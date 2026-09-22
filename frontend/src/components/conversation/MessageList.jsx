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
//       <div className="flex h-full flex-1 items-center justify-center bg-[#efeae2] px-4">
//         <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
//           <p className="text-center text-sm text-gray-500">
//             No messages yet
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="
//         flex
//         h-full
//         flex-col
//         gap-2
//         overflow-y-auto
//         bg-[#efeae2]
//         px-2
//         py-3
//         sm:px-4
//         sm:py-6
//       "
//     >
//       {messages.map((message) => (
//         <MessageBubble
//           key={message.id}
//           message={message}
//         />
//       ))}

//       {/* Auto-scroll target */}
//       <div ref={bottomRef} />
//     </div>
//   );
// }

// export default MessageList;

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

// Groups messages by calendar day and returns a label the way WhatsApp
// does: "Today", "Yesterday", the weekday name for the last week, then
// "22 September" (with year added only if it's not this year) for
// anything older.
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getDateLabel = (dateInput) => {
  const messageDate = new Date(dateInput);

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(messageDate, today)) return "Today";
  if (isSameDay(messageDate, yesterday)) return "Yesterday";

  const diffDays = Math.floor(
    (new Date(today.toDateString()) - new Date(messageDate.toDateString())) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays > 1 && diffDays < 7) {
    return messageDate.toLocaleDateString([], { weekday: "long" });
  }

  const sameYear = messageDate.getFullYear() === today.getFullYear();

  return messageDate.toLocaleDateString([], {
    day: "numeric",
    month: "long",
    ...(sameYear ? {} : { year: "numeric" }),
  });
};

// A unique key per calendar day (independent of locale/label wording)
// so consecutive messages on the same day are grouped together even
// across "Today" rolling over into "Yesterday" while the chat stays
// open.
const getDayKey = (dateInput) => {
  const d = new Date(dateInput);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

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

  let lastDayKey = null;

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
      {messages.map((message) => {
        const dayKey = getDayKey(message.createdAt);
        const showDateSeparator = dayKey !== lastDayKey;
        lastDayKey = dayKey;

        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div className="sticky top-0 z-10 my-2 flex justify-center">
                <span className="rounded-lg bg-white/90 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm">
                  {getDateLabel(message.createdAt)}
                </span>
              </div>
            )}

            <MessageBubble message={message} />
          </div>
        );
      })}

      {/* Auto-scroll target */}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;