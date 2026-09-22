import apiClient from "./apiClient";
export const getBusinesses = async (includeInactive = false) => (await apiClient.get("/api/businesses", { params: includeInactive ? { includeInactive: "true" } : {} })).data;
export const createBusiness = async (name) => (await apiClient.post("/api/businesses", { name })).data;
export const updateBusiness = async (id, data) => (await apiClient.put(`/api/businesses/${id}`, data)).data;