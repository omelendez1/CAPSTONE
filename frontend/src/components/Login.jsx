import { useState } from "react";
import "./Login.css"; // modal styles

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [message, setMessage] = useState("");

  // New user states
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  // 🔑 LOGIN HANDLER
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
      if (!res.ok) {
        return setMessage(data.error || "Login failed");
      }
      localStorage.setItem("authToken", data.token);
      setMessage("✅ Login successful! Token saved.");
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  // 🔑 FORGOT PASSWORD HANDLER
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
      if (!res.ok) {
        return setMessage(data.error || "Reset request failed");
      }
      setMessage("📧 Reset link sent to your email (if registered).");
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("❌ Could not send reset request.");
    }
  };

  // 🔑 REGISTER HANDLER for new users
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return setRegisterMessage(data.error || "Registration failed");
      }
      setRegisterMessage("✅ Registration successful! Please log in.");
      setNewEmail("");
      setNewPassword("");
    } catch (err) {
      console.error("Registration error:", err);
      setRegisterMessage("❌ Something went wrong.");
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <h2 className="text-2xl font-bold mb-4">
          {forgotMode ? "Forgot Password" : "Login"}
        </h2>

        {!forgotMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
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
          <form onSubmit={handleForgotPassword} className="space-y-4">
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

        {/* Forgot/Back toggle */}
        <p
          onClick={() => setForgotMode(!forgotMode)}
          className="mt-4 text-blue-600 cursor-pointer underline"
        >
          {forgotMode ? "Back to Login" : "Forgot Password?"}
        </p>

        {/* New user registration section */}
        {!forgotMode && (
          <div className="register-section mt-6 pt-4 border-t">
            <h3 className="font-semibold mb-2">New User? Register here:</h3>
            <form onSubmit={handleRegister} className="space-y-3">
              <input
                type="email"
                placeholder="New Email"
                className="w-full border p-2 rounded"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border p-2 rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className="button-row">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Register
                </button>
              </div>
              {registerMessage && (
                <p className="mt-2 text-sm text-gray-700">{registerMessage}</p>
              )}
            </form>
          </div>
        )}

        {/* Message output for login/forgot */}
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}