import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function Donut({ data, colors, centerText, centerSub }) {
  return (
    <div className="relative h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={50}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold">{centerText}</span>
        <span className="text-xs text-gray-500">{centerSub}</span>
      </div>
    </div>
  );
}

function RouteInsights({ route }) {
  if (!route) return null;

  const prob = route.success_probability;
  const probData = [
    { name: "On time", value: prob },
    { name: "Risk", value: 100 - prob },
  ];

  const minutes = { bus: 0, metro: 0, walk: 0 };
  route.legs.forEach((leg) => {
    minutes[leg.mode] = (minutes[leg.mode] || 0) + leg.minutes;
  });
  const modeData = [
    { name: "Bus", value: Math.round(minutes.bus * 10) / 10 },
    { name: "Metro", value: Math.round(minutes.metro * 10) / 10 },
    { name: "Walk", value: Math.round(minutes.walk * 10) / 10 },
  ];
  const modeColors = ["#f97316", "#8b5cf6", "#9ca3af"];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-bold mb-2">Deadline success</h2>
        <Donut
          data={probData}
          colors={["#22c55e", "#fecaca"]}
          centerText={`${prob}%`}
          centerSub="on time"
        />
        <p className="text-sm text-gray-500 text-center">
          Chance of arriving before your deadline
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-bold mb-2">Time by mode</h2>
        <Donut
          data={modeData}
          colors={modeColors}
          centerText={`${route.total_minutes}`}
          centerSub="minutes"
        />
        <div className="text-sm space-y-1 mt-2">
          {modeData.map((d, i) => (
            <div key={d.name} className="flex justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: modeColors[i] }}
                />
                {d.name}
              </span>
              <b>{d.value} min</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RouteInsights;