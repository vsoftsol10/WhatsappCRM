const ACTION_LABELS = {
  EMPLOYEE_CREATED: "Employee created",
  EMPLOYEE_UPDATED: "Employee updated",
  EMPLOYEE_DELETED: "Employee deleted",
  CUSTOMER_CREATED: "Customer created",
  CUSTOMER_UPDATED: "Customer updated",
  CUSTOMER_DELETED: "Customer deleted",
};

function actionBadge(action) {
  const value = (action || "").toUpperCase();

  if (value.includes("CREATED")) {
    return "bg-green-100 text-green-700";
  }

  if (value.includes("UPDATED")) {
    return "bg-[#DCF8C6] text-[#128C7E]";
  }

  if (value.includes("DELETED")) {
    return "bg-red-100 text-red-700";
  }

  return "bg-gray-100 text-gray-700";
}

function entityBadge(entityType) {
  switch ((entityType || "").toLowerCase()) {
    case "employee":
      return "bg-blue-100 text-blue-700";
    case "customer":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDate(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AuditLogTable({ logs, loading }) {
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
    <div className="crm-table-shell overflow-visible">
      <div className="crm-table-scroll">
        <table className="w-full min-w-[760px]">
          {/* Header */}
          <thead className="bg-[#25D366] text-black">
            <tr>
              <th className="crm-th">When</th>
              <th className="crm-th min-w-[180px]">Action</th>
              <th className="crm-th">Entity</th>
              <th className="crm-th min-w-[220px]">Details</th>
              <th className="crm-th min-w-[180px]">By</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-gray-100 transition hover:bg-[#DCF8C6] last:border-b-0"
              >
                {/* When */}
                <td className="crm-td whitespace-nowrap text-slate-600">
                  {formatDate(log.createdAt)}
                </td>

                {/* Action */}
                <td className="crm-td">
                  <span
                    className={`crm-badge ${actionBadge(log.action)}`}
                  >
                    {ACTION_LABELS[log.action] || log.action}
                  </span>
                </td>

                {/* Entity */}
                <td className="crm-td">
                  <span
                    className={`crm-badge ${entityBadge(
                      log.entityType
                    )}`}
                  >
                    {log.entityType || "-"}
                  </span>
                </td>

                {/* Details */}
                <td className="crm-td">
                  <div className="break-words text-sm text-slate-600">
                    {log.details || "—"}
                  </div>
                </td>

                {/* By */}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLogTable;