import { useState } from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSendMessage(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-t border-gray-200">
      {/* Emoji Button */}
      <button className="text-gray-500 hover:text-green-500 transition">
        <FaSmile size={20} />
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 px-4 py-2 bg-gray-100 rounded-full outline-none"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
      >
        <FaPaperPlane size={16} />
      </button>
    </div>
  );
}

export default MessageInput;