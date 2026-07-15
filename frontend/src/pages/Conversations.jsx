import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "../components/conversation/Sidebar";
import ChatHeader from "../components/conversation/ChatHeader";
import MessageList from "../components/conversation/MessageList";
import MessageInput from "../components/conversation/MessageInput";
import CustomerDetails from "../components/conversation/CustomerDetails";

import useConversationStore from "../store/conversationStore";
import useMessageStore from "../store/messageStore";

function Conversations() {

  const location = useLocation();

  const customerId = location.state?.customerId;

  // Conversation Store
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    fetchConversations,
    markAsRead,
    addConversation,
  } = useConversationStore();

  // Message Store
  const {
    messages,
    fetchMessages,
    addMessage,
  } = useMessageStore();

  // Load conversations when page opens
  useEffect(() => {
    fetchConversations();
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
    }
  };

  openCustomerConversation();
}, [customerId]);

  // Load messages whenever a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Send message
  const handleSendMessage = async (content) => {
    if (!selectedConversation) return;

    await addMessage({
      conversationId: selectedConversation.id,
      content,
      sender: "AGENT",
      messageType: "TEXT",
      status: "SENT",
    });

    await fetchMessages(selectedConversation.id);

    await fetchConversations();
  };

  return (
    <div className="h-screen flex bg-white">

      {/* Left Sidebar */}
      <div className="w-[350px] border-r bg-white">
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-[#f7f7f7]">

        {/* Chat Header */}
        <ChatHeader
          selectedConversation={selectedConversation}
        />

        {/* Messages */}
        <div className="flex-1">
          <MessageList
            messages={messages}
          />
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
        />

      </div>

      {/* Customer Details */}
      <div className="w-[320px] border-l bg-white">
        <CustomerDetails
          customer={selectedConversation}
        />
      </div>

    </div>
  );
}

export default Conversations;