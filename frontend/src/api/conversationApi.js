// import axios from "axios";

// const API_URL = "https://whatsappcrm-f1qj.onrender.com/api/conversations";

// // GET ALL CONVERSATIONS
// export const getConversations = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };

// // GET CONVERSATION BY ID
// export const getConversationById = async (id) => {
//   const response = await axios.get(`${API_URL}/${id}`);
//   return response.data;
// };

// // CREATE CONVERSATION
// export const createConversation = async (conversationData) => {
//   const response = await axios.post(API_URL, conversationData);
//   return response.data;
// };

// // UPDATE CONVERSATION STATUS
// export const updateConversationStatus = async (id, status) => {
//   const response = await axios.patch(`${API_URL}/${id}`, {
//     status,
//   });

//   return response.data;
// };

// // MARK AS READ
// export const markConversationAsRead = async (id) => {
//   const response = await axios.patch(
//     `${API_URL}/${id}/read`
//   );

//   return response.data;
// };

// // DELETE CONVERSATION
// export const deleteConversation = async (id) => {
//   const response = await axios.delete(`${API_URL}/${id}`);
//   return response.data;
// };

import apiClient from "./apiClient";

// ===============================
// GET ALL CONVERSATIONS
// ===============================
export const getConversations = async () => {
  const response = await apiClient.get("/api/conversations");
  return response.data;
};

// ===============================
// GET CONVERSATION BY ID
// ===============================
export const getConversationById = async (id) => {
  const response = await apiClient.get(
    `/api/conversations/${id}`
  );
  return response.data;
};

// ===============================
// CREATE CONVERSATION
// ===============================
export const createConversation = async (conversationData) => {
  const response = await apiClient.post(
    "/api/conversations",
    conversationData
  );
  return response.data;
};

// ===============================
// UPDATE CONVERSATION STATUS
// ===============================
export const updateConversationStatus = async (
  id,
  status
) => {
  const response = await apiClient.patch(
    `/api/conversations/${id}`,
    {
      status,
    }
  );

  return response.data;
};

// ===============================
// MARK CONVERSATION AS READ
// ===============================
export const markConversationAsRead = async (id) => {
  const response = await apiClient.patch(
    `/api/conversations/${id}/read`
  );

  return response.data;
};

// ===============================
// DELETE CONVERSATION
// ===============================
export const deleteConversation = async (id) => {
  const response = await apiClient.delete(
    `/api/conversations/${id}`
  );

  return response.data;
};