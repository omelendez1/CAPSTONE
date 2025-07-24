import React from "react";
import "./Login.css";
import welcomeVideo from "../assets/welcome.mp4";

export default function WelcomeModal({ onClose }) {
  return (
    <div className="welcome-modal-overlay" onClick={onClose}>
      <div
        className="welcome-modal-content large-welcome-modal"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        <h2 style={{ marginBottom: "1rem" }}>Welcome to the Pokémon Card Collector Game</h2>
        <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
          Good luck on your quest to collect every Pokémon card spanning Generations 1 through 8.
        </p>

        {/* Manual playback only (no autoplay, no mute, no loop) */}
        <div style={{ marginBottom: "1.5rem" }}>
          <video
            src={welcomeVideo}
            controls
            style={{ width: "100%", borderRadius: "8px" }}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="button-row">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}