function AlternativeRouteCard({ route, onSelect }) {
  return (
    <div className="bg-white border border-green-300 rounded-xl p-6 shadow-sm">
      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
        {route.label}
      </span>

      <p className="text-lg font-semibold mt-3">{route.modes}</p>

      <div className="mt-2 text-gray-700 space-y-1">
        <p>⏱ {route.time}</p>
        <p>💰 ₹{route.cost}</p>
        <p>🎯 {route.probability}% deadline success</p>
      </div>

      <button
        onClick={() => onSelect(route)}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        Select This Route
      </button>
    </div>
  );
}

export default AlternativeRouteCard;