import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ThemeHeader from "./components/ThemeHeader";
import Home from "./components/Home";
import Collection from "./components/Collection";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ThemeHeader />
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route
            path="/extra"
            element={
              <div className="text-center p-4">
                <h2 className="text-xl font-bold">Extra Section</h2>
                <p>I can add more features later.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}