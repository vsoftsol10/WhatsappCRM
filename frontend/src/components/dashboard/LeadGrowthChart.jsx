import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";



export default function LeadGrowthChart({ leadGrowth = [] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Lead Growth
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Monthly lead acquisition
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart data={leadGrowth}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="month"
            tick={{ fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="leads"
            stroke="#2563EB"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#2563EB",
            }}
            activeDot={{
              r: 7,
            }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}