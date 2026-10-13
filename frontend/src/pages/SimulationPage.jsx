import { useState } from "react";
import SimulationControls from "../components/disruption/SimulationControls";
import SimulationResult from "../components/disruption/SimulationResult";
import { disruptionOptions, simulationResult } from "../data/mockDisruptionData";

function SimulationPage() {
  const [selected, setSelected] = useState(null);
  const [ran, setRan] = useState(false);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Disruption Simulation</h1>

      <SimulationControls
        options={disruptionOptions}
        selected={selected}
        onSelect={(option) => {
          setSelected(option);
          setRan(false);
        }}
        onRun={() => setRan(true)}
      />

      {ran && <SimulationResult result={simulationResult} disruptionType={selected} />}
    </div>
  );
}

export default SimulationPage;