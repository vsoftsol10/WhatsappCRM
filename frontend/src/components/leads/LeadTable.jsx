import { useState } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

function statusBadge(status) {
  switch ((status || "").toUpperCase()) {
    case "NEW":
      return "bg-yellow-100 text-yellow-800";

    case "CONTACTED":
      return "bg-blue-100 text-blue-700";

    case "QUALIFIED":
      return "bg-purple-100 text-purple-700";

    case "WON":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function sourceBadge(source) {
  switch ((source || "").toUpperCase()) {
    case "WHATSAPP":
      return "bg-green-100 text-green-700";

    case "FACEBOOK":
      return "bg-blue-100 text-blue-700";

    case "INSTAGRAM":
      return "bg-pink-100 text-pink-700";

    case "WEBSITE":
      return "bg-indigo-100 text-indigo-700";

    case "REFERRAL":
      return "bg-orange-100 text-orange-700";

    case "CALL":
      return "bg-cyan-100 text-cyan-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function LeadTable({
  leads,
  onEdit,
  onDelete,
  onStatusChange,
  onConvert,
}) {
  const [openMenu, setOpenMenu] = useState(null);

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center text-gray-500">
        No leads found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-gray-200">
      <table className="min-w-full">
        <thead className="bg-yellow-400 text-black">
          <tr>
            <th className="px-5 py-4 text-left text-sm font-bold uppercase">
              Lead
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase">
              Phone
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase">
              Source
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase">
              Status
            </th>

            <th className="px-5 py-4 text-left text-sm font-bold uppercase">
              Created
            </th>

            <th className="px-5 py-4 text-center text-sm font-bold uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-gray-100 last:border-b-0 hover:bg-yellow-50 transition"
            >
              {/* Lead */}
              <td className="px-5 py-4">
                <div className="font-semibold text-slate-800">
                  {lead.name}
                </div>

                <div className="text-xs text-gray-500">
                  {lead.email || "-"}
                </div>
              </td>

              {/* Phone */}
              <td className="px-5 py-4 text-sm text-slate-700">
                {lead.phone || "-"}
              </td>

              {/* Source */}
              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${sourceBadge(
                    lead.source
                  )}`}
                >
                  {lead.source || "OTHER"}
                </span>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <select
                  value={lead.status}
                  onChange={(e) =>
                    onStatusChange(lead.id, e.target.value)
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="WON">WON</option>
                </select>
              </td>

              {/* Date */}
              <td className="px-5 py-4 text-sm text-slate-600">
                {lead.createdAt
                  ? new Date(
                      lead.createdAt
                    ).toLocaleDateString()
                  : "-"}
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="relative flex justify-center">
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === lead.id
                          ? null
                          : lead.id
                      )
                    }
                    className="rounded-lg p-2 hover:bg-gray-100 transition"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === lead.id && (
                    <div className="absolute right-0 top-10 z-50 w-40 rounded-xl border border-gray-200 bg-white shadow-lg">
                      <button
                        onClick={() => onEdit(lead)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      {lead.status === "WON" && !lead.isConverted && (
                        <button
                          onClick={() => {
                            onConvert(lead.id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-green-600 hover:bg-green-50"
                        >
                          Convert to Customer
                        </button>
                      )}

                      <button
                        onClick={() =>
                          onDelete(lead.id)
                        }
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
          ))}
        </tbody>
      </table>
    </div>
  );
}