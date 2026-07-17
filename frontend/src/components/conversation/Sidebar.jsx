// import { FaSearch } from "react-icons/fa";
// import ConversationCard from "./ConversationCard";
// import { useState } from "react";

// function Sidebar({
//    conversations = [],
//    selectedConversation,
//    setSelectedConversation,
// }) {

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("ALL");

//   // Search
//   let filteredConversations = conversations.filter((conversation) =>
//     conversation.customer?.name
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   // Filter
//   filteredConversations = filteredConversations.filter((conversation) => {
//     if (filter === "ALL") return true;

//     if (filter === "OPEN")
//       return conversation.status === "OPEN";

//     if (filter === "CLOSED")
//       return conversation.status === "CLOSED";

//     if (filter === "UNREAD")
//       return conversation.unreadCount > 0;

//     return true;
//   });

//   return (
//     <div className="flex h-full min-w-0 flex-col bg-white">

//       {/* Header */}
//       <div className="border-b p-4">
//         <h1 className="text-xl font-bold sm:text-2xl">
//           Conversations
//         </h1>
//       </div>

//       {/* Search */}
//       <div className="border-b p-4">
//         <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg">
//           <FaSearch className="text-gray-500" />

//           <input
//             type="text"
//             placeholder="Search customers..."
//             value={searchTerm}
//             onChange={(e) =>
//               setSearchTerm(e.target.value)
//             }
//             className="min-w-0 flex-1 bg-transparent outline-none"
//           />
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-2 border-b px-4 py-3">

//         <button
//           onClick={() => setFilter("ALL")}
//           className={`px-4 py-2 rounded-full text-sm ${
//             filter === "ALL"
//               ? "bg-[#25D366] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           All
//         </button>

//         {/* <button
//           onClick={() => setFilter("OPEN")}
//           className={`px-4 py-2 rounded-full text-sm ${
//             filter === "OPEN"
//               ? "bg-[#25D366] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           Open
//         </button>

//         <button
//           onClick={() => setFilter("CLOSED")}
//           className={`px-4 py-2 rounded-full text-sm ${
//             filter === "CLOSED"
//               ? "bg-[#25D366] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           Closed
//         </button> */}

//         <button
//           onClick={() => setFilter("UNREAD")}
//           className={`px-4 py-2 rounded-full text-sm ${
//             filter === "UNREAD"
//               ? "bg-[#25D366] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           Unread
//         </button>

//       </div>

//       {/* Conversation List */}
//       <div className="flex-1 overflow-y-auto">

//         {filteredConversations.map((conversation) => (
//           <ConversationCard
//             key={conversation.id}
//             conversation={conversation}
//             isSelected={
//               selectedConversation?.id === conversation.id
//             }
//             onSelect={setSelectedConversation}
//           />
//         ))}

//       </div>

//     </div>
//   );
// }

// export default Sidebar;


import { useState } from "react";
import ConversationCard from "./ConversationCard";
import SearchBar from "./SearchBar";

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

    if (filter === "OPEN") {
      return conversation.status === "OPEN";
    }

    if (filter === "CLOSED") {
      return conversation.status === "CLOSED";
    }

    if (filter === "UNREAD") {
      return conversation.unreadCount > 0;
    }

    return true;
  });

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Conversations
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {filteredConversations.length} Conversation
          {filteredConversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 px-4 py-3">
        <button
          onClick={() => setFilter("ALL")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "ALL"
              ? "bg-[#25D366] text-white"
              : "bg-[#DCF8C6] text-[#128C7E] hover:bg-[#25D366] hover:text-white"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("UNREAD")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "UNREAD"
              ? "bg-[#25D366] text-white"
              : "bg-[#DCF8C6] text-[#128C7E] hover:bg-[#25D366] hover:text-white"
          }`}
        >
          Unread
        </button>
      </div>

      {/* Conversation List */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              isSelected={
                selectedConversation?.id === conversation.id
              }
              onSelect={setSelectedConversation}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center p-6">
            <p className="text-center text-sm text-gray-500">
              No conversations found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
