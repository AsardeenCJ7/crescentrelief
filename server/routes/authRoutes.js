import { Router } from "express";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  refreshToken,
  getMe,
  forgotPassword,
  resetPassword,
  setupPassword,
  googleLogin,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh", refreshToken);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/setup-password/:userId", setupPassword);
router.post("/google", googleLogin);

export default router;
