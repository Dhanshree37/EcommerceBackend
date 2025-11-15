import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not defined in environment variables");
  process.exit(1);
}

/**
 * Connect to MongoDB
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("🛑 MongoDB connection closed");
  } catch (err) {
    console.error("❌ Error closing MongoDB connection:", err);
  }
};

// Handle termination signals (Ctrl+C, Heroku shutdown, etc.)
process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDB();
  process.exit(0);
});
