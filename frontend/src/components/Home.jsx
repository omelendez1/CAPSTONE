import { useState, useEffect } from "react";
import tokenIcon from "../assets/token.png"; // token image in /src/assets

export default function Home() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(0);

  // ✅ Load token count from localStorage when component mounts
  useEffect(() => {
    const savedTokens = parseInt(localStorage.getItem("tokenCount"), 10);
    if (!isNaN(savedTokens)) {
      setTokens(savedTokens);
    }
  }, []);

  // ✅ Helper to update tokens + localStorage
  const updateTokenStorage = (newTokens) => {
    setTokens(newTokens);
    localStorage.setItem("tokenCount", newTokens);
  };

  // ✅ Clicking token icon gives +4 tokens
  const earnTokens = () => {
    const newTokens = tokens + 4;
    updateTokenStorage(newTokens);
  };

  // ✅ Uses 1 token to generate a random card
  const fetchRandomCard = async () => {
    if (tokens <= 0) {
      alert("No tokens! Click the token icon to earn more.");
      return;
    }

    setLoading(true);
    setCard(null);

    try {
      const response = await fetch("http://localhost:8080/api/random-card");

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const randomCard = data.data[0];

      setCard({
        name: randomCard.name,
        type: randomCard.types?.[0] || "Unknown",
        imageUrl: randomCard.images.large,
      });

      // ✅ consume one token
      const newTokens = tokens - 1;
      updateTokenStorage(newTokens);

    } catch (err) {
      console.error("Error fetching card:", err);
      alert("Failed to fetch card. Backend proxy might be down.");
    } finally {
      setLoading(false);
    }
  };

  const saveCardToDB = async () => {
    if (!card) return;
    try {
      const response = await fetch("http://localhost:8080/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      });

      const result = await response.json();
      alert(result.message || "Card saved!");
    } catch (err) {
      console.error("Error saving card:", err);
    }
  };

  return (
    <div className="text-center p-4">

      {/* Page header */}
      <h2 className="text-xl font-bold mb-4">Welcome to the Home Page</h2>

      {/* Flex row: token icon + token counter + generate button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          marginBottom: "1rem",
        }}
      >
        {/* Token section (clickable to earn 4 tokens) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
          onClick={earnTokens}
          title="Click to earn +4 tokens"
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

      {/* Card Display */}
      <div className="mt-4 flex justify-center">
        <div className="placeholder relative">
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
              width="250"
              height="350"
            />
          )}
        </div>
      </div>

      {/* Card Info + Save Button */}
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