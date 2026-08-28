import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Eye,
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
  handleView,
  handleEdit,
  handleDelete,
  onStatusChange
}) {

  const user = useAuthStore(
    (state) => state.user
  );

  const isAdmin = user?.role === "ADMIN";

  const menuRef = useRef(null);

  const portalMenuRef = useRef(null);

  const buttonRefs = useRef({});

  // The dropdown menu is rendered into document.body via a portal (see
  // below) instead of staying inside the table's DOM tree. It has to
  // escape the table entirely because .crm-table-scroll uses
  // overflow-x-auto for horizontal scrolling on narrow screens — any
  // overflow value other than "visible" clips absolutely-positioned
  // descendants that try to render outside that box, regardless of
  // z-index. Portaling to <body> and positioning with fixed coordinates
  // (from the trigger button's getBoundingClientRect()) sidesteps that
  // clipping entirely.
  const [menuPosition, setMenuPosition] = useState("down");
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });

  const MENU_WIDTH = 160; // matches w-40 below

  useLayoutEffect(() => {
    if (!openMenu) return;

    const button = buttonRefs.current[openMenu];

    if (!button) return;

    const rect = button.getBoundingClientRect();

    const menuHeight = 200; // approx dropdown height

    const spaceBelow = window.innerHeight - rect.bottom;

    const goUp = spaceBelow < menuHeight;

    setMenuPosition(goUp ? "up" : "down");

    // getBoundingClientRect() is viewport-relative, which is exactly
    // what "position: fixed" coordinates need — no scroll-offset math
    // required, and it stays correct even inside a scrolled table.
    setMenuCoords({
      top: goUp ? rect.top - 8 : rect.bottom + 8,
      // Right-align the menu under the button, clamped so it never
      // renders off the left edge of the viewport.
      left: Math.max(8, rect.right - MENU_WIDTH),
    });
  }, [openMenu]);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedTrigger =
        menuRef.current && menuRef.current.contains(event.target);

      // The dropdown itself now lives in a portal outside menuRef's DOM
      // subtree, so also check whether the click landed inside it —
      // otherwise every click on a menu item would look like an
      // "outside" click and close the menu before onClick fires.
      const clickedMenu =
        portalMenuRef.current &&
        portalMenuRef.current.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
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
            {tickets.map((ticket) => {

              const id = ticket.id;

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
                          ref={(el) => {
                            if (el) {
                              buttonRefs.current[id] = el;
                            }
                          }}
                          onClick={() =>  setOpenMenu(openMenu === id ? null : id)
                          }
                          className="rounded-lg p-2 transition hover:bg-gray-100"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenu === id &&
                          createPortal(
                            <div
                              ref={portalMenuRef}
                              style={{
                                position: "fixed",
                                top: menuCoords.top,
                                left: menuCoords.left,
                                width: MENU_WIDTH,
                                // When flipped "up", the menu should grow
                                // upward from its bottom edge rather than
                                // downward from top, so translate it fully
                                // above the computed anchor point.
                                transform:
                                  menuPosition === "up"
                                    ? "translateY(-100%)"
                                    : "none",
                              }}
                              className="z-[9999] rounded-xl border border-gray-200 bg-white shadow-xl"
                            >
                              <button
                                onClick={() => {
                                  handleView(ticket);
                                  setOpenMenu(null);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-100"
                              >
                                <Eye size={16} />
                                View
                              </button>

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
                            </div>,
                            document.body
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