import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Card from "./models/Card.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

//  Health check route
app.get("/", (req, res) => {
  res.send("✅ Hello from backend");
});

//  Fetch all saved cards (flat)
app.get("/api/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    console.error("❌ Error fetching cards:", err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

// Save a card to DB
app.post("/api/cards", async (req, res) => {
  try {
    const { name, type, imageUrl, nationalPokedexNumber } = req.body;
    const newCard = new Card({ name, type, imageUrl, nationalPokedexNumber });
    await newCard.save();
    res.json({ message: "Card saved!", card: newCard });
  } catch (error) {
    console.error("❌ Failed to save card:", error);
    res.status(500).json({ error: "Failed to save card" });
  }
});

// Fetch grouped collection by generation
app.get("/api/collections-grouped", async (req, res) => {
  try {
    const cards = await Card.find();

    const grouped = {
      gen1: [],
      gen2: [],
      gen3: [],
      gen4: [],
      gen5: [],
      gen6: [],
      gen7: [],
      gen8: [],
    };

    cards.forEach((card) => {
      const dex = card.nationalPokedexNumber || 0;

      if (dex >= 1 && dex <= 151) grouped.gen1.push(card);
      else if (dex >= 152 && dex <= 251) grouped.gen2.push(card);
      else if (dex >= 252 && dex <= 386) grouped.gen3.push(card);
      else if (dex >= 387 && dex <= 493) grouped.gen4.push(card);
      else if (dex >= 494 && dex <= 649) grouped.gen5.push(card);
      else if (dex >= 650 && dex <= 721) grouped.gen6.push(card);
      else if (dex >= 722 && dex <= 809) grouped.gen7.push(card);
      else if (dex >= 810 && dex <= 905) grouped.gen8.push(card);
      else grouped.gen8.push(card); // fallback for future gens
    });

    res.json(grouped);
  } catch (err) {
    console.error("❌ Error grouping cards:", err);
    res.status(500).json({ error: "Failed to group cards" });
  }
});

// Proxy route to fetch a random card from Pokémon TCG API
app.get("/api/random-card", async (req, res) => {
  try {
    const apiKey = process.env.POKEMON_API_KEY;
    console.log("🔑 Using API Key:", apiKey);

    const url = "https://api.pokemontcg.io/v2/cards?pageSize=250&page=1";
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
    const cards = data.data;
    const randomCard = cards[Math.floor(Math.random() * cards.length)];

    console.log("✅ Random card selected:", randomCard.name);
    res.json({ data: [randomCard] });
  } catch (err) {
    console.error("❌ Proxy failed:", err);
    res.status(500).json({ error: "Failed to fetch card from Pokémon API" });
  }
});

const PORT = 8080;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);