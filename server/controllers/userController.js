import User from "../models/User.js";
import Task from "../models/Task.js";
import Donation from "../models/Donation.js";
import Favourite from "../models/Favourite.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import AuditLog from "../models/AuditLog.js";
import crypto from "crypto";

// ─── @GET /api/users (Admin) ───────────────────────────────────────────────
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, status, search } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password -refreshToken -setupToken -passwordResetToken")
      .lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── @GET /api/users/:id ───────────────────────────────────────────────────
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken");
  if (!user) throw new AppError("User not found.", 404);

  res.status(200).json({ success: true, data: user });
});

// ─── @PUT /api/users/:id ───────────────────────────────────────────────────
export const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, role, status, notes, address } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found.", 404);

  // Role change guards
  if (role && role !== user.role) {
    // Only superadmin can promote to admin
    if (role === "admin" && req.user.role !== "superadmin") {
      throw new AppError("Only superadmins can promote users to admin.", 403);
    }
    // No one can set superadmin via API
    if (role === "superadmin") {
      throw new AppError("Cannot assign superadmin role via API.", 403);
    }

    await AuditLog.create({
      actor: req.user._id,
      actorEmail: req.user.email,
      action: "USER_ROLE_CHANGED",
      targetType: "User",
      targetId: user._id,
      meta: { from: user.role, to: role },
      ipAddress: req.ip,
    });
  }

  // Prevent editing superadmin (except by themselves)
  if (user.role === "superadmin" && req.user._id.toString() !== user._id.toString()) {
    throw new AppError("Cannot modify a superadmin account.", 403);
  }

  if (fullName !== undefined) user.fullName = fullName;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (role !== undefined) user.role = role;
  if (status !== undefined) user.status = status;
  if (notes !== undefined) user.notes = notes;
  if (address !== undefined) user.address = address;

  await user.save();

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action: "USER_UPDATED",
    targetType: "User",
    targetId: user._id,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: user });
});

// ─── @DELETE /api/users/:id ────────────────────────────────────────────────
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found.", 404);

  if (user.role === "superadmin") {
    throw new AppError("Cannot delete a superadmin account.", 403);
  }

  // Soft delete via status change
  user.status = "Suspended";
  await user.save();

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action: "USER_DELETED",
    targetType: "User",
    targetId: user._id,
    meta: { email: user.email, name: user.fullName },
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: "User has been suspended." });
});

// ─── @POST /api/users/invite-admin ────────────────────────────────────────
export const inviteAdmin = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new AppError("This email is already registered.", 409);

  const setupToken = crypto.randomBytes(32).toString("hex");

  const admin = await User.create({
    fullName,
    email,
    role: "admin",
    status: "Pending Setup",
    emailVerified: false,
    authProvider: "local",
    invitedBy: req.user._id,
    invitedAt: new Date(),
    setupToken: crypto.createHash("sha256").update(setupToken).digest("hex"),
    setupTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    badge: { tier: "Bronze" },
  });

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action: "ADMIN_INVITED",
    targetType: "User",
    targetId: admin._id,
    meta: { email, fullName },
    ipAddress: req.ip,
  });

  const setupUrl = `${process.env.CLIENT_URL}/setup-password/${admin._id}`;

  res.status(201).json({
    success: true,
    message: "Admin invitation created.",
    data: {
      adminId: admin._id,
      email: admin.email,
      setupUrl, // In production: send this via email
      setupToken: process.env.NODE_ENV === "development" ? setupToken : undefined,
    },
  });
});

// ─── @PUT /api/users/profile ───────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, address, newsletterSubscribed, donationNotifications, giftAidEnabled } = req.body;

  const user = await User.findById(req.user._id);

  if (fullName) user.fullName = fullName;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (newsletterSubscribed !== undefined) user.newsletterSubscribed = newsletterSubscribed;
  if (donationNotifications !== undefined) user.donationNotifications = donationNotifications;
  if (giftAidEnabled !== undefined) {
    user.giftAidEnabled = giftAidEnabled;
    if (giftAidEnabled && !user.giftAidDeclaredAt) {
      user.giftAidDeclaredAt = new Date();
    }
  }

  await user.save();
  res.status(200).json({ success: true, data: user });
});

// ─── @PUT /api/users/change-password ──────────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  
  if (user.password) {
    if (!currentPassword) throw new AppError("Current password is required.", 400);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError("Current password is incorrect.", 400);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated successfully." });
});

// ─── @GET /api/users/favourites ───────────────────────────────────────────
export const getFavourites = asyncHandler(async (req, res) => {
  const favourites = await Favourite.find({ user: req.user._id })
    .populate("campaign", "title category image goal raised donors daysLeft urgent badgeColor")
    .sort("-createdAt")
    .lean({ virtuals: true });

  res.status(200).json({
    success: true,
    data: favourites.map((f) => f.campaign).filter(Boolean),
  });
});

// ─── @POST /api/users/favourites/:campaignId ──────────────────────────────
export const addFavourite = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;

  // Upsert to handle race conditions
  await Favourite.findOneAndUpdate(
    { user: req.user._id, campaign: campaignId },
    {},
    { upsert: true, new: true }
  );

  res.status(200).json({ success: true, message: "Added to favourites." });
});

// ─── @DELETE /api/users/favourites/:campaignId ────────────────────────────
export const removeFavourite = asyncHandler(async (req, res) => {
  await Favourite.findOneAndDelete({ user: req.user._id, campaign: req.params.campaignId });
  res.status(200).json({ success: true, message: "Removed from favourites." });
});

// ─── @GET /api/users/stats (Admin dashboard) ──────────────────────────────
export const getUserStats = asyncHandler(async (req, res) => {
  const [totalUsers, roleBreakdown, recentUsers] = await Promise.all([
    User.countDocuments({ status: { $ne: "Suspended" } }),
    User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]),
    User.find()
      .sort("-createdAt")
      .limit(5)
      .select("fullName email role status totalDonated createdAt"),
  ]);

  res.status(200).json({
    success: true,
    data: { totalUsers, roleBreakdown, recentUsers },
  });
});
