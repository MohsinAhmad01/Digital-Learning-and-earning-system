import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
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
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  relation: { type: String, enum: ["S/O", "D/O"], default: "S/O" },
  cnic: { type: String, required: true },
  certificateId: { type: String, required: true, unique: true },
  issueDate: { type: Date, default: Date.now },
  courseTitle: { type: String, required: true },
  courseCategory: { type: String },
  courseLevel: { type: String },
}, { timestamps: true });

export const Certificate = mongoose.model("Certificate", certificateSchema);