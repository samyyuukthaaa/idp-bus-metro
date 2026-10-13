function OriginalJourney({ journey }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      <h2 className="text-lg font-bold">Original Journey ❌</h2>
      <p className="text-gray-600 mb-4">
        {journey.from} → {journey.to}
      </p>

      <div className="space-y-2">
        {journey.segments.map((segment) => (
          <div
            key={segment.id}
            className={`p-3 rounded-lg border ${
              segment.status === "cancelled"
                ? "bg-red-50 border-red-300 text-red-700 line-through"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {segment.mode}
            {segment.status === "cancelled" && " ❌ Cancelled"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OriginalJourney;