import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully.");

    // Event listeners for debugging
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Reconnecting...");
      connect();
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit the app on failure
  }
};

export default connect;
