import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { markVideoCompleted, getUserDashboard,getCourseVideos } from "../controllers/progressController.js";

const router = express.Router();

router.post("/mark-completed", isAuthenticated, markVideoCompleted);
router.get("/dashboard", isAuthenticated, getUserDashboard);
router.get("/course/:id", isAuthenticated, getCourseVideos);
export default router;
