// import { useEffect, useRef } from "react";
// import MessageBubble from "./MessageBubble";

// function MessageList({ messages }) {
//   const bottomRef = useRef(null);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages]);

//   if (!messages || messages.length === 0) {
//     return (
//       <div className="flex h-full flex-1 items-center justify-center bg-gray-50">
//         <p className="text-gray-500">
//           No messages yet
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-full flex-col gap-3 overflow-y-auto bg-[#efeae2] px-3 py-4 sm:px-4 sm:py-6">
//       {messages.map((message) => (
//         <MessageBubble
//           key={message.id}
//           message={message}
//         />
//       ))}

//       {/* Auto-scroll target */}
//       <div ref={bottomRef}></div>
//     </div>
//   );
// }

// export default MessageList;

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function MessageList({ messages }) {
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-[#efeae2] px-4">
        <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
          <p className="text-center text-sm text-gray-500">
            No messages yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        flex
        h-full
        flex-col
        gap-2
        overflow-y-auto
        bg-[#efeae2]
        px-2
        py-3
        sm:px-4
        sm:py-6
      "
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      {/* Auto-scroll target */}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;