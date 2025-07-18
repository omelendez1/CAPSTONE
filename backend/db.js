import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error("MONGO_URI missing in .env");

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export default connectDB;