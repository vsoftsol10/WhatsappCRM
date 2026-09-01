import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/conversation/Sidebar";
import ChatHeader from "../components/conversation/ChatHeader";
import MessageList from "../components/conversation/MessageList";
import MessageInput from "../components/conversation/MessageInput";
import CustomerDetails from "../components/conversation/CustomerDetails";
import AiReviewBanner from "../components/conversation/AiReviewBanner";

import useConversationStore from "../store/conversationStore";
import useMessageStore from "../store/messageStore";
import { connectSocket } from "../api/socket";

function Conversations() {
  const location = useLocation();

  const customerId = location.state?.customerId;

  // Mobile Navigation State
  const [showChat, setShowChat] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  // Locally dismissed "AI review" banners, keyed by message id — so
  // the banner disappears immediately on Dismiss/Resolve without
  // waiting for a full messages re-fetch.
  const [dismissedReviewIds, setDismissedReviewIds] = useState([]);

  // Conversation Store
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    fetchConversations,
    markAsRead,
    addConversation,
    initSocketListeners: initConversationSocketListeners,
  } = useConversationStore();

  // Message Store
  const {
    messages,
    fetchMessages,
    addMessage,
    initSocketListeners: initMessageSocketListeners,
  } = useMessageStore();

  // Load conversations when page opens
  useEffect(() => {
    fetchConversations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wire up real-time updates. Registered once on mount; cleaned up on
  // unmount so listeners don't pile up across navigations.
  useEffect(() => {
    const cleanupConversations = initConversationSocketListeners();
    const cleanupMessages = initMessageSocketListeners();

    return () => {
      cleanupConversations?.();
      cleanupMessages?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const openCustomerConversation = async () => {
      if (!customerId) return;

      await fetchConversations();

      const store = useConversationStore.getState();

      const existingConversation = store.conversations.find(
        (conversation) =>
          String(conversation.customerId) === String(customerId)
      );

      if (existingConversation) {
        setSelectedConversation(existingConversation);
        setShowChat(true);
        return;
      }

      const newConversation = await addConversation({
        customerId,
        status: "OPEN",
        channel: "WHATSAPP",
        unreadCount: 0,
        lastMessage: "",
      });

      if (newConversation) {
        setSelectedConversation(newConversation);
        setShowChat(true);
      }
    };

    openCustomerConversation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  // Load messages whenever a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);

      // Open chat on mobile after selecting a conversation
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowChat(true);

      // Join this conversation's room (useful for future features like
      // typing indicators scoped to just this chat).
      const socket = connectSocket();
      socket?.emit("conversation:join", selectedConversation.id);

      return () => {
        socket?.emit("conversation:leave", selectedConversation.id);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  // Send message
  const handleSendMessage = async (content) => {
    if (!selectedConversation) return;

    // No manual fetchMessages/fetchConversations here anymore — the
    // backend broadcasts message:new + conversation:update over the
    // socket to every connected agent (including this one), so the UI
    // updates itself once that event arrives.
        try {
      await addMessage({
        conversationId: selectedConversation.id,
        content,
        sender: "AGENT",
        messageType: "TEXT",
        status: "SENT",
      });
    } catch {
      // addMessage already shows a toast for this — nothing more to do here.
    }
  };
  
  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] flex-col bg-white xl:min-h-full xl:flex-row">

      {/* Left Sidebar */}
      <div
          className={`
            ${showChat ? "hidden" : "flex"}
            flex-1 min-h-0 bg-white
            xl:flex xl:w-[350px] xl:min-w-[300px]
            xl:flex-none xl:border-r
          `}
      >
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      </div>

      {/* Chat Section */}
      <div
        className={`
          ${showChat ? "flex" : "hidden"}
          min-h-[520px] min-w-0 flex-1 flex-col bg-[#f7f7f7]
          xl:flex xl:min-h-0
        `}
      >
        {/* Chat Header */}
        <ChatHeader
          selectedConversation={selectedConversation}
          showChat={showChat}
          setShowChat={setShowChat}
          setShowCustomerDetails={setShowCustomerDetails}
        />

        {/* AI Review Banner — shown when the latest inbound message's
            AI classification failed after all retries. Looks at the
            last CUSTOMER message only, since that's the one an
            employee would actually need to act on. */}
        {(() => {
          const lastCustomerMessage = [...messages]
            .reverse()
            .find((m) => m.sender === "CUSTOMER");

          const needsReview =
            lastCustomerMessage?.classificationStatus === "FAILED" &&
            !dismissedReviewIds.includes(lastCustomerMessage.id);

          if (!needsReview) return null;

          return (
            <AiReviewBanner
              message={lastCustomerMessage}
              conversation={selectedConversation}
              onResolved={(messageId) =>
                setDismissedReviewIds((prev) => [...prev, messageId])
              }
            />
          );
        })()}

        {/* Messages */}
        <div className="min-h-0 flex-1">
          <MessageList
            messages={messages}
          />
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!selectedConversation}
        />
      </div>

      {/* Customer Details */}
      <div className="hidden max-h-[320px] border-t bg-white xl:block xl:max-h-none xl:w-[320px] xl:min-w-[280px] xl:border-l xl:border-t-0">
        <CustomerDetails
          customer={selectedConversation}
          showCustomerDetails={showCustomerDetails}
          setShowCustomerDetails={setShowCustomerDetails}
        />
      </div>

    </div>
  );
}

export default Conversations;