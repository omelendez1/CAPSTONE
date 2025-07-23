import { useState, useEffect } from "react";
import tokenIcon from "../assets/token.png";

export default function Home() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(0);
  const [cooldownMessage, setCooldownMessage] = useState("");
  const [loginWarning, setLoginWarning] = useState(""); // warning for not logged in

  // Load tokens from localStorage on mount
  useEffect(() => {
    const savedTokens = parseInt(localStorage.getItem("tokenCount"), 10);
    if (!isNaN(savedTokens)) {
      setTokens(savedTokens);
    }
  }, []);

  const updateTokenStorage = (newTokens) => {
    setTokens(newTokens);
    localStorage.setItem("tokenCount", newTokens);
  };

  // check if last earned date is today
  const isSameDay = (dateString) => {
    if (!dateString) return false;
    const savedDate = new Date(dateString).toDateString();
    const today = new Date().toDateString();
    return savedDate === today;
  };

  // Earn +4 tokens once per day
  const earnTokens = () => {
    const lastEarnedDate = localStorage.getItem("lastEarnedDate");

    if (isSameDay(lastEarnedDate)) {
      setCooldownMessage(
        "⏳ You’ve already claimed your daily tokens. Try again tomorrow!"
      );
      return;
    }

    const newTokens = tokens + 4;
    updateTokenStorage(newTokens);

    // Save today’s date to enforce cooldown
    localStorage.setItem("lastEarnedDate", new Date().toISOString());
    setCooldownMessage("✅ You earned +4 tokens for today!");
  };

  // Check login before generating a card
  const fetchRandomCard = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setLoginWarning("⚠️ You must log in to generate random cards!");
      // auto-clear after 3 seconds
      setTimeout(() => setLoginWarning(""), 8000);
      return;
    }

    if (tokens <= 0) {
      alert("No tokens left! Click the token icon (once per day) to earn more.");
      return;
    }

    setLoading(true);
    setCard(null);

    try {
      const response = await fetch("http://localhost:8080/api/random-card", {
        headers: {
          Authorization: `Bearer ${token}`, //ensure token is sent if required
        },
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const randomCard = data.data[0];

      setCard({
        name: randomCard.name,
        type: randomCard.types?.[0] || "Unknown",
        imageUrl: randomCard.images.large,
        nationalPokedexNumber: randomCard.nationalPokedexNumbers?.[0] || null,
      });

      // Consume one token after success
      updateTokenStorage(tokens - 1);
      setLoginWarning(""); // clear any old warning if successful
    } catch (err) {
      console.error("Error fetching card:", err);
      alert("Failed to fetch card. Backend proxy might be down.");
    } finally {
      setLoading(false);
    }
  };

  // Save card securely with JWT token
  const saveCardToDB = async () => {
    if (!card) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("❌ You must be logged in to save cards!");
        return;
      }

      const response = await fetch("http://localhost:8080/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(card),
      });

      const result = await response.json();

      if (!response.ok) {
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
      {/* Header */}
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

      {/* Show cooldown or success message */}
      {cooldownMessage && (
        <p style={{ fontSize: "0.9rem", color: "gray", marginBottom: "0.5rem" }}>
          {cooldownMessage}
        </p>
      )}

      {/* Show login warning if not logged in */}
      {loginWarning && (
        <p style={{ fontSize: "0.9rem", color: "red", marginBottom: "0.5rem" }}>
          {loginWarning}
        </p>
      )}

      {/* Card Display */}
      <div className="mt-4 flex justify-center">
        <div className="placeholder relative" style={{ width: "256px", height: "384px" }}>
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