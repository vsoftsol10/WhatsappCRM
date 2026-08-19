import { useEffect, useState } from "react";
import { getAuditLogs } from "../api/auditLogApi";
import Pagination from "../components/common/Pagination";

const ENTITY_TYPES = [
  { key: "ALL", label: "All Records" },
  { key: "Customer", label: "Customers" },
  { key: "Employee", label: "Employees" },
];

const ACTION_LABELS = {
  EMPLOYEE_CREATED: "Employee created",
  EMPLOYEE_UPDATED: "Employee updated",
  EMPLOYEE_DELETED: "Employee deleted",
  CUSTOMER_CREATED: "Customer created",
  CUSTOMER_UPDATED: "Customer updated",
  CUSTOMER_DELETED: "Customer deleted",
};

// Same green/red/blue badge scheme used for status pills across the
// rest of the app (see crm-badge usage in Customers.jsx, EmployeeTable.jsx).
function actionBadgeClass(action) {
  if (action?.endsWith("_CREATED")) return "bg-green-100 text-green-700";
  if (action?.endsWith("_UPDATED")) return "bg-blue-100 text-blue-700";
  if (action?.endsWith("_DELETED")) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [entityType, setEntityType] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await getAuditLogs(
          currentPage,
          itemsPerPage,
          entityType === "ALL" ? "" : entityType
        );

        setLogs(data.logs || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.total || 0);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage, entityType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [entityType]);

  return (
    <div className="crm-page space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="crm-title">
            Audit Log
          </h1>

          <p className="crm-subtitle">
            A record of who created, updated, or deleted employees and
            customers.
          </p>
        </div>
      </div>

      {/* ================= FILTER CHIPS ================= */}

      <div className="flex flex-wrap gap-3 lg:justify-end">
        {ENTITY_TYPES.map((type) => {
          const isActive = entityType === type.key;

          return (
            <button
              key={type.key}
              type="button"
              onClick={() => setEntityType(type.key)}
              className={`
                rounded-xl
                border
                px-5
                py-2.5
                text-sm
                font-semibold
                transition-all
                ${
                  isActive
                    ? "border-[#25D366] bg-[#25D366] text-black shadow-md"
                    : "border-gray-300 bg-white text-slate-700 hover:bg-[#DCF8C6] hover:border-[#25D366]"
                }
              `}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      {/* ================= CONTENT ================= */}

      {loading ? (
        <div className="crm-page-surface p-8 text-center sm:p-16">
          <p className="text-gray-500 text-lg">
            Loading audit log...
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="crm-page-surface p-8 text-center sm:p-16">
          <h3 className="text-xl font-semibold text-gray-700">
            No Activity Recorded Yet
          </h3>

          <p className="text-gray-500 mt-2">
            Actions on customers and employees will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="crm-table-shell">
            <div className="crm-table-scroll">
              <table className="min-w-full">
                <thead className="bg-[#25D366] text-black">
                  <tr>
                    <th className="crm-th">When</th>
                    <th className="crm-th">Action</th>
                    <th className="crm-th">Details</th>
                    <th className="crm-th">By</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="crm-td whitespace-nowrap text-gray-500">
                        {formatDate(log.createdAt)}
                      </td>

                      <td className="crm-td">
                        <span
                          className={`crm-badge ${actionBadgeClass(log.action)}`}
                        >
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                      </td>

                      <td className="crm-td">
                        {log.details || "—"}
                      </td>

                      <td className="crm-td whitespace-nowrap font-medium">
                        {log.actor?.name || "System"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default AuditLogs;