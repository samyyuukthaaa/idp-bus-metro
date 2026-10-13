import { useState } from "react";
import OriginalJourney from "../components/disruption/OriginalJourney";
import AlternativeRouteCard from "../components/disruption/AlternativeRouteCard";
import { originalJourney, alternatives } from "../data/mockDisruptionData";

function RecoveryPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Journey Recovery</h1>

      <OriginalJourney journey={originalJourney} />

      <h2 className="text-xl font-bold mt-8 mb-4">Alternative Journey Options ✅</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {alternatives.map((route) => (
          <AlternativeRouteCard key={route.id} route={route} onSelect={setSelected} />
        ))}
      </div>

      {selected && (
        <p className="mt-6 text-center font-semibold text-green-700">
          You selected: {selected.label} ({selected.modes})
        </p>
      )}
    </div>
  );
}

export default RecoveryPage;