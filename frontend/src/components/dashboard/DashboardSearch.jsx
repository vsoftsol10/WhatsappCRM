import { useMemo, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardSearch() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const modules = [
    {
      name: "Dashboard",
      description: "Go to Dashboard",
      route: "/dashboard",
    },
    {
      name: "Customers",
      description: "Manage customers",
      route: "/customers",
    },
    {
      name: "Leads",
      description: "Manage leads",
      route: "/leads",
    },
    {
      name: "Deals",
      description: "Manage deals",
      route: "/deals",
    },
    {
      name: "Employees",
      description: "Manage employees",
      route: "/employees",
    },
    {
      name: "Tasks",
      description: "Manage tasks",
      route: "/tasks",
    },
    {
      name: "Conversations",
      description: "Open WhatsApp inbox",
      route: "/conversations",
    },
    {
      name: "Templates",
      description: "Manage templates",
      route: "/templates",
    },
    {
      name: "Campaigns",
      description: "Manage campaigns",
      route: "/campaigns",
    },
  ];

  const filteredModules = useMemo(() => {
    if (!query.trim()) return [];

    return modules.filter((module) =>
      module.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="relative mb-8">
      {/* Search Box */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search modules..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Search Results */}
      {filteredModules.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          {filteredModules.map((module) => (
            <button
              key={module.name}
              onClick={() => {
                navigate(module.route);
                setQuery("");
              }}
              className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-4 text-left transition hover:bg-gray-50 last:border-none"
            >
              <div>
                <h4 className="font-semibold text-gray-900">
                  {module.name}
                </h4>

                <p className="text-sm text-gray-500">
                  {module.description}
                </p>
              </div>

              <ArrowRight
                size={18}
                className="text-blue-600"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}