import { useEffect, useState } from "react";
import { getAuditLogs } from "../api/auditLogApi";
import Pagination from "../components/common/Pagination";

const ENTITY_TYPES = ["ALL", "Employee", "Customer"];

const ACTION_LABELS = {
  EMPLOYEE_CREATED: "Employee created",
  EMPLOYEE_UPDATED: "Employee updated",
  EMPLOYEE_DELETED: "Employee deleted",
  CUSTOMER_DELETED: "Customer deleted",
};

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
    <div className="crm-page">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Audit Log
          </h1>
          <p className="text-sm text-gray-500">
            A record of who created, updated, or deleted employees and
            customers.
          </p>
        </div>

        <select
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {ENTITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === "ALL" ? "All types" : type}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                When
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Action
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Details
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                By
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No activity recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">
                    {ACTION_LABELS[log.action] || log.action}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {log.details || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {log.actor?.name || "System"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AuditLogs;