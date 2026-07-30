import { X, Mail, Phone, Building2, Tag, FileText, Calendar } from "lucide-react";

const STATUS_STYLES = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-yellow-100 text-yellow-700",
  QUALIFIED: "bg-purple-100 text-purple-700",
  WON: "bg-green-100 text-green-700",
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

export default function ViewLeadModal({ isOpen, onClose, lead }) {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#25D366] px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {lead.name}
              </h2>
              <span
                className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                  STATUS_STYLES[lead.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {lead.status}
              </span>
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
            <InfoRow icon={Mail} label="Email" value={lead.email} />
            <InfoRow icon={Phone} label="Phone" value={lead.phone} />
            <InfoRow icon={Building2} label="Company" value={lead.company} />
            <InfoRow icon={Tag} label="Source" value={lead.source} />

            {lead.requirements && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-[#DCF8C6] p-2 text-[#128C7E]">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Requirements
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {lead.requirements}
                  </p>
                </div>
              </div>
            )}

            <InfoRow
              icon={Calendar}
              label="Created On"
              value={
                lead.createdAt
                  ? new Date(lead.createdAt).toLocaleString()
                  : null
              }
            />

            {lead.isConverted && (
              <div className="rounded-lg bg-[#DCF8C6] px-4 py-2 text-sm font-medium text-[#128C7E]">
                ✓ This lead has been converted to a customer
              </div>
            )}
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