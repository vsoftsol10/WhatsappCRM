import { useEffect, useState, useCallback } from "react";
import { getAuditLogs } from "../api/auditLogApi";
import Pagination from "../components/common/Pagination";
import AuditLogHeader from "../components/auditlog/AuditLogHeader";
import AuditLogStats from "../components/auditlog/AuditLogStats";
import AuditLogFilters from "../components/auditlog/AuditLogFilters";
import AuditLogTable from "../components/auditlog/AuditLogTable";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [entityType, setEntityType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    employee: 0,
    customer: 0,
  });

  const itemsPerPage = 20;

  // ===========================
  // FETCH LOGS
  // ===========================

  const fetchLogs = useCallback(async () => {
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
  }, [currentPage, entityType]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [entityType]);

  // ===========================
  // FETCH STATS (unfiltered snapshot, independent of table filters)
  // ===========================

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [all, employee, customer] = await Promise.all([
          getAuditLogs(1, 1, ""),
          getAuditLogs(1, 1, "Employee"),
          getAuditLogs(1, 1, "Customer"),
        ]);

        setStats({
          total: all.pagination?.total || 0,
          employee: employee.pagination?.total || 0,
          customer: customer.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch audit log stats:", error);
      }
    };

    fetchStats();
  }, []);

  // ===========================
  // REFRESH
  // ===========================

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  // ===========================
  // RETURN
  // ===========================

  return (
    <div className="crm-page bg-slate-100">
      <AuditLogHeader onRefresh={handleRefresh} refreshing={refreshing} />

      <AuditLogStats stats={stats} />

      <div className="mb-6">
        <AuditLogFilters
          entityType={entityType}
          setEntityType={setEntityType}
        />
      </div>

      <AuditLogTable logs={logs} loading={loading} />

      {logs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default AuditLogs;