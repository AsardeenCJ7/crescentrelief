import { Router } from "express";
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignStats,
} from "../controllers/campaignController.js";
import { createDonation } from "../controllers/donationController.js";
import { protect, adminOnly, superAdminOnly, optionalAuth } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", optionalAuth, getCampaigns);
router.get("/stats", getCampaignStats);
router.get("/:id", optionalAuth, getCampaignById);

// Donation on campaign
router.post("/:id/donate", optionalAuth, createDonation);

// Admin routes
router.post("/", protect, adminOnly, createCampaign);
router.put("/:id", protect, adminOnly, updateCampaign);
router.delete("/:id", protect, superAdminOnly, deleteCampaign);

export default router;
