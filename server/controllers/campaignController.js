import Campaign from "../models/Campaign.js";
import slugify from "slugify";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import AuditLog from "../models/AuditLog.js";

// ─── @GET /api/campaigns ──────────────────────────────────────────────────
export const getCampaigns = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 9,
    category,
    status = "Active",
    urgent,
    search,
    sort = "-createdAt",
    zakatOnly,
  } = req.query;

  const filter = {};

  // Only expose non-admin status unless admin requests
  if (req.user?.role === "admin" || req.user?.role === "superadmin") {
    if (status !== "all") filter.status = status;
  } else {
    filter.status = "Active";
  }

  if (category && category !== "All") filter.category = category;
  if (urgent === "true") filter.urgent = true;
  if (zakatOnly === "true") filter.isZakatEligible = true;
  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [campaigns, total] = await Promise.all([
    Campaign.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-longDescription -documents -milestones")
      .lean(),
    Campaign.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: campaigns,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── @GET /api/campaigns/:id ──────────────────────────────────────────────
export const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate("createdBy", "fullName email avatar")
    .lean({ virtuals: true });

  if (!campaign) throw new AppError("Campaign not found.", 404);

  // Increment view count (fire and forget)
  Campaign.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }).exec();

  res.status(200).json({ success: true, data: campaign });
});

// ─── @POST /api/campaigns ─────────────────────────────────────────────────
export const createCampaign = asyncHandler(async (req, res) => {
  const data = req.body;

  // Auto-generate slug from title
  let slug = slugify(data.title, { lower: true, strict: true });

  // Ensure slug uniqueness
  const existing = await Campaign.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const campaign = await Campaign.create({
    ...data,
    slug,
    createdBy: req.user._id,
    status: data.status || "Active",
  });

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action: "CAMPAIGN_CREATED",
    targetType: "Campaign",
    targetId: campaign._id,
    meta: { title: campaign.title },
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, data: campaign });
});

// ─── @PUT /api/campaigns/:id ──────────────────────────────────────────────
export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new AppError("Campaign not found.", 404);

  const previousStatus = campaign.status;

  // Regenerate slug if title changed
  if (req.body.title && req.body.title !== campaign.title) {
    let newSlug = slugify(req.body.title, { lower: true, strict: true });
    const existing = await Campaign.findOne({ slug: newSlug, _id: { $ne: campaign._id } });
    req.body.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
  }

  Object.assign(campaign, req.body);
  await campaign.save();

  const action =
    req.body.status && req.body.status !== previousStatus
      ? "CAMPAIGN_STATUS_CHANGED"
      : "CAMPAIGN_UPDATED";

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action,
    targetType: "Campaign",
    targetId: campaign._id,
    meta: { title: campaign.title, previousStatus, newStatus: campaign.status },
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: campaign });
});

// ─── @DELETE /api/campaigns/:id ───────────────────────────────────────────
export const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new AppError("Campaign not found.", 404);

  if (req.query.force === "true") {
    await campaign.deleteOne();
    return res.status(200).json({ success: true, message: "Campaign permanently deleted." });
  }

  // Soft delete: archive instead of remove
  campaign.status = "Archived";
  await campaign.save();

  await AuditLog.create({
    actor: req.user._id,
    actorEmail: req.user.email,
    action: "CAMPAIGN_DELETED",
    targetType: "Campaign",
    targetId: campaign._id,
    meta: { title: campaign.title },
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: "Campaign archived successfully." });
});

// ─── @GET /api/campaigns/stats ────────────────────────────────────────────
export const getCampaignStats = asyncHandler(async (req, res) => {
  const stats = await Campaign.aggregate([
    { $match: { status: { $in: ["Active", "Completed"] } } },
    {
      $group: {
        _id: null,
        totalRaised: { $sum: "$raised" },
        totalGoal: { $sum: "$goal" },
        totalDonors: { $sum: "$donors" },
        activeCampaigns: {
          $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
        },
        completedCampaigns: {
          $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
        },
      },
    },
  ]);

  const byCategory = await Campaign.aggregate([
    { $match: { status: "Active" } },
    { $group: { _id: "$category", count: { $sum: 1 }, raised: { $sum: "$raised" } } },
    { $sort: { raised: -1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {},
      byCategory,
    },
  });
});
