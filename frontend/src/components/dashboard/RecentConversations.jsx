import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronRight } from "lucide-react";
import useConversationStore from "../../store/conversationStore";

// Turns an ISO timestamp into a short relative label like WhatsApp/Slack do
// ("2 min ago", "3 hr ago", "Yesterday", or a plain date once it's old).
const formatRelativeTime = (isoString) => {
  if (!isoString) return "";

  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return then.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export default function RecentConversations() {
  const navigate = useNavigate();

  const { conversations, loading, fetchConversations } =
    useConversationStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Backend already returns conversations sorted by updatedAt desc —
  // just take the 5 most recent for the dashboard preview.
  const recentChats = (conversations || []).slice(0, 5);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Recent Conversations
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Latest customer interactions
          </p>
        </div>

        <button
          onClick={() => navigate("/conversations")}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          View All
          <ChevronRight size={16} />
        </button>

      </div>

      {/* Conversation List */}
      <div className="space-y-4">

        {loading && recentChats.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6">
            Loading conversations...
          </p>
        )}

        {!loading && recentChats.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-6">
            No conversations yet.
          </p>
        )}

        {recentChats.map((chat) => {
          const customerName = chat.customer?.name || "Unknown";
          const lastMessage = chat.lastMessage || "No messages yet";

          return (
            <div
              key={chat.id}
              onClick={() =>
                navigate("/conversations", {
                  state: { customerId: chat.customer?.id },
                })
              }
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all duration-300 hover:border-blue-200 hover:bg-white hover:shadow-md cursor-pointer"
            >

              {/* Left */}
              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="relative">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                    {customerName.charAt(0).toUpperCase()}
                  </div>

                  {chat.status === "OPEN" && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></span>
                  )}

                </div>

                {/* Name + Message */}
                <div>

                  <div className="flex items-center gap-2">

                    <h3 className="font-semibold text-gray-900">
                      {customerName}
                    </h3>

                  </div>

                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                    {lastMessage}
                  </p>

                </div>

              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-2">

                <span className="text-xs text-gray-400">
                  {formatRelativeTime(chat.updatedAt)}
                </span>

                {chat.unreadCount > 0 ? (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-bold text-white">
                    {chat.unreadCount}
                  </span>
                ) : (
                  <MessageCircle
                    size={18}
                    className="text-gray-400"
                  />
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}