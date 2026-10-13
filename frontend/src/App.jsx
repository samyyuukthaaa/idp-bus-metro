import { Routes, Route } from "react-router-dom";
import DisruptionDashboard from "./pages/DisruptionDashboard";
import RecoveryPage from "./pages/RecoveryPage";

function App() {
  return (
    <Routes>
      <Route path="/disruption" element={<DisruptionDashboard />} />
      <Route path="/recovery" element={<RecoveryPage />} />
    </Routes>
  );
}

export default App;