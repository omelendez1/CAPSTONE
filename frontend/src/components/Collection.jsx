import { useState, useEffect } from "react";

export default function Collection() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/cards")
      .then((res) => res.json())
      .then((data) => setCards(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">My Collection</h2>

      {cards.length === 0 ? (
        <p>No saved cards yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div key={index} className="p-2 border rounded">
              <img src={card.imageUrl} alt={card.name} />
              <h3 className="mt-2">{card.name}</h3>
              <p>Type: {card.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}