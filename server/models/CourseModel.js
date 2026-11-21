import mongoose, { model } from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);


const courseSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Service title is required."] },
  Catagory: { type: String, required: [true, "Service title is required."] },
  image: { type: String, required: [true, "Service image URL is required."] },
  description: { type: String, required: [true, "Service description is required."] },
  prize: { type: String, required: [true, "Service description is required."] },
  duration: { type: String },
  level: { type: String },
  tags: [{ type: String }],
  skillsYouWillGain: [{ type: String }],
  reviews: [reviewSchema],
  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
views: { type: Number, default: 0 }
}
);

export const Course = mongoose.model("CourseModel", courseSchema);
