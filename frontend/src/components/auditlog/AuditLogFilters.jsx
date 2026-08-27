import { useEffect, useState } from "react";
import { Filter, Search } from "lucide-react";

import { getAuditLogActions } from "../../api/auditLogApi";
import { actionLabel, AUDIT_ENTITY_TYPES } from "./auditLogHelpers";

function AuditLogFilters({
  search,
  onSearchChange,
  action,
  onActionChange,
  entityType,
  onEntityTypeChange,
}) {
  const [actions, setActions] = useState([]);

  // Pulled from the DB (distinct action values actually in use)
  // rather than hardcoded here, so the dropdown never drifts out of
  // sync as new action types get added across modules over time.
  useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await getAuditLogActions();
        setActions(response.data || []);
      } catch (error) {
        console.error("Failed to fetch audit log actions:", error);
      }
    };

    fetchActions();
  }, []);

  return (
    <div className="crm-page-surface p-5 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-gray-100 p-2">
          <Filter size={18} className="text-gray-500" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">Filters</h3>
          <p className="text-sm text-gray-500">
            Search and filter audit activities
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Search */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Search
          </label>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by action, description, actor..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#25D366]"
            />
          </div>
        </div>

        {/* Action */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Action
          </label>

          <select
            value={action}
            onChange={(e) => onActionChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-sm outline-none transition focus:border-[#25D366]"
          >
            <option value="ALL">All Actions</option>

            {actions.map((a) => (
              <option key={a} value={a}>
                {actionLabel(a)}
              </option>
            ))}
          </select>
        </div>

        {/* Entity */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Entity
          </label>

          <select
            value={entityType}
            onChange={(e) => onEntityTypeChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-sm outline-none transition focus:border-[#25D366]"
          >
            {AUDIT_ENTITY_TYPES.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default AuditLogFilters;