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

  // function to show modal from anywhere
  const handleRequireLogin = () => {
    setShowLogin(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header + Nav */}
        <ThemeHeader />
        <NavBar onLoginClick={() => setShowLogin(true)} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Pass onRequireLogin into Collection */}
          <Route
            path="/collection"
            element={<Collection onRequireLogin={handleRequireLogin} />}
          />

          <Route path="/about" element={<About />} />
        </Routes>

        {/* Global Login Modal */}
        {showLogin && <Login onClose={() => setShowLogin(false)} />}
      </div>
    </Router>
  );
}