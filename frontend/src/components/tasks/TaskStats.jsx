// export default function TaskStats({ tasks }) {
//   const totalTasks = tasks.length;

//   const todoTasks = tasks.filter(
//     (task) => task.status === "TODO"
//   ).length;

//   const inProgressTasks = tasks.filter(
//     (task) => task.status === "IN_PROGRESS"
//   ).length;

//   const reviewTasks = tasks.filter(
//     (task) => task.status === "REVIEW"
//   ).length;

//   const completedTasks = tasks.filter(
//     (task) => task.status === "COMPLETED"
//   ).length;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-6">
//       {/* TOTAL */}

//       <div className="bg-white rounded-xl shadow-sm p-5">
//         <p className="text-gray-500 text-sm">
//           Total Tasks
//         </p>

//         <h2 className="text-3xl font-bold mt-2">
//           {totalTasks}
//         </h2>
//       </div>

//       {/* TODO */}

//       <div className="bg-white rounded-xl shadow-sm p-5">
//         <p className="text-gray-500 text-sm">
//           Todo
//         </p>

//         <h2 className="text-3xl font-bold mt-2 text-gray-700">
//           {todoTasks}
//         </h2>
//       </div>

//       {/* IN PROGRESS */}

//       <div className="bg-white rounded-xl shadow-sm p-5">
//         <p className="text-gray-500 text-sm">
//           In Progress
//         </p>

//         <h2 className="text-3xl font-bold mt-2 text-blue-600">
//           {inProgressTasks}
//         </h2>
//       </div>

//       {/* REVIEW */}

//       <div className="bg-white rounded-xl shadow-sm p-5">
//         <p className="text-gray-500 text-sm">
//           Review
//         </p>

//         <h2 className="text-3xl font-bold mt-2 text-amber-600">
//           {reviewTasks}
//         </h2>
//       </div>

//       {/* COMPLETED */}

//       <div className="bg-white rounded-xl shadow-sm p-5">
//         <p className="text-gray-500 text-sm">
//           Completed
//         </p>

//         <h2 className="text-3xl font-bold mt-2 text-green-600">
//           {completedTasks}
//         </h2>
//       </div>
//     </div>
//   );
// }

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
              hover:border-yellow-300
              hover:bg-yellow-50
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