// import { useState, useRef, useEffect } from "react";
// import {
//   Calendar,
//   Users,
//   Megaphone,
//   MoreVertical,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function CampaignCard({
//   campaign,
//   onEdit,
//   onDelete,
//   onStatusChange,
// }) {
//   const [showMenu, setShowMenu] = useState(false);

//   const menuRef = useRef(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         menuRef.current &&
//         !menuRef.current.contains(event.target)
//       ) {
//         setShowMenu(false);
//       }
//     };

//     document.addEventListener(
//       "mousedown",
//       handleClickOutside
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//     };
//   }, []);

//   const handleStatusChange = (status) => {
//     if (onStatusChange) {
//       onStatusChange(campaign.id, status);
//     } else {
//       console.log(
//         "Campaign:",
//         campaign.id,
//         "Status:",
//         status
//       );
//     }

//     setShowMenu(false);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "DRAFT":
//         return "bg-gray-100 text-gray-700";

//       case "SCHEDULED":
//         return "bg-blue-100 text-blue-700";

//       case "SENDING":
//         return "bg-yellow-100 text-yellow-700";

//       case "COMPLETED":
//         return "bg-green-100 text-green-700";

//       case "FAILED":
//         return "bg-red-100 text-red-700";

//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const getTypeColor = (type) => {
//     switch (type) {
//       case "PROMOTIONAL":
//         return "bg-purple-100 text-purple-700";

//       case "BROADCAST":
//         return "bg-indigo-100 text-indigo-700";

//       case "FOLLOW_UP":
//         return "bg-orange-100 text-orange-700";

//       case "ANNOUNCEMENT":
//         return "bg-cyan-100 text-cyan-700";

//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
      
//       {/* HEADER */}

//       <div className="flex items-start justify-between">
//         <div>
//           <h3
//             onClick={() => navigate(`/campaigns/${campaign.id}`)}
//             className="text-lg font-semibold cursor-pointer hover:text-blue-600"
//           >
//             {campaign.name}
//           </h3>

//           <div className="flex gap-2 mt-2 flex-wrap">
//             <span
//               className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
//                 campaign.type
//               )}`}
//             >
//               {campaign.type}
//             </span>

//             <span
//               className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                 campaign.status
//               )}`}
//             >
//               {campaign.status}
//             </span>
//           </div>
//         </div>

//         {/* DROPDOWN MENU */}

//         <div
//           className="relative"
//           ref={menuRef}
//         >
//           <button
//             onClick={() =>
//               setShowMenu(!showMenu)
//             }
//             className="text-gray-500 hover:text-black"
//           >
//             <MoreVertical size={18} />
//           </button>

//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">

//               <button
//                 onClick={() => {
//                   navigate(`/campaigns/${campaign.id}`);
//                   setShowMenu(false);
//                 }}
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//               >
//                 View Details
//               </button>

//               <button
//                 onClick={() =>
//                   handleStatusChange(
//                     "SCHEDULED"
//                   )
//                 }
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//               >
//                 Scheduled
//               </button>

//               <button
//                 onClick={() =>
//                   handleStatusChange(
//                     "SENDING"
//                   )
//                 }
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//               >
//                 Sending
//               </button>

//               <button
//                 onClick={() =>
//                   handleStatusChange(
//                     "COMPLETED"
//                   )
//                 }
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//               >
//                 Completed
//               </button>

//               <button
//                 onClick={() =>
//                   handleStatusChange(
//                     "FAILED"
//                   )
//                 }
//                 className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//               >
//                 Failed
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MESSAGE */}

//       <div className="mt-4">
//         <p className="text-sm text-gray-600 line-clamp-3">
//           {campaign.messageContent}
//         </p>
//       </div>

//       {/* AUDIENCE */}

//       <div className="flex items-center gap-2 mt-5 text-gray-600">
//         <Users size={16} />

//         <span className="text-sm">
//           Audience: {campaign.audienceCount}
//         </span>
//       </div>

