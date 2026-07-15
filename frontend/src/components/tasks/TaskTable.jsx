// import { useState } from "react";
// import { useAuthStore } from "../../store/authStore";
// import {
//   MoreVertical,
//   Pencil,
//   Trash2,
// } from "lucide-react";

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

// function statusBadge(status) {
//   switch ((status || "").toUpperCase()) {
//     case "TODO":
//       return "bg-gray-100 text-gray-700";

//     case "IN_PROGRESS":
//       return "bg-blue-100 text-blue-700";

//     case "REVIEW":
//       return "bg-amber-100 text-amber-700";

//     case "COMPLETED":
//       return "bg-green-100 text-green-700";

//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// }

// export default function TaskTable({
//   tasks = [],
//   onEdit,
//   onDelete,
//   onStatusChange,
// }) {
//   const { user } = useAuthStore();

//   const [openMenu, setOpenMenu] = useState(null);

//   const isAdmin = user?.role === "ADMIN";

//   const currentUserId =
//     user?.id || user?.userId;

//   if (!tasks || tasks.length === 0) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500 mt-6">
//         No Tasks Found
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-200 mt-6">
//       <table className="min-w-full">
//         {/* Header */}
//         <thead className="bg-yellow-400 text-black">
//           <tr>
//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Assigned To
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Task
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Priority
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Status
//             </th>

//             <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
//               Due Date
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
//           {tasks.map((task) => {
//             const canUpdateStatus =
//               isAdmin ||
//               task.assignedToId === currentUserId;

//             return (
//               <tr
//                 key={task.id}
//                 className="border-b border-gray-100 last:border-b-0 hover:bg-yellow-50 transition"
//               >
//                 {/* Assigned To */}
//                 <td className="px-5 py-4 text-sm">
//                   {task.assignedTo ? (
//                     <div>
//                       <div className="font-semibold text-slate-800">
//                         {task.assignedTo.name}
//                       </div>

//                       <div className="text-xs text-gray-500">
//                         {task.assignedTo.email}
//                       </div>
//                     </div>
//                   ) : (
//                     <span className="italic text-gray-400">
//                       Unassigned
//                     </span>
//                   )}
//                 </td>

//                 {/* Task */}
//                 <td className="px-5 py-4">
//                   <div className="text-base font-semibold text-slate-800">
//                     {task.title}
//                   </div>

//                   <div className="mt-1 text-sm text-gray-500 line-clamp-2">
//                     {task.description || "-"}
//                   </div>
//                 </td>

//                 {/* Priority */}
//                 <td className="px-5 py-4">
//                   <span
//                     className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(
//                       task.priority
//                     )}`}
//                   >
//                     {task.priority}
//                   </span>
//                 </td>

//                 {/* Status */}
//                 <td className="px-5 py-4">
//                   {canUpdateStatus ? (
//                     <select
//                       value={task.status}
//                       onChange={(e) =>
//                         onStatusChange(
//                           task.id,
//                           e.target.value
//                         )
//                       }
//                       className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-yellow-400 ${statusBadge(
//                         task.status
//                       )}`}
//                     >
//                       <option value="TODO">
//                         TODO
//                       </option>

//                       <option value="IN_PROGRESS">
//                         IN PROGRESS
//                       </option>

//                       <option value="REVIEW">
//                         REVIEW
//                       </option>

//                       <option value="COMPLETED">
//                         COMPLETED
//                       </option>
//                     </select>
//                   ) : (

//                                         <span
//                       className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
//                         task.status
//                       )}`}
//                     >
//                       {task.status.replace("_", " ")}
//                     </span>
//                   )}
//                 </td>

//                 {/* Due Date */}
//                 <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
//                   {task.dueDate
//                     ? new Date(task.dueDate).toLocaleDateString()
//                     : "-"}
//                 </td>

//                 {/* Created */}
//                 <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
//                   {task.createdAt
//                     ? new Date(task.createdAt).toLocaleDateString()
//                     : "-"}
//                 </td>

//                 {/* Actions */}
//                 <td className="px-5 py-4">
//                   <div className="relative flex justify-center">
//                     {isAdmin ? (
//                       <>
//                         <button
//                           onClick={() =>
//                             setOpenMenu(
//                               openMenu === task.id
//                                 ? null
//                                 : task.id
//                             )
//                           }
//                           className="rounded-lg p-2 hover:bg-gray-100 transition"
//                         >
//                           <MoreVertical size={18} />
//                         </button>

//                         {openMenu === task.id && (
//                           <div className="absolute right-0 top-10 z-50 w-40 rounded-xl border border-gray-200 bg-white shadow-lg">
//                             <button
//                               onClick={() => {
//                                 setOpenMenu(null);
//                                 onEdit(task);
//                               }}
//                               className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
//                             >
//                               <Pencil size={16} />
//                               Edit
//                             </button>

//                             <button
//                               onClick={() => {
//                                 setOpenMenu(null);
//                                 onDelete(task.id);
//                               }}
//                               className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
//                             >
//                               <Trash2 size={16} />
//                               Delete
//                             </button>
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <span className="text-gray-400 text-sm">
//                         —
//                       </span>
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


