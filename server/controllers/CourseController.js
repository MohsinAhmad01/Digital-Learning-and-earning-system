 import { Course } from "../models/CourseModel.js";
import mongoose from "mongoose";

// 📌 Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description, prize, duration, level, Catagory, tags, skillsYouWillGain } = req.body;
    const image = req.file ? req.file.filename : null;

    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    if (!title || !description || !image || !prize || !Catagory) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    const newCourse = await Course.create({
      title,
      description,
      prize,
      image,
      duration,
      level,
      Catagory,
       tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
  skillsYouWillGain: skillsYouWillGain ? skillsYouWillGain.split(",").map(skill => skill.trim()) : [],
  createdBy: req.user._id,
    });

    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// 📌 Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    const fullUrl = req.protocol + "://" + req.get("host");

    const updatedCourses = courses.map((course) => ({
      ...course._doc,
      image: `${fullUrl}/uploads/${course.image}`, // Convert to full image path
      averageRating:
        course.reviews.length > 0
          ? (course.reviews.reduce((a, b) => a + b.rating, 0) / course.reviews.length).toFixed(1)
          : null,
          views: course.views || 0
    }));

    res.status(200).json({ success: true, courses: updatedCourses });
  } catch (err) {
    console.error("Fetch Courses Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch courses." });
  }
};

export const getCourseById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid course ID." });
  }

  try {
    const course = await Course.findById(id).populate("reviews.user", "name avatar");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found." });
    }
course.views = course.views + 1;
    await course.save();

    // ✅ ONLY check ownership IF user is logged in
    if (
      req.user &&
      req.user.role === "teacher" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can access only your own course",
      });
    }

    const fullUrl = req.protocol + "://" + req.get("host");

    res.status(200).json({
      success: true,
      course: {
        ...course._doc,
        image: `${fullUrl}/uploads/${course.image}`,
        averageRating:
          course.reviews.length > 0
            ? (
                course.reviews.reduce((a, b) => a + b.rating, 0) /
                course.reviews.length
              ).toFixed(1)
            : null,
      },
    });
  } catch (error) {
    console.error("Get Course Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// only my courses  videos in teacherside 
export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user._id });

    const fullUrl = req.protocol + "://" + req.get("host");

    const updatedCourses = courses.map((course) => ({
      ...course._doc,
      image: course.image
        ? `${fullUrl}/uploads/${course.image}`
        : null,
    }));

    res.status(200).json({
      success: true,
      courses: updatedCourses,
    });
  } catch (error) {
    console.error("Get My Courses Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher courses",
    });
  }
};

// 📌 Update course
export const updateCourse = async (req, res) => {
  try {
    const { title, description, prize, duration, level, Catagory, tags, skillsYouWillGain } = req.body;
    const image = req.file ? req.file.filename : null;

    const updatedFields = {
      title,
      description,
      prize,
      duration,
      level,
      Catagory,
      tags: tags ? JSON.parse(tags) : undefined,
      skillsYouWillGain: skillsYouWillGain ? JSON.parse(skillsYouWillGain) : undefined,
    };
    if (image) updatedFields.image = image;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      {
        new: true,
      }
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Add Review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Prevent self-review
    if (req.user._id.toString() === course.createdBy.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "You cannot review your own course" 
      });
    }

    // Check if user already submitted a review
    const alreadyReviewed = course.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this course" });
    }

    // Add new review
    course.reviews.push({
      user: req.user._id,
      rating,
      comment,
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { courseId, reviewId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Remove the review by ID
    course.reviews = course.reviews.filter((rev) => rev._id.toString() !== reviewId);

    // Update number of reviews and optionally average rating
    course.numOfReviews = course.reviews.length;
    course.ratings =
      course.reviews.reduce((acc, item) => acc + item.rating, 0) /
      (course.reviews.length || 1);

    await course.save();

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};