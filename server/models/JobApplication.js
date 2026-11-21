import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  linkedin: String,
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: String,
  portfolio: String,
  website: String,
  coverLetter: String,
  resume: { type: String, required: true }, // file path
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);