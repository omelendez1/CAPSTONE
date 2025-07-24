import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [message, setMessage] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedEmail, setLoggedEmail] = useState("");

  const navigate = useNavigate();

  // ✅ Function to go Home and close modal
  const handleReturnHome = () => {
    onClose?.(); // close modal if provided
    navigate("/"); // navigate back to home
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

  // LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setMessage(data.error || "Login failed");

      // Save token + email
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", email);

      setMessage("✅ Login successful!");
      setIsLoggedIn(true);
      setLoggedEmail(email);

      setTimeout(() => {
        onClose(); // close modal
        window.location.reload(); // refresh navbar state
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  // FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
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

  // REGISTER HANDLER
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newUserEmail, password: newUserPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.error || "Registration failed");
      setMessage("✅ Registration successful! You can now login.");
      setNewUserEmail("");
      setNewUserPassword("");
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
      window.location.reload(); // refresh navbar
    }, 500);
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close login modal">
          ✕
        </button>

        {/*  If logged in already, show logout UI */}
        {isLoggedIn ? (
          <>
            <h2 className="text-2xl font-bold mb-4">You’re logged in</h2>
            <p className="mb-4 text-gray-700">
              Logged in as <strong>{loggedEmail}</strong>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Log out
            </button>

            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">
              {forgotMode ? "Forgot Password" : "Login"}
            </h2>

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
                <div className="button-row">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4 login-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border p-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="button-row">
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

            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}

            {/* Registration only shown if not logged in */}
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

                {/* ✅ Footer with Return Home on left, Register on right */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                >
                  {/* ⬅ Return Home link */}
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

                  {/* Register button */}
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}