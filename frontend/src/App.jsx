import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import ThemeHeader from "./components/ThemeHeader";
import Home from "./components/Home";
import Collection from "./components/Collection";
import Login from "./components/Login";
import About from "./components/About";

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
          <Route path="/about" element={<About />} /> {/* New route */}
        </Routes>

        {showLogin && <Login onClose={() => setShowLogin(false)} />}
      </div>
    </Router>
  );
}