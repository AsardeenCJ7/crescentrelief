import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");
  
  const db = mongoose.connection.db;
  const result = await db.collection("campaigns").updateMany(
    { category: "Emergency" },
    { $set: { category: "Emergency Relief" } }
  );
  
  console.log("Updated:", result.modifiedCount);
  process.exit(0);
};

run();
