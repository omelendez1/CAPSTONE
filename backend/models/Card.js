import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "Unknown",
  },
  imageUrl: {
    type: String,
    required: true,
  },
  nationalPokedexNumber: {
    type: Number,
    default: 0,
  },

  // link card to logged-in user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Add timestamps (createdAt, updatedAt)
cardSchema.set("timestamps", true);

const Card = mongoose.model("Card", cardSchema);
export default Card;