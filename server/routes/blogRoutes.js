import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

import { isAuthenticated } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("coverImage"),
  createBlog
);

router.put(
  "/update/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.single("coverImage"),
  updateBlog
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteBlog
);

export default router;