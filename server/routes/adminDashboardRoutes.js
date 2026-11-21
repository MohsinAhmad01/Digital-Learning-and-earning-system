import express from "express";
import { getAdminDashboardStats } from "../controllers/adminDashboardController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.get(
  "/dashboard",
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminDashboardStats
);

export default router;