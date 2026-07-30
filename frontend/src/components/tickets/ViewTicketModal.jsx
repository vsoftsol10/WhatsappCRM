import { X, User, Users, FileText, Clock } from "lucide-react";

const STATUS_STYLES = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-200 text-gray-700",
};

const PRIORITY_STYLES = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-[#DCF8C6] p-2 text-[#128C7E]">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function ViewTicketModal({ isOpen, onClose, ticket }) {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#25D366] px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {ticket.title}
              </h2>
              <div className="mt-1 flex gap-2">
                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                    STATUS_STYLES[ticket.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ticket.status?.replace("_", " ")}
                </span>

                <span
                  className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                    PRIORITY_STYLES[ticket.priority] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-[#128C7E]"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
            {ticket.description && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-[#DCF8C6] p-2 text-[#128C7E]">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Description
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {ticket.description}
                  </p>
                </div>
              </div>
            )}

            <InfoRow
              icon={Users}
              label="Customer"
              value={ticket.customer?.name}
            />

            <InfoRow
              icon={User}
              label="Assigned To"
              value={ticket.assignedTo?.name || "Unassigned"}
            />

            <InfoRow
              icon={User}
              label="Created By"
              value={ticket.createdBy?.name}
            />

            <InfoRow
              icon={Clock}
              label="Created On"
              value={
                ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleString()
                  : null
              }
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 transition hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}