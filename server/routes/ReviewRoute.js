import express from "express";
import {
  createReviewForGig,
  getReviewsForGig,
  getGigRating,
  deleteReview,
  getReviewsForFreelancer,
} from "../controllers/ReviewController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", isAuthenticated, createReviewForGig);

router.get("/freelancer/:freelancerId", getReviewsForFreelancer);
router.get("/rating/:gigId", getGigRating);
router.get("/:gigId", getReviewsForGig);

router.delete("/:id", isAuthenticated, deleteReview);

export default router;