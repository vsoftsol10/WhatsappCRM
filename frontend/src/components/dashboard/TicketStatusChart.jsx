import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6", // Todo
  "#F59E0B", // In Progress
  "#8B5CF6", // Review
  "#10B981", // Completed
];

export default function TicketStatusChart({ tasks }) {

  console.log(tasks);

  const data = [
    {
      name: "Todo",
      value: tasks?.todo ?? 0,
    },
    {
      name: "In Progress",
      value: tasks?.inProgress ?? 0,
    },
    {
      name: "Review",
      value: tasks?.review ?? 0,
    },
    {
      name: "Completed",
      value: tasks?.completed ?? 0,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Ticket Status
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current task distribution
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={55}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend
            verticalAlign="bottom"
            height={36}
          />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}