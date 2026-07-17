import {
  TrendingUp,
  Clock3,
  MessageSquareMore,
  Users,
  Target,
  CheckCircle2,
} from "lucide-react";

export default function InsightsCard({ stats }) {
  const insights = [
    {
      title: "Unread Chats",
      value: stats?.unreadConversations ?? 0,
      icon: MessageSquareMore,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Customers",
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Leads",
      value: stats?.totalLeads ?? 0,
      icon: Target,
      color: "text-[#25D366]",
      bg: "bg-[#DCF8C6]",
    },
    {
      title: "Completed Tasks",
      value: stats?.tasks?.completed ?? 0,
      icon: CheckCircle2,
      color: "text-[#128C7E]",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Background Decoration */}
      <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-cyan-100 blur-3xl opacity-60"></div>

      <div className="relative">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              CRM Insights
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Quick overview of activity
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100">
            <TrendingUp
              size={24}
              className="text-cyan-600"
            />
          </div>

        </div>

        {/* Metrics */}
        <div className="space-y-4">

          {insights.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-4
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:border-blue-200
                  hover:shadow-sm
                "
              >

                <div className="flex items-center gap-4">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon
                      size={20}
                      className={item.color}
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      {item.title}
                    </p>

                    <h3 className="font-semibold text-gray-900">
                      {item.value}
                    </h3>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center transition-all duration-300 hover:bg-white hover:shadow-sm">

            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <Clock3
                className="text-[#128C7E]"
                size={20}
              />
            </div>

            <p className="text-xs text-gray-500">
              Avg Response
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              2.3 min
            </p>

          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center transition-all duration-300 hover:bg-white hover:shadow-sm">

            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCF8C6]">
              <TrendingUp
                className="text-[#25D366]"
                size={20}
              />
            </div>

            <p className="text-xs text-gray-500">
              Conversion
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              64%
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}