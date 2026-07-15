import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";

export default function EmployeeStats({
  totalEmployees,
  activeEmployees,
  inactiveEmployees,
  adminEmployees,
}) {
  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
    },
    {
      title: "Active",
      value: activeEmployees,
      icon: UserCheck,
    },
    {
      title: "Inactive",
      value: inactiveEmployees,
      icon: UserX,
    },
    {
      title: "Admins",
      value: adminEmployees,
      icon: ShieldCheck,
    },
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
              hover:border-yellow-300
              hover:bg-yellow-50
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

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <Icon
                  size={24}
                  className="text-yellow-600"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}