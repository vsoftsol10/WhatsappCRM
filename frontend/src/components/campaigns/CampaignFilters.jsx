// import { Search } from "lucide-react";

// export default function CampaignFilters({
//   search,
//   setSearch,
//   statusFilter,
//   setStatusFilter,
// }) {
//   const statuses = [
//     "ALL",
//     "DRAFT",
//     "SCHEDULED",
//     "SENDING",
//     "COMPLETED",
//     "FAILED",
//   ];

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      
//       {/* SEARCH */}

//       <div className="relative mb-4">
//         <Search
//           size={18}
//           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//         />

//         <input
//           type="text"
//           placeholder="Search campaigns..."
//           value={search}
//           onChange={(e) =>
//             setSearch(e.target.value)
//           }
//           className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* STATUS FILTERS */}

//       <div className="flex flex-wrap gap-2">
//         {statuses.map((status) => (
//           <button
//             key={status}
//             onClick={() =>
//               setStatusFilter(status)
//             }
//             className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
//               statusFilter === status
//                 ? "bg-[#25D366] text-black"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             {status}
//           </button>
//         ))}
//       </div>

//     </div>
//   );
// }

export default function CampaignFilters({
  statusFilter,
  setStatusFilter,
}) {
  const statuses = [
    "ALL",
    "DRAFT",
    "SCHEDULED",
    "SENDING",
    "COMPLETED",
    "FAILED",
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`
              min-w-[80px]
              rounded-xl
              border
              px-5
              py-2
              text-base
              font-medium
              transition-all
              duration-200
              ${
                statusFilter === status
                  ? "border-[#25D366] bg-[#25D366] text-black shadow-md"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-[#25D366]"
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}