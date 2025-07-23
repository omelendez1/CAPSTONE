import { useEffect, useState } from "react";
import NavTab from "./NavTab";
import pokeballIcon from "../assets/pokeIconTab.png";

export default function NavBar({ onLoginClick }) {
  const [userEmail, setUserEmail] = useState(null);

  // Load saved user email on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setUserEmail(null);

    // Refresh UI state
    window.location.reload();
  };

  const isLoggedIn = Boolean(userEmail);

  return (
    <>
      {/* Top Navbar with all tabs aligned */}
      <nav className="flex justify-center gap-2 bg-gray-200 p-2">
        <NavTab label="Home" to="/" />
        <NavTab label="Collection" to="/collection" />
        <NavTab label="About" to="/about" />

        {/* Login/Logout Button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </nav>

      {/* BELOW NAVBAR → Greeting + Pokéball flexed right */}
      <div className="flex justify-end items-center gap-3 pr-4 py-2 bg-gray-100">
        {isLoggedIn ? (
          <>
            <span className="text-sm text-gray-700">
              Hello, <strong>{userEmail}</strong>
            </span>
            <img src={pokeballIcon} alt="Pokéball" className="w-6 h-6" />
          </>
        ) : (
          // Logged out → show gray Pokéball only
          <img
            src={pokeballIcon}
            alt="Pokéball"
            className="w-6 h-6 grayscale opacity-50"
          />
        )}
      </div>
    </>
  );
}