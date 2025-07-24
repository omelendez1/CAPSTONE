import { useState } from "react";
import "./Login.css";

export default function DeleteConfirmationModal({ onClose, onDeleteSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!confirmChecked) {
      return setMessage("❌ Please confirm you want to delete your profile.");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/auth/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "❌ Failed to delete profile.");
        return;
      }

      setMessage("✅ Profile successfully deleted.");

      // Clear local storage, notify parent
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");

      // Give user a moment to see the message before closing
      setTimeout(() => {
        onDeleteSuccess?.();
      }, 800);
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Something went wrong while deleting your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div
        className="login-modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Delete Your Profile</h2>

        <p className="mb-4 text-red-600">
          ⚠ This action is <strong>permanent</strong> and cannot be undone.
        </p>

        <form onSubmit={handleDelete} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
            />
            I understand this will permanently delete my profile.
          </label>

          {message && (
            <p
              className="text-sm mt-2"
              style={{ color: message.includes("✅") ? "green" : "red" }}
            >
              {message}
            </p>
          )}

          <div className="button-row" style={{ justifyContent: "space-between" }}>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              {loading ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}