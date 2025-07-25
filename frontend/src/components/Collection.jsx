import { useEffect, useState } from "react";
import "./Collection.css";

// ✅ Always use the deployed backend URL
const API_BASE_URL = "https://capstone-backend-o1hj.onrender.com";

export default function Collection({ onRequireLogin }) {
  const [grouped, setGrouped] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        // Not logged in
        setLoggedIn(false);
        onRequireLogin?.(); // optional call to parent
        setLoading(false);
        return;
      }

      setLoggedIn(true);

      try {
        const res = await fetch(`${API_BASE_URL}/api/collections-grouped`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setLoggedIn(false);
            onRequireLogin?.();
          } else {
            setError("❌ Failed to fetch your collection.");
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setGrouped(data);
      } catch (err) {
        console.error("❌ Failed to load collections:", err);
        setError("❌ Something went wrong loading your collection.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [onRequireLogin]);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "1.25rem" }}>
        Loading your Pokémon collection...
      </p>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p style={{ color: "red", fontSize: "1.2rem" }}>{error}</p>
      </div>
    );
  }

  const renderSection = (title, cards) => (
    <section style={{ marginBottom: "3rem" }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.75rem",
          marginBottom: "1rem",
        }}
      >
        {title}
      </h2>

      {!loggedIn ? (
        // ⚠️ If not logged in, just keep a placeholder
        <p style={{ textAlign: "center", color: "#aaa" }}>
          (Log in to see saved cards for this generation)
        </p>
      ) : cards.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No cards saved yet for this generation.
        </p>
      ) : (
        <div className="card-grid">
          {cards.map((card) => (
            <div
              className="card-item"
              key={card._id}
              onClick={() => setSelectedCard(card)}
            >
              <img
                src={card.imageUrl || "https://via.placeholder.com/200"}
                alt={card.name}
              />
              <h3>{card.name}</h3>
              <p>Type: {card.type}</p>
              {card.nationalPokedexNumber && (
                <p>#{card.nationalPokedexNumber}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div style={{ padding: "2rem" }}>
      {/*  Show warning if not logged in */}
      {!loggedIn && (
        <div
          style={{
            textAlign: "center",
            color: "red",
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          ⚠️ You must log in to view & generate random cards!
        </div>
      )}

      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          marginBottom: "2rem",
        }}
      >
        Your Pokémon Collection
      </h1>

      {/*  Always keep generation layout visible */}
      {renderSection("Generation I (Kanto)", grouped?.gen1 || [])}
      {renderSection("Generation II (Johto)", grouped?.gen2 || [])}
      {renderSection("Generation III (Hoenn)", grouped?.gen3 || [])}
      {renderSection("Generation IV (Sinnoh)", grouped?.gen4 || [])}
      {renderSection("Generation V (Unova)", grouped?.gen5 || [])}
      {renderSection("Generation VI (Kalos)", grouped?.gen6 || [])}
      {renderSection("Generation VII (Alola)", grouped?.gen7 || [])}
      {renderSection("Generation VIII (Galar)", grouped?.gen8 || [])}

      {/*  Modal overlay for selected card */}
      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedCard(null)}
            >
              ✖
            </button>
            <img
              src={selectedCard.imageUrl || "https://via.placeholder.com/400"}
              alt={selectedCard.name}
            />
            <h2>{selectedCard.name}</h2>
            <p>Type: {selectedCard.type}</p>
            {selectedCard.nationalPokedexNumber && (
              <p>#{selectedCard.nationalPokedexNumber}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}