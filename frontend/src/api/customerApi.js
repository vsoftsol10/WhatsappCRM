import apiClient from "./apiClient";

export const getCustomers = async (
  status = "",
  search = "",
  page,
  limit,
  businessId,
) => {
  const response = await apiClient.get("/api/customers", {
    params: {
      status,
      search,
      ...(page ? { page, limit } : {}),
      ...(businessId ? { businessId } : {}),
    },
  });
  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await apiClient.get(`/api/customers/${id}`);
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await apiClient.post("/api/customers", customerData);
  return response.data;
};

export const updateCustomer = async (id, customerData) => {
  const response = await apiClient.put(`/api/customers/${id}`, customerData);
  return response.data;
};

export const deleteCustomer = async (id) => {
  const response = await apiClient.delete(`/api/customers/${id}`);
  return response.data;
};

// ================= BULK IMPORT =================

export const previewBulkImportCustomers = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post(
    "/api/customers/bulk-import/preview",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};

export const confirmBulkImportCustomers = async ({ toCreate, toUpdate, toLink, businessId }) => {
  const response = await apiClient.post(
    "/api/customers/bulk-import/confirm",
    { toCreate, toUpdate, toLink, businessId }
  );

  return response.data;
};