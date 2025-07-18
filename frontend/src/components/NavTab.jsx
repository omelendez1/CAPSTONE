export default function NavTab({ label, to }) {
  return (
    <a
      href={to}
      className="px-4 py-2 m-1 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {label}
    </a>
  );
}