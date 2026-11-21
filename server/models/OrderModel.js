import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    percent: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["requested", "paid", "cancelled"],
      default: "requested",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    paidAt: Date,

    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },

    title: String,
    price: Number,

    packageType: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },

    packageSnapshot: {
      packageName: String,
      title: String,
      description: String,
      price: Number,
      deliveryTime: Number,
      revisionNumber: Number,
      features: [String],
    },

    requirements: {
      type: String,
      required: true,
    },

    attachments: [String],

    milestones: {
      type: [milestoneSchema],
      default: [],
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    progressPercent: {
      type: Number,
      default: 0,
    },

    deliveryFiles: [String],
    deliveryMessage: String,
    deliveredAt: Date,

    revisionRequested: {
      type: Boolean,
      default: false,
    },

    revisionCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "in_progress",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    deadline: Date,
    completedAt: Date,

    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);