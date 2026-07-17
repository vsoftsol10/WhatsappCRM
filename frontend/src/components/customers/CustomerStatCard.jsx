import {
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

function CustomerStatCard({
  totalCustomers,
  activeCustomers,
  inactiveCustomers,
  statusFilter,
  setStatusFilter,
}) {
  const cards = [
    {
      key: "ALL",
      title: "All Customers",
      buttonLabel: "All",
      value: totalCustomers,
      icon: Users,
    },
    {
      key: "ACTIVE",
      title: "Active",
      buttonLabel: "Active",
      value: activeCustomers,
      icon: UserCheck,
    },
    {
      key: "INACTIVE",
      title: "Inactive",
      buttonLabel: "Inactive",
      value: inactiveCustomers,
      icon: UserX,
    },
  ];

  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="
                bg-white
                rounded-2xl
                border
                border-gray-200
                p-5
                shadow-sm
                transition-all
                duration-200
                hover:border-[#25D366]
                hover:bg-[#DCF8C6]
                hover:shadow-lg
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-gray-900">
                    {card.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCF8C6]">
                  <Icon
                    size={24}
                    className="text-[#25D366]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Chips */}
      {/* <div className="flex flex-wrap gap-3 mb-6">
        {cards.map((card) => {
          const isActive =
            statusFilter === card.key;

          return (
            <button
              key={card.key}
              type="button"
              onClick={() =>
                setStatusFilter(card.key)
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
              {card.buttonLabel}
            </button>
          );
        })}
      </div> */}
    </>
  );
}

export default CustomerStatCard;