import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    deliveryTime: {
      type: Number,
      required: true,
      min: 1,
    },

    revisionNumber: {
      type: Number,
      required: true,
      default: 1,
    },

    features: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);
const gigSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2500,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    cover: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    requirements: {
      type: String,
      default: "",
      trim: true,
    },
faqs: {
  type: [faqSchema],
  default: [],
},
    packages: {
      basic: {
        type: packageSchema,
        required: true,
      },

      standard: {
        type: packageSchema,
        required: true,
      },

      premium: {
        type: packageSchema,
        required: true,
      },
    },

    totalStars: {
      type: Number,
      default: 0,
    },

    starNumber: {
      type: Number,
      default: 0,
    },

    sales: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published", "paused"],
      default: "published",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

gigSchema.virtual("startingPrice").get(function () {
  return this.packages?.basic?.price || 0;
});

gigSchema.virtual("deliveryTime").get(function () {
  return this.packages?.basic?.deliveryTime || 0;
});

gigSchema.set("toJSON", { virtuals: true });
gigSchema.set("toObject", { virtuals: true });

export default mongoose.model("Gig", gigSchema);