// import {
//   MoreVertical,
//   Pencil,
//   Trash2,
// } from "lucide-react";

// function statusBadge(status) {
//   switch ((status || "").toUpperCase()) {
//     case "OPEN":
//       return "bg-red-100 text-red-700";

//     case "IN_PROGRESS":
//       return "bg-yellow-100 text-yellow-800";

//     case "RESOLVED":
//       return "bg-green-100 text-green-700";

//     case "CLOSED":
//       return "bg-slate-200 text-slate-700";

//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// }

// function priorityBadge(priority) {
//   switch ((priority || "").toUpperCase()) {
//     case "HIGH":
//       return "bg-red-100 text-red-700";

//     case "MEDIUM":
//       return "bg-yellow-100 text-yellow-800";

//     case "LOW":
//       return "bg-green-100 text-green-700";

//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// }

// function TicketTable({
//   tickets,
//   openMenu,
//   setOpenMenu,
//   handleEdit,
//   handleDelete,
// }) {
//   if (!tickets || tickets.length === 0) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
//         No tickets found
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-200">
//       <table className="min-w-full">
//         {/* Header */}
//         <thead className="bg-yellow-400 text-black">
//           <tr>
//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Customer
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Title
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Priority
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Status
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Created
//             </th>

//             <th className="px-5 py-4 text-center text-sm font-bold uppercase tracking-wide">
//               Actions
//             </th>
//           </tr>
//         </thead>

//         {/* Body */}
//         <tbody>
//           {tickets.map((ticket) => {
//             const id = ticket.id;

//             return (
//               <tr
//                 key={id}
//                 className="border-b border-gray-100 last:border-b-0 hover:bg-yellow-50 transition"
//               >
//                 {/* Customer */}
//                 <td className="px-5 py-4 text-sm font-medium text-slate-700">
//                   {ticket.customer?.name || "-"}
//                 </td>

//                 {/* Title */}
//                 <td className="px-5 py-4">
//                   <div className="text-base font-semibold text-slate-800">
//                     {ticket.title}
//                   </div>

//                   <div className="mt-1 text-sm text-gray-500 line-clamp-2">
//                     {ticket.description}
//                   </div>
//                 </td>

//                 {/* Priority */}
//                 <td className="px-5 py-4">
//                   <span
//                     className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(
//                       ticket.priority
//                     )}`}
//                   >
//                     {ticket.priority}
//                   </span>
//                 </td>

//                 {/* Status */}
//                 <td className="px-5 py-4">
//                   <span
//                     className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
//                       ticket.status
//                     )}`}
//                   >
//                     {ticket.status.replace("_", " ")}
//                   </span>
//                 </td>

//                 {/* Date */}
//                 <td className="px-5 py-4 text-sm text-slate-600">
//                   {ticket.createdAt
//                     ? new Date(ticket.createdAt).toLocaleDateString()
//                     : "-"}
//                 </td>

//                 {/* Actions */}
//                 <td className="px-5 py-4">
//                   <div className="relative flex justify-center">
//                     <button
//                       onClick={() =>
//                         setOpenMenu(openMenu === id ? null : id)
//                       }
//                       className="rounded-lg p-2 hover:bg-gray-100 transition"
//                     >
//                       <MoreVertical size={18} />
//                     </button>

//                     {openMenu === id && (
//                       <div className="absolute right-0 top-10 z-50 w-40 rounded-xl border border-gray-200 bg-white shadow-lg">
//                         <button
//                           onClick={() => handleEdit(ticket)}
//                           className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
//                         >
//                           <Pencil size={16} />
//                           Edit
//                         </button>

//                         <button
//                           onClick={() => handleDelete(id)}
//                           className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
//                         >
//                           <Trash2 size={16} />
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default TicketTable;

import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

function statusBadge(status) {
  switch ((status || "").toUpperCase()) {
    case "OPEN":
      return "bg-red-100 text-red-700";

    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800";

    case "RESOLVED":
      return "bg-green-100 text-green-700";

    case "CLOSED":
      return "bg-slate-200 text-slate-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function priorityBadge(priority) {
  switch ((priority || "").toUpperCase()) {
    case "HIGH":
      return "bg-red-100 text-red-700";

    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";

    case "LOW":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function TicketTable({
  tickets,
  openMenu,
  setOpenMenu,
  handleEdit,
  handleDelete,
}) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
        No tickets found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-200">
      <table className="min-w-full">
        {/* Header */}
        <thead className="bg-yellow-400 text-black">
          <tr>
            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Customer
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Title
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Assigned To
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Priority
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Status
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Created
            </th>

            <th className="px-5 py-4 text-center text-sm font-bold uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {tickets.map((ticket) => {
            const id = ticket.id;

            return (
              <tr
                key={id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-yellow-50 transition"
              >
                {/* Customer */}
                <td className="px-5 py-4 text-sm font-medium text-slate-700">
                  {ticket.customer?.name || "-"}
                </td>

                {/* Title */}
                <td className="px-5 py-4">
                  <div className="text-base font-semibold text-slate-800">
                    {ticket.title}
                  </div>

                  <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {ticket.description}
                  </div>
                </td>

                {/* Assigned Employee */}
                <td className="px-5 py-4 text-sm">
                  {ticket.assignedTo ? (
                    <div>
                      <div className="font-semibold text-slate-800">
                        {ticket.assignedTo.name}
                      </div>

                      <div className="text-xs text-gray-500">
                        {ticket.assignedTo.email}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">
                      Unassigned
                    </span>
                  )}
                </td>

                {/* Priority */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                      ticket.status
                    )}`}
                  >
                    {ticket.status.replace("_", " ")}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-sm text-slate-600">
                  {ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="relative flex justify-center">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === id ? null : id)
                      }
                      className="rounded-lg p-2 hover:bg-gray-100 transition"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === id && (
                      <div className="absolute right-0 top-10 z-50 w-40 rounded-xl border border-gray-200 bg-white shadow-lg">
                        <button
                          onClick={() => handleEdit(ticket)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(id)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;