// import { ClipboardList, Users, UserCircle } from "lucide-react";

// function AuditLogStats({ stats }) {
//   const cards = [
//     {
//       key: "ALL",
//       label: "All Activity",
//       count: stats.total,
//       icon: ClipboardList,
//     },
//     {
//       key: "Employee",
//       label: "Employee Activity",
//       count: stats.employee,
//       icon: Users,
//     },
//     {
//       key: "Customer",
//       label: "Customer Activity",
//       count: stats.customer,
//       icon: UserCircle,
//     },
//   ];

//   return (
//     <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
//       {cards.map((item) => {
//         const Icon = item.icon;

//         return (
//           <div
//             key={item.key}
//             className="
//               bg-white
//               rounded-2xl
//               border
//               border-gray-200
//               p-5
//               shadow-sm
//               transition-all
//               duration-200
//               hover:border-[#25D366]
//               hover:bg-[#DCF8C6]
//               hover:shadow-lg
//             "
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div className="min-w-0">
//                 <p className="text-sm font-medium text-gray-500">
//                   {item.label}
//                 </p>

//                 <h2 className="mt-3 text-3xl font-bold text-gray-900">
//                   {item.count}
//                 </h2>
//               </div>

//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCF8C6]">
//                 <Icon size={24} className="text-[#25D366]" />
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default AuditLogStats;

import { ClipboardList, CalendarDays, CalendarRange } from "lucide-react";

function AuditLogStats({ stats }) {
  const cards = [
    {
      key: "total",
      label: "All Activity",
      count: stats.total,
      icon: ClipboardList,
    },
    {
      key: "today",
      label: "Today",
      count: stats.today,
      icon: CalendarDays,
    },
    {
      key: "thisWeek",
      label: "This Week",
      count: stats.thisWeek,
      icon: CalendarRange,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
      {cards.map((item) => {
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
              hover:border-[#25D366]
              hover:bg-[#DCF8C6]
              hover:shadow-lg
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  {item.count}
                </h2>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCF8C6]">
                <Icon size={24} className="text-[#25D366]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AuditLogStats;