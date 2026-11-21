import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  updateSetting,
  resetPassword,
  getPublicFreelancerProfile,
  getTopFreelancers,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.put("/Setting/update", isAuthenticated, upload.single("avatar"), updateSetting);
router.post("/otp-verification", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.get("/top-freelancers", getTopFreelancers);
router.get("/freelancer/:id", getPublicFreelancerProfile);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
