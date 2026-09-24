import { Building2, CheckCircle, XCircle, Users } from "lucide-react";

export default function BusinessStats({ businesses = [] }) {
  const total = businesses.length;
  const active = businesses.filter((b) => b.isActive).length;
  const inactive = total - active;
  const totalCustomers = businesses.reduce(
    (sum, b) => sum + (b._count?.customers || 0),
    0
  );

  const stats = [
    { title: "Total Businesses", value: total, icon: Building2 },
    { title: "Active", value: active, icon: CheckCircle },
    { title: "Inactive", value: inactive, icon: XCircle },
    { title: "Total Customers", value: totalCustomers, icon: Users },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
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
                  {stat.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  {stat.value}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCF8C6]">
                <Icon size={24} className="text-[#25D366]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}