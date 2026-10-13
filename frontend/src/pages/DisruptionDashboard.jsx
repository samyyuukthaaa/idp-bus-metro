import { useNavigate } from "react-router-dom";
import DisruptionAlert from "../components/disruption/DisruptionAlert";
import { disruption } from "../data/mockDisruptionData";

function DisruptionDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Disruption Dashboard</h1>
      <DisruptionAlert
        type={disruption.type}
        message={disruption.message}
        onFindRoutes={() => navigate("/recovery")}
      />
    </div>
  );
}

export default DisruptionDashboard;