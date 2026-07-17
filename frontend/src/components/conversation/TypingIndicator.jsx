// function TypingIndicator({ isTyping, customerName }) {
//   if (!isTyping) return null;

//   return (
//     <div className="px-4 py-2 bg-gray-50">
//       <div className="flex items-center gap-2 text-sm text-gray-500">
//         <span>{customerName} is typing</span>

//         {/* Animated dots */}
//         <div className="flex gap-1">
//           <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
//           <span
//             className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
//             style={{ animationDelay: "0.15s" }}
//           ></span>
//           <span
//             className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
//             style={{ animationDelay: "0.3s" }}
//           ></span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TypingIndicator;

function TypingIndicator({ isTyping, customerName }) {
  if (!isTyping) return null;

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-2">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-medium text-[#128C7E]">
          {customerName} is typing
        </span>

        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-[#25D366]"></span>

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#25D366]"
            style={{ animationDelay: "0.15s" }}
          ></span>

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#25D366]"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
