import { FaSearch } from "react-icons/fa";
import ConversationCard from "./ConversationCard";
import { useState } from "react";

function Sidebar({
   conversations = [],
   selectedConversation,
   setSelectedConversation,
}) {

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  // Search
  let filteredConversations = conversations.filter((conversation) =>
    conversation.customer?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Filter
  filteredConversations = filteredConversations.filter((conversation) => {
    if (filter === "ALL") return true;

    if (filter === "OPEN")
      return conversation.status === "OPEN";

    if (filter === "CLOSED")
      return conversation.status === "CLOSED";

    if (filter === "UNREAD")
      return conversation.unreadCount > 0;

    return true;
  });

  return (
    <div className="h-full flex flex-col bg-white">

      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">
          Conversations
        </h1>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg">
          <FaSearch className="text-gray-500" />

          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="bg-transparent outline-none flex-1"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 py-3 border-b">

        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "ALL"
              ? "bg-green-400 text-black"
              : "bg-gray-200"
          }`}
        >
          All
        </button>

        {/* <button
          onClick={() => setFilter("OPEN")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "OPEN"
              ? "bg-yellow-400 text-black"
              : "bg-gray-200"
          }`}
        >
          Open
        </button>

        <button
          onClick={() => setFilter("CLOSED")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "CLOSED"
              ? "bg-yellow-400 text-black"
              : "bg-gray-200"
          }`}
        >
          Closed
        </button> */}

        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === "UNREAD"
              ? "bg-green-400 text-black"
              : "bg-gray-200"
          }`}
        >
          Unread
        </button>

      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">

        {filteredConversations.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            conversation={conversation}
            isSelected={
              selectedConversation?.id === conversation.id
            }
            onSelect={setSelectedConversation}
          />
        ))}

      </div>

    </div>
  );
}

export default Sidebar;