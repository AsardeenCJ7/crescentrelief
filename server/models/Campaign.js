import mongoose from "mongoose";

const donationTierSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    label: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    size: { type: String },
    url: { type: String, required: true },
    mimeType: { type: String, default: "application/pdf" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    targetAmount: { type: Number, required: true },
    achieved: { type: Boolean, default: false },
    achievedAt: { type: Date },
  },
  { _id: true }
);

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 500 },
    longDescription: { type: String },
    category: {
      type: String,
      required: true,
      enum: [
        "Zakat", "Sadaqah", "Lillah", "Qurbani / Udhiya", "Fidya", 
        "Sadaqatul Fitr / Fitrana", "Food Pack", "Mosque Project", 
        "Shelter Project", "Widows Support", "Water Project", 
        "Emergency Relief", "Orphan Support", "Education Support", 
        "Medical Aid", "Winter Appeal", "Palestine / Gaza Emergency Appeal", 
        "General Donation"
      ],
    },
    status: {
      type: String,
      enum: ["Draft", "Active", "Paused", "Completed", "Closed", "Archived"],
      default: "Draft",
    },
    image: { type: String },
    videoUrl: { type: String },
    goal: { type: Number, required: true, min: 1 },
    raised: { type: Number, default: 0, min: 0 },
    donors: { type: Number, default: 0, min: 0 },
    daysLeft: { type: Number, default: 30, min: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    urgent: { type: Boolean, default: false },
    isZakatEligible: { type: Boolean, default: false },
    isGiftAidEligible: { type: Boolean, default: true },
    badge: { type: String },
    badgeColor: {
      type: String,
      enum: ["emergency", "primary", "secondary", "accent", "success"],
      default: "primary",
    },
    documents: [documentSchema],
    donationTiers: [donationTierSchema],
    milestones: [milestoneSchema],
    tags: [{ type: String, trim: true, lowercase: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    managedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    country: { type: String },
    region: { type: String },
    beneficiariesCount: { type: Number, default: 0 },
    impactMetric: { type: String },
    featuredOrder: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: percentage funded
campaignSchema.virtual("percentFunded").get(function () {
  if (!this.goal || this.goal === 0) return 0;
  return Math.min(Math.round((this.raised / this.goal) * 100), 100);
});

// Virtual: remaining amount
campaignSchema.virtual("remaining").get(function () {
  return Math.max(0, this.goal - this.raised);
});

// Indexes for fast queries
campaignSchema.index({ status: 1, category: 1 });
campaignSchema.index({ createdAt: -1 });
campaignSchema.index({ raised: -1 });
campaignSchema.index({ urgent: -1, status: 1 });
campaignSchema.index({ slug: 1 }, { unique: true });
campaignSchema.index({ tags: 1 });
campaignSchema.index({ title: "text", description: "text" });

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
