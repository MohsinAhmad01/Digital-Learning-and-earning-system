import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { generateCertificate, getMyCertificates, getCertificateById, } from "../controllers/certificateController.js";

const router = express.Router();

router.post("/generate/:courseId", isAuthenticated, generateCertificate);
router.get("/my-certificates", isAuthenticated, getMyCertificates);
router.get("/:id", isAuthenticated, getCertificateById);

export default router;
