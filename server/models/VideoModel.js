import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  description: {
  type: String,
  trim: true,
},

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseModel",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

});

export const Video = mongoose.model("Video", videoSchema);
