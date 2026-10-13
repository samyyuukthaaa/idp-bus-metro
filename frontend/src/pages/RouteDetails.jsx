import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Bus, TrainFront, Footprints, ArrowLeft, Clock, Repeat } from "lucide-react";

const modeIcon = { bus: Bus, metro: TrainFront, walk: Footprints };
const modeStyle = {
  bus: "bg-orange-100 text-orange-700",
  metro: "bg-purple-100 text-purple-700",
  walk: "bg-gray-100 text-gray-700",
};
const modeLabel = { bus: "Bus", metro: "Metro", walk: "Walk" };

// Zooms the map so the whole route is visible
function FitBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 1) map.fitBounds(coords, { padding: [30, 30] });
  }, [coords, map]);
  return null;
}

function RouteDetails() {
  const { state } = useLocation();
    const navigate = useNavigate();
  const route = state?.route;

  if (!route) {
    return (
      <div className="p-8">
        <p className="text-gray-600 mb-4">No route selected yet.</p>
        <Link to="/plan" className="text-blue-600 underline">
          Go to Plan Journey
        </Link>
      </div>
    );
  }

  const coords = route.coordinates;
  const first = coords[0];
  const last = coords[coords.length - 1];

  return (
    <div className="p-8">
      <Link to="/plan" className="flex items-center gap-1 text-blue-600 mb-4">
        <ArrowLeft size={16} /> Back to results
      </Link>

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        {/* Left: timeline */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 self-start">
          <h1 className="text-xl font-bold">Journey Details</h1>
          <p className="text-sm text-gray-500 mt-1">
            {route.legs[0].from} → {route.legs[route.legs.length - 1].to}
          </p>

          <div className="flex gap-4 mt-3 text-gray-700">
            <span className="flex items-center gap-1">
              <Clock size={16} /> <b>{route.total_minutes} min</b>
            </span>
            <span className="flex items-center gap-1">
              <Repeat size={16} /> {route.num_transfers} transfers
            </span>
          </div>
          <p className="mt-2 text-sm">
            On-time probability: <b>{route.success_probability}%</b>
          </p>

          <div className="mt-5 border-l-2 border-blue-200 ml-3 space-y-5">
            {route.legs.map((leg, i) => {
              const Icon = modeIcon[leg.mode] || Bus;
              return (
                <div key={i} className="relative pl-6">
                  <span className="absolute -left-[13px] top-0 bg-white border-2 border-blue-400 rounded-full p-1">
                    <Icon size={14} />
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${modeStyle[leg.mode]}`}
                  >
                    {modeLabel[leg.mode]} · {leg.minutes} min
                  </span>
                  <p className="font-semibold mt-1">{leg.from}</p>
                                    <p className="text-sm text-gray-500">to {leg.to}</p>
                  {route.id !== undefined && (
                    <button
                      onClick={() =>
                        navigate("/disruption", {
                          state: {
                            route,
                            legIndex: i,
                            start: state.start,
                            end: state.end,
                            buffer: state.buffer,
                          },
                        })
                      }
                      className="mt-1 text-xs text-red-600 hover:underline"
                    >
                      🚨 Simulate cancellation
                    </button>
                  )}
                </div>
              );
            })}
            <div className="relative pl-6">
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-red-500" />
              <p className="font-semibold">
                {route.legs[route.legs.length - 1].to}
              </p>
              <p className="text-sm text-gray-500">Destination</p>
            </div>
          </div>

          <details className="mt-5">
            <summary className="cursor-pointer text-blue-600 text-sm">
              View all {route.stops.length} stops
            </summary>
            <ol className="mt-2 text-sm text-gray-700 list-decimal pl-5 space-y-1 max-h-60 overflow-y-auto">
              {route.stops.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </details>
        </div>

        {/* Right: map */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2">
          <MapContainer
            center={first || [12.97, 77.59]}
            zoom={12}
            className="h-[600px] w-full rounded-lg"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline positions={coords} pathOptions={{ color: "#2563eb", weight: 5 }} />
            {first && (
              <CircleMarker center={first} radius={9} pathOptions={{ color: "#16a34a", fillOpacity: 1 }}>
                <Popup>Start: {route.legs[0].from}</Popup>
              </CircleMarker>
            )}
            {last && (
              <CircleMarker center={last} radius={9} pathOptions={{ color: "#dc2626", fillOpacity: 1 }}>
                <Popup>Destination: {route.legs[route.legs.length - 1].to}</Popup>
              </CircleMarker>
            )}
            <FitBounds coords={coords} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default RouteDetails;