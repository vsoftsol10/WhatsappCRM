import {
  Megaphone,
  FileText,
  TrendingUp,
  ClipboardCheck,
} from "lucide-react";

export default function PerformanceOverview({ stats }) {
  const items = [
    {
      title: "Campaigns",
      value: stats?.totalCampaigns ?? 0,
      subtitle: "Running Campaigns",
      icon: Megaphone,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Templates",
      value: stats?.totalTemplates ?? 0,
      subtitle: "Message Templates",
      icon: FileText,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
    {
      title: "Completed Tasks",
      value: stats?.tasks?.completed ?? 0,
      // subtitle: "Finished Today",
      icon: ClipboardCheck,
      color: "text-[#128C7E]",
      bg: "bg-green-100",
    },
    {
      title: "Success Rate",
      value: "100%",
      subtitle: "System Health",
      icon: TrendingUp,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Background Decoration */}
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-100 blur-3xl opacity-60"></div>

      <div className="relative">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Performance Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Overall CRM performance metrics
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4">

          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  group
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white
                  hover:border-blue-200
                  hover:shadow-md
                "
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon
                    className={item.color}
                    size={24}
                  />
                </div>

                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  {item.value}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {item.subtitle}
                </p>
              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}