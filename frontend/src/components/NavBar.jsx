import NavTab from "./NavTab";

export default function NavBar() {
  return (
    <nav className="flex justify-center gap-2 bg-gray-200 p-2">
      <NavTab label="Home" to="/" />
      <NavTab label="Collection" to="/collection" />
      <NavTab label="Extra" to="/extra" />
    </nav>
  );
}