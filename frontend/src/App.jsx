import { Routes, Route } from "react-router-dom";
import DisruptionDashboard from "./pages/DisruptionDashboard";

function App() {
  return (
    <Routes>
      <Route path="/disruption" element={<DisruptionDashboard />} />
    </Routes>
  );
}

export default App;