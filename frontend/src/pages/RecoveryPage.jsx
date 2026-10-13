import { Link, useLocation, useNavigate } from "react-router-dom";
import OriginalJourney from "../components/disruption/OriginalJourney";
import RouteCard from "../components/journey/RouteCard";

const cap = (m) => m.charAt(0).toUpperCase() + m.slice(1);

function RecoveryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Journey Recovery</h1>
        <p className="text-gray-600 mb-4">
          Nothing to recover yet. Simulate a cancellation from a journey's details page.
        </p>
        <Link to="/plan" className="text-blue-600 underline">
          Go to Plan Journey
        </Link>
      </div>
    );
  }

  const { result, route, legIndex, start, end, buffer } = state;

  const originalJourney = {
    from: route.legs[0].from,
    to: route.legs[route.legs.length - 1].to,
    segments: route.legs.map((l, i) => ({
      id: i,
      mode: `${cap(l.mode)}: ${l.from} → ${l.to}`,
      status: i === legIndex ? "cancelled" : "affected",
    })),
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Journey Recovery</h1>

      <OriginalJourney journey={originalJourney} />

      {!result.recovered ? (
        <p className="mt-6 bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3">
          ❌ {result.message} A traditional planner would stop here.
        </p>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Alternative Journey Options ✅</h2>
            <button
              onClick={() =>
                navigate("/route-details", {
                  state: { route: { ...result.recovery, tags: [] }, start, end, buffer },
                })
              }
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              View recovery route on map
            </button>
          </div>

          <p className="text-gray-600 mt-1 mb-4">
            The model-selected route takes{" "}
            <b>
              {result.minutes_difference >= 0 ? "+" : ""}
              {result.minutes_difference} min
            </b>{" "}
            compared with the original and has a{" "}
            <b>{result.recovery.success_probability}%</b> chance of meeting your deadline.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {result.alternatives.map((alt, i) => (
              <RouteCard
                key={i}
                route={{ ...alt, tags: alt.selected ? ["Recommended"] : [] }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default RecoveryPage;