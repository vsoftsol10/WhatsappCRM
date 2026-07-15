import { create } from "zustand";
import {
  sendMessage,
  getMessagesByConversation,
  deleteMessage,
} from "../api/messageApi";

const useMessageStore = create((set) => ({
  messages: [],
  loading: false,

  // GET MESSAGES
  fetchMessages: async (conversationId) => {
    try {
      set({ loading: true });

      const data = await getMessagesByConversation(conversationId);

      set({
        messages: data.messages,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  // SEND MESSAGE
  addMessage: async (messageData) => {
    try {
      await sendMessage(messageData);
    } catch (error) {
      console.error(error);
    }
  },

  // DELETE MESSAGE
  removeMessage: async (id) => {
    try {
      await deleteMessage(id);

      set((state) => ({
        messages: state.messages.filter(
          (message) => message.id !== id
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useMessageStore;