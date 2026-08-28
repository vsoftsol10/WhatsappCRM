import { useEffect, useState, useCallback } from "react";
import { getAuditLogs, getAuditLogStats } from "../api/auditLogApi";
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
  const [action, setAction] = useState("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
  });

  const itemsPerPage = 20;

  // ===========================
  // DEBOUNCE SEARCH INPUT
  // ===========================
  // Waits 400ms after the user stops typing before actually
  // triggering a fetch — avoids firing a request on every keystroke.

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ===========================
  // FETCH LOGS
  // ===========================

  const fetchLogs = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getAuditLogs(
        currentPage,
        itemsPerPage,
        entityType === "ALL" ? "" : entityType,
        action === "ALL" ? "" : action,
        debouncedSearch
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
  }, [currentPage, entityType, action, debouncedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [entityType, action, debouncedSearch]);

  // ===========================
  // FETCH STATS (unfiltered snapshot, independent of table filters)
  // ===========================

  const fetchStats = useCallback(async () => {
    try {
      const response = await getAuditLogStats();

      setStats({
        total: response.data?.total || 0,
        today: response.data?.today || 0,
        thisWeek: response.data?.thisWeek || 0,
      });
    } catch (error) {
      console.error("Failed to fetch audit log stats:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  // ===========================
  // REFRESH
  // ===========================

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchLogs(), fetchStats()]);
    setRefreshing(false);
  };

  // ===========================
  // RETURN
  // ===========================

  return (
    <div className="crm-page">
      <AuditLogHeader onRefresh={handleRefresh} refreshing={refreshing} />

      <AuditLogStats stats={stats} />

      <div className="mb-6">
        <AuditLogFilters
          search={search}
          onSearchChange={setSearch}
          action={action}
          onActionChange={setAction}
          entityType={entityType}
          onEntityTypeChange={setEntityType}
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