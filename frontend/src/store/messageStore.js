import { create } from "zustand";
import toast from "react-hot-toast";
import {
  sendMessage,
  getMessagesByConversation,
  editMessage,
  deleteMessage,
} from "../api/messageApi";
import { connectSocket } from "../api/socket";

const useMessageStore = create((set, get) => ({
  messages: [],
  loading: false,
  currentConversationId: null,

  // GET MESSAGES
  fetchMessages: async (conversationId) => {
    try {
      set({ loading: true, currentConversationId: conversationId });

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

      const errData = error.response?.data;

      if (errData?.code === "WINDOW_CLOSED") {
        toast.error(
          "24-hour window closed for this customer — send a template instead."
        );
      } else {
        toast.error(errData?.message || "Failed to send message");
      }

      // Re-throw so the input component can also react (e.g. keep the
      // draft text instead of clearing it) if it wants to.
      throw error;
    }
  },

  // EDIT MESSAGE
  updateMessage: async (id, content) => {
    try {
      const result = await editMessage(id, content);

      set((state) => ({
        messages: state.messages.map((message) =>
          message.id === id ? result.data : message
        ),
      }));
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

  // CLEAR ALL MESSAGES (local state only — used after clearing chat on the server)
  clearMessages: () => {
    set({ messages: [], currentConversationId: null });
  },

  // SOCKET LISTENERS — call once from a mounted component (Conversations
  // page) and call the returned cleanup on unmount.
  initSocketListeners: () => {
    const socket = connectSocket();
    if (!socket) return () => {};

    const handleNewMessage = (message) => {
      const { currentConversationId, messages } = get();

      if (message.conversationId !== currentConversationId) return;

      // Dedupe — the agent who just sent it already has it from the
      // REST response, so ignore the socket echo of the same id.
      if (messages.some((m) => m.id === message.id)) return;

      set({ messages: [...messages, message] });
    };

    const handleStatusUpdate = ({ metaMessageId, status, failureReason }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.metaMessageId === metaMessageId
            ? { ...m, status: status ?? m.status, failureReason }
            : m
        ),
      }));
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:status", handleStatusUpdate);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:status", handleStatusUpdate);
    };
  },
}));

export default useMessageStore;