//       {/* SCHEDULE */}

//       <div className="flex items-center gap-2 mt-3 text-gray-600">
//         <Calendar size={16} />

//         <span className="text-sm">
//           {campaign.scheduledAt
//             ? new Date(
//                 campaign.scheduledAt
//               ).toLocaleString()
//             : "Not Scheduled"}
//         </span>
//       </div>

//       {/* FOOTER */}

//       <div className="flex justify-between items-center mt-6 pt-4 border-t">
//         <div className="flex items-center gap-2 text-gray-500">
//           <Megaphone size={16} />

//           <span className="text-xs">
//             Campaign
//           </span>
//         </div>

//         <div className="flex gap-2">

//           <button
//             onClick={() =>
//               onEdit?.(campaign)
//             }
//             className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
//           >
//             Edit
//           </button>

//           <button
//             onClick={() =>
//               onDelete?.(campaign.id)
//             }
//             className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  Calendar,
  Users,
  Megaphone,
  Eye,
  Send,
  Edit,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function CampaignCard({
  campaign,
  onView,
  onSend,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-700";

      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";

      case "SENDING":
        return "bg-yellow-100 text-yellow-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "PROMOTIONAL":
        return "bg-purple-100 text-purple-700";

      case "BROADCAST":
        return "bg-indigo-100 text-indigo-700";

      case "FOLLOW_UP":
        return "bg-orange-100 text-orange-700";

      case "ANNOUNCEMENT":
        return "bg-cyan-100 text-cyan-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow border hover:shadow-lg transition-all duration-300 p-5">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <h2
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
            className="text-lg font-semibold cursor-pointer hover:text-blue-600"
          >
            {campaign.name}
          </h2>

          <div className="flex gap-2 mt-3">

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                campaign.type
              )}`}
            >
              {campaign.type}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                campaign.status
              )}`}
            >
              {campaign.status}
            </span>

          </div>

        </div>

      </div>

      {/* Message Preview */}

      <div className="mt-5">

        <p className="text-gray-600 line-clamp-3">
          {campaign.messageContent}
        </p>

      </div>

      {/* Audience */}

      <div className="flex items-center gap-2 mt-5">

        <Users size={16} className="text-gray-500" />

        <span className="text-sm text-gray-700">
          Audience : {campaign.audienceCount || 0}
        </span>

      </div>

      {/* Schedule */}

      <div className="flex items-center gap-2 mt-3">

        <Calendar size={16} className="text-gray-500" />

        <span className="text-sm text-gray-700">

          {campaign.scheduledAt
            ? new Date(campaign.scheduledAt).toLocaleString()
            : "Not Scheduled"}

        </span>

      </div>

      {/* Footer */}

      <div className="border-t mt-6 pt-5">

        <div className="flex items-center gap-2 mb-4">

          <Megaphone size={16} />

          <span className="text-sm font-medium">
            Campaign Actions
          </span>

        </div>

        {/* Action Buttons */}

        <div className="grid grid-cols-2 gap-3">

          {/* View */}

          <button
            onClick={() => onView(campaign)}
            className="flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-blue-50 hover:border-blue-400 transition"
          >
            <Eye size={18} />

            View
          </button>

          {/* Send */}

          <button
            onClick={() => onSend(campaign)}
            className="flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-blue-50 hover:border-blue-400 transition"
          >
            <Send size={18} />

            Send
          </button>

          {/* Edit */}

          <button
            onClick={() => onEdit(campaign)}
            className="flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-yellow-50 hover:border-yellow-400 transition"
          >
            <Edit size={18} />

            Edit
          </button>

          {/* Delete */}

          <button
            onClick={() => onDelete(campaign.id)}
            className="flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-blue-50 hover:border-blue-400 transition"
          >
            <Trash2 size={18} />

            Delete
          </button>

        </div>

      </div>

    </div>
  );
}