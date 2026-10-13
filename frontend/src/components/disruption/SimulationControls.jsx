function SimulationControls({ options, selected, onSelect, onRun }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      <h2 className="text-lg font-bold mb-4">Select Disruption</h2>

      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="disruption"
              checked={selected === option}
              onChange={() => onSelect(option)}
            />
            {option}
          </label>
        ))}
      </div>

      <button
        onClick={onRun}
        disabled={!selected}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
      >
        RUN SIMULATION
      </button>
    </div>
  );
}

export default SimulationControls;