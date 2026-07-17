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
    <div className="flex flex-wrap gap-3 lg:justify-end">
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
                  ? "border-[#25D366] bg-[#25D366] text-black shadow-md"
                  : "border-gray-300 bg-white text-slate-700 hover:bg-[#DCF8C6] hover:border-[#25D366]"
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