// import DealListCard from "./DealListCard";

// export default function DealList({
//   deals = [],
//   onView,
//   onEdit,
//   onDelete,
// }) {
//   if (deals.length === 0) {
//     return (
//       <div className="bg-white rounded-xl p-10 text-center text-gray-500">
//         No Deals Found
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-4 mt-6">
//       {deals.map((deal) => (
//         <DealListCard
//           key={deal.id}
//           deal={deal}
//           onView={onView}
//           onEdit={onEdit}
//           onDelete={onDelete}
//         />
//       ))}
//     </div>
//   );
// }

// import DealListCard from "./DealListCard";

// export default function DealList({
//   deals = [],
//   onView,
//   onEdit,
//   onDelete,
//   onStageChange,
// }) {
//   if (deals.length === 0) {
//     return (
//       <div className="bg-white rounded-xl p-10 text-center text-gray-500">
//         No Deals Found
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
//       {deals.map((deal) => (
//         <DealListCard
//           key={deal.id}
//           deal={deal}
//           onView={onView}
//           onEdit={onEdit}
//           onDelete={onDelete}
//           onStageChange={onStageChange}
//         />
//       ))}
//     </div>
//   );
// }

import { useState } from "react";
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

function stageBadge(stage) {
  switch ((stage || "").toUpperCase()) {
    case "LEAD":
      return "bg-blue-100 text-blue-700";

    case "PROPOSAL":
      return "bg-purple-100 text-purple-700";

    case "NEGOTIATION":
      return "bg-orange-100 text-orange-700";

    case "WON":
      return "bg-green-100 text-green-700";

    case "LOST":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function DealList({
  deals = [],
  onView,
  onEdit,
  onDelete,
  onStageChange,
}) {
  const [openMenu, setOpenMenu] = useState(null);

  if (!deals || deals.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
        No Deals Found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-200 mt-6">
      <table className="min-w-full">
        {/* Header */}
        <thead className="bg-[#25D366] text-black">
          <tr>
            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Customer
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Deal Title
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Assigned To
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Deal Value
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-wide">
              Stage
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
          {deals.map((deal) => (
            <tr
              key={deal.id}
              className="border-b border-gray-100 last:border-b-0 hover:bg-[#DCF8C6] transition"
            >
              {/* Customer */}
              <td className="px-5 py-4">
                <div className="font-semibold text-slate-800">
                  {deal.customer?.name || "No Customer"}
                </div>

                <div className="text-xs text-gray-500">
                  {deal.customer?.phone || "-"}
                </div>

                <div className="text-xs text-gray-500">
                  {deal.customer?.email || "-"}
                </div>
              </td>

              {/* Deal Title */}
              <td className="px-5 py-4">
                <div className="text-base font-semibold text-slate-800">
                  {deal.title}
                </div>

                <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {deal.description || "-"}
                </div>
              </td>

              {/* Assigned To */}
              <td className="px-5 py-4 text-sm">
                {deal.assignedTo ? (
                  <div>
                    <div className="font-semibold text-slate-800">
                      {deal.assignedTo.name}
                    </div>

                    <div className="text-xs text-gray-500">
                      {deal.assignedTo.email}
                    </div>
                  </div>
                ) : (
                  <span className="italic text-gray-400">
                    Unassigned
                  </span>
                )}
              </td>

              {/* Deal Value */}
              <td className="px-5 py-4">
                <div className="font-bold text-slate-800">
                  ₹ {Number(deal.value || 0).toLocaleString()}
                </div>
              </td>

                            {/* Stage */}
              <td className="px-5 py-4">
                <select
                  value={deal.stage}
                  onChange={(e) =>
                    onStageChange(deal.id, e.target.value)
                  }
                  className={`rounded-lg px-3 py-2 text-sm font-semibold border outline-none focus:ring-2 focus:ring-[#25D366] ${stageBadge(
                    deal.stage
                  )}`}
                >
                  <option value="LEAD">Lead</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="WON">Won</option>
                  <option value="LOST">Lost</option>
                </select>
              </td>

              {/* Created Date */}
              <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                {deal.createdAt
                  ? new Date(deal.createdAt).toLocaleDateString()
                  : "-"}
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="relative flex justify-center">
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === deal.id ? null : deal.id
                      )
                    }
                    className="rounded-lg p-2 hover:bg-gray-100 transition"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === deal.id && (
                    <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-gray-200 bg-white shadow-lg">
                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onView(deal);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                      >
                        <Eye size={16} />
                        View Deal
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onEdit(deal);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                      >
                        <Pencil size={16} />
                        Edit Deal
                      </button>

                      <button
                        onClick={() => {
                          setOpenMenu(null);
                          onDelete(deal.id);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete Deal
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
           
  );
}