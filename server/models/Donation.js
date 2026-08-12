import mongoose from "mongoose";

const giftAidSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    taxpayerName: String,
    taxpayerAddress: String,
    declaredAt: Date,
  },
  { _id: false }
);

const donationSchema = new mongoose.Schema(
  {
    // Core references
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },

    // Financial
    amount: {
      type: Number,
      required: true,
      min: [1, "Minimum donation is £1"],
    },
    currency: { type: String, default: "GBP", uppercase: true },
    giftAidAmount: { type: Number, default: 0 }, // 25% of amount
    netAmount: { type: Number }, // amount after fees

    // Donor Info (for anonymous donations)
    donorName: { type: String },
    donorEmail: { type: String, lowercase: true },
    isAnonymous: { type: Boolean, default: false },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "bank_transfer", "cash", "crypto", "stripe"],
      default: "card",
    },
    stripePaymentIntentId: { type: String, sparse: true },
    stripeChargeId: { type: String, sparse: true },
    transactionId: { type: String, unique: true, sparse: true },

    // Status
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded", "Disputed"],
      default: "Pending",
    },
    completedAt: { type: Date },
    failedAt: { type: Date },
    failureReason: { type: String },

    // Recurring
    isRecurring: { type: Boolean, default: false },
    recurringPlan: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "annually"],
    },
    recurringId: { type: String },
    parentDonationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation" },

    // Gift Aid
    giftAid: giftAidSchema,

    // Referral tracking
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    referralCode: { type: String },

    // Certificate
    certificateId: { type: String, unique: true, sparse: true },
    certificateGeneratedAt: { type: Date },

    // Metadata
    ipAddress: { type: String, select: false },
    userAgent: { type: String, select: false },
    note: { type: String, maxlength: 500 }, // donor note/message
    internalNote: { type: String, select: false },

    // Zakat designation
    isZakat: { type: Boolean, default: false },
    zakatNisab: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: formatted amount
donationSchema.virtual("formattedAmount").get(function () {
  return `£${this.amount.toFixed(2)}`;
});

// Auto-set completedAt when status changes to Completed
donationSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "Completed" && !this.completedAt) {
    this.completedAt = new Date();
  }
  if (this.isModified("status") && this.status === "Failed" && !this.failedAt) {
    this.failedAt = new Date();
  }
  // Auto-calculate Gift Aid
  if (this.giftAid?.enabled) {
    this.giftAidAmount = Math.round(this.amount * 0.25 * 100) / 100;
  }
  next();
});

// Compound indexes
donationSchema.index({ campaign: 1, status: 1 });
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ status: 1, createdAt: -1 });
donationSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });
donationSchema.index({ transactionId: 1 }, { unique: true, sparse: true });
donationSchema.index({ isRecurring: 1, recurringId: 1 });
donationSchema.index({ referredBy: 1 });

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
