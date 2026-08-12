import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    country: String,
    postcode: String,
  },
  { _id: false }
);

const badgeSchema = new mongoose.Schema(
  {
    tier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
      default: "Bronze",
    },
    unlockedAt: { type: Date, default: Date.now },
    referralCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      minlength: 8,
      select: false, // Never returned in queries by default
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: { type: String },
    role: {
      type: String,
      enum: ["donor", "admin", "superadmin"],
      default: "donor",
    },
    status: {
      type: String,
      enum: ["Active", "Suspended", "Pending Setup", "Unverified"],
      default: "Unverified",
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    setupToken: { type: String, select: false }, // for admin invite flow
    setupTokenExpires: { type: Date, select: false },
    refreshToken: { type: String, select: false },

    // Donation stats (denormalized for performance)
    totalDonated: { type: Number, default: 0, min: 0 },
    campaignsSupported: { type: Number, default: 0, min: 0 },
    donationCount: { type: Number, default: 0, min: 0 },
    lastDonatedAt: { type: Date },

    // UK Gift Aid
    giftAidEnabled: { type: Boolean, default: false },
    giftAidDeclaredAt: { type: Date },

    // Address (required for Gift Aid)
    address: addressSchema,

    // Referral system
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    referralCount: { type: Number, default: 0 },
    referralDonationTotal: { type: Number, default: 0 },

    // Badge/gamification
    badge: badgeSchema,

    // Social login
    googleId: { type: String, sparse: true },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // Preferences
    newsletterSubscribed: { type: Boolean, default: false },
    donationNotifications: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
    preferredCurrency: { type: String, default: "GBP" },

    // Admin fields
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    invitedAt: { type: Date },
    lastLoginAt: { type: Date },
    loginCount: { type: Number, default: 0 },
    notes: { type: String }, // Internal admin notes
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.emailVerificationToken;
        delete ret.setupToken;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// ─── PRE-SAVE: Hash password ───────────────────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── PRE-SAVE: Auto-generate referral code ────────────────────────────────
userSchema.pre("save", function (next) {
  if (!this.referralCode) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "CR-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.referralCode = code;
  }
  next();
});

// ─── METHODS ──────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateBadgeTier = function () {
  const total = this.totalDonated;
  const referrals = this.referralCount;

  if (total >= 10000 || referrals >= 50) {
    this.badge.tier = "Diamond";
  } else if (total >= 5000 || referrals >= 25) {
    this.badge.tier = "Platinum";
  } else if (total >= 1000 || referrals >= 10) {
    this.badge.tier = "Gold";
  } else if (total >= 250 || referrals >= 3) {
    this.badge.tier = "Silver";
  } else {
    this.badge.tier = "Bronze";
  }
};

// ─── INDEXES ──────────────────────────────────────────────────────────────
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ referralCode: 1 }, { unique: true, sparse: true });
userSchema.index({ referredBy: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ googleId: 1 }, { sparse: true });

const User = mongoose.model("User", userSchema);
export default User;
