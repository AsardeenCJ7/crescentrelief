import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import Task from "../models/Task.js";
import slugify from "slugify";

// Import all mock campaigns from the frontend constants
import { CAMPAIGNS } from "../../src/constants/data.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/crescentrelief");
    console.log("MongoDB connected for seeding...");
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
};

const MOCK_USERS = [
  { fullName: "Super Admin", email: "superadmin@crescentrelief.org", role: "superadmin", password: "password123", status: "Active" },
  { fullName: "System Admin", email: "admin@crescentrelief.org", role: "admin", password: "password123", status: "Active" },
  { fullName: "Asardeen MA", email: "user@example.com", role: "donor", password: "password123", totalDonated: 2450, campaignsSupported: 7, status: "Active" },
  { fullName: "Sarah Khan", email: "sarah.k@example.com", role: "donor", password: "password123", totalDonated: 450, campaignsSupported: 4, status: "Active" },
];

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Campaign.deleteMany();
    await Donation.deleteMany();
    await Task.deleteMany();

    console.log("Existing data cleared.");

    // Seed users
    const users = await User.create(MOCK_USERS);
    console.log("Users seeded.");
    const adminId = users[0]._id;

    // Seed ALL campaigns from data.js
    const mappedCampaigns = CAMPAIGNS.map(c => {
      // Remove id since Mongo generates _id
      const { id, ...campaignData } = c;
      return {
        ...campaignData,
        slug: slugify(c.title, { lower: true, strict: true }),
        createdBy: adminId,
        status: "Active" // Ensure all mock campaigns are set to Active
      };
    });

    const campaigns = await Campaign.create(mappedCampaigns);
    console.log(`Seeded ${campaigns.length} campaigns successfully.`);

    // Seed some mock tasks
    await Task.create({
      title: "Review Gaza Emergency Relief Campaign",
      description: "Check the documents and verify the latest field updates from the Gaza team.",
      assignedTo: users[1]._id, // Admin
      assignedBy: adminId, // Superadmin
      campaign: campaigns[0]._id,
      priority: "High",
    });
    console.log("Tasks seeded.");

    console.log("✅ Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

connectDB().then(seedData);
