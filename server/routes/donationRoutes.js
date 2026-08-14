import { Router } from "express";
import {
  getAllDonations,
  getMyDonations,
  getDonationStats,
  getDonationActivity,
  createPaymentIntent,
} from "../controllers/donationController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// Public / General routes
router.post("/create-payment-intent", createPaymentIntent);

// Donor routes
router.get("/my", protect, getMyDonations);

// Admin routes
router.get("/", protect, adminOnly, getAllDonations);
router.get("/stats", protect, adminOnly, getDonationStats);
router.get("/activity", protect, adminOnly, getDonationActivity);

export default router;
