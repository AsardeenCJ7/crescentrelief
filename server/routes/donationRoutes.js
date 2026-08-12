import { Router } from "express";
import {
  getAllDonations,
  getMyDonations,
  getDonationStats,
} from "../controllers/donationController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// Donor routes
router.get("/my", protect, getMyDonations);

// Admin routes
router.get("/", protect, adminOnly, getAllDonations);
router.get("/stats", protect, adminOnly, getDonationStats);

export default router;
