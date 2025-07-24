import mongoose from "mongoose";

const ipTrackerSchema = new mongoose.Schema({
  ip: { type: String, unique: true, required: true },  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("IPTracker", ipTrackerSchema);