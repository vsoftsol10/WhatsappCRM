import { useState } from "react";
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  IndianRupee,
  User,
} from "lucide-react";

export default function DealListCard({
  deal,
  onView,
  onEdit,
  onDelete,
  onStageChange,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const stageColor = {
    LEAD: "bg-blue-50 border-blue-200 text-blue-700",
    PROPOSAL: "bg-purple-50 border-purple-200 text-purple-700",
    NEGOTIATION: "bg-orange-50 border-orange-200 text-orange-700",
    WON: "bg-green-50 border-green-200 text-green-700",
    LOST: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Three Dot Menu */}
      <div className="absolute right-4 top-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="rounded-full p-2 transition hover:bg-gray-100"
        >
          <MoreVertical size={20} />
        </button>

        {showMenu && (
          <div className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-gray-200 bg-white shadow-xl">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onView(deal);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              <Eye size={18} />
              View Deal
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onEdit(deal);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              <Pencil size={18} />
              Edit Deal
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onDelete(deal.id);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} />
              Delete Deal
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="mb-5 pr-10">
        <h3 className="text-lg font-semibold text-gray-900">
          {deal.title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-gray-500">
          <User size={16} />
          <span>{deal.customer?.name || "No Customer"}</span>
        </div>
      </div>

      {/* Stage */}
      <div className="mb-5">
        <label className="mb-2 block text-xs font-semibold uppercase text-gray-500">
          Deal Stage
        </label>

        <select
          value={deal.stage}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            onStageChange(deal.id, e.target.value)
          }
          className={`w-full rounded-xl border px-3 py-2 text-sm font-semibold outline-none ${stageColor[deal.stage]}`}
        >
          <option value="LEAD">Lead</option>
          <option value="PROPOSAL">Proposal</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </select>
      </div>

            {/* Deal Value */}
      <div className="flex items-center gap-2 border-t pt-4 text-gray-700">
        <IndianRupee size={18} className="text-yellow-600" />

        <span className="text-xl font-bold text-gray-900">
          {Number(deal.value || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}