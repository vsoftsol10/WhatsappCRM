import { X } from "lucide-react";

// Splits a details string like "Ravi Kumar: status: NEW -> CONTACTED,
// assignedTo: unassigned -> abc123" into individual readable lines.
// Falls back to showing the whole string as one line if it doesn't
// contain the ", " separator our controllers use between changed
// fields (e.g. a plain one-line summary like "842 created, 3 updated"
// still splits fine and reads naturally either way).
function parseDetailLines(details) {
  if (!details) return [];

  return details
    .split(", ")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ViewAuditLogDetailsModal({
  log,
  isOpen,
  onClose,
  actionLabel,
  actionBadgeClass,
  entityBadgeClass,
  formatDate,
}) {
  if (!isOpen || !log) return null;

  const detailLines = parseDetailLines(log.details);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Activity Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`crm-badge ${actionBadgeClass}`}>
              {actionLabel(log.action)}
            </span>

            <span className={`crm-badge ${entityBadgeClass}`}>
              {log.entityType || "-"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                When
              </p>
              <p className="mt-1 text-gray-800">
                {formatDate(log.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Entity ID
              </p>
              <p className="mt-1 break-all text-gray-800">
                {log.entityId || "-"}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Performed by
              </p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-xs font-semibold text-white">
                  {(log.actor?.name || "System").charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {log.actor?.name || "System"}
                  </p>
                  {log.actor?.email && (
                    <p className="text-xs text-gray-500">
                      {log.actor.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              What changed
            </p>

            {detailLines.length === 0 ? (
              <p className="text-sm text-gray-500">
                No additional details recorded.
              </p>
            ) : (
              <ul className="space-y-1.5 rounded-xl border border-gray-100 bg-gray-50 p-3">
                {detailLines.map((line, i) => (
                  <li
                    key={i}
                    className="break-words text-sm text-gray-700"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}