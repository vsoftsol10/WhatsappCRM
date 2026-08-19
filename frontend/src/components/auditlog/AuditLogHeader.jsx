import { RefreshCw } from "lucide-react";

function AuditLogHeader({ onRefresh, refreshing }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h1 className="crm-title text-slate-800">Audit Log</h1>

        <p className="crm-subtitle text-slate-500">
          A record of who created, updated, or deleted employees and
          customers.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="crm-secondary-button w-full sm:w-auto"
      >
        <RefreshCw
          size={18}
          className={refreshing ? "animate-spin" : ""}
        />
        Refresh
      </button>
    </div>
  );
}

export default AuditLogHeader;