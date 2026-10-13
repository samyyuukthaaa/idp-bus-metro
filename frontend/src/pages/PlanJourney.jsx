import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { getStops, getRoutes } from "../services/api";
import RouteCard from "../components/journey/RouteCard";

// The API returns near-identical routes; keep only distinct ones
function removeDuplicates(routes) {
  const seen = new Set();
  return routes.filter((r) => {
    const key = `${r.legs.map((l) => l.mode).join(">")}-${Math.round(
      r.total_minutes
    )}-${r.success_probability}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function PlanJourney() {
  const [stops, setStops] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [buffer, setBuffer] = useState(20);
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getStops()
      .then(setStops)
      .catch(() =>
        setError("Cannot reach the backend. Is the uvicorn terminal running?")
      );
  }, []);

  const handleSearch = async () => {
    setError("");
    const names = new Set(stops.map((s) => s.name));
    if (!names.has(start) || !names.has(end)) {
      setError("Please pick both stops from the suggestion list.");
      return;
    }
    if (start === end) {
      setError("Start and destination must be different.");
      return;
    }
    setLoading(true);
    setRoutes(null);
    try {
      const result = await getRoutes({ start, end, buffer_pct: buffer });
      setRoutes(removeDuplicates(result));
    } catch (e) {
      setError("Something went wrong while searching. Check the uvicorn terminal.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Plan Your Journey</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 grid gap-4 md:grid-cols-4 items-end">
        <label className="block">
          <span className="text-sm text-gray-600">From</span>
          <input
            list="stop-list"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="Start typing a stop..."
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">To</span>
          <input
            list="stop-list"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="Start typing a stop..."
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">
            Extra time buffer: <b>{buffer}%</b>
          </span>
          <input
            type="range"
            min="0"
            max="50"
            value={buffer}
            onChange={(e) => setBuffer(Number(e.target.value))}
            className="mt-3 w-full"
          />
        </label>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          {loading ? "Searching..." : "Search"}
        </button>

        <datalist id="stop-list">
          {stops.map((s) => (
            <option key={s.name} value={s.name} />
          ))}
        </datalist>
      </div>

      {error && (
        <p className="mt-4 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {routes && routes.length === 0 && (
        <p className="mt-6 text-gray-600">No routes found between these stops.</p>
      )}

      {routes && routes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-3">
            {routes.length} route{routes.length > 1 ? "s" : ""} found
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanJourney;