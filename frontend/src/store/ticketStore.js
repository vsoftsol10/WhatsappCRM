import { create } from "zustand";

import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  deleteTicket,
} from "../api/ticketApi";

import { getCustomers } from "../api/customerApi";
import { getEmployees } from "../api/employeeApi";

const useTicketStore = create((set) => ({
  tickets: [],
  selectedTicket: null,

  customers: [],
  employees: [],

  isLoading: false,
  error: null,

  // ================= FETCH CUSTOMERS =================
  fetchCustomers: async () => {
    try {
      const res = await getCustomers();

      set({
        customers: res.customers || [],
      });
    } catch (error) {
      console.error("Failed to fetch customers", error);

      set({
        customers: [],
      });
    }
  },

  // ================= FETCH EMPLOYEES =================
  fetchEmployees: async () => {
    try {
      const res = await getEmployees();

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

  // ================= FETCH ALL TICKETS =================
  fetchTickets: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getTickets();

      set({
        tickets: data.data,
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
  fetchTicketById: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getTicketById(id);

      set({
        selectedTicket: data.data,
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
  addTicket: async (ticketData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await createTicket(ticketData);

      set((state) => ({
        tickets: [data.data, ...state.tickets],
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
  editTicket: async (
    id,
    ticketData
  ) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await updateTicket(
        id,
        ticketData
      );

      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === id
            ? data.data
            : ticket
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
  changeTicketStatus: async (
    id,
    status
  ) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await updateTicketStatus(
        id,
        status
      );

      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === id
            ? data.data
            : ticket
        ),
        selectedTicket:
          state.selectedTicket?.id === id
            ? data.data
            : state.selectedTicket,
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
  removeTicket: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await deleteTicket(id);

      set((state) => ({
        tickets: state.tickets.filter(
          (ticket) => ticket.id !== id
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

  clearError: () =>
    set({
      error: null,
    }),
}));

export default useTicketStore;