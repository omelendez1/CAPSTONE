import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Card from "./models/Card.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ================================
   1️⃣ USER SCHEMA + MODEL
================================ */
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  resetToken: String,
  resetTokenExpiry: Date,
});

const User = mongoose.model("User", userSchema);

/* ================================
   2️⃣ AUTH ROUTES
================================ */

// 👉 LOGIN ROUTE (validates email/password, returns JWT)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// 👉 FORGOT PASSWORD ROUTE (generates reset token)
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate a reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // For now, just return the token (in real app, you'd send via email)
    res.json({
      message: "Password reset token generated",
      resetToken,
    });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ error: "Server error during password reset" });
  }
});

/* 
   👉 OPTIONAL: You might also want a REGISTER route to create initial users
   (temporarily allow creating users while testing)
*/
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ email, passwordHash });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

/* ================================
   3️⃣ ORIGINAL POKÉMON ROUTES
================================ */

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Hello from backend");
});

// Fetch all saved cards
app.get("/api/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    console.error("❌ Error fetching cards:", err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

// Save a card
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

// Grouped collection by generation
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
      else grouped.gen8.push(card);
    });

    res.json(grouped);
  } catch (err) {
    console.error("❌ Error grouping cards:", err);
    res.status(500).json({ error: "Failed to group cards" });
  }
});

// Pokémon TCG API Proxy
app.get("/api/random-card", async (req, res) => {
  try {
    const apiKey = process.env.POKEMON_API_KEY;
    console.log("🔑 Using API Key:", apiKey);

    const url = "https://api.pokemontcg.io/v2/cards?pageSize=250&page=1";
    const response = await fetch(url, {
      headers: { "X-Api-Key": apiKey },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Pokémon API error:", errorText);
      return res.status(response.status).json({
        error: "Pokémon API error",
        details: errorText,
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

/* ================================
SERVER START
================================ */
const PORT = 8080;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);