import express from "express";
import {
  uploadVideo,
  getVideosByCourse,
  getVideoById,
  deleteVideo,
} from "../controllers/videoController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { multiUpload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/upload", isAuthenticated, authorizeRoles("admin", "teacher"), multiUpload, uploadVideo);
router.get("/courses/:courseId", getVideosByCourse);
// In routes/videoRoutes.js
router.get("/:videoId", getVideoById);
router.delete(
  "/:videoId",
  isAuthenticated,
  authorizeRoles("admin", "teacher"),
  deleteVideo
);

export default router;
