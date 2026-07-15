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
    <div className="space-y-4">
      
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="border rounded-xl px-4 py-2 w-full md:w-96"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() =>
              setSelectedStatus(status)
            }
            className={`px-4 py-2 rounded-xl font-medium transition
              ${
                selectedStatus === status
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-gray-600"
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