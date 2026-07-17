import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  PhoneCall,
  BadgeCheck,
  Trophy,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

function statusBadge(status) {
  switch ((status || "").toUpperCase()) {
    case "NEW":
      return "bg-[#DCF8C6] text-[#128C7E]";

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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  if (!leads || leads.length === 0) {
    return (
      <div className="crm-page-surface p-8 text-center text-gray-500 sm:p-10">
        No leads found
      </div>
    );
  }

  return (
    <div className="crm-table-shell overflow-visible">
      <div className="crm-table-scroll">
      <table className="w-full min-w-[820px]">
        <thead className="bg-[#25D366] text-black">
          <tr>
            <th className="crm-th min-w-[220px]">
              Lead
            </th>

            <th className="crm-th">
              Phone
            </th>

            <th className="crm-th">
              Source
            </th>

            <th className="crm-th">
              Status
            </th>

            <th className="crm-th">
              Created
            </th>

            <th className="crm-th text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead, index) => {
          const isLastRows = index >= leads.length - 3;

          return (
            <tr
              key={lead.id}
              className="border-b border-gray-100 last:border-b-0 hover:bg-[#DCF8C6] transition"
            >
              {/* Lead */}
              <td className="crm-td">
                <div className="break-words font-semibold text-slate-800">
                  {lead.name}
                </div>

                <div className="break-all text-xs text-gray-500">
                  {lead.email || "-"}
                </div>
              </td>

              {/* Phone */}
              <td className="crm-td">
                {lead.phone || "-"}
              </td>

              {/* Source */}
              <td className="crm-td">
                <span
                  className={`crm-badge ${sourceBadge(
                    lead.source
                  )}`}
                >
                  {lead.source || "OTHER"}
                </span>
              </td>

              {/* Status */}
              <td className="crm-td">
                <select
                  value={lead.status}
                  disabled={lead.isConverted}
                  onChange={(e) =>
                    onStatusChange(lead.id, e.target.value)
                  }
                  className={`w-full max-w-[150px] rounded-lg border px-3 py-2 text-sm outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#DCF8C6] ${
                    lead.isConverted
                      ? "cursor-not-allowed bg-gray-100 text-gray-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="WON">WON</option>
                </select>
              </td>

              {/* Date */}
              <td className="crm-td whitespace-nowrap text-slate-600">
                {lead.createdAt
                  ? new Date(
                      lead.createdAt
                    ).toLocaleDateString()
                  : "-"}
              </td>

              {/* Actions */}
              <td className="crm-td">
                <div ref={menuRef} className="relative flex justify-center">
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
  <div
    className={`absolute right-0 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ${
      isLastRows ? "bottom-10" : "top-10"
    }`}
  >
    <button
      onClick={() => {
        onEdit(lead);
        setOpenMenu(null);
      }}
      className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
    >
      <Pencil size={16} />
      Edit Lead
    </button>

    <button
      onClick={() => {
        onDelete(lead.id);
        setOpenMenu(null);
      }}
      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
    >
      <Trash2 size={16} />
      Delete Lead
    </button>

    <div className="border-t" />

    {!lead.isConverted && lead.status === "NEW" && (
      <button
        onClick={() => {
          onStatusChange(lead.id, "CONTACTED");
          setOpenMenu(null);
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
      >
        <PhoneCall size={16} />
        Mark Contacted
      </button>
    )}

    {!lead.isConverted && lead.status === "CONTACTED" && (
      <button
        onClick={() => {
          onStatusChange(lead.id, "QUALIFIED");
          setOpenMenu(null);
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
      >
        <BadgeCheck size={16} />
        Mark Qualified
      </button>
    )}

    {!lead.isConverted && lead.status === "QUALIFIED" && (
      <button
        onClick={() => {
          onStatusChange(lead.id, "WON");
          setOpenMenu(null);
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#128C7E] hover:bg-[#DCF8C6]"
      >
        <Trophy size={16} />
        Mark Won
      </button>
    )}

    {lead.status === "WON" && !lead.isConverted && (
      <button
        onClick={() => {
          console.log("Table Convert", lead.id);
          onConvert(lead.id);
          setOpenMenu(null);
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#128C7E] hover:bg-[#DCF8C6]"
      >
        <UserPlus size={16} />
        Convert to Customer
      </button>
    )}

    {lead.isConverted && (
      <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#128C7E]">
        <CheckCircle2 size={16} />
        Converted
      </div>
    )}
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
    </div>
  );
}
