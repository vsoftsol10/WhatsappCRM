// import { FaCheck, FaCheckDouble } from "react-icons/fa";

// function MessageBubble({ message }) {
//   const isSender = message.sender === "USER";

//   const renderStatusIcon = () => {
//     switch (message.status) {
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
//     <div
//       className={`flex mb-3 ${
//         isSender ? "justify-end" : "justify-start"
//       }`}
//     >
//       <div
//         className={`max-w-[85%] rounded-xl px-4 py-2 shadow-sm sm:max-w-[70%] ${
//           isSender
//             ? "bg-[#25D366] text-black rounded-br-none"
//             : "bg-white text-gray-800 rounded-bl-none"
//         }`}
//       >
//         {/* Message Content */}
//         <p className="break-words text-sm">
//           {message.content}
//         </p>

//         {/* Time + Status */}
//         <div
//           className={`flex items-center gap-1 mt-1 text-xs ${
//             isSender
//               ? "justify-end text-gray-700"
//               : "justify-end text-gray-500"
//           }`}
//         >
//           <span>
//             {new Date(message.createdAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </span>

//           {isSender && renderStatusIcon()}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MessageBubble;

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
      className={`mb-2 flex ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-2 shadow-sm sm:max-w-[72%] ${
          isSender
            ? "rounded-br-md bg-[#DCF8C6] text-[#111827]"
            : "rounded-bl-md bg-white text-gray-800"
        }`}
      >
        {/* Message */}
        <p className="break-words text-sm leading-relaxed">
          {message.content}
        </p>

        {/* Time + Status */}
        <div
          className={`mt-1 flex items-center gap-1 text-[11px] ${
            isSender
              ? "justify-end text-[#6B7280]"
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
