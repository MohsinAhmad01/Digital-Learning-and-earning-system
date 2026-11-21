import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  getMyGigs,
} from "../controllers/GigController.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();
router.post(
  "/create",
  isAuthenticated,
    authorizeRoles("admin","freelancer"),
    upload.array("images", 5),
    createGig
);
router.get(
  "/my-gigs",
  isAuthenticated,
  authorizeRoles("admin", "freelancer"),
  getMyGigs
);
router.get("/", getGigs);
router.get("/:id", getGig);
router.delete("/:id", isAuthenticated, authorizeRoles("admin","freelancer"), deleteGig);
export default router;