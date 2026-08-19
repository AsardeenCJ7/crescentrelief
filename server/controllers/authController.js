import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";

// ─── Token Generator ───────────────────────────────────────────────────────
const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_key_for_dev_mode_only", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const signRefreshToken = (id) =>
  jwt.sign({ id }, (process.env.JWT_SECRET || "fallback_secret_key_for_dev_mode_only") + "_refresh", {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });

const sendTokenResponse = async (user, statusCode, res) => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Save refresh token to DB
  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  user.loginCount = (user.loginCount || 0) + 1;
  await user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      totalDonated: user.totalDonated,
      campaignsSupported: user.campaignsSupported,
      badge: user.badge,
      referralCode: user.referralCode,
      giftAidEnabled: user.giftAidEnabled,
      newsletterSubscribed: user.newsletterSubscribed,
    },
  });
};

// ─── @POST /api/auth/register ──────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, referralCode } = req.body;

  // Check if email already exists
  let user = await User.findOne({ email }).select("+emailVerificationToken +emailVerificationExpires");
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[Crescent Relief OTP] code for ${email} is: ${otp}`);

  // Find referrer if code provided
  let referrer = null;
  if (referralCode) {
    referrer = await User.findOne({ referralCode });
  }

  if (user) {
    if (user.status !== "Unverified" || user.emailVerified) {
      throw new AppError("Email already registered. Please sign in.", 409);
    }
    // If Unverified, update their details and send a new OTP
    user.fullName = fullName;
    user.password = password; // Will be hashed by pre-save hook
    if (phone) user.phone = phone;
    user.emailVerificationToken = otp;
    user.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
    if (referrer && !user.referredBy) {
      user.referredBy = referrer._id;
    }
    await user.save();
  } else {
    // Create new user
    user = await User.create({
      fullName,
      email,
      password,
      phone,
      role: "donor",
      status: "Unverified",
      emailVerified: false,
      emailVerificationToken: otp,
      emailVerificationExpires: Date.now() + 10 * 60 * 1000, // 10 mins
      authProvider: "local",
      referredBy: referrer?._id || undefined,
      badge: { tier: "Bronze" },
    });

    // Increment referrer's count only on new user creation
    if (referrer) {
      referrer.referralCount += 1;
      referrer.updateBadgeTier();
      await referrer.save({ validateBeforeSave: false });
    }
  }

  await AuditLog.create({
    actorEmail: email,
    action: "USER_CREATED",
    targetType: "User",
    targetId: user._id,
    ipAddress: req.ip,
  });

  // Send email in background to prevent timeout
  sendEmail({
    email: user.email,
    subject: "Crescent Relief - Verify Your Email",
    message: `Welcome to Crescent Relief! Your verification code is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0d9488; text-align: center;">Welcome to Crescent Relief!</h2>
        <p>Thank you for registering. To verify your email address, please enter the following 6-digit verification code:</p>
        <div style="background: #f0fdfa; border: 2px dashed #0d9488; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0d9488; margin: 20px 0; border-radius: 8px;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">This code is valid for 10 minutes. If you did not register for an account, you can safely ignore this email.</p>
      </div>
    `
  }).catch(error => console.error("Error sending registration verification email via SMTP:", error));

  res.status(201).json({
    success: true,
    message: "Registration initiated. Verification code sent.",
    email: user.email,
    ...(process.env.NODE_ENV === "development" && { otp }),
  });
});

// ─── @POST /api/auth/verify-otp ──────────────────────────────────────────────
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError("Email and verification code are required.", 400);
  }

  const user = await User.findOne({ email }).select("+emailVerificationToken +emailVerificationExpires");
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (user.emailVerified || user.status === "Active") {
    throw new AppError("This email is already verified. Please sign in directly.", 400);
  }

  if (user.status === "Suspended") {
    throw new AppError("Account suspended. Contact support@crescentrelief.org.", 403);
  }

  if (user.emailVerificationToken !== otp) {
    throw new AppError("Invalid verification code.", 400);
  }

  if (user.emailVerificationExpires < Date.now()) {
    throw new AppError("Verification code has expired. Please request a new one.", 400);
  }

  // Set user active
  user.status = "Active";
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  await AuditLog.create({
    actor: user._id,
    actorEmail: user.email,
    action: "EMAIL_VERIFIED",
    targetType: "User",
    targetId: user._id,
    ipAddress: req.ip,
  });

  // Send welcome email in background
  sendEmail({
    email: user.email,
    subject: "Welcome to Crescent Relief! 🌙",
    message: `Welcome to Crescent Relief, ${user.fullName}! Your email has been verified successfully. You are now a verified donor.`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0d9488, #0ea5e9); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Crescent Relief! 🌙</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your journey of making a difference starts now</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 15px;">Dear <strong>${user.fullName}</strong>,</p>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
            Thank you for joining Crescent Relief! Your email has been <strong style="color: #0d9488;">successfully verified</strong> and your donor account is now active.
          </p>
          <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
            <p style="font-size: 14px; color: #0d9488; font-weight: 600; margin: 0 0 8px;">What you can do now:</p>
            <ul style="font-size: 14px; color: #4b5563; margin: 0; padding-left: 18px; line-height: 1.8;">
              <li>Browse and support active campaigns</li>
              <li>Track your donation history</li>
              <li>See the real-world impact of your contributions</li>
              <li>Connect with our volunteer community</li>
            </ul>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin: 20px 0 0;">
            Together, we can make a lasting difference in the lives of those who need it most.
          </p>
          <p style="font-size: 14px; color: #6b7280; margin: 25px 0 0;">
            With gratitude,<br/><strong style="color: #374151;">The Crescent Relief Team</strong>
          </p>
        </div>
        <div style="background: #f9fafb; padding: 15px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">© ${new Date().getFullYear()} Crescent Relief. All rights reserved.</p>
        </div>
      </div>
    `
  }).catch(emailError => console.error("Error sending welcome email:", emailError));

  sendTokenResponse(user, 200, res);
});

