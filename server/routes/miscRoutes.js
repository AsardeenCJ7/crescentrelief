import { Router } from "express";
import {
  submitContact,
  getAllContacts,
  resolveContact,
  subscribe,
  unsubscribe,
  uploadFile,
} from "../controllers/miscController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

// Public routes
router.post("/contact", submitContact);
router.post("/newsletter/subscribe", subscribe);
router.post("/newsletter/unsubscribe", unsubscribe);

// Admin routes
router.get("/contact", protect, adminOnly, getAllContacts);
router.put("/contact/:id/resolve", protect, adminOnly, resolveContact);
router.post("/upload", protect, adminOnly, upload.single("file"), uploadFile);

export default router;
