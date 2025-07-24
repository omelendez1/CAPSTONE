import React from "react";
import "./Login.css";

export default function WelcomeModal({ onClose }) {
  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div
        className="login-modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
        style={{ maxWidth: "480px", minHeight: "320px" }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>
        <h2 style={{ marginBottom: "1rem" }}>Welcome to the App!</h2>
        <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
          We're thrilled to have you here. Enjoy exploring the features and may your journey be rewarding.
        </p>

        {/* Example: embedded video or image */}
        <div style={{ marginBottom: "1.5rem" }}>
          <video
            src="/welcome-video.mp4"
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