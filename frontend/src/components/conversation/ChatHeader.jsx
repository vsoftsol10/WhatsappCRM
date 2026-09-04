import { useState, useRef, useEffect } from "react";
import {
  FaEllipsisV,
  FaArrowLeft,
  FaInfoCircle,
  FaEnvelopeOpen,
  FaTrashAlt,
  FaCheckCircle,
  FaRedo,
  FaRobot,
} from "react-icons/fa";
import useConversationStore from "../../store/conversationStore";
import useMessageStore from "../../store/messageStore";
import ConfirmModal from "../common/ConfirmModal";

function ChatHeader({
  selectedConversation,
  setShowChat,
  setShowCustomerDetails,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showClearChatConfirm, setShowClearChatConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [toggling, setToggling] = useState(false);
  const menuRef = useRef(null);

  const markAsUnread = useConversationStore((state) => state.markAsUnread);
  const clearChat = useConversationStore((state) => state.clearChat);
  const editConversationStatus = useConversationStore(
    (state) => state.editConversationStatus
  );
  const toggleBot = useConversationStore((state) => state.toggleBot);
  const clearMessages = useMessageStore((state) => state.clearMessages);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!selectedConversation) {
    return (
      <div className="flex min-h-16 items-center border-b border-gray-200 bg-white px-4 sm:px-6">
        <p className="text-gray-500">
          Select a conversation
        </p>
      </div>
    );
  }

  const handleMarkUnread = () => {
    setShowMenu(false);
    markAsUnread(selectedConversation.id);
  };

  const handleClearChat = () => {
    setShowMenu(false);
    setShowClearChatConfirm(true);
  };

  const confirmClearChat = () => {
    setShowClearChatConfirm(false);
    clearChat(selectedConversation.id);
    clearMessages();
  };

  const isClosed = selectedConversation.status === "CLOSED";

  const handleCloseChat = () => {
    setShowMenu(false);
    setShowCloseConfirm(true);
  };

  const confirmCloseChat = () => {
    setShowCloseConfirm(false);
    editConversationStatus(selectedConversation.id, "CLOSED");
  };

  const handleReopenChat = () => {
    setShowMenu(false);
    editConversationStatus(selectedConversation.id, "OPEN");
  };

  // Treat undefined as ON (matches the schema default) so conversations
  // fetched before this feature shipped still show the correct state.
  const isBotOn = selectedConversation.botEnabled !== false;

  const handleToggleBot = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await toggleBot(selectedConversation.id);
    } finally {
      setToggling(false);
    }
  };

  return (
    <>
    <div className="flex min-h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4">
      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile Back Button */}
        <button
          onClick={() => setShowChat(false)}
          className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
        >
          <FaArrowLeft size={18} />
        </button>

        {/* Avatar */}
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-lg font-semibold text-white sm:h-12 sm:w-12">
            {(
              selectedConversation.customer?.name ||
              selectedConversation.phone ||
              "?"
            ).charAt(0)}
          </div>

          {selectedConversation.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#25D366]"></span>
          )}
        </div>

        {/* Name + Status */}
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-gray-800">
            {selectedConversation.customer?.name ||
              selectedConversation.phone}
          </h2>

          <div className="flex items-center gap-2">
            {selectedConversation.customer?.name &&
              selectedConversation.phone && (
                <span className="truncate text-sm text-gray-500">
                  {selectedConversation.phone}
                </span>
              )}

            {selectedConversation.status === "CLOSED" ? (
              <p className="text-sm font-medium text-red-500">
                Closed
              </p>
            ) : (
              <p className="text-sm font-medium text-[#25D366]">
                Open
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-4 text-gray-600">
        {/* Customer Details - Mobile */}
        <button
          onClick={() => setShowCustomerDetails(true)}
          className="transition hover:text-[#128C7E] lg:hidden"
        >
          <FaInfoCircle size={18} />
        </button>

        {/* Desktop Icons */}
        <div className="hidden items-center gap-6 lg:flex">
          {/* Bot ON/OFF pill â€” per-conversation Grok auto-reply switch */}
          <button
            onClick={handleToggleBot}
            disabled={toggling}
            title={
              isBotOn
                ? "Grok is auto-replying in this chat. Click to hand it over to you."
                : "Bot is off for this chat. Click to let Grok auto-reply again."
            }
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition disabled:opacity-60 ${
              isBotOn
                ? "border-[#25D366] bg-[#25D366]/10 text-[#128C7E]"
                : "border-gray-300 bg-gray-100 text-gray-500"
            }`}
          >
            <FaRobot size={12} />
            Bot {isBotOn ? "ON" : "OFF"}
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="transition hover:text-[#128C7E]"
            >
              <FaEllipsisV size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 z-50 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  onClick={handleMarkUnread}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaEnvelopeOpen size={13} />
                  Mark as Unread
                </button>

                <button
                  onClick={handleClearChat}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaTrashAlt size={13} />
                  Clear Chat
                </button>

                {isClosed ? (
                  <button
                    onClick={handleReopenChat}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaRedo size={13} />
                    Reopen Chat
                  </button>
                ) : (
                  <button
                    onClick={handleCloseChat}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaCheckCircle size={13} />
                    Close Chat
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      isOpen={showClearChatConfirm}
      title="Clear Chat"
      message="Clear all messages in this chat? This cannot be undone."
      confirmText="Clear"
      cancelText="Cancel"
      variant="danger"
      onConfirm={confirmClearChat}
      onCancel={() => setShowClearChatConfirm(false)}
    />

    <ConfirmModal
      isOpen={showCloseConfirm}
      title="Close Chat"
      message="Close this conversation with the customer? You can reopen it anytime from this same menu."
      confirmText="Close"
      cancelText="Cancel"
      variant="danger"
      onConfirm={confirmCloseChat}
      onCancel={() => setShowCloseConfirm(false)}
    />
    </>
  );
}

export default ChatHeader;