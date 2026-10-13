import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Play,
  TrainFront,
} from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/plan", label: "Plan Journey", icon: Search },
  { to: "/disruption", label: "Disruption", icon: AlertTriangle },
  { to: "/recovery", label: "Recovery", icon: RefreshCw },
  { to: "/compare", label: "Compare Routes", icon: BarChart3 },
  { to: "/simulation", label: "Simulation", icon: Play },
];

function Sidebar() {
  return (
    <aside className="w-60 bg-blue-900 text-white min-h-screen flex flex-col">
      <div className="flex items-center gap-2 px-6 py-6 text-xl font-bold">
        <TrainFront />
        ResilientGo
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 font-semibold"
                  : "text-blue-200 hover:bg-blue-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <p className="px-6 py-4 text-xs text-blue-300">
        Resilience-Aware Journey Planner
      </p>
    </aside>
  );
}

export default Sidebar;