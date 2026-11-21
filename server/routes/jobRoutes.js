import express from "express";
import {
  createJob,
  getAllJobs,
  getJobDetail,
  updateJob,
  deleteJob,
  getAllJobsForAdmin,
  getMyJobs,
} from "../controllers/JobController.js";

import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// ⭐ IMPORTANT: Specific routes MUST come BEFORE dynamic routes like /:id

// Public Routes
router.get("/", getAllJobs);

// admin job Protected Routes - SPECIFIC paths before /:id
router.get("/admin/jobs", isAuthenticated, authorizeRoles("job", "admin"), getAllJobsForAdmin);
router.get("/my-jobs", isAuthenticated, authorizeRoles("job", "admin"), getMyJobs);

// Dynamic route - MUST come LAST
router.get("/:id", getJobDetail);

// job dashboard Protected Routes
router.post("/", isAuthenticated, authorizeRoles("job", "admin"), upload.single("image"), createJob);
router.put("/edit-job/:id", isAuthenticated, authorizeRoles("job", "admin"), upload.single("image"), updateJob);
router.delete("/:id", isAuthenticated, authorizeRoles("job", "admin"), deleteJob);
export default router;