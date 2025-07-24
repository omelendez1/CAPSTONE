import { useState, useEffect } from "react";
import axios from "axios";
import tokenIcon from "../assets/token.png";

export default function Home() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(0);
  const [cooldownMessage, setCooldownMessage] = useState("");
  const [loginWarning, setLoginWarning] = useState("");

  // ✅ Fetch token balance for logged-in user
  useEffect(() => {
    const fetchUserTokens = async () => {
      const jwt = localStorage.getItem("authToken");
      if (!jwt) {
        setTokens(0);
        return; // logged out → show 0
      }

      try {
        const res = await axios.get("http://localhost:8080/api/auth/tokens", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setTokens(res.data.tokens);
      } catch (err) {
        console.error("❌ Failed to fetch token balance:", err);
        setTokens(0);
      }
    };

    fetchUserTokens();
  }, []);

  // ✅ Claim daily +4 tokens from backend
  const earnTokens = async () => {
    const jwt = localStorage.getItem("authToken");
    if (!jwt) {
      setLoginWarning("⚠️ You must log in to claim tokens!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/claim-tokens",
        {},
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      setTokens(res.data.tokens);
      setCooldownMessage(res.data.message);
    } catch (err) {
      console.error("❌ Claim tokens error:", err);
      setCooldownMessage(
        err.response?.data?.error ||
          "Failed to claim tokens. Try again tomorrow!"
      );
    }
  };

  // ✅ Fetch random card, deduct token after successful draw
  const fetchRandomCard = async () => {
    const jwt = localStorage.getItem("authToken");
    if (!jwt) {
      setLoginWarning("⚠️ You must log in to generate random cards!");
      setTimeout(() => setLoginWarning(""), 5000);
      return;
    }

    if (tokens <= 0) {
      alert("No tokens left! Click the token icon (once per day) to earn more.");
      return;
    }

    setLoading(true);
    setCard(null);

    try {
      const res = await fetch("http://localhost:8080/api/random-card", {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      const randomCard = data.data[0];

      setCard({
        name: randomCard.name,
        type: randomCard.types?.[0] || "Unknown",
        imageUrl: randomCard.images.large,
        nationalPokedexNumber: randomCard.nationalPokedexNumbers?.[0] || null,
      });

      // ✅ Deduct ONE token locally after generating a card
      setTokens((prev) => prev - 1);
    } catch (err) {
      console.error("Error fetching card:", err);
      alert("Failed to fetch card. Backend proxy might be down.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save card securely with JWT token
  const saveCardToDB = async () => {
    if (!card) return;

    try {
      const jwt = localStorage.getItem("authToken");
      if (!jwt) {
        alert("❌ You must be logged in to save cards!");
        return;
      }

      const res = await fetch("http://localhost:8080/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(card),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to save card");
        return;
      }

      alert(result.message || "✅ Card saved!");
    } catch (err) {
      console.error("Error saving card:", err);
      alert("❌ Could not save card. Are you logged in?");
    }
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-bold mb-4">Welcome to the Home Page</h2>

      {/* Token Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          marginBottom: "1rem",
        }}
      >
        {/* Token clickable icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
          onClick={earnTokens}
          title="Click once per day to earn +4 tokens"
        >
          <img
            src={tokenIcon}
            alt="Token"
            style={{ width: "40px", height: "40px" }}
          />
          <span style={{ fontWeight: "bold" }}>{tokens} tokens</span>
        </div>

        {/* Generate button */}
        <button
          onClick={fetchRandomCard}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={tokens <= 0}
        >
          {tokens > 0 ? "Generate Random Card" : "No Tokens"}
        </button>
      </div>

      {/* Cooldown / login messages */}
      {cooldownMessage && (
        <p style={{ fontSize: "0.9rem", color: "gray", marginBottom: "0.5rem" }}>
          {cooldownMessage}
        </p>
      )}

      {loginWarning && (
        <p style={{ fontSize: "0.9rem", color: "red", marginBottom: "0.5rem" }}>
          {loginWarning}
        </p>
      )}

      {/* Card Display */}
      <div className="mt-4 flex justify-center">
        <div
          className="placeholder relative"
          style={{ width: "256px", height: "384px" }}
        >
          {loading && (
            <p className="absolute w-full text-center text-white top-1/2 transform -translate-y-1/2">
              Loading...
            </p>
          )}
          {card && (
            <img
              src={card.imageUrl}
              alt={card.name}
              className="absolute top-0 left-0 w-full h-full object-contain rounded-lg shadow-lg"
              width="258"
              height="387"
            />
          )}
        </div>
      </div>

      {/* Card Info + Save */}
      {card && (
        <div className="mt-2 text-center">
          <h2 className="text-xl mt-2">{card.name}</h2>
          <p>Type: {card.type}</p>
          <button
            onClick={saveCardToDB}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save to Collection
          </button>
        </div>
      )}
    </div>
  );
}