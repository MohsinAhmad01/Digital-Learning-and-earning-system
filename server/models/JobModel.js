import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String },
    location: { type: String },
     type: {
      type: String,
      required: true,
      enum: ["Full Time", "Part Time", "Internship"],
    },
    experience: { type: String, required: true },
    description: { type: String, required: [true, "Description of job is required."] },
    image: { type: String,required: [true, "Job image URL is required."] },
 requirements: {
      type: [String],
      default: [],
    },
    createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
