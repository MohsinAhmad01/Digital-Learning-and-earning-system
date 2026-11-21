import Reviewmodel from "../models/ReviewModel.js";
import Gig from "../models/gigModel.js";
import Order from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

const recalculateSellerRating = async (sellerId) => {
  const gigs = await Gig.find({ owner: sellerId }).select("_id");

  const gigIds = gigs.map((gig) => gig._id);

  const reviews = await Reviewmodel.find({
    gigId: { $in: gigIds },
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : (
          reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
          totalReviews
        ).toFixed(1);

  await User.findByIdAndUpdate(sellerId, {
    rating: Number(averageRating),
  });

  return {
    totalReviews,
    averageRating: Number(averageRating),
  };
};

export const createReviewForGig = async (req, res) => {
  try {
    const { orderId, gigId, rating, comment } = req.body;

    if (!orderId || !gigId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Order ID, Gig ID and rating are required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !mongoose.Types.ObjectId.isValid(gigId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order or gig ID.",
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      buyer: req.user._id,
      gig: gigId,
      status: "completed",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "Only buyer with completed order can review this gig.",
      });
    }

    if (order.isReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this order.",
      });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    if (gig.owner.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot review your own gig.",
      });
    }

    const existingReview = await Reviewmodel.findOne({
      orderId,
      reviewer: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted for this order.",
      });
    }

    const newReview = await Reviewmodel.create({
      reviewer: req.user._id,
      gigId,
      orderId,
      rating: Number(rating),
      comment,
    });

    await Gig.findByIdAndUpdate(gigId, {
      $inc: {
        totalStars: Number(rating),
        starNumber: 1,
      },
    });

    order.isReviewed = true;
    await order.save();

    await recalculateSellerRating(gig.owner);

    const populatedReview = await Reviewmodel.findById(newReview._id)
      .populate("reviewer", "name email avatar")
      .populate("gigId", "title category cover packages");

    return res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getReviewsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gigId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gig ID.",
      });
    }

    const reviews = await Reviewmodel.find({ gigId })
      .populate("reviewer", "name email avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getReviewsForFreelancer = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(freelancerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid freelancer ID.",
      });
    }

    const gigs = await Gig.find({ owner: freelancerId }).select("_id");

    const gigIds = gigs.map((gig) => gig._id);

    const reviews = await Reviewmodel.find({
      gigId: { $in: gigIds },
    })
      .populate("reviewer", "name email avatar")
      .populate("gigId", "title category cover packages")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : (
            reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
            totalReviews
          ).toFixed(1);

    return res.status(200).json({
      success: true,
      totalReviews,
      averageRating: Number(averageRating),
      reviews,
    });
  } catch (error) {
    console.error("Error fetching freelancer reviews:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getGigRating = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    const avg =
      gig.starNumber === 0 ? 0 : (gig.totalStars / gig.starNumber).toFixed(1);

    return res.status(200).json({
      success: true,
      averageRating: Number(avg),
      totalReviews: gig.starNumber,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Reviewmodel.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const isOwner = review.reviewer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed.",
      });
    }

    const gig = await Gig.findById(review.gigId);

    await Reviewmodel.findByIdAndDelete(req.params.id);

    await Gig.findByIdAndUpdate(review.gigId, {
      $inc: {
        totalStars: -Number(review.rating),
        starNumber: -1,
      },
    });

    if (gig?.owner) {
      await recalculateSellerRating(gig.owner);
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};