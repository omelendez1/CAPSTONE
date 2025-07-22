import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  imageUrl: { type: String, required: true },
  nationalPokedexNumber: { type: Number }, // new field for grouping generations
});

export default mongoose.model("Card", CardSchema);