// ─── @POST /api/auth/resend-otp ──────────────────────────────────────────────
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError("Email is required.", 400);

  const user = await User.findOne({ email }).select("+emailVerificationToken +emailVerificationExpires");
  if (!user) throw new AppError("User not found.", 404);

  if (user.emailVerified || user.status !== "Unverified") {
    throw new AppError("This account is already verified. Please sign in directly.", 400);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[Crescent Relief OTP Resend] code for ${email} is: ${otp}`);

  user.emailVerificationToken = otp;
  user.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send email in background
  sendEmail({
    email: user.email,
    subject: "Crescent Relief - Verify Your Email",
    message: `Your new verification code is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0d9488; text-align: center;">New Verification Code</h2>
        <p>You requested a new verification code. Please enter the following 6-digit code to verify your email address:</p>
        <div style="background: #f0fdfa; border: 2px dashed #0d9488; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0d9488; margin: 20px 0; border-radius: 8px;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">This code is valid for 10 minutes. If you did not request this, please secure your account.</p>
      </div>
    `
  }).catch(error => console.error("Error sending resend verification email via SMTP:", error));

  res.status(200).json({
    success: true,
    message: "A new verification code has been sent.",
    ...(process.env.NODE_ENV === "development" && { otp }),
  });
});

// ─── @POST /api/auth/login ─────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new AppError("Email and password are required.", 400);

  // Fetch user with password (normally excluded)
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid email or password.", 401);

  if (user.status === "Pending Setup") {
    throw new AppError("Account setup incomplete. Please check your invitation email.", 403);
  }

  if (user.authProvider === "google") {
    throw new AppError("Please sign in with Google.", 400);
  }

  if (user.status === "Unverified") {
    throw new AppError(
      "EMAIL_NOT_VERIFIED",
      403
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid email or password.", 401);

  if (user.status === "Suspended") {
    throw new AppError("Account suspended. Contact support@crescentrelief.org.", 403);
  }

  await AuditLog.create({
    actor: user._id,
    actorEmail: user.email,
    action: "USER_LOGIN",
    targetType: "User",
    targetId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  sendTokenResponse(user, 200, res);
});

// ─── @POST /api/auth/logout ────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { refreshToken: null });

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action: "USER_LOGOUT",
    targetType: "User",
    targetId: req.user._id,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: "Logged out successfully." });
});

// ─── @POST /api/auth/refresh ───────────────────────────────────────────────
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new AppError("Refresh token required.", 400);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET + "_refresh");
  } catch {
    throw new AppError("Invalid or expired refresh token.", 401);
  }

  const user = await User.findOne({ _id: decoded.id }).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    throw new AppError("Refresh token revoked.", 401);
  }

  const newAccessToken = signAccessToken(user._id);
  res.status(200).json({ success: true, accessToken: newAccessToken });
});

// ─── @GET /api/auth/me ─────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// ─── @POST /api/auth/forgot-password ──────────────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // Always respond 200 to prevent email enumeration
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Send email in background
  sendEmail({
    email: user.email,
    subject: "Crescent Relief - Password Reset Request",
    message: `You requested a password reset. Please click on the link to reset your password: ${resetUrl}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0d9488; text-align: center;">Password Reset Request</h2>
        <p>We received a request to reset the password associated with your Crescent Relief account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0d9488; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #0d9488; font-size: 14px;">${resetUrl}</p>
        <p style="font-size: 12px; color: #666;">This link is valid for 15 minutes. If you did not request a password reset, no further action is required.</p>
      </div>
    `
  }).catch(error => console.error("Error sending password reset email via SMTP:", error));

  if (process.env.NODE_ENV === "development") {
    return res.status(200).json({
      success: true,
      message: "Password reset link generated (dev mode).",
      resetUrl,
    });
  }

  res.status(200).json({
    success: true,
    message: "If that email exists, a reset link has been sent.",
  });
});

// ─── @POST /api/auth/reset-password/:token ────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) throw new AppError("Reset token is invalid or has expired.", 400);

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  if (user.status === "Pending Setup") user.status = "Active";
  await user.save();

  await AuditLog.create({
    actor: user._id,
    actorEmail: user.email,
    action: "PASSWORD_RESET",
    targetType: "User",
    targetId: user._id,
    ipAddress: req.ip,
  });

  sendTokenResponse(user, 200, res);
});

// ─── @POST /api/auth/setup-password/:userId ───────────────────────────────
export const setupPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { userId } = req.params;

  const user = await User.findById(userId).select("+setupToken +setupTokenExpires");
  if (!user) throw new AppError("Invalid setup link.", 400);
  if (user.status !== "Pending Setup") {
    throw new AppError("Account is already set up.", 400);
  }

  user.password = password;
  user.status = "Active";
  user.setupToken = undefined;
  user.setupTokenExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// ─── @POST /api/auth/google ────────────────────────────────────────────────
export const googleLogin = asyncHandler(async (req, res) => {
  const { email, fullName, googleId, avatar, referralCode } = req.body;

  if (!email || !googleId) throw new AppError("Email and Google ID are required.", 400);

  let user = await User.findOne({ email });

  if (user) {
    let updated = false;
    if (user.authProvider !== "google") {
      user.authProvider = "google";
      user.googleId = googleId;
      updated = true;
    }
    if (avatar && !user.avatar) {
      user.avatar = avatar;
      updated = true;
    }
    if (user.status === "Unverified" || !user.emailVerified) {
      user.status = "Active";
      user.emailVerified = true;
      updated = true;
    }
    if (updated) {
      await user.save({ validateBeforeSave: false });
    }
  } else {
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
    }

    user = await User.create({
      fullName: fullName || "Google User",
      email,
      googleId,
      authProvider: "google",
      role: "donor",
      status: "Active",
      emailVerified: true,
      avatar,
      referredBy: referrer?._id || undefined,
      badge: { tier: "Bronze" }
    });

    if (referrer) {
      referrer.referralCount += 1;
      referrer.updateBadgeTier();
      await referrer.save({ validateBeforeSave: false });
    }

    await AuditLog.create({
      actorEmail: email,
      action: "USER_CREATED",
      targetType: "User",
      targetId: user._id,
      meta: { provider: "google" },
      ipAddress: req.ip,
    });
  }

  await AuditLog.create({
    actor: user._id,
    actorEmail: user.email,
    action: "USER_LOGIN",
    targetType: "User",
    targetId: user._id,
    meta: { provider: "google" },
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  sendTokenResponse(user, 200, res);
});
