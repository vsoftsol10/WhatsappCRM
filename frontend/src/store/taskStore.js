import { create } from "zustand";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../api/taskApi";

// 👉 ADD THIS IMPORT (you must create this API if not exists)
import { getEmployees } from "../api/employeeApi";

const useTaskStore = create((set) => ({
  tasks: [],
  selectedTask: null,

  // ✅ NEW
  employees: [],

  isLoading: false,
  error: null,

  // ================= FETCH EMPLOYEES =================
  fetchEmployees: async () => {
    try {
      const res = await getEmployees();

      console.log("Employee API:", res);

      set({
        employees: res.employees || [],
      });
    } catch (error) {
      console.error("Failed to fetch employees", error);

      set({
        employees: [],
      });
    }
  },
  // ================= FETCH ALL TASKS =================
  fetchTasks: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await getTasks();

      set({
        tasks: data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  // ================= FETCH ONE =================
  fetchTaskById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const data = await getTaskById(id);

      set({
        selectedTask: data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  // ================= CREATE =================
  addTask: async (taskData) => {
    set({ isLoading: true, error: null });

    try {
      const data = await createTask(taskData);

      set((state) => ({
        tasks: [data.data, ...state.tasks],
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ================= UPDATE =================
  editTask: async (id, taskData) => {
    set({ isLoading: true, error: null });

    try {
      const data = await updateTask(id, taskData);

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? data.data : task
        ),
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ================= UPDATE STATUS =================
  changeTaskStatus: async (id, status) => {
    set({ isLoading: true, error: null });

    try {
      const data = await updateTaskStatus(id, status);

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? data.data : task
        ),
        selectedTask:
          state.selectedTask?.id === id
            ? data.data
            : state.selectedTask,
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ================= DELETE =================
  removeTask: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await deleteTask(id);

      set((state) => ({
        tasks: state.tasks.filter(
          (task) => task.id !== id
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useTaskStore;