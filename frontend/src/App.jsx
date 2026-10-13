import { Routes, Route } from "react-router-dom";
import DisruptionDashboard from "./pages/DisruptionDashboard";
import RecoveryPage from "./pages/RecoveryPage";
import CompareRoutes from "./pages/CompareRoutes";
import SimulationPage from "./pages/SimulationPage";

function App() {
  return (
    <Routes>
      <Route path="/disruption" element={<DisruptionDashboard />} />
      <Route path="/recovery" element={<RecoveryPage />} />
      <Route path="/compare" element={<CompareRoutes />} />
      <Route path="/simulation" element={<SimulationPage />} />
    </Routes>
  );
}

export default App;