function FilterPanel({ filters, setFilters }) {
  const update = (key, value) => setFilters({ ...filters, [key]: value });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Filter</h2>
        <button
          onClick={() =>
            setFilters({ bus: true, metro: true, maxTransfers: 6, minProb: 0, sort: "best" })
          }
          className="text-sm text-blue-600"
        >
          Reset
        </button>
      </div>

      <div>
        <p className="font-semibold mb-2">Sort by</p>
        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="best">Recommended</option>
          <option value="fastest">Fastest</option>
          <option value="reliable">Most reliable</option>
        </select>
      </div>

      <div>
        <p className="font-semibold mb-2">Transport modes</p>
        <label className="flex items-center gap-2 mb-1">
          <input
            type="checkbox"
            checked={filters.bus}
            onChange={(e) => update("bus", e.target.checked)}
          />
          🚌 Bus
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.metro}
            onChange={(e) => update("metro", e.target.checked)}
          />
          🚇 Metro
        </label>
      </div>

      <div>
        <p className="font-semibold mb-2">
          Max transfers: <b>{filters.maxTransfers}</b>
        </p>
        <input
          type="range"
          min="0"
          max="6"
          value={filters.maxTransfers}
          onChange={(e) => update("maxTransfers", Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <p className="font-semibold mb-2">
          Min on-time probability: <b>{filters.minProb}%</b>
        </p>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={filters.minProb}
          onChange={(e) => update("minProb", Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default FilterPanel;