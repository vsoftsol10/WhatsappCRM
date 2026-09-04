// import { create } from "zustand";
// import {
//   getConversations,
//   getConversationById,
//   createConversation,
//   updateConversationStatus,
//   markConversationAsRead,
//   markConversationAsUnread,
//   clearConversationMessages,
//   deleteConversation,
// } from "../api/conversationApi";
// import { connectSocket } from "../api/socket";

// const useConversationStore = create((set) => ({
//   conversations: [],
//   conversation: null,
//   loading: false,

//   // ADD THESE
//   selectedConversation: null,

//   setSelectedConversation: (conversation) => {
//     set({
//       selectedConversation: conversation,
//     });
//   },


//   // GET ALL CONVERSATIONS
//   fetchConversations: async () => {
//     try {
//       set({ loading: true });

//       const data = await getConversations();

//       console.log("API Response:", data);
//       console.log("Conversations:", data.conversations);

//       set({
//         conversations: data.conversations,
//         loading: false,
//       });
//     } catch (error) {
//       console.error(error);
//       set({ loading: false });
//     }
//   },

//   // GET CONVERSATION BY ID
//   fetchConversationById: async (id) => {
//     try {
//       set({ loading: true });

//       const data = await getConversationById(id);

//       set({
//         conversation: data.conversation,
//         loading: false,
//       });
//     } catch (error) {
//       console.error(error);
//       set({ loading: false });
//     }
//   },

//   // CREATE CONVERSATION
//   addConversation: async (conversationData) => {
//     try {
//       const data = await createConversation(conversationData);

//       // set((state) => ({
//       //   conversations: [...state.conversations, data.conversation],
//       //}));
//       return data.conversation;
//     } catch (error) {
//       console.error(error);
//     }
//   },

//   // UPDATE STATUS
//   editConversationStatus: async (id, status) => {
//     try {
//       await updateConversationStatus(id, status);

//       set((state) => ({
//         conversations: state.conversations.map((conversation) =>
//           conversation.id === id
//             ? { ...conversation, status }
//             : conversation
//         ),
//       }));
//     } catch (error) {
//       console.error(error);
//     }
//   },

//   // MARK AS READ
//   markAsRead: async (id) => {
//     try {
//       await markConversationAsRead(id);

//       set((state) => ({
//         conversations: state.conversations.map((conversation) =>
//           conversation.id === id
//             ? {
//                 ...conversation,
//                 unreadCount: 0,
//               }
//             : conversation
//         ),
//       }));
//     } catch (error) {
//       console.error(error);
//     }
//   },

//   // MARK AS UNREAD
//   markAsUnread: async (id) => {
//     try {
//       await markConversationAsUnread(id);

//       set((state) => ({
//         conversations: state.conversations.map((conversation) =>
//           conversation.id === id
//             ? {
//                 ...conversation,
//                 unreadCount: 1,
//               }
//             : conversation
//         ),
//       }));
//     } catch (error) {
//       console.error(error);
//     }
//   },

//   // CLEAR CHAT
//   clearChat: async (id) => {
//     try {
//       await clearConversationMessages(id);

//       set((state) => ({
//         conversations: state.conversations.map((conversation) =>
//           conversation.id === id
//             ? { ...conversation, lastMessage: "" }
//             : conversation
//         ),
//       }));
//     } catch (error) {
//       console.error(error);
//     }
//   },

//   // DELETE
//   removeConversation: async (id) => {
//     try {
//       await deleteConversation(id);

//       set((state) => ({
//         conversations: state.conversations.filter(
//           (conversation) => conversation.id !== id
//         ),
//       }));
//     } catch (error) {
//       console.error(error);
//     }
//   },

//   // SOCKET LISTENERS — call once from a mounted component (Conversations
//   // page) and call the returned cleanup on unmount. Keeps the sidebar's
//   // lastMessage/unreadCount live across every connected agent.
//   initSocketListeners: () => {
//     const socket = connectSocket();
//     if (!socket) return () => {};

//     const handleConversationUpdate = (updatedConversation) => {
//       set((state) => {
//         const exists = state.conversations.some(
//           (c) => c.id === updatedConversation.id
//         );

