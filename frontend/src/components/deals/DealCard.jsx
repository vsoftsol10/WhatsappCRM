// export default function DealCard({
//   deal,
//   onEdit,
//   onDelete,
//   onView,
// }) {
//   const handleOpen = () => {
//     console.log("CLICKED DEAL:", deal);

//     if (!deal?.id) {
//       console.error("Deal ID missing:", deal);
//       return;
//     }

//     // Open popup instead of navigating
//     onView(deal);
//   };

//   return (
//     <div
//       onClick={handleOpen}
//       className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
//     >
//       {/* TITLE */}
//       <h3 className="font-semibold text-black">
//         {deal?.title || "No Title"}
//       </h3>

//       {/* CUSTOMER */}
//       <p className="text-sm text-gray-500">
//         {deal?.customer?.name || "No Customer"}
//       </p>

//       {/* VALUE */}
//       <p className="text-sm font-bold text-yellow-600 mt-1">
//         ₹ {Number(deal?.value || 0).toLocaleString()}
//       </p>

//       {/* ACTIONS */}
//       <div className="flex justify-between mt-3">
//         {/* EDIT */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onEdit(deal);
//           }}
//           className="text-sm text-blue-600 hover:underline"
//         >
//           Edit
//         </button>

//         {/* DELETE */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onDelete(deal.id);
//           }}
//           className="text-sm text-red-500 hover:underline"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

import { User, IndianRupee } from "lucide-react";

export default function DealCard({
  deal,
  onEdit,
  onDelete,
  onView,
  onStageChange,
}) {
  const stageColor = {
    LEAD: "bg-blue-50 border-blue-200 text-blue-700",
    PROPOSAL: "bg-purple-50 border-purple-200 text-purple-700",
    NEGOTIATION: "bg-orange-50 border-orange-200 text-orange-700",
    WON: "bg-green-50 border-green-200 text-green-700",
    LOST: "bg-red-50 border-red-200 text-red-700",
  };

  const handleOpen = () => {
    if (!deal?.id) {
      console.error("Deal ID missing:", deal);
      return;
    }

    onView(deal);
  };

  return (
    <div
      onClick={handleOpen}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      {/* Title */}
      <h3 className="font-semibold text-gray-900">
        {deal?.title || "No Title"}
      </h3>

      {/* Customer */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
        <User size={15} />
        <span>{deal?.customer?.name || "No Customer"}</span>
      </div>

      {/* Value */}
      <div className="mt-3 flex items-center gap-2 text-yellow-600">
        <IndianRupee size={16} />
        <span className="font-bold">
          {Number(deal?.value || 0).toLocaleString()}
        </span>
      </div>

      {/* Stage */}
      <div className="mt-4">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Stage
        </label>

        <select
          value={deal.stage}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            onStageChange(deal.id, e.target.value)
          }
          className={`w-full rounded-lg border px-3 py-2 text-sm font-medium outline-none ${stageColor[deal.stage]}`}
        >
          <option value="LEAD">Lead</option>
          <option value="PROPOSAL">Proposal</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </select>
      </div>

            {/* Actions */}
      <div className="mt-4 flex justify-between border-t pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(deal);
          }}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(deal.id);
          }}
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}