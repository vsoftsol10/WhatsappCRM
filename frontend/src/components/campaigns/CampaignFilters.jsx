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