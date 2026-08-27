import apiClient from "./apiClient";

export const getAuditLogs = async (
  page = 1,
  limit = 20,
  entityType = "",
  action = "",
  search = ""
) => {
  const response = await apiClient.get("/api/audit-logs", {
    params: {
      page,
      limit,
      ...(entityType ? { entityType } : {}),
      ...(action ? { action } : {}),
      ...(search ? { search } : {}),
    },
  });
  return response.data;
};

export const getAuditLogStats = async () => {
  const response = await apiClient.get("/api/audit-logs/stats");
  return response.data;
};

export const getAuditLogActions = async () => {
  const response = await apiClient.get("/api/audit-logs/actions");
  return response.data;
};