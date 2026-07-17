// import { FaPhoneAlt, FaVideo, FaEllipsisV } from "react-icons/fa";

// function ChatHeader({ selectedConversation }) {
//   if (!selectedConversation) {
//     return (
//       <div className="flex min-h-16 items-center border-b border-gray-200 bg-white px-4 sm:px-6">
//         <p className="text-gray-500">
//           Select a conversation
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4">
//       {/* Left Section */}
//       <div className="flex min-w-0 items-center gap-3">
//         {/* Avatar */}
//         <div className="relative">
//           <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-lg font-semibold text-black sm:h-12 sm:w-12">
//             {selectedConversation.customer?.name?.charAt(0)}
//           </div>

//           {selectedConversation.isOnline && (
//             <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-white rounded-full"></span>
//           )}
//         </div>

//         {/* Name + Status */}
//         <div className="min-w-0">
//           <h2 className="truncate font-semibold text-gray-800">
//             {selectedConversation.customer?.name}
//           </h2>

//           <p className="text-sm text-gray-500">
//             Online
//           </p>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="flex shrink-0 items-center gap-3 text-gray-600 sm:gap-6">
//         <button className="hover:text-[#128C7E] transition">
//           <FaPhoneAlt size={18} />
//         </button>

//         <button className="hover:text-[#128C7E] transition">
//           <FaVideo size={18} />
//         </button>

//         <button className="hover:text-[#128C7E] transition">
//           <FaEllipsisV size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatHeader;

import {
  FaPhoneAlt,
  FaVideo,
  FaEllipsisV,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";

function ChatHeader({
  selectedConversation,
  showChat,
  setShowChat,
  setShowCustomerDetails,
}) {
  if (!selectedConversation) {
    return (
      <div className="flex min-h-16 items-center border-b border-gray-200 bg-white px-4 sm:px-6">
        <p className="text-gray-500">
          Select a conversation
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4">
      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile Back Button */}
        <button
          onClick={() => setShowChat(false)}
          className="rounded-full p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
        >
          <FaArrowLeft size={18} />
        </button>

        {/* Avatar */}
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-lg font-semibold text-white sm:h-12 sm:w-12">
            {selectedConversation.customer?.name?.charAt(0)}
          </div>

          {selectedConversation.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#25D366]"></span>
          )}
        </div>

        {/* Name + Status */}
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-gray-800">
            {selectedConversation.customer?.name}
          </h2>

          <p className="text-sm font-medium text-[#25D366]">
            Online
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-4 text-gray-600">
        {/* Phone - Mobile */}
        <button
          className="transition hover:text-[#128C7E] lg:hidden"
        >
          <FaPhoneAlt size={18} />
        </button>

        {/* Customer Details - Mobile */}
        <button
          onClick={() => setShowCustomerDetails(true)}
          className="transition hover:text-[#128C7E] lg:hidden"
        >
          <FaInfoCircle size={18} />
        </button>

        {/* Desktop Icons */}
        <div className="hidden items-center gap-6 lg:flex">
          <button className="transition hover:text-[#128C7E]">
            <FaPhoneAlt size={18} />
          </button>

          <button className="transition hover:text-[#128C7E]">
            <FaVideo size={18} />
          </button>

          <button className="transition hover:text-[#128C7E]">
            <FaEllipsisV size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
