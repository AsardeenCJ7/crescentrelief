import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/crescentrelief";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦  Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅  MongoDB reconnected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌  MongoDB connection error:", err);
    });

  } catch (error) {
    console.error("❌  MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
