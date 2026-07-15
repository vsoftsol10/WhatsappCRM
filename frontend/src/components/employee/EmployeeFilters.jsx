function EmployeeFilters({
  statusFilter,
  setStatusFilter,
}) {
  const filters = [
    {
      key: "ALL",
      label: "All Employees",
    },
    {
      key: "ACTIVE",
      label: "Active",
    },
    {
      key: "INACTIVE",
      label: "Inactive",
    },
    {
      key: "ADMIN",
      label: "Admins",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {filters.map((filter) => {
        const isActive =
          statusFilter === filter.key;

        return (
          <button
            key={filter.key}
            type="button"
            onClick={() =>
              setStatusFilter(filter.key)
            }
            className={`
              rounded-xl
              border
              px-5
              py-2.5
              text-sm
              font-semibold
              transition-all
              ${
                isActive
                  ? "border-yellow-400 bg-yellow-400 text-black shadow-md"
                  : "border-gray-300 bg-white text-slate-700 hover:bg-yellow-50 hover:border-yellow-300"
              }
            `}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default EmployeeFilters;