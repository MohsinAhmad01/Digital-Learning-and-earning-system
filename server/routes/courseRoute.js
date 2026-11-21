import express from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addReview,
  deleteReview,
  getMyCourses,
} from "../controllers/CourseController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/* ===================== ADMIN ROUTES (TOP) ===================== */

// ✅ Admin: get all courses (dashboard)
router.get(
  "/allcourse",
  isAuthenticated,
  authorizeRoles("admin", "teacher","user"),
  getAllCourses
);
// ✅ Teacher: get only own courses
router.get(
  "/my-courses",
  isAuthenticated,
  authorizeRoles("teacher","admin"),
  getMyCourses
);

// ✅ Admin: create course
router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("admin", "teacher"),
  upload.single("image"),
  createCourse
);

// ✅ Admin: update course
router.put(
  "/admin/edit/:id",
  isAuthenticated,
  authorizeRoles("admin", "teacher"),
  upload.single("image"),
  updateCourse
);

// ✅ Admin: delete course
router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin", "teacher"),
  deleteCourse
);

/* ===================== PUBLIC ROUTES (BOTTOM) ===================== */

// ✅ Public: show all courses
router.get("/", getAllCourses);

// ✅ Public: course details
router.get("/:id", getCourseById);

// ✅ Auth user: add review
router.post("/:id/review", isAuthenticated, addReview);
router.delete("/:courseId/review/:reviewId", isAuthenticated, authorizeRoles("admin","teacher"), deleteReview);
export default router;
