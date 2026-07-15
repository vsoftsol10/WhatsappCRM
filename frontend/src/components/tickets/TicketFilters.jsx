// import {
//   ClipboardList,
//   FolderOpen,
//   LoaderCircle,
//   CheckCircle2,
//   Lock,
// } from "lucide-react";

// function TicketFilters({
//   statusFilter,
//   setStatusFilter,
//   ticketCounts,
// }) {
//   const filters = [
//     {
//       key: "ALL",
//       label: "All Tickets",
//       buttonLabel: "All Tickets",
//       count: ticketCounts.total,
//       icon: ClipboardList,
//     },
//     {
//       key: "OPEN",
//       label: "Open",
//       buttonLabel: "Open",
//       count: ticketCounts.open,
//       icon: FolderOpen,
//     },
//     {
//       key: "IN_PROGRESS",
//       label: "In Progress",
//       buttonLabel: "In Progress",
//       count: ticketCounts.inProgress,
//       icon: LoaderCircle,
//     },
//     {
//       key: "RESOLVED",
//       label: "Resolved",
//       buttonLabel: "Resolved",
//       count: ticketCounts.resolved,
//       icon: CheckCircle2,
//     },
//     {
//       key: "CLOSED",
//       label: "Closed",
//       buttonLabel: "Closed",
//       count: ticketCounts.closed,
//       icon: Lock,
//     },
//   ];

//   return (
//     <>
//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
//         {filters.map((item) => {
//           const Icon = item.icon;

//           return (
//             <div
//               key={item.key}
//               className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
//             >
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">
//                     {item.label}
//                   </p>

//                   <h2 className="mt-3 text-3xl font-bold text-slate-900">
//                     {item.count}
//                   </h2>
//                 </div>

//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
//                   <Icon size={22} />
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Filter Buttons */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         {filters.map((item) => {
//           const isActive = statusFilter === item.key;

//           return (
//             <button
//               key={item.key}
//               type="button"
//               onClick={() => setStatusFilter(item.key)}
//               className={`
//                 rounded-xl
//                 border
//                 px-5
//                 py-2.5
//                 text-sm
//                 font-semibold
//                 transition-all
//                 ${
//                   isActive
//                     ? "border-yellow-400 bg-yellow-400 text-black shadow-md"
//                     : "border-gray-300 bg-white text-slate-700 hover:bg-yellow-50 hover:border-yellow-300"
//                 }
//               `}
//             >
//               {item.buttonLabel}
//             </button>
//           );
//         })}
//       </div>
//     </>
//   );
// }

// export default TicketFilters;

import {
  ClipboardList,
  FolderOpen,
  LoaderCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";

function TicketFilters({
  statusFilter,
  setStatusFilter,
  ticketCounts,
}) {
  const filters = [
    {
      key: "ALL",
      label: "All Tickets",
      buttonLabel: "All Tickets",
      count: ticketCounts.total,
      icon: ClipboardList,
    },
    {
      key: "OPEN",
      label: "Open",
      buttonLabel: "Open",
      count: ticketCounts.open,
      icon: FolderOpen,
    },
    {
      key: "IN_PROGRESS",
      label: "In Progress",
      buttonLabel: "In Progress",
      count: ticketCounts.inProgress,
      icon: LoaderCircle,
    },
    {
      key: "RESOLVED",
      label: "Resolved",
      buttonLabel: "Resolved",
      count: ticketCounts.resolved,
      icon: CheckCircle2,
    },
    {
      key: "CLOSED",
      label: "Closed",
      buttonLabel: "Closed",
      count: ticketCounts.closed,
      icon: Lock,
    },
  ];

  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
        {filters.map((item) => {
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

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {filters.map((item) => {
          const isActive = statusFilter === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatusFilter(item.key)}
              className={`
                rounded-xl
                border
                px-5
                py-2.5
                text-sm
                font-semibold
                transition-all
                ${
                  isActive
                    ? "border-yellow-400 bg-yellow-400 text-black shadow-md"
                    : "border-gray-300 bg-white text-slate-700 hover:bg-yellow-50 hover:border-yellow-300"
                }
              `}
            >
              {item.buttonLabel}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default TicketFilters;