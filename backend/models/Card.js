import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  imageUrl: { type: String }
});

export default mongoose.model("Card", CardSchema);