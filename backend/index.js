import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import path from "path";                     // <-- For __dirname fix
import { fileURLToPath } from "url";         // <-- For __dirname fix

import Card from "./models/Card.js";

dotenv.config();

const app = express();

// ===== Updated CORS to allow multiple origins =====
const allowedOrigins = [
  "http://localhost:5173",                       // React local dev server
  "https://pokemoncardgeneratorgame.netlify.app", // Your frontend Netlify URL
  "https://capstone-backend-o1hj.onrender.com"     // Your backend URL itself
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Allow Postman, curl, or server-to-server calls with no origin
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: The origin ${origin} is not allowed by CORS.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

// ===== Fix __dirname for ES modules =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ================================
    USER SCHEMA + MODEL
================================ */
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  resetToken: String,
  resetTokenExpiry: Date,
  tokens: {
    type: Number,
    default: 0,
  },
  lastTokenClaim: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

/* ================================
  AUTH MIDDLEWARE (JWT protect)
================================ */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/* ================================
    AUTH ROUTES
================================ */
// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// FORGOT PASSWORD
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    res.json({
      message: "Password reset token generated",
      resetToken,
    });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ error: "Server error during password reset" });
  }
});

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Special test email triggers welcome modal
    if (email === "testdev@example.com") {
      let testUser = await User.findOne({ email });
      if (!testUser) {
        const passwordHash = await bcrypt.hash(password, 10);
        testUser = new User({ email, passwordHash });
        await testUser.save();
      }

      return res.status(201).json({
        message: "✅ Test account always triggers welcome modal",
        showWelcomeModal: true,
      });
    }

    // Normal signup flow
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        showWelcomeModal: false,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, passwordHash });
    await newUser.save();

    return res.status(201).json({
      message: "✅ Registration successful!",
      showWelcomeModal: true,
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

/* ================================
  DELETE USER ROUTE (with card cleanup)
================================ */
app.delete("/api/auth/delete", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Delete all cards belonging to this user
    await Card.deleteMany({ userId: user._id });

    // Delete user record
    await User.deleteOne({ _id: user._id });

    return res.json({ message: "✅ User and all associated cards deleted successfully" });
  } catch (err) {
    console.error("❌ Delete user error:", err);
    res.status(500).json({ error: "Server error while deleting user" });
  }
});

/* ================================
  TOKEN MANAGEMENT ROUTES
================================ */
app.get("/api/auth/tokens", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("tokens lastTokenClaim");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      tokens: user.tokens,
      lastTokenClaim: user.lastTokenClaim,
    });
  } catch (err) {
    console.error("❌ Error fetching tokens:", err);
    res.status(500).json({ error: "Failed to fetch token info" });
  }
});

app.post("/api/auth/claim-tokens", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();
    const lastClaim = user.lastTokenClaim || new Date(0);
    const hoursSinceLastClaim = (now - lastClaim) / 1000 / 3600;

    if (hoursSinceLastClaim < 24) {
      return res.status(400).json({
        error: `You can only claim tokens once every 24 hours. Please wait ${Math.ceil(
          24 - hoursSinceLastClaim
        )} hour(s).`,
      });
    }

    const DAILY_TOKEN_AMOUNT = 5;
    user.tokens += DAILY_TOKEN_AMOUNT;
    user.lastTokenClaim = now;
    await user.save();

    res.json({
      message: `You have claimed ${DAILY_TOKEN_AMOUNT} tokens.`,
      tokens: user.tokens,
      lastTokenClaim: user.lastTokenClaim,
    });
  } catch (err) {
    console.error("❌ Error claiming tokens:", err);
    res.status(500).json({ error: "Failed to claim tokens" });
  }
});

/* ================================
  PROTECTED CARD ROUTES
================================ */
app.get("/api/cards", authMiddleware, async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.userId });
    res.json(cards);
  } catch (err) {
    console.error("❌ Error fetching cards:", err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

app.post("/api/cards", authMiddleware, async (req, res) => {
  try {
    const { name, type, imageUrl, nationalPokedexNumber } = req.body;
    const newCard = new Card({
      name,
      type,
      imageUrl,
      nationalPokedexNumber,
      userId: req.userId,
    });
    await newCard.save();
    res.json({ message: "Card saved!", card: newCard });
  } catch (error) {
    console.error("❌ Failed to save card:", error);
    res.status(500).json({ error: "Failed to save card" });
  }
});

app.get("/api/collections-grouped", authMiddleware, async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.userId });
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
      else grouped.gen8.push(card);
    });

    res.json(grouped);
  } catch (err) {
    console.error("❌ Error grouping cards:", err);
    res.status(500).json({ error: "Failed to group cards" });
  }
});

/* ================================
  CLEANUP ROUTE
================================ */
app.post("/api/admin/fix-pokedex", async (req, res) => {
  try {
    const badCards = await Card.find({ " nationalPokedexNumber": { $exists: true } });
    if (!badCards.length) {
      return res.json({ message: "✅ No bad cards found. DB is already clean." });
    }

    let fixedCount = 0;
    for (const card of badCards) {
      const rawValue = card[" nationalPokedexNumber"];
      const parsedDex = parseInt(rawValue, 10) || 0;
      card.nationalPokedexNumber = parsedDex;
      card.set(" nationalPokedexNumber", undefined, { strict: false });
      await card.save();
      console.log(`✅ Fixed card: ${card.name} → ${parsedDex}`);
      fixedCount++;
    }

    res.json({ message: `✅ Fixed ${fixedCount} cards successfully!` });
  } catch (err) {
    console.error("❌ Failed to fix pokedex fields:", err);
    res.status(500).json({ error: "Failed to fix bad fields" });
  }
});

/* ================================
  POKÉMON API PROXY
================================ */
app.get("/", (req, res) => {
  res.send("✅ Hello from backend");
});

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
   REACT FRONTEND SERVING LOGIC
  (Add after all backend routes)
================================ */
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================================
  SERVER START
================================ */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`✅ Backend + React running on http://localhost:${PORT}`)
);