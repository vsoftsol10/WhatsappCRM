function TicketFilters({
  statusFilter,
  setStatusFilter,
}) {
  const filters = [
    { key: "ALL", label: "All Tickets" },
    { key: "OPEN", label: "Open" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "RESOLVED", label: "Resolved" },
    { key: "CLOSED", label: "Closed" },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
      {filters.map((item) => {
        const isActive = statusFilter === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setStatusFilter(item.key)}
            className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? "border-[#25D366] bg-[#25D366] text-black shadow-md"
                : "border-gray-300 bg-white text-slate-700 hover:bg-[#DCF8C6] hover:border-[#25D366]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default TicketFilters;
