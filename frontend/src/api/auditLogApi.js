import apiClient from "./apiClient";

export const getAuditLogs = async (page = 1, limit = 20, entityType = "") => {
  const response = await apiClient.get("/api/audit-logs", {
    params: {
      page,
      limit,
      ...(entityType ? { entityType } : {}),
    },
  });
  return response.data;
};