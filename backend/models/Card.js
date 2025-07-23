import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  name: String,
  type: String,
  imageUrl: String,
  nationalPokedexNumber: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // new user- or userId
});

export default mongoose.model("Card", cardSchema);