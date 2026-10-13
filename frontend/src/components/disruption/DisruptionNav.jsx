import { NavLink } from "react-router-dom";

const links = [
  { to: "/disruption", label: "Disruption" },
  { to: "/recovery", label: "Recovery" },
  { to: "/compare", label: "Compare" },
  { to: "/simulation", label: "Simulation" },
];

function DisruptionNav() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex gap-6">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            isActive ? "font-bold text-green-400" : "text-gray-300 hover:text-white"
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default DisruptionNav;