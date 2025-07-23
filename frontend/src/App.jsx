import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import ThemeHeader from "./components/ThemeHeader";
import Home from "./components/Home";
import Collection from "./components/Collection";
import Login from "./components/Login"; // Modal login

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ThemeHeader />
        <NavBar onLoginClick={() => setShowLogin(true)} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          {/* Removed /login route */}
        </Routes>

        {showLogin && <Login onClose={() => setShowLogin(false)} />}
      </div>
    </Router>
  );
}