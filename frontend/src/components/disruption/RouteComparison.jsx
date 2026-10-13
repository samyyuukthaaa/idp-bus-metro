import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function RouteComparison({ data }) {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Reliability vs Success Probability (%)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reliability" name="Reliability" fill="#3b82f6" />
              <Bar dataKey="probability" name="Success Probability" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Route Comparison Table</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2">Route</th>
              <th>Time (h)</th>
              <th>Cost (₹)</th>
              <th>Reliability</th>
              <th>Success Probability</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.name} className="border-b border-gray-100">
                <td className="py-2 font-semibold">{row.name}</td>
                <td>{row.time}</td>
                <td>{row.cost}</td>
                <td>{row.reliability}%</td>
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