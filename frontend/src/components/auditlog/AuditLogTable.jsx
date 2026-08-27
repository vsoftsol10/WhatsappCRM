import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Eye } from "lucide-react";

import ViewAuditLogDetailsModal from "./ViewAuditLogDetailsModal";
import {
  actionLabel,
  actionBadgeClass,
  entityBadgeClass,
  formatLogDate,
} from "./auditLogHelpers";

function AuditLogTable({ logs, loading }) {
  const [selectedLog, setSelectedLog] = useState(null);

  // ================= "MORE" KEBAB MENU =================
  // Rendered via a portal into document.body instead of staying
  // inside the table's DOM tree, for the same reason as
  // TicketTable.jsx's three-dot menu: .crm-table-scroll uses
  // overflow-x-auto for horizontal scrolling, and any overflow value
  // other than "visible" clips absolutely-positioned descendants that
  // try to render outside that box, regardless of z-index. Portaling
  // to <body> with fixed coordinates (from the trigger button's
  // getBoundingClientRect()) sidesteps that clipping entirely.
  const [openMenuId, setOpenMenuId] = useState(null);

  const [menuPosition, setMenuPosition] = useState("down");

  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });

  const buttonRefs = useRef({});

  const portalMenuRef = useRef(null);

  const MENU_WIDTH = 176;

  useLayoutEffect(() => {
    if (!openMenuId) return;

    const button = buttonRefs.current[openMenuId];

    if (!button) return;

    const rect = button.getBoundingClientRect();

    const menuHeight = 56; // just one item currently

    const spaceBelow = window.innerHeight - rect.bottom;

    const goUp = spaceBelow < menuHeight;

    setMenuPosition(goUp ? "up" : "down");

    setMenuCoords({
      top: goUp ? rect.top - 8 : rect.bottom + 8,
      left: Math.max(8, rect.right - MENU_WIDTH),
    });
  }, [openMenuId]);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedTrigger =
        buttonRefs.current[openMenuId] &&
        buttonRefs.current[openMenuId].contains(event.target);

      const clickedMenu =
        portalMenuRef.current && portalMenuRef.current.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  if (loading) {
    return (
      <div className="crm-page-surface p-8 text-center text-gray-400 sm:p-10">
        Loading...
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="crm-page-surface p-8 text-center text-gray-500 sm:p-10">
        No activity recorded yet.
      </div>
    );
  }

  return (
    <>
      <div className="crm-table-shell overflow-visible">
        <div className="crm-table-scroll">
          <table className="w-full min-w-[900px]">
            {/* Header */}
            <thead className="bg-[#25D366] text-black">
              <tr>
                <th className="crm-th">Date &amp; Time</th>
                <th className="crm-th min-w-[160px]">Actor</th>
                <th className="crm-th min-w-[160px]">Action</th>
                <th className="crm-th">Entity</th>
                <th className="crm-th min-w-[220px]">Description</th>
                <th className="crm-th text-center">More</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 transition hover:bg-[#DCF8C6] last:border-b-0"
                >
                  {/* Date & Time */}
                  <td className="crm-td whitespace-nowrap text-slate-600">
                    {formatLogDate(log.createdAt)}
                  </td>

                  {/* Actor */}
                  <td className="crm-td">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-sm font-semibold text-white">
                        {(log.actor?.name || "System").charAt(0)}
                      </div>

                      <span className="font-medium text-slate-800">
                        {log.actor?.name || "System"}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="crm-td">
                    <span className={`crm-badge ${actionBadgeClass(log.action)}`}>
                      {actionLabel(log.action)}
                    </span>
                  </td>

                  {/* Entity */}
                  <td className="crm-td">
                    <span className={`crm-badge ${entityBadgeClass(log.entityType)}`}>
                      {log.entityType || "-"}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="crm-td">
                    <div className="line-clamp-1 max-w-xs break-words text-sm text-slate-600">
                      {log.details || "—"}
                    </div>
                  </td>

                  {/* More */}
                  <td className="crm-td text-center">
                    <div className="relative flex justify-center">
                      <button
                        ref={(el) => (buttonRefs.current[log.id] = el)}
                        onClick={() =>
                          setOpenMenuId((prev) =>
                            prev === log.id ? null : log.id
                          )
                        }
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {openMenuId === log.id &&
                        createPortal(
                          <div
                            ref={portalMenuRef}
                            style={{
                              position: "fixed",
                              top: menuCoords.top,
                              left: menuCoords.left,
                              width: MENU_WIDTH,
                              transform:
                                menuPosition === "up"
                                  ? "translateY(-100%)"
                                  : "none",
                            }}
                            className="z-[9999] rounded-xl border border-gray-200 bg-white shadow-xl"
                          >
                            <button
                              onClick={() => {
                                setSelectedLog(log);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:bg-gray-100"
                            >
                              <Eye size={16} />
                              View Details
                            </button>
                          </div>,
                          document.body
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ViewAuditLogDetailsModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        actionLabel={actionLabel}
        actionBadgeClass={selectedLog ? actionBadgeClass(selectedLog.action) : ""}
        entityBadgeClass={selectedLog ? entityBadgeClass(selectedLog.entityType) : ""}
        formatDate={formatLogDate}
      />
    </>
  );
}

export default AuditLogTable;