import {
  MessageCircle,
  ChevronRight,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "John Doe",
    message: "Need pricing for bulk order.",
    time: "2 min ago",
    unread: 3,
    online: true,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    message: "Can you schedule a demo tomorrow?",
    time: "15 min ago",
    unread: 1,
    online: true,
  },
  {
    id: 3,
    name: "Michael",
    message: "Thank you for the quotation.",
    time: "1 hour ago",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "David",
    message: "I'll get back to you shortly.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "Emma",
    message: "Can I get the invoice?",
    time: "Yesterday",
    unread: 2,
    online: true,
  },
  {
    id: 6,
    name: "Kevin",
    message: "Interested in premium package.",
    time: "2 days ago",
    unread: 0,
    online: false,
  },
  {
    id: 7,
    name: "Sophia",
    message: "Please send product catalogue.",
    time: "2 days ago",
    unread: 4,
    online: true,
  },
  {
    id: 8,
    name: "Alex",
    message: "Payment has been completed.",
    time: "3 days ago",
    unread: 0,
    online: false,
  },
];

export default function RecentConversations() {
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

        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition">
          View All
          <ChevronRight size={16} />
        </button>

      </div>

      {/* Conversation List */}
      <div className="space-y-4">

        {conversations.slice(0, 5).map((chat) => (

          <div
            key={chat.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all duration-300 hover:border-blue-200 hover:bg-white hover:shadow-md"
          >

            {/* Left */}
            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  {chat.name.charAt(0)}
                </div>

                {chat.online && (
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#DCF8C6]0"></span>
                )}

              </div>

              {/* Name + Message */}
              <div>

                <div className="flex items-center gap-2">

                  <h3 className="font-semibold text-gray-900">
                    {chat.name}
                  </h3>

                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {chat.message}
                </p>

              </div>

            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-2">

              <span className="text-xs text-gray-400">
                {chat.time}
              </span>

              {chat.unread > 0 ? (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-bold text-white">
                  {chat.unread}
                </span>
              ) : (
                <MessageCircle
                  size={18}
                  className="text-gray-400"
                />
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}