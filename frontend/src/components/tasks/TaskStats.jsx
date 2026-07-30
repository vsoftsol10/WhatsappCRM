import {
  ClipboardList,
  ListTodo,
  LoaderCircle,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

export default function TaskStats({ tasks }) {
  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const reviewTasks = tasks.filter(
    (task) => task.status === "REVIEW"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: ClipboardList,
    },
    {
      title: "Todo",
      value: todoTasks,
      icon: ListTodo,
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: LoaderCircle,
    },
    {
      title: "Review",
      value: reviewTasks,
      icon: ClipboardCheck,
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              p-5
              shadow-sm
              transition-all
              duration-200
              hover:border-[#25D366]
              hover:bg-[#DCF8C6]
              hover:shadow-lg
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  {stat.value}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCF8C6]">
                <Icon
                  size={24}
                  className="text-[#25D366]"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}