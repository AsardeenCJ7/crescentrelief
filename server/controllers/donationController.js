import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import { asyncHandler, AppError } from "../middleware/errorHandler.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import Stripe from "stripe";

// Lazy-init Stripe so that dotenv.config() has run before we read the env var
let _stripe = null;
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

// ─── @POST /api/donations/create-payment-intent ─────────────────────────
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount < 1) {
    throw new AppError("Invalid donation amount", 400);
  }

  const stripe = getStripe();

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe takes amounts in cents/pence
    currency: "gbp",
    payment_method_types: ['card'],
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

// ─── @POST /api/campaigns/:id/donate ──────────────────────────────────────
export const createDonation = asyncHandler(async (req, res) => {
  const { amount, isAnonymous, paymentMethod, note, giftAid, referralCode, isZakat } = req.body;
  const campaignId = req.params.id;

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new AppError("Campaign not found.", 404);
  if (campaign.status !== "Active") throw new AppError("This campaign is not currently accepting donations.", 400);
  if (amount < 1) throw new AppError("Minimum donation amount is £1.", 400);

  // Find referrer
  let referrer = null;
  if (referralCode) {
    referrer = await User.findOne({ referralCode });
  }

  // Build donation document
  const donationData = {
    campaign: campaignId,
    amount,
    isAnonymous: isAnonymous || false,
    paymentMethod: paymentMethod || "card",
    note,
    transactionId: `TRX-${uuidv4().split("-")[0].toUpperCase()}`,
    status: "Completed", // In real app, set to Pending until payment gateway confirms
    referredBy: referrer?._id,
    referralCode,
    isZakat: isZakat || false,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  };

  // Attach user if authenticated
  if (req.user) {
    donationData.donor = req.user._id;
    donationData.donorName = isAnonymous ? "Anonymous" : req.user.fullName;
    donationData.donorEmail = req.user.email;
  } else {
    // Guest donation
    donationData.donorName = req.body.donorName || "Anonymous";
    donationData.donorEmail = req.body.donorEmail;
  }

  // Gift Aid
  if (giftAid?.enabled) {
    donationData.giftAid = {
      enabled: true,
      taxpayerName: giftAid.taxpayerName,
      taxpayerAddress: giftAid.taxpayerAddress,
      declaredAt: new Date(),
    };
    donationData.giftAidAmount = Math.round(amount * 0.25 * 100) / 100;
  }

  // Generate certificate ID
  donationData.certificateId = `CERT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  donationData.certificateGeneratedAt = new Date();

  const donation = await Donation.create(donationData);

  // ── Update Campaign stats atomically ──
  await Campaign.findByIdAndUpdate(campaignId, {
    $inc: { raised: amount, donors: 1 },
  });

  // ── Update Donor stats if logged in ──
  if (req.user) {
    const user = await User.findById(req.user._id);
    user.totalDonated += amount;
    user.donationCount += 1;
    user.lastDonatedAt = new Date();

    // Check if first donation to this campaign
    const prevDonation = await Donation.findOne({
      donor: req.user._id,
      campaign: campaignId,
      _id: { $ne: donation._id },
    });
    if (!prevDonation) {
      user.campaignsSupported += 1;
    }

    user.updateBadgeTier();
    await user.save({ validateBeforeSave: false });
  }

  // ── Update referrer stats ──
  if (referrer) {
    referrer.referralDonationTotal += amount;
    referrer.updateBadgeTier();
    await referrer.save({ validateBeforeSave: false });
  }

  // Populate campaign info for response
  await donation.populate("campaign", "title category image slug");

  res.status(201).json({
    success: true,
    message: "Thank you for your generous donation!",
    data: {
      donationId: donation._id,
      transactionId: donation.transactionId,
      certificateId: donation.certificateId,
      amount: donation.amount,
      giftAidAmount: donation.giftAidAmount,
      campaign: donation.campaign,
      paymentMethod: donation.paymentMethod,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      status: donation.status,
      createdAt: donation.createdAt,
    },
  });
});

// ─── @GET /api/donations (Admin) ──────────────────────────────────────────
export const getAllDonations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, campaign, search } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (campaign) filter.campaign = campaign;
  if (search) {
    filter.$or = [
      { donorEmail: { $regex: search, $options: "i" } },
      { donorName: { $regex: search, $options: "i" } },
      { transactionId: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [donations, total] = await Promise.all([
    Donation.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate("campaign", "title category")
      .populate("donor", "fullName email avatar")
      .lean(),
    Donation.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: donations,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── @GET /api/donations/my ────────────────────────────────────────────────
export const getMyDonations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [donations, total] = await Promise.all([
    Donation.find({ donor: req.user._id })
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .populate("campaign", "title category image")
      .lean({ virtuals: true }),
    Donation.countDocuments({ donor: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    data: donations,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// ─── @GET /api/donations/stats (Admin dashboard) ──────────────────────────
export const getDonationStats = asyncHandler(async (req, res) => {
  const { period = "7d" } = req.query;

  const periodMap = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = periodMap[period] || 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [overview, recentDonations, topCampaigns, dailyTrend] = await Promise.all([
    // Overall stats
    Donation.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: null,
          totalRaised: { $sum: "$amount" },
          totalDonations: { $sum: 1 },
          avgDonation: { $avg: "$amount" },
          totalGiftAid: { $sum: "$giftAidAmount" },
        },
      },
    ]),

    // Recent donations
    Donation.find({ status: "Completed" })
      .sort("-createdAt")
      .limit(5)
      .populate("campaign", "title")
      .populate("donor", "fullName")
      .lean(),

    // Top campaigns by raised
    Donation.aggregate([
      { $match: { status: "Completed", createdAt: { $gte: startDate } } },
      { $group: { _id: "$campaign", raised: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { raised: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "campaigns",
          localField: "_id",
          foreignField: "_id",
          as: "campaign",
        },
      },
      { $unwind: "$campaign" },
      { $project: { raised: 1, count: 1, "campaign.title": 1, "campaign.category": 1 } },
    ]),

    // Daily trend
    Donation.aggregate([
      {
        $match: {
          status: "Completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: overview[0] || { totalRaised: 0, totalDonations: 0, avgDonation: 0 },
      recentDonations,
      topCampaigns,
      dailyTrend,
    },
  });
});

// ─── @GET /api/donations/activity (Admin - daily activity feed) ─────────────
export const getDonationActivity = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const [dailyActivity, paymentMethodBreakdown, recentDonations, topDonors] = await Promise.all([
    // Daily totals grouped by day
    Donation.aggregate([
      { $match: { status: "Completed", createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          stripe: { $sum: { $cond: [{ $eq: ["$paymentMethod", "stripe"] }, "$amount", 0] } },
          paypal: { $sum: { $cond: [{ $eq: ["$paymentMethod", "paypal"] }, "$amount", 0] } },
          card: { $sum: { $cond: [{ $eq: ["$paymentMethod", "card"] }, "$amount", 0] } },
        },
      },
      { $sort: { _id: -1 } },
    ]),

    // Payment method breakdown totals
    Donation.aggregate([
      { $match: { status: "Completed", createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]),

    // Recent donations with full user + campaign info
    Donation.find({ status: "Completed", createdAt: { $gte: startDate } })
      .sort("-createdAt")
      .limit(50)
      .populate("campaign", "title category image")
      .populate("donor", "fullName email avatar badge")
      .lean(),

    // Top donors in period
    Donation.aggregate([
      { $match: { status: "Completed", createdAt: { $gte: startDate }, donor: { $exists: true } } },
      {
        $group: {
          _id: "$donor",
          totalDonated: { $sum: "$amount" },
          count: { $sum: 1 },
          lastDonation: { $max: "$createdAt" },
        },
      },
      { $sort: { totalDonated: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          totalDonated: 1,
          count: 1,
          lastDonation: 1,
          "user.fullName": 1,
          "user.email": 1,
          "user.avatar": 1,
          "user.badge": 1,
        },
      },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      dailyActivity,
      paymentMethodBreakdown,
      recentDonations,
      topDonors,
    },
  });
});
