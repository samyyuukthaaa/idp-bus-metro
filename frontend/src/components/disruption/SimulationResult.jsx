function SimulationResult({ result, disruptionType }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-2">Before Disruption</h2>
        <p className="text-gray-700">Shortest Path:</p>
        <p className="font-semibold">{result.before.path}</p>
        <p className="mt-2">Arrival Probability: {result.before.probability}%</p>
      </div>

      <div className="bg-red-50 border border-red-300 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-2">After Disruption</h2>
        <p className="font-semibold text-red-600">🚨 {disruptionType}</p>
        <p className="mt-2">Traditional Route Planner:</p>
        <p>{result.after.traditional}</p>
        <p className="mt-2">Our Resilience-Aware System:</p>
        <p className="text-green-700 font-semibold">{result.after.resilient}</p>
      </div>
    </div>
  );
}

export default SimulationResult;