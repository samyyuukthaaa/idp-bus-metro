import { Bus, TrainFront, Footprints, Clock, Repeat } from "lucide-react";

const modeIcon = { bus: Bus, metro: TrainFront, walk: Footprints };
const modeStyle = {
  bus: "bg-orange-100 text-orange-700",
  metro: "bg-purple-100 text-purple-700",
  walk: "bg-gray-100 text-gray-700",
};

function RouteCard({ route }) {
  const prob = route.success_probability;
  const probColor =
    prob >= 70 ? "bg-green-500" : prob >= 40 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex flex-wrap gap-2 mb-3">
        {route.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded"
          >
            {tag === "Recommended" ? "⭐ " : ""}
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {route.legs.map((leg, i) => {
          const Icon = modeIcon[leg.mode] || Bus;
          return (
            <span
              key={i}
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${modeStyle[leg.mode]}`}
            >
              <Icon size={14} />
              {leg.minutes} min
            </span>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-3">
        {route.legs[0].from} → {route.legs[route.legs.length - 1].to}
      </p>

      <div className="flex items-center gap-6 mt-4 text-gray-700">
        <span className="flex items-center gap-1">
          <Clock size={16} /> <b>{route.total_minutes} min</b>
        </span>
        <span className="flex items-center gap-1">
          <Repeat size={16} /> {route.num_transfers} transfers
        </span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>On-time probability</span>
          <b>{prob}%</b>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className={`h-2 rounded-full ${probColor}`}
            style={{ width: `${prob}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default RouteCard;