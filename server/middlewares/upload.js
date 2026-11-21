import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ---------------- DISK STORAGE ----------------
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ---------------- MEMORY STORAGE ----------------
const memoryStorage = multer.memoryStorage();

// Cloudinary uploads
export const multiUpload = multer({ storage: memoryStorage }).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

const allowedResFileTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.oasis.opendocument.text", // .odt
  "application/rtf",
  "image/jpeg",
  "image/png",
  "image/gif",
];

// Resume uploads: accept images & docs
const resumeFileFilter = (req, file, cb) => {
  if (allowedResFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, Word, ODT, RTF, or image files are allowed!"), false);
  }
};
export const upload = multer({ storage: diskStorage,fileFilter: resumeFileFilter,limits: { fileSize: 5 * 1024 * 1024 } });
