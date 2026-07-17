// import {
//   MoreVertical,
//   Pencil,
//   Trash2,
// } from "lucide-react";
// import { useEffect, useRef } from "react";

// function statusBadge(status) {
//   switch ((status || "").toUpperCase()) {
//     case "OPEN":
//       return "bg-red-100 text-red-700";

//     case "IN_PROGRESS":
//       return "bg-[#DCF8C6] text-[#128C7E]";

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
//       return "bg-[#DCF8C6] text-[#128C7E]";

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
//   const menuRef = useRef(null);

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
//         <thead className="bg-[#25D366] text-black">
//           <tr>
//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Customer
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Title
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Assigned To
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
//                 className="border-b border-gray-100 last:border-b-0 hover:bg-[#DCF8C6] transition"
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

//                 {/* Assigned Employee */}
//                 <td className="px-5 py-4 text-sm">
//                   {ticket.assignedTo ? (
//                     <div>
//                       <div className="font-semibold text-slate-800">
//                         {ticket.assignedTo.name}
//                       </div>

//                       <div className="text-xs text-gray-500">
//                         {ticket.assignedTo.email}
//                       </div>
//                     </div>
//                   ) : (
//                     <span className="text-gray-400 italic">
//                       Unassigned
//                     </span>
//                   )}
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

import { useEffect, useRef } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

function statusBadge(status) {
  switch ((status || "").toUpperCase()) {
    case "OPEN":
      return "bg-red-100 text-red-700 border-red-300";

    case "IN_PROGRESS":
      return "bg-[#DCF8C6] text-[#128C7E] border-[#25D366]";

    case "RESOLVED":
      return "bg-green-100 text-green-700 border-green-300";

    case "CLOSED":
      return "bg-slate-100 text-slate-700 border-slate-300";

    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

function priorityBadge(priority) {
  switch ((priority || "").toUpperCase()) {
    case "HIGH":
      return "bg-red-100 text-red-700";

    case "MEDIUM":
      return "bg-[#DCF8C6] text-[#128C7E]";

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
  onStatusChange
}) {

  const user = useAuthStore(
    (state) => state.user
  );

  const isAdmin = user?.role === "ADMIN";

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [setOpenMenu]);

  if (!tickets || tickets.length === 0) {
    return (
      <div className="crm-page-surface p-8 text-center text-gray-500 sm:p-10">
        No tickets found
      </div>
    );
  }

  return (
    <div className="crm-table-shell overflow-visible">
      <div className="crm-table-scroll">
        <table className="w-full min-w-[920px]">
          {/* Header */}
          <thead className="bg-[#25D366] text-black">
            <tr>
              <th className="crm-th">
                Customer
              </th>

              <th className="crm-th min-w-[220px]">
                Title
              </th>

              <th className="crm-th min-w-[210px]">
                Assigned To
              </th>

              <th className="crm-th">
                Priority
              </th>

              <th className="crm-th">
                Status
              </th>

              <th className="crm-th">
                Created
              </th>

              {isAdmin && (
                <th className="crm-th text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {tickets.map((ticket, index) => {

              const id = ticket.id;

              // Open upward for the last two rows
              const openUp = index >= tickets.length - 2;

              //const isLastRows = index >= tickets.length - 3;

              const shouldOpenUp = index >= tickets.length - 2;

              return (
                <tr
                  key={id}
                  className="border-b border-gray-100 transition hover:bg-[#DCF8C6] last:border-b-0"
                >
                  {/* Customer */}
                  <td className="crm-td font-medium">
                    {ticket.customer?.name || "-"}
                  </td>

                  {/* Title */}
                  <td className="crm-td">
                    <div className="break-words text-base font-semibold text-slate-800">
                      {ticket.title}
                    </div>

                    <div className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {ticket.description}
                    </div>
                  </td>

                  {/* Assigned Employee */}
                  <td className="crm-td">
                    {ticket.assignedTo ? (
                      <div>
                        <div className="font-semibold text-slate-800">
                          {ticket.assignedTo.name}
                        </div>

                        <div className="break-all text-xs text-gray-500">
                          {ticket.assignedTo.email}
                        </div>
                      </div>
                    ) : (
                      <span className="italic text-gray-400">
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="crm-td">
                    <span
                      className={`crm-badge ${priorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                                  {/* Status */}
                 <td className="crm-td">
                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      onStatusChange(ticket.id, e.target.value)
                    }
                    className={`w-full max-w-[150px] cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium outline-none ${statusBadge(
                      ticket.status
                    )}`}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">
                      IN PROGRESS
                    </option>
                    <option value="RESOLVED">
                      RESOLVED
                    </option>
                    <option value="CLOSED">
                      CLOSED
                    </option>
                  </select>
                </td>

                  {/* Date */}
                  <td className="crm-td whitespace-nowrap text-slate-600">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Actions */}
                  {isAdmin && (
                    <td className="crm-td">
                      <div
                        ref={openMenu === id ? menuRef : null}
                        className="relative flex justify-center"
                      >
                        <button
                          onClick={() =>  setOpenMenu(openMenu === id ? null : id)
                          }
                          className="rounded-lg p-2 transition hover:bg-gray-100"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenu === id && (
                          // <div
                          //   className={`absolute right-0 z-[999] w-40 rounded-xl border border-gray-200 bg-white shadow-xl ${
                          //     isLastRows
                          //       ? "bottom-full mb-2"
                          //       : "top-full mt-2"
                          //   }`}
                          // >
                          <div
                            className={`absolute right-0 z-[9999] w-40 rounded-xl border border-gray-200 bg-white shadow-xl ${
                              shouldOpenUp
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                            }`}
                          >
                            <button
                              onClick={() => {
                                handleEdit(ticket);
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-100"
                            >
                              <Pencil size={16} />
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                handleDelete(id);
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketTable;
