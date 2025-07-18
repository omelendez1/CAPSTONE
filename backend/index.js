import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Needed to fetch from external API
import Card from "./models/Card.js";

dotenv.config();
const app = express();

// Enable CORS for frontend origin
app.use(cors({ origin: "http://localhost:5173" }));

// Enable JSON body parsing
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Hello from backend");
});

// Fetch all saved cards from MongoDB
app.get("/api/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    console.error("❌ Error fetching cards:", error);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

// Save a card to MongoDB
app.post("/api/cards", async (req, res) => {
  try {
    const { name, type, imageUrl } = req.body;
    const newCard = new Card({ name, type, imageUrl });
    await newCard.save();
    res.json({ message: "Card saved!", card: newCard });
  } catch (error) {
    console.error("❌ Error saving card:", error);
    res.status(500).json({ error: "Failed to save card" });
  }
});

// Proxy route to fetch a random Pokémon card from the external API with detailed logging
app.get("/api/random-card", async (req, res) => {
  try {
    const apiKey = process.env.POKEMON_API_KEY;
    console.log("🔑 Using API Key:", apiKey);

    const url = "https://api.pokemontcg.io/v2/cards?pageSize=1&page=random";
    console.log("🌐 Fetching:", url);

    const response = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
    });

    console.log("✅ Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Pokémon API error:", errorText);
      return res.status(response.status).json({
        error: "Pokémon API error",
        details: errorText,
        status: response.status,
      });
    }

    const data = await response.json();
    console.log("✅ Got data:", JSON.stringify(data).slice(0, 200) + "...");
    res.json(data);
  } catch (err) {
    console.error("❌ Proxy failed:", err);
    res.status(500).json({ error: "Failed to fetch card from Pokémon API" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});