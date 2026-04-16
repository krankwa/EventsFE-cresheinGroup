import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Tue", sales: 4000 },
  { name: "Wed", sales: 3000 },
  { name: "Thu", sales: 2000 },
  { name: "Fri", sales: 2780 },
  { name: "Sat", sales: 1890 },
  { name: "Sun", sales: 3490 },
];

export function DashboardCharts() {
  return (
    <div className="min-h-[300px] w-full p-4">
      <ResponsiveContainer width="100%" height="100%" aspect={2} minWidth={0}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            {/* Main Blue Gradient */}
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Added horizontal grid lines with very low opacity for a professional look */}
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            opacity={0.5}
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
            dy={15}
          />
          <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />

          <Tooltip
            cursor={{
              stroke: "#3b82f6",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              fontSize: "12px",
              padding: "8px 12px",
            }}
            itemStyle={{ color: "#1e293b", fontWeight: "bold" }}
          />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)"
            // The "dots" at each data point
            dot={{ r: 4, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
            activeDot={{
              r: 6,
              fill: "#3b82f6",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
