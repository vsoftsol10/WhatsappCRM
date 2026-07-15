import {
  ClipboardList,
  FolderOpen,
  LoaderCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";

function TicketStats({ ticketCounts }) {
  const stats = [
    {
      key: "ALL",
      label: "All Tickets",
      count: ticketCounts.total,
      icon: ClipboardList,
    },
    {
      key: "OPEN",
      label: "Open",
      count: ticketCounts.open,
      icon: FolderOpen,
    },
    {
      key: "IN_PROGRESS",
      label: "In Progress",
      count: ticketCounts.inProgress,
      icon: LoaderCircle,
    },
    {
      key: "RESOLVED",
      label: "Resolved",
      count: ticketCounts.resolved,
      icon: CheckCircle2,
    },
    {
      key: "CLOSED",
      label: "Closed",
      count: ticketCounts.closed,
      icon: Lock,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              p-5
              shadow-sm
              transition-all
              duration-200
              hover:border-yellow-300
              hover:bg-yellow-50
              hover:shadow-lg
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  {item.count}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <Icon
                  size={24}
                  className="text-yellow-600"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TicketStats;