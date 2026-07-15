import { FaPhoneAlt, FaVideo, FaEllipsisV } from "react-icons/fa";

function ChatHeader({ selectedConversation }) {
  if (!selectedConversation) {
    return (
      <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-white">
        <p className="text-gray-500">
          Select a conversation
        </p>
      </div>
    );
  }

  return (
    <div className="h-16 px-4 border-b border-gray-200 bg-white flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-lg">
            {selectedConversation.customer?.name?.charAt(0)}
          </div>

          {selectedConversation.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* Name + Status */}
        <div>
          <h2 className="font-semibold text-gray-800">
            {selectedConversation.customer?.name}
          </h2>

          <p className="text-sm text-gray-500">
            Online
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 text-gray-600">
        <button className="hover:text-green-600 transition">
          <FaPhoneAlt size={18} />
        </button>

        <button className="hover:text-green-600 transition">
          <FaVideo size={18} />
        </button>

        <button className="hover:text-green-600 transition">
          <FaEllipsisV size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;