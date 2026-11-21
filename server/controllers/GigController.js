import Gig from "../models/gigModel.js";

/* ===============================
   HELPERS
================================ */

const parseArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [parsed];
  } catch {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [value];
  }
};

const parsePackage = (value) => {
  if (!value) return null;

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const validatePackage = (pkg, packageName) => {
  if (!pkg) {
    return `${packageName} package is required.`;
  }

  if (!pkg.title || !pkg.description) {
    return `${packageName} package title and description are required.`;
  }

  if (!pkg.price || Number(pkg.price) <= 0) {
    return `${packageName} package price must be greater than 0.`;
  }

  if (!pkg.deliveryTime || Number(pkg.deliveryTime) <= 0) {
    return `${packageName} package delivery time must be greater than 0.`;
  }

  if (pkg.revisionNumber && Number(pkg.revisionNumber) < 0) {
    return `${packageName} package revision number cannot be negative.`;
  }

  return null;
};

const buildPackage = (pkg, defaultName, defaultRevision) => {
  return {
    packageName: pkg.packageName || defaultName,
    title: pkg.title,
    description: pkg.description,
    price: Number(pkg.price),
    deliveryTime: Number(pkg.deliveryTime),
    revisionNumber: Number(pkg.revisionNumber || defaultRevision),
    features: parseArray(pkg.features),
  };
};

const getUploadedImageUrls = (req) => {
  if (!req.files || req.files.length === 0) {
    return [];
  }

  return req.files.map((file) => {
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  });
};

/* ===============================
   CREATE GIG
================================ */

export const createGig = async (req, res) => {
  try {
    if (!req.user || !["freelancer", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only freelancers can create gigs.",
      });
    }

    const { title, description, category, requirements, status, cover } =
      req.body;

    const tags = parseArray(req.body.tags);
    const faqs = parseArray(req.body.faqs)
      .map((faq) => ({
        question: faq.question?.trim(),
        answer: faq.answer?.trim(),
      }))
      .filter((faq) => faq.question && faq.answer);
    const basic = parsePackage(req.body.basic);
    const standard = parsePackage(req.body.standard);
    const premium = parsePackage(req.body.premium);

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Gig title, description, and category are required.",
      });
    }

    const basicError = validatePackage(basic, "Basic");
    const standardError = validatePackage(standard, "Standard");
    const premiumError = validatePackage(premium, "Premium");

    if (basicError || standardError || premiumError) {
      return res.status(400).json({
        success: false,
        message: basicError || standardError || premiumError,
      });
    }

    const imageUrls = getUploadedImageUrls(req);

    const gig = await Gig.create({
      owner: req.user._id,

      title,
      description,
      category,

      cover: cover || imageUrls[0] || "",
      images: imageUrls,

      tags,
      requirements: requirements || "",
      faqs,
      packages: {
        basic: buildPackage(basic, "Basic", 1),
        standard: buildPackage(standard, "Standard", 2),
        premium: buildPackage(premium, "Premium", 3),
      },

      status: status || "published",
      isActive: true,

      totalStars: 0,
      starNumber: 0,
      sales: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Gig created successfully.",
      gig,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create gig.",
      error: err.message,
    });
  }
};

/* ===============================
   GET ALL PUBLISHED GIGS
================================ */

export const getGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({
      status: "published",
      isActive: true,
    })
      .populate("owner", "name avatar role rating totalSales totalOrders")
      .sort({ createdAt: -1 });

    return res.status(200).json(gigs);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching gigs.",
      error: err.message,
    });
  }
};

/* ===============================
   GET SINGLE GIG
================================ */

export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "owner",
      "name email avatar role bio skills rating totalSales totalOrders createdAt",
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    return res.status(200).json({
      success: true,
      gig,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching gig details.",
      error: err.message,
    });
  }
};

/* ===============================
   GET LOGGED-IN FREELANCER GIGS
================================ */

export const getMyGigs = async (req, res) => {
  try {
    if (!req.user || !["freelancer", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only freelancers can view dashboard gigs.",
      });
    }

    const gigs = await Gig.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      gigs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch freelancer gigs.",
      error: err.message,
    });
  }
};

/* ===============================
   DELETE GIG
================================ */

export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found.",
      });
    }

    const isOwner = gig.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own gig.",
      });
    }

    await Gig.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Gig has been deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete gig.",
      error: err.message,
    });
  }
};
