// src/store/dashboardStore.js

import { create } from "zustand";
import { getDashboardStats } from "../api/dashboardApi";

const useDashboardStore = create((set) => ({
  dashboardStats: null,
  isLoading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await getDashboardStats();

      set({
        dashboardStats: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch dashboard statistics",
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useDashboardStore;