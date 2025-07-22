import { useState } from "react";

export default function Home() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomCard = async () => {
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
      <h2 className="text-xl font-bold mb-4">Welcome to the Home Page</h2>

      {/* Button to fetch a random card */}
      <button
        onClick={fetchRandomCard}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Generate Random Card
      </button>

      {/* Card Display */}
      <div className="mt-4 flex justify-center">
        {/* Always reserve the same space */}
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