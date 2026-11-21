import { Certificate } from "../models/CertificateModel.js";

// Generate certificate (one per user per course)
export const generateCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { fullName, fatherName, relation, cnic, courseTitle, courseCategory, courseLevel } = req.body;
    const userId = req.user._id;

    // ✅ Check if certificate already exists
    let certificate = await Certificate.findOne({ user: userId, course: courseId });

    if (certificate) {
      // Return 200 instead of 400 to avoid Axios error
      return res.status(200).json({
        success: true,
        alreadyExists: true,
        certificate,
      });
    }

    // Generate random certificate ID
    const certificateId = `DT-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create new certificate
    certificate = await Certificate.create({
      user: userId,
      course: courseId,
      fullName,
      fatherName,
      relation,
      cnic,
      certificateId,
      courseTitle,
      courseCategory,
      courseLevel,
    });

    res.status(201).json({
      success: true,
      alreadyExists: false,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

// Get all certificates of the authenticated user
export const getMyCertificates = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const certificates = await Certificate.find({ user: userId }).populate("course", "title");
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    next(error);
  }
};

// Get single certificate by ID (for preview)
export const getCertificateById = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate("course", "title");
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });
    res.status(200).json({ success: true, certificate });
  } catch (error) {
    next(error);
  }
};
