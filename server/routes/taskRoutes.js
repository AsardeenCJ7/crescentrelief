import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment,
} from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// All task routes are admin-only
router.use(protect, adminOnly);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/comments", addComment);

export default router;
