import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseModel",
    required: true,
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const UserProgress = mongoose.model(
  "UserProgress",
  userProgressSchema
);
