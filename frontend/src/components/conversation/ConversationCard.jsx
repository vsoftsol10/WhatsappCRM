// import {
//   FaCheck,
//   FaCheckDouble,
// } from "react-icons/fa";

// function ConversationCard({
//   conversation,
//   isSelected,
//   onSelect,
// }) {
//   if (!conversation) return null;

//   const getStatusIcon = () => {
//     switch (conversation?.messageStatus) {
//       case "READ":
//         return (
//           <FaCheckDouble className="text-blue-500 text-xs" />
//         );

//       case "DELIVERED":
//         return (
//           <FaCheckDouble className="text-gray-400 text-xs" />
//         );

//       default:
//         return (
//           <FaCheck className="text-gray-400 text-xs" />
//         );
//     }
//   };

//   return (
//     <button
//       type="button"
//       onClick={() => onSelect(conversation)}
//       className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition duration-200
//         ${
//           isSelected
//             ? "border-l-4 border-l-[#25D366] bg-[#DCF8C6]"
//             : "hover:bg-gray-50"
//         }`}
//     >
//       {/* Avatar */}
//       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-lg font-semibold text-white">
//         {(
//           conversation.customer?.name ||
//           conversation.phone ||
//           "?"
//         ).charAt(0)}
//       </div>

//       {/* Content */}
//       <div className="min-w-0 flex-1">
//         <div className="flex items-center justify-between gap-2">
//           <h3 className="truncate font-semibold text-gray-900">
//             {conversation.customer?.name || conversation.phone}
//           </h3>

//           <span className="shrink-0 text-xs text-gray-500">
//             {new Date(conversation.updatedAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </span>
//         </div>

//         <div className="mt-1 flex items-center gap-1">
//           {getStatusIcon()}

//           <p className="truncate text-sm text-gray-500">
//             {conversation.lastMessage || "No messages yet"}
//           </p>
//         </div>
//       </div>

//       {/* Unread Badge */}
//       {conversation.unreadCount > 0 && (
//         <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#25D366] px-2 text-xs font-semibold text-white">
//           {conversation.unreadCount}
//         </div>
//       )}
//     </button>
//   );
// }

// export default ConversationCard;


import {
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";

// WhatsApp-style relative label for the conversation list row: a clock
// time for today, "Yesterday", the weekday name for the last week, and
// a short date (with year only if it's not this year) beyond that.
const getConversationTimeLabel = (dateInput) => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isYesterday) return "Yesterday";

  const diffDays = Math.floor(
    (new Date(now.toDateString()) - new Date(date.toDateString())) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays > 1 && diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "long" });
  }

  const sameYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString(
    [],
    sameYear
      ? { day: "numeric", month: "short" }
      : { day: "numeric", month: "short", year: "numeric" }
  );
};

function ConversationCard({
  conversation,
  isSelected,
  onSelect,
}) {
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
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition duration-200
        ${
          isSelected
            ? "border-l-4 border-l-[#25D366] bg-[#DCF8C6]"
            : "hover:bg-gray-50"
        }`}
    >
      {/* Avatar */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-lg font-semibold text-white">
        {(
          conversation.customer?.name ||
          conversation.phone ||
          "?"
        ).charAt(0)}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-900">
            {conversation.customer?.name || conversation.phone}
          </h3>

          <span className="shrink-0 text-xs text-gray-500">
            {getConversationTimeLabel(conversation.updatedAt)}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1">
          {getStatusIcon()}

          <p className="truncate text-sm text-gray-500">
            {conversation.lastMessage || "No messages yet"}
          </p>
        </div>
      </div>

      {/* Unread Badge */}
      {conversation.unreadCount > 0 && (
        <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#25D366] px-2 text-xs font-semibold text-white">
          {conversation.unreadCount}
        </div>
      )}
    </button>
  );
}

export default ConversationCard;