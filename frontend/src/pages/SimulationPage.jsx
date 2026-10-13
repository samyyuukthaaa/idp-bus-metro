import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { disruptRoute } from "../services/api";

const cap = (m) => m.charAt(0).toUpperCase() + m.slice(1);

function loadLastSearch() {
  try {
    return JSON.parse(localStorage.getItem("lastSearch"));
  } catch {
    return null;
  }
}

function SimulationPage() {
  const search = loadLastSearch();
  const [routePos, setRoutePos] = useState(0);
  const [legIndex, setLegIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!search || !search.routes?.length) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Disruption Simulation</h1>
        <p className="text-gray-600 mb-4">Search for a journey first, then come back here.</p>
        <Link to="/plan" className="text-blue-600 underline">
          Go to Plan Journey
        </Link>
      </div>
    );
  }

  const route = search.routes[routePos];

  const run = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await disruptRoute({
        start: search.start,
        end: search.end,
        buffer_pct: search.buffer,
        route_index: route.id,
        leg_index: legIndex,
      });
      setResult(data);
    } catch (e) {
      setError("Something went wrong. Check the uvicorn terminal.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Disruption Simulation</h1>
        <p className="text-gray-600">
          {search.start} → {search.end}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <label className="block">
          <span className="font-semibold">Choose a route</span>
          <select
            value={routePos}
            onChange={(e) => {
              setRoutePos(Number(e.target.value));
              setLegIndex(null);
              setResult(null);
            }}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            {search.routes.map((r, i) => (
              <option key={r.id} value={i}>
                Route {i + 1} · {r.total_minutes} min · {r.success_probability}% on time
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="font-semibold mb-2">Select the leg to cancel</p>
          <div className="space-y-2">
            {route.legs.map((leg, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="leg"
                  checked={legIndex === i}
                  onChange={() => {
                    setLegIndex(i);
                    setResult(null);
                  }}
                />
                {cap(leg.mode)}: {leg.from} → {leg.to} ({leg.minutes} min)
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={run}
          disabled={legIndex === null || loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Running..." : "RUN SIMULATION"}
        </button>
      </div>

      {error && (
        <p className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3">{error}</p>
      )}

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-2">Before disruption</h2>
            <p className="text-gray-700">
              {route.legs.map((l) => cap(l.mode)).join(" → ")}
            </p>
            <p className="mt-2">
              Time: <b>{route.total_minutes} min</b>
            </p>
            <p>
              On-time probability: <b>{route.success_probability}%</b>
            </p>
          </div>

          <div className="bg-red-50 border border-red-300 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-2">After disruption</h2>
            <p className="font-semibold text-red-600">
              🚨 {cap(route.legs[legIndex].mode)} cancelled: {route.legs[legIndex].from} →{" "}
              {route.legs[legIndex].to}
            </p>
            {result.recovered ? (
              <div className="mt-3 text-green-800">
                <p className="font-semibold">
                  ✅ Rerouted. {result.alternatives.length} alternatives compared.
                </p>
                <p className="mt-1">
                  New time: <b>{result.recovery.total_minutes} min</b> (
                  {result.minutes_difference >= 0 ? "+" : ""}
                  {result.minutes_difference} min)
                </p>
                <p>
                  On-time probability: <b>{result.recovery.success_probability}%</b>
                </p>
                <p className="mt-1 text-sm">
                  Path: {result.recovery.legs.map((l) => cap(l.mode)).join(" → ")}
                </p>
              </div>
            ) : (
              <p className="mt-3 font-semibold text-red-700">❌ {result.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SimulationPage;