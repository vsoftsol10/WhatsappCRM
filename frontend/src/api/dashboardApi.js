// src/api/dashboardApi.js

import apiClient from "./apiClient";

export const getDashboardStats = async () => {
  const response = await apiClient.get("/api/dashboard/stats");

  return response.data;
};