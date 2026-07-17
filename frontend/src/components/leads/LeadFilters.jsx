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
//     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//       {/* Search */}
//       <div className="w-full lg:max-w-md">
//         <input
//           type="text"
//           placeholder="Search leads..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
//         />
//       </div>

//       {/* Filter Chips */}
//       <div className="flex flex-wrap gap-3 lg:justify-end">
//         {statuses.map((status) => (
//           <button
//             key={status}
//             onClick={() => setSelectedStatus(status)}
//             className={`px-5 py-2.5 rounded-xl font-medium transition ${
//               selectedStatus === status
//                 ? "bg-[#25D366] text-black"
//                 : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
//             }`}
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
    "CONVERTED",
  ];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <div className="w-full lg:max-w-md">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3 lg:justify-end">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`rounded-xl px-5 py-2.5 font-medium transition ${
              selectedStatus === status
                ? "bg-[#25D366] text-black"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {status === "CONVERTED" ? "Converted" : status}
          </button>
        ))}
      </div>
    </div>
  );
}