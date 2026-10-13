import { Link } from "react-router-dom";
import RouteComparison from "../components/disruption/RouteComparison";

function loadLastSearch() {
  try {
    return JSON.parse(localStorage.getItem("lastSearch"));
  } catch {
    return null;
  }
}

function CompareRoutes() {
  const search = loadLastSearch();

  if (!search || !search.routes?.length) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Compare Routes</h1>
        <p className="text-gray-600 mb-4">Search for a journey first, then come back here.</p>
        <Link to="/plan" className="text-blue-600 underline">
          Go to Plan Journey
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Compare Routes</h1>
      <p className="text-gray-600 mb-6">
        {search.start} → {search.end}
      </p>
      <RouteComparison routes={search.routes} />
    </div>
  );
}

export default CompareRoutes;