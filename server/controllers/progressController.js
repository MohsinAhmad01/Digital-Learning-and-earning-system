import { UserProgress } from "../models/UserProgressModel.js";
import { Video } from "../models/VideoModel.js";
import { Certificate } from "../models/CertificateModel.js";
export const markVideoCompleted = async (req, res) => {
  const { courseId, videoId } = req.body;

  try {
    let progress = await UserProgress.findOne({ user: req.user._id, course: courseId });

    if (!progress) {
      progress = await UserProgress.create({
        user: req.user._id,
        course: courseId,
        completedVideos: [videoId],
      });
    } else {
      if (!progress.completedVideos.includes(videoId)) {
        progress.completedVideos.push(videoId);
        await progress.save();
      }
    }

    res.status(200).json({ success: true, message: "Video marked as completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all videos for a course + completion status
export const getCourseVideos = async (req, res) => {
  try {
    const courseId = req.params.id;
    const videos = await Video.find({ course: courseId });

    let completedVideos = [];
    if (req.user) {
      const progress = await UserProgress.findOne({ user: req.user._id, course: courseId });
      completedVideos = progress ? progress.completedVideos.map((v) => v.toString()) : [];
    }

    const videosWithCompletion = videos.map((video) => ({
      ...video._doc,
      completed: completedVideos.includes(video._id.toString()),
    }));

    res.status(200).json({ success: true, videos: videosWithCompletion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch videos" });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Fetch user progress for all courses
    const progress = await UserProgress.find({ user: userId }).populate("course");

    // 2️⃣ Fetch all certificates for the user
    const certificates = await Certificate.find({ user: userId }).lean();

    // 3️⃣ Build dashboard courses data
    const coursesData = await Promise.all(
      progress.map(async (item) => {
        const totalVideos = await Video.countDocuments({ course: item.course._id });
        const percentage = totalVideos === 0
          ? 0
          : Math.round((item.completedVideos.length / totalVideos) * 100);

        // Check if certificate exists for this course
        const certificate = certificates.find(
          (cert) => cert.course.toString() === item.course._id.toString()
        );

        return {
          course: item.course,
          completedVideos: item.completedVideos.length,
          totalVideos,
          percentage,
          certificateGenerated: !!certificate,
          certificateData: certificate || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      user: req.user,
      courses: coursesData,
      certificates, // optional: for separate My Certificates section
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
