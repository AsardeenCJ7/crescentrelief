import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LOCAL_URI = "mongodb://localhost:27017/crescentrelief";
const ATLAS_URI = "mongodb+srv://crescent_admin:mpW9MUtQEZU3eLpQ@crescentrelief.b8pftrj.mongodb.net/crescentrelief?retryWrites=true&w=majority&appName=CrescentRelief";

const COLLECTIONS = ["campaigns", "users", "donations", "tasks", "auditlogs", "newsletters"];

async function migrate() {
  console.log("🔌 Connecting to LOCAL MongoDB...");
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log("✅ Connected to local DB");

  console.log("🔌 Connecting to ATLAS MongoDB...");
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log("✅ Connected to Atlas DB");

  for (const collectionName of COLLECTIONS) {
    try {
      const localCollection = localConn.collection(collectionName);
      const atlasCollection = atlasConn.collection(collectionName);

      const docs = await localCollection.find({}).toArray();

      if (docs.length === 0) {
        console.log(`⚠️  ${collectionName}: No documents found locally, skipping.`);
        continue;
      }

      // Drop existing Atlas collection to avoid duplicates
      await atlasCollection.deleteMany({});

      // Insert all local documents into Atlas
      await atlasCollection.insertMany(docs);
      console.log(`✅ ${collectionName}: Migrated ${docs.length} documents to Atlas`);
    } catch (err) {
      console.error(`❌ ${collectionName}: Failed - ${err.message}`);
    }
  }

  await localConn.close();
  await atlasConn.close();
  console.log("\n🎉 Migration complete! All data is now in Atlas.");
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
