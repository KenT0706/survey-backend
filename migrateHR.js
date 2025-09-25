// migrateHR.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ override: true, silent: true });




const MONGODB_URI || process.env.DATABASE_URL || process.env.MONGODB_URI;



async function migrateHR() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;

    const oldCollection = db.collection("hrresponses");
    const newCollection = db.collection("hrselfassessmentresponses");

    const oldDocs = await oldCollection.find().toArray();
    console.log(`📦 Found ${oldDocs.length} old docs in hrresponses`);

    if (oldDocs.length > 0) {
      // Remove any _id to avoid duplicate key errors
      const cleanedDocs = oldDocs.map(({ _id, ...rest }) => rest);

      // Insert into new collection
      const result = await newCollection.insertMany(cleanedDocs);
      console.log(`✅ Inserted ${result.insertedCount} docs into hrselfassessmentresponses`);
    }

    console.log("🎉 Migration finished!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrateHR();
