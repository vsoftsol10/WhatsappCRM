import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
// import { useNavigate } from "react-router-dom";

function roleBadge(role) {
  switch ((role || "").toUpperCase()) {
    case "ADMIN":
      return "bg-red-100 text-red-700";

    case "USER":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function statusBadge(status) {
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";

    case "INACTIVE":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function EmployeeTable({
  employees,
  handleDelete,
  onEdit,
  onView,
}) {
  // const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(null);

  // ================= "ACTIONS" KEBAB MENU =================
  // Rendered via a portal into document.body instead of staying inside
  // the table's DOM tree, for the same reason as AuditLogTable.jsx's
  // three-dot menu: .crm-table-scroll uses overflow-x-auto for
  // horizontal scrolling, and any overflow value other than "visible"
  // clips absolutely-positioned descendants that try to render outside
  // that box, regardless of z-index. Portaling to <body> with fixed
  // coordinates (from the trigger button's getBoundingClientRect())
  // sidesteps that clipping entirely.
  const [menuDirection, setMenuDirection] = useState("down");

  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });

  const buttonRefs = useRef({});

  const portalMenuRef = useRef(null);

  const MENU_WIDTH = 176; // w-44

  // Estimated dropdown height (3 items x ~44px + a little padding).
  // Good enough for deciding "does it fit below the button" without
  // needing to render the menu first just to measure it.
  const MENU_HEIGHT_ESTIMATE = 150;

  useLayoutEffect(() => {
    if (!openMenu) return;

    const button = buttonRefs.current[openMenu];

    if (!button) return;

    const rect = button.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;

    const goUp = spaceBelow < MENU_HEIGHT_ESTIMATE;

    setMenuDirection(goUp ? "up" : "down");

    setMenuCoords({
      top: goUp ? rect.top - 8 : rect.bottom + 8,
      left: Math.max(8, rect.right - MENU_WIDTH),
    });
  }, [openMenu]);

  const handleToggleMenu = (employeeId) => {
    setOpenMenu((prev) => (prev === employeeId ? null : employeeId));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedTrigger =
        buttonRefs.current[openMenu] &&
        buttonRefs.current[openMenu].contains(event.target);

      const clickedMenu =
        portalMenuRef.current && portalMenuRef.current.contains(event.target);

      if (!clickedTrigger && !clickedMenu) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  if (!employees || employees.length === 0) {
    return (
      <div className="crm-page-surface p-8 text-center text-gray-500 sm:p-10">
        No employees found
      </div>
    );
  }

  return (
    <div className="crm-table-shell overflow-visible">
      <div className="crm-table-scroll">
      <table className="w-full min-w-[980px]">

        {/* Header */}

        <thead className="bg-[#25D366] text-black">
          <tr>
            <th className="crm-th min-w-[240px]">
              Employee
            </th>

            <th className="crm-th">
              Phone
            </th>

            <th className="crm-th">
              Department
            </th>

            <th className="crm-th">
              Designation
            </th>

            <th className="crm-th">
              Status
            </th>

            <th className="crm-th">
              Role
            </th>

            <th className="crm-th text-center">
              Actions
            </th>
          </tr>
        </thead>

        {/* Body */}

        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="border-b border-gray-100 last:border-b-0 hover:bg-[#DCF8C6] transition"
            >
              {/* Employee */}

              <td className="crm-td">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#25D366] text-black flex items-center justify-center font-bold">
                    {employee.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800">
                      {employee.name}
                    </div>

                    <div className="break-all text-xs text-gray-500">
                      {employee.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Phone */}

              <td className="crm-td">
                {employee.phone || "-"}
              </td>

              {/* Department */}

              <td className="crm-td">
                {employee.department || "-"}
              </td>

              {/* Designation */}

              <td className="crm-td">
                {employee.designation || "-"}
              </td>

              {/* Status */}

              <td className="crm-td">
                <span
                  className={`crm-badge ${statusBadge(
                    employee.status
                  )}`}
                >
                  {employee.status}
                </span>
              </td>

              {/* Role */}

              <td className="crm-td">
                <span
                  className={`crm-badge ${roleBadge(
                    employee.role
                  )}`}
                >
                  {employee.role}
                </span>
              </td>

              {/* Actions */}

              <td className="crm-td">
                <div className="relative flex justify-center">
                  <button
                    ref={(el) => {
                      buttonRefs.current[employee.id] = el;
                    }}
                    onClick={() => handleToggleMenu(employee.id)}
                    className="rounded-lg p-2 hover:bg-gray-100 transition"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === employee.id &&
                    createPortal(
                      <div
                        ref={portalMenuRef}
                        style={{
                          position: "fixed",
                          top: menuCoords.top,
                          left: menuCoords.left,
                          width: MENU_WIDTH,
                          transform:
                            menuDirection === "up"
                              ? "translateY(-100%)"
                              : "none",
                        }}
                        className="z-[9999] rounded-xl border border-gray-200 bg-white shadow-xl"
                      >
                        <button
                          onClick={() => {
                            onView?.(employee.id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition"
                        >
                          <Eye size={16} />
                          View
                        </button>

                        <button
                          onClick={() => {
                            onEdit?.(employee.id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            handleDelete(employee.id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 size={16} />
                          Delete
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
  );
}