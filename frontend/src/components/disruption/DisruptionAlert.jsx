import { AlertTriangle } from "lucide-react";

function DisruptionAlert({ type, message, onFindRoutes }) {
  return (
    <div className="bg-red-50 border border-red-300 rounded-xl p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
        <AlertTriangle />
        DISRUPTION DETECTED
      </div>
      <p className="mt-2 font-semibold">{type}</p>
      <p className="text-gray-700 mt-1">{message}</p>
      <button
        onClick={onFindRoutes}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Find Alternative Routes
      </button>
    </div>
  );
}

export default DisruptionAlert;