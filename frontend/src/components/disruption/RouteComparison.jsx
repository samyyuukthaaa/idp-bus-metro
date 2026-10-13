import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ChartCard({ title, data, dataKey, color, unit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <h2 className="font-bold mb-3">{title}</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit={unit} />
            <Tooltip />
            <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RouteComparison({ routes }) {
  const data = routes.map((r, i) => ({
    name: `Route ${i + 1}`,
    minutes: r.total_minutes,
    probability: r.success_probability,
    transfers: r.num_transfers,
    tags: r.tags.join(", ") || "-",
    modes: r.legs.map((l) => l.mode).join(" → "),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title="Total travel time" data={data} dataKey="minutes" color="#3b82f6" unit=" min" />
        <ChartCard title="On-time probability" data={data} dataKey="probability" color="#22c55e" unit="%" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 overflow-x-auto">
        <h2 className="font-bold mb-3">Route comparison</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2">Route</th>
              <th>Label</th>
              <th>Modes</th>
              <th>Time</th>
              <th>Transfers</th>
              <th>On-time probability</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.name} className="border-b border-gray-100">
                <td className="py-2 font-semibold">{row.name}</td>
                <td>{row.tags}</td>
                <td>{row.modes}</td>
                <td>{row.minutes} min</td>
                <td>{row.transfers}</td>
                <td>{row.probability}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RouteComparison;