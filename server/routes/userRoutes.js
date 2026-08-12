import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  inviteAdmin,
  updateProfile,
  changePassword,
  getFavourites,
  addFavourite,
  removeFavourite,
  getUserStats,
} from "../controllers/userController.js";
import { protect, adminOnly, superAdminOnly } from "../middleware/auth.js";

const router = Router();

// My profile routes
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/favourites", protect, getFavourites);
router.post("/favourites/:campaignId", protect, addFavourite);
router.delete("/favourites/:campaignId", protect, removeFavourite);

// Admin routes
router.get("/stats", protect, adminOnly, getUserStats);
router.get("/", protect, adminOnly, getAllUsers);
router.post("/invite-admin", protect, superAdminOnly, inviteAdmin);
router.get("/:id", protect, adminOnly, getUserById);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, superAdminOnly, deleteUser);

export default router;
