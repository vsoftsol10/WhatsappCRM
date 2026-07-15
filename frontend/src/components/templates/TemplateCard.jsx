// import { useState, useRef, useEffect } from "react";
// import {
//   MoreVertical,
// } from "lucide-react";

// export default function TemplateCard({
//   template,
//   onEdit,
//   onDelete,
//   onStatusChange,
// }) {
//   const [showMenu, setShowMenu] = useState(false);

//   const menuRef = useRef(null);

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
//       onStatusChange(template.id, status);
//     } else {
//       console.log(
//         "Template:",
//         template.id,
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

//       case "ACTIVE":
//         return "bg-green-100 text-green-700";

//       case "INACTIVE":
//         return "bg-red-100 text-red-700";

//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">

//       {/* HEADER */}

//       <div className="flex items-start justify-between">
//         <div>
//           <h3 className="text-lg font-semibold">
//             {template.name}
//           </h3>

//           <div className="flex gap-2 mt-2 flex-wrap">
//             <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
//               {template.category}
//             </span>

//             <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
//               {template.messageType}
//             </span>

//             <span
//               className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                 template.status
//               )}`}
//             >
//               {template.status}
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
//                 onClick={() =>
//                   handleStatusChange(
//                     "ACTIVE"
//                   )
//                 }
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//               >
//                 Active
//               </button>

//               <button
//                 onClick={() =>
//                   handleStatusChange(
//                     "INACTIVE"
//                   )
//                 }
//                 className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//               >
//                 Inactive
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* CONTENT */}

//       <div className="mt-4">
//         <p className="text-sm text-gray-600 line-clamp-4">
//           {template.content}
//         </p>
//       </div>

//       {/* FOOTER */}

//       <div className="flex justify-end items-center mt-6 pt-4 border-t">
//         <div className="flex gap-2">
//           <button
//             onClick={() =>
//               onEdit?.(template)
//             }
//             className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
//           >
//             Edit
//           </button>

//           <button
//             onClick={() =>
//               onDelete?.(template.id)
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
  FileText,
  Eye,
  SquarePen,
  Send,
  Trash2,
} from "lucide-react";

export default function TemplateCard({
  template,
  onEdit,
  onDelete,
  onPreview,
  onSend,
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* HEADER */}
      <div className="flex justify-between items-start p-5">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
            <FileText
              size={28}
              className="text-green-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {template.name}
            </h2>

            <p className="text-gray-500 mt-1">
              {template.category}
            </p>
          </div>
        </div>

        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold ${
            template.status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : template.status === "INACTIVE"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {template.status}
        </span>
      </div>

      {/* DIVIDER */}
      <div className="border-t" />

      {/* CONTENT */}
      <div className="p-5">
        <div className="bg-green-50 rounded-2xl p-5 min-h-[150px]">
          <p className="text-gray-700 whitespace-pre-line">
            {template.content}
          </p>
        </div>

        {/* INFO */}
        <div className="mt-5 space-y-1 text-sm">
          <p>
            <span className="font-semibold">
              Created By:
            </span>{" "}
            {template.createdBy?.name || "Admin"}
          </p>

          <p>
            <span className="font-semibold">
              Created:
            </span>{" "}
            {formatDate(template.createdAt)}
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t" />

      {/* ACTIONS */}
      <div className="grid grid-cols-4 text-center py-3">
        {/* Preview */}
        <button
          onClick={() =>
            onPreview?.(template)
          }
          className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700 transition"
        >
          <Eye size={22} />
          <span className="text-sm">
            Preview
          </span>
        </button>

        {/* Edit */}
        <button
          onClick={() =>
            onEdit?.(template)
          }
          className="flex flex-col items-center gap-1 text-amber-500 hover:text-amber-600 transition"
        >
          <SquarePen size={22} />
          <span className="text-sm">
            Edit
          </span>
        </button>

        {/* Send */}
        <button
          onClick={() =>
            onSend?.(template)
          }
          className="flex flex-col items-center gap-1 text-green-600 hover:text-green-700 transition"
        >
          <Send size={22} />
          <span className="text-sm">
            Send
          </span>
        </button>

        {/* Delete */}
        <button
          onClick={() =>
            onDelete?.(template.id)
          }
          className="flex flex-col items-center gap-1 text-red-600 hover:text-red-700 transition"
        >
          <Trash2 size={22} />
          <span className="text-sm">
            Delete
          </span>
        </button>
      </div>
    </div>
  );
}