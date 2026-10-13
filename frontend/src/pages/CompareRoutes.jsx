import RouteComparison from "../components/disruption/RouteComparison";
import { comparison } from "../data/mockDisruptionData";

function CompareRoutes() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Compare Routes</h1>
      <RouteComparison data={comparison} />
    </div>
  );
}

export default CompareRoutes;