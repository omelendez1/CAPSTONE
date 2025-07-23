import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ThemeHeader from "./components/ThemeHeader";
import Home from "./components/Home";
import Collection from "./components/Collection";
import Login from "./components/Login"; // NEW

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ThemeHeader />
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          {/* changed /extra with /login */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}