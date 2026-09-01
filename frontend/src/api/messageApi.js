import apiClient from "./apiClient";

// ===============================
// SEND MESSAGE
// ===============================
export const sendMessage = async (messageData) => {
  const response = await apiClient.post(
    "/api/messages",
    messageData
  );

  return response.data;
};

// ===============================
// GET MESSAGES BY CONVERSATION ID
// ===============================
export const getMessagesByConversation = async (
  conversationId
) => {
  const response = await apiClient.get(
    `/api/messages/${conversationId}`
  );

  return response.data;
};

// ===============================
// EDIT MESSAGE
// ===============================
export const editMessage = async (id, content) => {
  const response = await apiClient.put(
    `/api/messages/${id}`,
    { content }
  );

  return response.data;
};

// ===============================
// DELETE MESSAGE
// ===============================
export const deleteMessage = async (id) => {
  const response = await apiClient.delete(
    `/api/messages/${id}`
  );

  return response.data;
};

// Clears the "AI classification failed" review flag once an employee
// has manually handled that message (created a Lead, sent it to
// ERP-CRM, or decided no action was needed).
export const resolveMessageClassification = async (id) => {
  const response = await apiClient.patch(
    `/api/messages/${id}/resolve-classification`
  );

  return response.data;
};