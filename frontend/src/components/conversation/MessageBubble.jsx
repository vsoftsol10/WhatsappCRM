import { FaCheck, FaCheckDouble } from "react-icons/fa";

function MessageBubble({ message }) {
  const isSender = message.sender === "USER";

  const renderStatusIcon = () => {
    switch (message.status) {
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
      className={`flex mb-3 ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-xl shadow-sm ${
          isSender
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        {/* Message Content */}
        <p className="break-words text-sm">
          {message.content}
        </p>

        {/* Time + Status */}
        <div
          className={`flex items-center gap-1 mt-1 text-xs ${
            isSender
              ? "justify-end text-gray-100"
              : "justify-end text-gray-500"
          }`}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isSender && renderStatusIcon()}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;