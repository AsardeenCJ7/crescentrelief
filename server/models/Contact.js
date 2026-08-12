import mongoose from "mongoose";

/**
 * Contact / Enquiry model
 */
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    type: {
      type: String,
      enum: ["general", "donation_support", "volunteer", "partnership", "media", "complaint"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["New", "Read", "In Progress", "Resolved", "Spam"],
      default: "New",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    internalNotes: { type: String, select: false },
    ipAddress: { type: String, select: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", sparse: true },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ assignedTo: 1 });

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