//         const conversations = exists
//           ? state.conversations.map((c) =>
//               c.id === updatedConversation.id
//                 ? { ...c, ...updatedConversation }
//                 : c
//             )
//           : [updatedConversation, ...state.conversations];

//         return { conversations };
//       });
//     };

//     socket.on("conversation:update", handleConversationUpdate);

//     return () => {
//       socket.off("conversation:update", handleConversationUpdate);
//     };
//   },
// }));

// export default useConversationStore;

import { create } from "zustand";
import {
  getConversations,
  getConversationById,
  createConversation,
  updateConversationStatus,
  markConversationAsRead,
  markConversationAsUnread,
  clearConversationMessages,
  deleteConversation,
  toggleConversationBot,
} from "../api/conversationApi";
import { connectSocket } from "../api/socket";

const useConversationStore = create((set) => ({
  conversations: [],
  conversation: null,
  loading: false,

  // ADD THESE
  selectedConversation: null,

  setSelectedConversation: (conversation) => {
    set({
      selectedConversation: conversation,
    });
  },


  // GET ALL CONVERSATIONS
  fetchConversations: async () => {
    try {
      set({ loading: true });

      const data = await getConversations();

      console.log("API Response:", data);
      console.log("Conversations:", data.conversations);

      set({
        conversations: data.conversations,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  // GET CONVERSATION BY ID
  fetchConversationById: async (id) => {
    try {
      set({ loading: true });

      const data = await getConversationById(id);

      set({
        conversation: data.conversation,
        loading: false,
      });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  // CREATE CONVERSATION
  addConversation: async (conversationData) => {
    try {
      const data = await createConversation(conversationData);

      // set((state) => ({
      //   conversations: [...state.conversations, data.conversation],
      //}));
      return data.conversation;
    } catch (error) {
      console.error(error);
    }
  },

  // UPDATE STATUS
  editConversationStatus: async (id, status) => {
    try {
      await updateConversationStatus(id, status);

      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === id
            ? { ...conversation, status }
            : conversation
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // MARK AS READ
  markAsRead: async (id) => {
    try {
      await markConversationAsRead(id);

      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === id
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // MARK AS UNREAD
  markAsUnread: async (id) => {
    try {
      await markConversationAsUnread(id);

      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === id
            ? {
                ...conversation,
                unreadCount: 1,
              }
            : conversation
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // CLEAR CHAT
  clearChat: async (id) => {
    try {
      await clearConversationMessages(id);

      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === id
            ? { ...conversation, lastMessage: "" }
            : conversation
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // TOGGLE BOT (Grok Auto-Reply) FOR ONE CONVERSATION
  toggleBot: async (id) => {
    try {
      const data = await toggleConversationBot(id);
      const updated = data.conversation;

      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === id
            ? { ...conversation, botEnabled: updated.botEnabled }
            : conversation
        ),
        selectedConversation:
          state.selectedConversation?.id === id
            ? { ...state.selectedConversation, botEnabled: updated.botEnabled }
            : state.selectedConversation,
      }));

      return updated;
    } catch (error) {
      console.error(error);
    }
  },

  // DELETE
  removeConversation: async (id) => {
    try {
      await deleteConversation(id);

      set((state) => ({
        conversations: state.conversations.filter(
          (conversation) => conversation.id !== id
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // SOCKET LISTENERS — call once from a mounted component (Conversations
  // page) and call the returned cleanup on unmount. Keeps the sidebar's
  // lastMessage/unreadCount live across every connected agent.
  initSocketListeners: () => {
    const socket = connectSocket();
    if (!socket) return () => {};

    const handleConversationUpdate = (updatedConversation) => {
      set((state) => {
        const exists = state.conversations.some(
          (c) => c.id === updatedConversation.id
        );

        const conversations = exists
          ? state.conversations.map((c) =>
              c.id === updatedConversation.id
                ? { ...c, ...updatedConversation }
                : c
            )
          : [updatedConversation, ...state.conversations];

        const selectedConversation =
          state.selectedConversation?.id === updatedConversation.id
            ? { ...state.selectedConversation, ...updatedConversation }
            : state.selectedConversation;

        return { conversations, selectedConversation };
      });
    };

    socket.on("conversation:update", handleConversationUpdate);

    return () => {
      socket.off("conversation:update", handleConversationUpdate);
    };
  },
}));

export default useConversationStore;