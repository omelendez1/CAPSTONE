import NavTab from "./NavTab";

export default function NavBar({ onLoginClick }) {
  return (
    <nav className="flex justify-center gap-2 bg-gray-200 p-2">
      <NavTab label="Home" to="/" />
      <NavTab label="Collection" to="/collection" />
      <button
        onClick={onLoginClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </nav>
  );
}