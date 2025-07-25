import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import WelcomeModal from "./WelcomeModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; // Import the new modal

//  Centralized backend URL
const API_BASE_URL = "https://capstone-backend-o1hj.onrender.com";

export default function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [message, setMessage] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedEmail, setLoggedEmail] = useState("");

  // State for WelcomeModal
  const [showWelcome, setShowWelcome] = useState(false);

  // State for Delete Profile modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  // Return Home + close modal
  const handleReturnHome = () => {
    onClose?.();
    navigate("/");
  };

  // Check if already logged in when modal opens
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedEmail = localStorage.getItem("userEmail");
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setLoggedEmail(storedEmail);
    }
  }, []);

  // ✅ LOGIN HANDLER – now uses full backend URL
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setMessage(data.error || "Login failed");

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", email);

      setMessage("✅ Login successful!");
      setIsLoggedIn(true);
      setLoggedEmail(email);

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  // ✅ FORGOT PASSWORD HANDLER – now uses full backend URL
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.error || "Reset request failed");
      setMessage("📧 Reset link sent to your email (if registered).");
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("❌ Could not send reset request.");
    }
  };

  // ✅ REGISTER HANDLER – now uses full backend URL
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newUserEmail, password: newUserPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        return setMessage(data.error || "Registration failed");
      }

      setMessage("✅ Registration successful! You can now login.");
      setNewUserEmail("");
      setNewUserPassword("");

      // ✅ If backend indicates a welcome modal, show it
      if (data.showWelcomeModal) {
        setShowWelcome(true);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("❌ Something went wrong during registration.");
    }
  };

  // LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setLoggedEmail("");
    setMessage("✅ Logged out successfully!");
    setTimeout(() => {
      onClose();
      window.location.reload();
    }, 500);
  };

  return (
    <>
      {/* Show WelcomeModal if triggered */}
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      {/* ✅ Show DeleteConfirmationModal if triggered */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onDeleteSuccess={() => {
            setShowDeleteModal(false);
            // Optional: log the user out after deletion
            handleLogout();
          }}
        />
      )}

      <div className="login-modal-overlay">
        <div className="login-modal-content">
          {/* Clean, conventional close icon top-right */}
          <span className="modal-close-icon" onClick={onClose}>
            ✕
          </span>

          {/* Header text */}
          <h2 className="text-2xl font-bold mb-4">
            {isLoggedIn
              ? "You’re logged in"
              : forgotMode
              ? "Forgot Password"
              : "Login"}
          </h2>

          {/* Logged in UI */}
          {isLoggedIn ? (
            <>
              <p className="mb-4 text-gray-700">
                Logged in as <strong>{loggedEmail}</strong>
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Log out
                </button>
              </div>
              {message && (
                <p className="mt-4 text-sm text-gray-700">{message}</p>
              )}
            </>
          ) : (
            <>
              {/* Login / Forgot Password forms */}
              {!forgotMode ? (
                <form onSubmit={handleLogin} className="space-y-4 login-form">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Login
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={handleForgotPassword}
                  className="space-y-4 login-form"
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}

              <p
                onClick={() => setForgotMode(!forgotMode)}
                className="mt-4 text-blue-600 cursor-pointer underline"
              >
                {forgotMode ? "Back to Login" : "Forgot Password?"}
              </p>

              {message && (
                <p className="mt-4 text-sm text-gray-700">{message}</p>
              )}

              {/* Registration section */}
              <div className="register-section mt-10 pt-4 border-t">
                <h3 className="font-semibold mb-2">New User Registration</h3>
                <form onSubmit={handleRegister} className="space-y-4">
                  <input
                    type="email"
                    placeholder="New user email"
                    className="w-full border p-2 rounded"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="New user password"
                    className="w-full border p-2 rounded"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    required
                  />

                  {/* Footer row: Return Home, Delete Profile, Register */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#555",
                        textDecoration: "underline",
                      }}
                      onClick={handleReturnHome}
                    >
                      ⬅ Return Home
                    </span>

                    <div style={{ display: "flex", gap: "1rem" }}>
                      {/* New Delete Profile button */}
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                      >
                        Delete Profile
                      </button>

                      <button
                        type="submit"
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

