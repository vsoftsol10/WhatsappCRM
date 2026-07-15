// export default function LeadFilters({
//   searchTerm,
//   setSearchTerm,
//   selectedStatus,
//   setSelectedStatus,
// }) {
//   const statuses = [
//     "ALL",
//     "NEW",
//     "CONTACTED",
//     "QUALIFIED",
//     "WON",
//   ];

//   return (
//     <div className="space-y-4">
      
//       <div className="flex justify-end">
//         <input
//           type="text"
//           placeholder="Search leads..."
//           value={searchTerm}
//           onChange={(e) =>
//             setSearchTerm(e.target.value)
//           }
//           className="border rounded-xl px-4 py-2 w-full md:w-96"
//         />
//       </div>

//       <div className="flex flex-wrap gap-3">
//         {statuses.map((status) => (
//           <button
//             key={status}
//             onClick={() =>
//               setSelectedStatus(status)
//             }
//             className={`px-4 py-2 rounded-xl font-medium transition
//               ${
//                 selectedStatus === status
//                   ? "bg-yellow-400 text-black"
//                   : "bg-white text-gray-600"
//               }
//             `}
//           >
//             {status}
//           </button>
//         ))}
//       </div>

//     </div>
//   );
// }

export default function LeadFilters({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
}) {
  const statuses = [
    "ALL",
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "WON",
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Search */}
      <div className="w-full lg:max-w-md">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3 lg:justify-end">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-5 py-2.5 rounded-xl font-medium transition ${
              selectedStatus === status
                ? "bg-yellow-400 text-black"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}