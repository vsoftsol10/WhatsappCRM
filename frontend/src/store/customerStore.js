import { create } from "zustand";

const useCustomerStore = create((set) => ({
  customers: [],
  setCustomers: (customers) => set({ customers }),
}));

export default useCustomerStore;
