import mongoose from "mongoose";

/**
 * AuditLog — tracks important admin actions for accountability
 */
const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    actorEmail: { type: String }, // denormalized in case user is deleted
    action: {
      type: String,
      required: true,
      enum: [
        "USER_CREATED",
        "USER_UPDATED",
        "USER_DELETED",
        "USER_SUSPENDED",
        "USER_ROLE_CHANGED",
        "EMAIL_VERIFIED",
        "USER_LOGIN",
        "USER_LOGOUT",
        "CAMPAIGN_CREATED",
        "CAMPAIGN_UPDATED",
        "CAMPAIGN_DELETED",
        "CAMPAIGN_STATUS_CHANGED",
        "DONATION_CREATED",
        "DONATION_REFUNDED",
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_DELETED",
        "SETTINGS_UPDATED",
        "ADMIN_INVITED",
        "PASSWORD_RESET",
        "CONTACT_RESOLVED",
      ],
    },
    targetType: {
      type: String,
      enum: ["User", "Campaign", "Donation", "Task", "Settings", "Contact"],
    },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    meta: { type: mongoose.Schema.Types.Mixed }, // any extra data
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
