import apiClient from "./apiClient";

// ================= GET ALL DEALS =================
export const getDeals = async () => {
  const response = await apiClient.get("/api/deals");

  return response.data;
};

// ================= GET SINGLE DEAL =================
export const getDealById = async (id) => {
  const response = await apiClient.get(`/api/deals/${id}`);

  return response.data;
};

// ================= CREATE DEAL =================
export const createDeal = async (dealData) => {
  const response = await apiClient.post(
    "/api/deals",
    dealData
  );

  return response.data;
};

// ================= UPDATE DEAL =================
export const updateDeal = async (
  id,
  dealData
) => {
  const response = await apiClient.put(
    `/api/deals/${id}`,
    dealData
  );

  return response.data;
};

// ================= UPDATE DEAL STAGE =================
export const updateDealStage = async (
  id,
  stage
) => {
  const response = await apiClient.patch(
    `/api/deals/${id}/stage`,
    {
      stage,
    }
  );

  return response.data;
};

// ================= DELETE DEAL =================
export const deleteDeal = async (id) => {
  const response = await apiClient.delete(
    `/api/deals/${id}`
  );

  return response.data;
};

// ================= GET DEAL ACTIVITIES =================
export const getDealActivities = async (dealId) => {
  const response = await apiClient.get(
    `/api/deals/${dealId}/activities`
  );

  return response.data;
};

// ================= CREATE DEAL ACTIVITY =================
export const createDealActivity = async (
  dealId,
  activityData
) => {
  const response = await apiClient.post(
    `/api/deals/${dealId}/activities`,
    activityData
  );

  return response.data;
};