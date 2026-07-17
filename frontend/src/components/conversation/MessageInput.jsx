// import { useState } from "react";
// import { FaPaperPlane, FaSmile } from "react-icons/fa";

// function MessageInput({ onSendMessage }) {
//   const [message, setMessage] = useState("");

//   const handleSend = () => {
//     const trimmedMessage = message.trim();

//     if (!trimmedMessage) return;

//     onSendMessage(trimmedMessage);
//     setMessage("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-3 sm:gap-3 sm:px-4">
//       {/* Emoji Button */}
//       <button className="text-gray-500 hover:text-[#128C7E] transition">
//         <FaSmile size={20} />
//       </button>

//       {/* Input */}
//       <input
//         type="text"
//         placeholder="Type a message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//         className="min-w-0 flex-1 rounded-full bg-gray-100 px-4 py-2 outline-none focus:ring-2 focus:ring-[#DCF8C6]"
//       />

//       {/* Send Button */}
//       <button
//         onClick={handleSend}
//         className="rounded-full bg-[#25D366] p-3 text-black transition hover:bg-[#128C7E]"
//       >
//         <FaPaperPlane size={16} />
//       </button>
//     </div>
//   );
// }

// export default MessageInput;

import { useRef, useState } from "react";
import {
  FaPaperPlane,
  FaSmile,
  FaPaperclip,
  FaFileAlt,
  FaImage,
  FaVideo,
} from "react-icons/fa";

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const documentInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    onSendMessage(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log(`${type} selected:`, file);

    // Media upload implementation will be added later.

    setShowAttachmentMenu(false);
    e.target.value = "";
  };

  return (
    <div className="relative flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-3 sm:gap-3 sm:px-4">

      {/* Emoji */}
      <button className="text-gray-500 transition hover:text-[#128C7E]">
        <FaSmile size={20} />
      </button>

      {/* Attachment */}
      <button
        onClick={() => setShowAttachmentMenu((prev) => !prev)}
        className="text-gray-500 transition hover:text-[#128C7E]"
      >
        <FaPaperclip size={20} />
      </button>

      {/* Attachment Popup */}
      {showAttachmentMenu && (
        <div className="absolute bottom-16 left-12 z-50 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">

          <button
            onClick={() => documentInputRef.current?.click()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-gray-100"
          >
            <FaFileAlt className="text-[#128C7E]" />
            <span>Document</span>
          </button>

          <button
            onClick={() => imageInputRef.current?.click()}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-gray-100"
          >
            <FaImage className="text-[#128C7E]" />
            <span>Image</span>
          </button>

          <button
            onClick={() => videoInputRef.current?.click()}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-gray-100"
          >
            <FaVideo className="text-[#128C7E]" />
            <span>Video</span>
          </button>
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        ref={documentInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "Document")}
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "Image")}
      />

      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e, "Video")}
      />

      {/* Message Input */}
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-0 flex-1 rounded-full bg-gray-100 px-4 py-2 outline-none transition focus:ring-2 focus:ring-[#DCF8C6]"
      />

      {/* Send */}
      <button
        onClick={handleSend}
        className="rounded-full bg-[#25D366] p-3 text-white transition hover:bg-[#128C7E]"
      >
        <FaPaperPlane size={16} />
      </button>

    </div>
  );
}

export default MessageInput;