import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import {
  MoreVertical,
  Pencil,
  Trash2,
  User,
} from "lucide-react";

function priorityBadge(priority) {
  switch ((priority || "").toUpperCase()) {
    case "HIGH":
      return "bg-red-100 text-red-700 border border-red-200";

    case "MEDIUM":
      return "bg-amber-100 text-amber-700 border border-amber-200";

    case "LOW":
      return "bg-green-100 text-green-700 border border-green-200";

    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
}

function statusBadge(status) {
  switch ((status || "").toUpperCase()) {
    case "TODO":
      return "bg-gray-100 text-gray-700 border border-gray-200";

    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border border-blue-200";

    case "REVIEW":
      return "bg-amber-100 text-amber-700 border border-amber-200";

    case "COMPLETED":
      return "bg-green-100 text-green-700 border border-green-200";

    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
}

export default function TaskTable({
  tasks = [],
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
}) {
  const { user } = useAuthStore();

  const isAdmin = user?.role === "ADMIN";

  const currentUserId = user?.id || user?.userId;

  const [openMenu, setOpenMenu] = useState(null);

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 shadow-sm">
        <div className="flex flex-col items-center justify-center">

          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <User
              size={30}
              className="text-yellow-600"
            />
          </div>

          <h3 className="text-xl font-semibold text-slate-800">
            No Tasks Found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            There are no tasks matching your filters.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="overflow-x-auto">

        <table className="min-w-full">

          {/* ========================= */}
          {/* TABLE HEADER */}
          {/* ========================= */}

          <thead className="sticky top-0 z-10 bg-yellow-400">

            <tr>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">
                Assigned To
              </th>

              <th className="min-w-[280px] px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">
                Task
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">
                Priority
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">
                Status
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">
                Due Date
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-black">
                Created
              </th>

              <th className="w-20 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-black">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
                      {tasks.map((task) => {
            const canUpdateStatus =
              isAdmin ||
              task.assignedToId === currentUserId;

            return (
              <tr
                key={task.id}
                className="transition-all duration-200 hover:bg-yellow-50/60"
              >
                {/* ================= Assigned To ================= */}

                <td className="px-6 py-5">
                  {task.assignedTo ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 font-semibold text-yellow-700">
                        {task.assignedTo.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {task.assignedTo.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {task.assignedTo.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="italic text-gray-400">
                      Unassigned
                    </span>
                  )}
                </td>

                {/* ================= Task ================= */}

                <td className="px-6 py-5">
                  <div className="font-semibold text-slate-800">
                    {task.title}
                  </div>

                  <div className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {task.description || "-"}
                  </div>
                </td>

                {/* ================= Priority ================= */}

                <td className="px-6 py-5">
                  {isAdmin ? (
                    <select
                      value={task.priority}
                      onChange={(e) =>
                        onPriorityChange(
                          task.id,
                          e.target.value
                        )
                      }
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 ${priorityBadge(
                        task.priority
                      )}`}
                    >
                      <option value="LOW">
                        LOW
                      </option>

                      <option value="MEDIUM">
                        MEDIUM
                      </option>

                      <option value="HIGH">
                        HIGH
                      </option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  )}
                </td>

                {/* ================= Status ================= */}

                <td className="px-6 py-5">
                  {canUpdateStatus ? (
                    <select
                      value={task.status}
                      onChange={(e) =>
                        onStatusChange(
                          task.id,
                          e.target.value
                        )
                      }
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 ${statusBadge(
                        task.status
                      )}`}
                    >
                      <option value="TODO">
                        TODO
                      </option>

                      <option value="IN_PROGRESS">
                        IN PROGRESS
                      </option>

                      <option value="REVIEW">
                        REVIEW
                      </option>

                      <option value="COMPLETED">
                        COMPLETED
                      </option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                        task.status
                      )}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  )}
                </td>

                {/* ================= Due Date ================= */}

                <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                {/* ================= Created ================= */}

                <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">
                  {task.createdAt
                    ? new Date(
                        task.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </td>

                                {/* ================= Actions ================= */}

                <td className="px-6 py-5">
                  <div className="relative flex justify-center">
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === task.id
                                ? null
                                : task.id
                            )
                          }
                          className="rounded-xl p-2 transition hover:bg-gray-100"
                        >
                          <MoreVertical
                            size={18}
                            className="text-gray-600"
                          />
                        </button>

                        {openMenu === task.id && (
                          <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                            <button
                              onClick={() => {
                                setOpenMenu(null);
                                onEdit(task);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-gray-50"
                            >
                              <Pencil size={16} />
                              Edit Task
                            </button>

                            <button
                              onClick={() => {
                                setOpenMenu(null);
                                onDelete(task.id);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete Task
                            </button>

                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">
                        —
                      </span>
                    )}
                  </div>
                </td>

              </tr>
            );
          })}
           </tbody>
        </table>

      </div>
    </div>
  );
}