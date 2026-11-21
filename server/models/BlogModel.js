import mongoose from "mongoose";

const blogSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    quote: {
      type: String,
      default: null,
    },
    quoteAuthor: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    author: {
      name: {
        type: String,
        required: true,
        default: "DevTech Team",
      },
      avatar: {
        type: String,
        default: null,
      },
      role: {
        type: String,
        default: "Author",
      },
    },

    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },

    sections: [blogSectionSchema],

    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);