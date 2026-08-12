import mongoose from "mongoose";

/**
 * Newsletter Subscriber model
 */
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    name: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", sparse: true },
    status: {
      type: String,
      enum: ["Active", "Unsubscribed", "Bounced"],
      default: "Active",
    },
    source: {
      type: String,
      enum: ["footer", "campaign", "checkout", "dashboard", "manual"],
      default: "footer",
    },
    tags: [{ type: String }],
    unsubscribedAt: { type: Date },
    unsubscribeToken: { type: String, select: false },
    ipAddress: { type: String, select: false },
  },
  {
    timestamps: true,
  }
);

subscriberSchema.index({ email: 1 }, { unique: true });
subscriberSchema.index({ status: 1 });

const Subscriber = mongoose.model("Subscriber", subscriberSchema);
export default Subscriber;
