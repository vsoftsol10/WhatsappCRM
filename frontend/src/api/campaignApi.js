// import apiClient from "./apiClient";

// // ================= GET ALL CAMPAIGNS =================
// export const getCampaigns = async () => {
//   const response = await apiClient.get(
//     "/api/campaigns"
//   );

//   return response.data;
// };

// // ================= GET SINGLE CAMPAIGN =================
// export const getCampaignById = async (id) => {
//   const response = await apiClient.get(
//     `/api/campaigns/${id}`
//   );

//   return response.data;
// };

// // ================= CREATE CAMPAIGN =================
// export const createCampaign = async (
//   campaignData
// ) => {
//   const response = await apiClient.post(
//     "/api/campaigns",
//     campaignData
//   );

//   return response.data;
// };

// // ================= UPDATE CAMPAIGN =================
// export const updateCampaign = async (
//   id,
//   campaignData
// ) => {
//   const response = await apiClient.put(
//     `/api/campaigns/${id}`,
//     campaignData
//   );

//   return response.data;
// };

// // ================= DELETE CAMPAIGN =================
// export const deleteCampaign = async (id) => {
//   const response = await apiClient.delete(
//     `/api/campaigns/${id}`
//   );

//   return response.data;
// };

import apiClient from "./apiClient";

// ===============================
// GET ALL CAMPAIGNS
// ===============================
export const getCampaigns = async () => {
  const response = await apiClient.get("/api/campaigns");
  return response.data;
};

// ===============================
// GET CAMPAIGN BY ID
// ===============================
export const getCampaignById = async (id) => {
  const response = await apiClient.get(`/api/campaigns/${id}`);
  return response.data;
};

// ===============================
// CREATE CAMPAIGN
// ===============================
export const createCampaign = async (campaignData) => {
  const response = await apiClient.post(
    "/api/campaigns",
    campaignData
  );

  return response.data;
};

// ===============================
// UPDATE CAMPAIGN
// ===============================
export const updateCampaign = async (
  id,
  campaignData
) => {
  const response = await apiClient.put(
    `/api/campaigns/${id}`,
    campaignData
  );

  return response.data;
};

// ===============================
// DELETE CAMPAIGN
// ===============================
export const deleteCampaign = async (id) => {
  const response = await apiClient.delete(
    `/api/campaigns/${id}`
  );

  return response.data;
};

// ===============================
// GENERATE AI CAMPAIGN
// ===============================
export const generateAICampaign = async (prompt) => {
  const response = await apiClient.post(
    "/api/campaigns/generate-ai",
    {
      prompt,
    }
  );

  return response.data;
};

// ===============================
// SEND CAMPAIGN TO CUSTOMERS
// ===============================
export const sendCampaign = async (
  campaignId,
  customerIds
) => {
  const response = await apiClient.post(
    "/api/campaigns/send",
    {
      campaignId,
      customerIds,
    }
  );

  return response.data;
};