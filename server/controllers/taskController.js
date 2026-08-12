import Task from "../models/Task.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import AuditLog from "../models/AuditLog.js";

// ─── @GET /api/tasks ──────────────────────────────────────────────────────
export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo, page = 1, limit = 20 } = req.query;
  const filter = { isArchived: false };

  // Admins see their own tasks; superadmins see all
  if (req.user.role === "admin") {
    filter.assignedTo = req.user._id;
  } else if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate("assignedTo", "fullName email avatar")
      .populate("assignedBy", "fullName email avatar")
      .populate("campaign", "title")
      .lean({ virtuals: true }),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: tasks,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── @POST /api/tasks ─────────────────────────────────────────────────────
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, priority, category, dueDate, campaign } = req.body;

  const task = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy: req.user._id,
    priority: priority || "Medium",
    category,
    dueDate,
    campaign,
  });

  await task.populate("assignedTo", "fullName email");
  await task.populate("assignedBy", "fullName email");

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action: "TASK_CREATED",
    targetType: "Task",
    targetId: task._id,
    meta: { title, assignedTo },
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, data: task });
});

// ─── @PUT /api/tasks/:id ──────────────────────────────────────────────────
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError("Task not found.", 404);

  // Only assignee or superadmin can update status
  const isAssignee = task.assignedTo.toString() === req.user._id.toString();
  const isAssigner = task.assignedBy.toString() === req.user._id.toString();
  if (!isAssignee && !isAssigner && req.user.role !== "superadmin") {
    throw new AppError("Not authorized to update this task.", 403);
  }

  Object.assign(task, req.body);
  await task.save();

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action: "TASK_UPDATED",
    targetType: "Task",
    targetId: task._id,
    meta: { status: task.status },
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: task });
});

// ─── @DELETE /api/tasks/:id ───────────────────────────────────────────────
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError("Task not found.", 404);

  task.isArchived = true;
  await task.save();

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action: "TASK_DELETED",
    targetType: "Task",
    targetId: task._id,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: "Task archived." });
});

// ─── @POST /api/tasks/:id/comments ────────────────────────────────────────
export const addComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError("Task not found.", 404);

  task.comments.push({
    author: req.user._id,
    text: req.body.text,
    createdAt: new Date(),
  });

  await task.save();
  await task.populate("comments.author", "fullName avatar");

  res.status(200).json({ success: true, data: task.comments });
});
