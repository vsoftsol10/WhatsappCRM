import { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  PhoneCall,
  BadgeCheck,
  Trophy,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

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
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onConvert,
}) {
  const [openMenu, setOpenMenu] = useState(null);

  const [menuPosition, setMenuPosition] = useState("down");

  const menuRef = useRef(null);

  const buttonRefs = useRef({});

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  useLayoutEffect(() => {
    if (!openMenu) return;

    const button = buttonRefs.current[openMenu];
    const dropdown = dropdownRef.current;

    if (!button || !dropdown) return;

    const buttonRect = button.getBoundingClientRect();
    const menuHeight = dropdown.getBoundingClientRect().height;

    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    // Prefer opening down; only flip up if there isn't enough
    // room below AND there IS enough room above.
    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
      setMenuPosition("up");
    } else {
      setMenuPosition("down");
    }
  }, [openMenu]);

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
              Assigned To
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
          {leads.map((lead) => {
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

              {/* Assigned To */}
              <td className="crm-td">
                {lead.assignedTo ? (
                  <span className="text-sm font-medium text-slate-700">
                    {lead.assignedTo.name}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">
                    Unassigned
                  </span>
                )}
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
                <div ref={menuRef} onClick={(e) => e.stopPropagation()} className="relative flex justify-center">
                  <button
                    ref={(el) => {
                      if (el) {
                        buttonRefs.current[lead.id] = el;
                      }
                    }}
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
    ref={dropdownRef}
    className={`absolute right-0 z-[9999] max-h-[70vh] w-56 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg ${
      menuPosition === "up" ? "bottom-full mb-2" : "top-full mt-2"
    }`}
  >
    <button
      onClick={() => {
        onView(lead);
        setOpenMenu(null);
      }}
      className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
    >
      <Eye size={16} />
      View Details
    </button>

    <button
      onClick={() => {
        console.log("Edit clicked", lead.id);
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
        console.log("Delete clicked", lead.id);
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
          console.log("Contacted clicked", lead.id);
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
          console.log("Qualified clicked", lead.id);
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
          console.log("Convert clicked", lead.id);
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