import Contact from "../models/Contact.js";
import Subscriber from "../models/Subscriber.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";

// ─── @POST /api/contact ───────────────────────────────────────────────────
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, type } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
    type: type || "general",
    user: req.user?._id,
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    message: "Your message has been received. We'll respond within 24 hours.",
    data: { id: contact._id },
  });
});

// ─── @GET /api/contact (Admin) ────────────────────────────────────────────
export const getAllContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate("assignedTo", "fullName email")
      .lean(),
    Contact.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: contacts,
    pagination: { page: parseInt(page), limit: parseInt(limit), total },
  });
});

// ─── @PUT /api/contact/:id/resolve ────────────────────────────────────────
export const resolveContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new AppError("Contact not found.", 404);

  contact.status = "Resolved";
  contact.resolvedAt = new Date();
  contact.resolvedBy = req.user._id;
  if (req.body.internalNotes) contact.internalNotes = req.body.internalNotes;
  await contact.save();

  res.status(200).json({ success: true, data: contact });
});

// ─── @POST /api/newsletter/subscribe ─────────────────────────────────────
export const subscribe = asyncHandler(async (req, res) => {
  const { email, name, source } = req.body;
  if (!email) throw new AppError("Email is required.", 400);

  // Upsert — reactivate if previously unsubscribed
  const subscriber = await Subscriber.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        name,
        status: "Active",
        source: source || "footer",
        user: req.user?._id,
        ipAddress: req.ip,
      },
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    message: "You're now subscribed to our newsletter!",
  });
});

// ─── @POST /api/newsletter/unsubscribe ────────────────────────────────────
export const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await Subscriber.findOneAndUpdate(
    { email: email?.toLowerCase() },
    { status: "Unsubscribed", unsubscribedAt: new Date() }
  );
  res.status(200).json({ success: true, message: "You have been unsubscribed." });
});

// ─── @POST /api/misc/upload (Admin) ──────────────────────────────────────
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded or file format not supported.", 400);
  }

  // Generate public access URL
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: "File uploaded successfully.",
    url: fileUrl,
  });
});
