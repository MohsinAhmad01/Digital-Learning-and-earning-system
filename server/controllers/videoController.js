import cloudinary from "../utils/cloudinary.js";
import { Video } from "../models/VideoModel.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer, folder, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType, // video | image | auto
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};


export const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
      console.log("Video not found in DB");
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ success: true, video });
  } catch (err) {
    console.error("getVideoById error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch video." });
  }
};

export const uploadVideo = async (req, res) => {
  try {
    const { title, description, course } = req.body;

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile || !thumbnailFile) {
      return res.status(400).json({
        success: false,
        message: "Video and thumbnail required",
      });
    }

    // ✅ Upload video
    const videoUpload = await uploadToCloudinary(
      videoFile.buffer,
      "course_videos",
      "video"
    );

    // ✅ Upload thumbnail (IMAGE)
    const thumbnailUpload = await uploadToCloudinary(
      thumbnailFile.buffer,
      "thumbnails",
      "image"
    );

    const video = await Video.create({
      title,
      description,
      course,
      videoUrl: videoUpload.secure_url,
      thumbnailUrl: thumbnailUpload.secure_url,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, video });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Video upload failed",
    });
  }
};


export const getVideosByCourse = async (req, res) => {
  try {
    const videos = await Video.find({ course: req.params.courseId });
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Get Videos Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch videos." });
  }
};
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // ✅ Admin can delete anything
    if (req.user.role !== "admin") {
      // ❗ SAFETY CHECK
      if (!video.uploadedBy) {
        return res.status(403).json({
          message: "Old video: delete not allowed",
        });
      }

      // Teacher can delete ONLY their own videos
      if (video.uploadedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You are not allowed to delete this video",
        });
      }
    }

    await video.deleteOne();

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
