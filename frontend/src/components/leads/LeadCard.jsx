import { MoreVertical } from "lucide-react";
import { useState } from "react";


export default function LeadCard({ 
  lead,
  onEdit,
  onDelete,
  onStatusChange,
  onConvert,
 }) {

  const statusStyles = {
    NEW: "bg-yellow-100 text-yellow-700",
    CONTACTED: "bg-blue-100 text-blue-700",
    QUALIFIED: "bg-purple-100 text-purple-700",
    WON: "bg-green-100 text-green-700",
  };

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition min-h-[260px]">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {lead.name}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            SOURCE
          </p>

          <p className="font-medium text-gray-800">
            {lead.source || "N/A"}
          </p>
        </div>

        <div className="relative">
  <button
    onClick={() => setShowMenu(!showMenu)}
    className="p-2 rounded-lg hover:bg-gray-100"
  >
    <MoreVertical size={18} />
  </button>

  {showMenu && (
    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-20">
      
      <button
        onClick={() => {
          onEdit(lead);
          setShowMenu(false);
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-xl"
      >
        Edit Lead
      </button>

      <button
        onClick={() => {
          onDelete(lead.id);
          setShowMenu(false);
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
      >
        Delete Lead
      </button>

      <hr />

      <button
        onClick={() => {
          onStatusChange(
            lead.id,
            "CONTACTED"
          );
          setShowMenu(false);
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Mark Contacted
      </button>

      <button
        onClick={() => {
          onStatusChange(
            lead.id,
            "QUALIFIED"
          );
          setShowMenu(false);
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Mark Qualified
      </button>

      <button
        onClick={() => {
          onStatusChange(
            lead.id,
            "WON"
          );
          setShowMenu(false);
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600 hover:rounded-xl"
      >
        Mark Won
      </button>

      {lead.status === "WON" && !lead.isConverted && (
        <button
          onClick={() => {
            onConvert(lead.id);
            setShowMenu(false);
          }}
          className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50"
        >
          Convert to Customer
        </button>
      )}

    </div>
  )}
</div>
      </div>

      {/* Contact Details */}
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-700">
          📞 {lead.phone || "N/A"}
        </p>

        <p className="text-sm text-gray-700 break-all">
          ✉️ {lead.email || "N/A"}
        </p>
      </div>

      {/* Requirements */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
          Requirements
        </p>

        <p className="text-sm text-gray-700 line-clamp-3">
          {lead.requirements ||
            lead.notes ||
            "No requirements provided"}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusStyles[lead.status] ||
            "bg-gray-100 text-gray-700"
          }`}
        >
          {lead.status}
        </span>

        <span className="text-xs text-gray-400">
          Lead
        </span>
      </div>
    </div>
  );
}

// import { MoreVertical } from "lucide-react";
// import { useState } from "react";

// export default function LeadCard({
//   lead,
//   onEdit,
//   onDelete,
//   onStatusChange,
//   onConvertToCustomer,
// }) {
//   const statusStyles = {
//     NEW: "bg-yellow-100 text-yellow-700",
//     CONTACTED: "bg-blue-100 text-blue-700",
//     QUALIFIED: "bg-purple-100 text-purple-700",
//     WON: "bg-green-100 text-green-700",
//   };

//   const [showMenu, setShowMenu] = useState(false);

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition min-h-[280px] flex flex-col">

//       {/* Header */}
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h3 className="text-lg font-bold text-gray-900">
//             {lead.name}
//           </h3>

//           <p className="text-sm text-gray-500 mt-1">
//             SOURCE
//           </p>

//           <p className="font-medium text-gray-800">
//             {lead.source || "N/A"}
//           </p>
//         </div>


//         {/* Menu */}
//         <div className="relative">
//           <button
//             onClick={() => setShowMenu(!showMenu)}
//             className="p-2 rounded-lg hover:bg-gray-100"
//           >
//             <MoreVertical size={18} />
//           </button>


//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-20">

//               <button
//                 onClick={() => {
//                   onEdit(lead);
//                   setShowMenu(false);
//                 }}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:rounded-xl"
//               >
//                 Edit Lead
//               </button>


//               <button
//                 onClick={() => {
//                   onDelete(lead.id);
//                   setShowMenu(false);
//                 }}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//               >
//                 Delete Lead
//               </button>


//               <hr />


//               <button
//                 onClick={() => {
//                   onStatusChange(
//                     lead.id,
//                     "CONTACTED"
//                   );
//                   setShowMenu(false);
//                 }}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100"
//               >
//                 Mark Contacted
//               </button>


//               <button
//                 onClick={() => {
//                   onStatusChange(
//                     lead.id,
//                     "QUALIFIED"
//                   );
//                   setShowMenu(false);
//                 }}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100"
//               >
//                 Mark Qualified
//               </button>


//               <button
//                 onClick={() => {
//                   onStatusChange(
//                     lead.id,
//                     "WON"
//                   );
//                   setShowMenu(false);
//                 }}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600 hover:rounded-xl"
//               >
//                 Mark Won
//               </button>

//             </div>
//           )}
//         </div>
//       </div>



//       {/* Contact Details */}
//       <div className="space-y-2 mb-4">

//         <p className="text-sm text-gray-700">
//           📞 {lead.phone || "N/A"}
//         </p>


//         <p className="text-sm text-gray-700 break-all">
//           ✉️ {lead.email || "N/A"}
//         </p>

//       </div>



//       {/* Requirements */}
//       <div className="mb-5 flex-1">

//         <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
//           Requirements
//         </p>


//         <p className="text-sm text-gray-700 line-clamp-3">
//           {lead.requirements ||
//             lead.notes ||
//             "No requirements provided"}
//         </p>

//       </div>



//       {/* Convert Button */}
//       {lead.status === "QUALIFIED" && (
//         <button
//           onClick={() => onConvertToCustomer(lead)}
//           className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-semibold transition"
//         >
//           Convert to Customer
//         </button>
//       )}



//       {/* Footer */}
//       <div className="flex justify-between items-center">

//         <span
//           className={`px-3 py-1 rounded-full text-xs font-semibold ${
//             statusStyles[lead.status] ||
//             "bg-gray-100 text-gray-700"
//           }`}
//         >
//           {lead.status}
//         </span>


//         <span className="text-xs text-gray-400">
//           Lead
//         </span>

//       </div>

//     </div>
//   );
// }