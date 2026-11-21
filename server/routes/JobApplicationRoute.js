import express from "express";
import { createApplication, getApplicationsByJob } from "../controllers/JobApplicationController.js";
import { upload } from "../middlewares/upload.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
const router = express.Router();

router.post("/", upload.single("resume"), createApplication);

// Admin can see applications for a job
router.get("/job/:jobId", isAuthenticated, authorizeRoles("job", "admin"), getApplicationsByJob);
export default router;