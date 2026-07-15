import {
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";

function ConversationCard({
  conversation,
  isSelected,
  onSelect,
}) {
  // Prevent rendering if conversation is undefined
  if (!conversation) return null;

  const getStatusIcon = () => {
    switch (conversation?.messageStatus) {
      case "READ":
        return (
          <FaCheckDouble className="text-blue-500 text-xs" />
        );

      case "DELIVERED":
        return (
          <FaCheckDouble className="text-gray-400 text-xs" />
        );

      default:
        return (
          <FaCheck className="text-gray-400 text-xs" />
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(conversation)}
      className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-200 transition hover:bg-gray-100 ${
        isSelected ? "bg-green-100" : ""
      }`}
    >
      {/* Avatar */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-semibold text-lg">
        {conversation.customer?.name?.charAt(0)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 truncate">
            {conversation.customer?.name}
          </h3>

          <span className="text-xs text-gray-500">
            {new Date(conversation.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-1">
          {getStatusIcon()}

          <p className="text-sm text-gray-500 truncate">
            {conversation.lastMessage}
          </p>
        </div>
      </div>

      {conversation.unreadCount > 0 && (
        <div className="flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-green-500 text-white text-xs font-medium">
          {conversation.unreadCount}
        </div>
      )}
    </div>
  );
}

export default ConversationCard;