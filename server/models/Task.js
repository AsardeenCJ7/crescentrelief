import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled", "On Hold"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    category: {
      type: String,
      enum: ["Campaign", "Finance", "Reporting", "Communication", "Operations", "Other"],
      default: "Other",
    },

    // Who is this task for
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Who created/assigned this task
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional campaign link
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },

    // Dates
    dueDate: { type: Date },
    completedAt: { type: Date },
    startedAt: { type: Date },

    // Checklist items within a task
    checklist: [
      {
        item: { type: String, required: true },
        done: { type: Boolean, default: false },
        doneAt: { type: Date },
      },
    ],

    // Attachments / files
    attachments: [
      {
        name: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Comments / activity log
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Overdue flag (computed via virtual)
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-set completedAt / startedAt
taskSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "Completed" && !this.completedAt) {
      this.completedAt = new Date();
    }
    if (this.status === "In Progress" && !this.startedAt) {
      this.startedAt = new Date();
    }
  }
  next();
});

// Virtual: overdue
taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate || this.status === "Completed" || this.status === "Cancelled") return false;
  return new Date() > this.dueDate;
});

taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ assignedBy: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ campaign: 1 });
taskSchema.index({ createdAt: -1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;
