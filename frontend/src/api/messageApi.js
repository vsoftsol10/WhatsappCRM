import axios from "axios";

const API_URL = "http://localhost:5000/api/messages";

// SEND MESSAGE
export const sendMessage = async (messageData) => {
  const response = await axios.post(API_URL, messageData);
  return response.data;
};

// GET MESSAGES BY CONVERSATION ID
export const getMessagesByConversation = async (conversationId) => {
  const response = await axios.get(`${API_URL}/${conversationId}`);
  return response.data;
};

// DELETE MESSAGE
export const deleteMessage = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};