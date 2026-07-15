import axios from "axios";

const API_URL = "http://localhost:5000/api/conversations";

// GET ALL CONVERSATIONS
export const getConversations = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// GET CONVERSATION BY ID
export const getConversationById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// CREATE CONVERSATION
export const createConversation = async (conversationData) => {
  const response = await axios.post(API_URL, conversationData);
  return response.data;
};

// UPDATE CONVERSATION STATUS
export const updateConversationStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}`, {
    status,
  });

  return response.data;
};

// MARK AS READ
export const markConversationAsRead = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/read`
  );

  return response.data;
};

// DELETE CONVERSATION
export const deleteConversation = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};