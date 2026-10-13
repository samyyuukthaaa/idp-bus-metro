import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DisruptionAlert from "../components/disruption/DisruptionAlert";
import { disruptRoute } from "../services/api";

const cap = (m) => m.charAt(0).toUpperCase() + m.slice(1);

function DisruptionDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!state?.route) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Disruption Dashboard</h1>
        <p className="text-gray-600 mb-4">
          Pick a journey first, then choose a leg to cancel on the details page.
        </p>
        <Link to="/plan" className="text-blue-600 underline">
          Go to Plan Journey
        </Link>
      </div>
    );
  }

  const { route, legIndex, start, end, buffer } = state;
  const leg = route.legs[legIndex];

  const findAlternatives = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await disruptRoute({
        start,
        end,
        buffer_pct: buffer,
        route_index: route.id,
        leg_index: legIndex,
      });
      navigate("/recovery", { state: { result, route, legIndex, start, end, buffer } });
    } catch (e) {
      setError("Something went wrong. Check the uvicorn terminal.");
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Disruption Dashboard</h1>

      <DisruptionAlert
        type={`${cap(leg.mode)} Cancelled`}
        message={`The ${leg.mode} leg from ${leg.from} to ${leg.to} has been cancelled. Your original journey is no longer feasible.`}
        onFindRoutes={findAlternatives}
      />

      {loading && (
        <p className="text-center text-gray-600 mt-4">
          Finding the most reliable alternative... this can take a few seconds.
        </p>
      )}
      {error && (
        <p className="mt-4 max-w-xl mx-auto bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
    </div>
  );
}

export default DisruptionDashboard;