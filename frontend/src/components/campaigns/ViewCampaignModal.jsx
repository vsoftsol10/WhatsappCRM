import { X, Calendar, Tag, FileText } from "lucide-react";

export default function ViewCampaignModal({
  isOpen,
  onClose,
  campaign,
}) {
  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center border-b px-6 py-4">

          <div>

            <h2 className="text-2xl font-bold">
              Campaign Details
            </h2>

            <p className="text-gray-500 text-sm">
              View complete campaign
            </p>

          </div>

          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full p-2"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-6">

          {/* Name */}

          <div>

            <p className="text-sm text-gray-500">
              Campaign Name
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {campaign.name}
            </h2>

          </div>

          {/* Type */}

          <div className="flex items-center gap-3">

            <Tag
              size={18}
              className="text-purple-600"
            />

            <div>

              <p className="text-sm text-gray-500">
                Campaign Type
              </p>

              <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">

                {campaign.type}

              </span>

            </div>

          </div>

          {/* Status */}

          <div>

            <p className="text-sm text-gray-500">
              Status
            </p>

            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                campaign.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : campaign.status === "SCHEDULED"
                  ? "bg-yellow-100 text-yellow-700"
                  : campaign.status === "FAILED"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {campaign.status}
            </span>

          </div>

          {/* Scheduled */}

          {campaign.scheduledAt && (

            <div className="flex items-center gap-3">

              <Calendar
                size={18}
                className="text-blue-600"
              />

              <div>

                <p className="text-sm text-gray-500">
                  Scheduled Time
                </p>

                <p className="font-medium">
                  {new Date(
                    campaign.scheduledAt
                  ).toLocaleString()}
                </p>

              </div>

            </div>

          )}

          {/* Message */}

          <div>

            <div className="flex items-center gap-2 mb-3">

              <FileText size={18} />

              <h3 className="font-semibold">
                Message Content
              </h3>

            </div>

            <div className="border rounded-xl p-4 bg-gray-50 whitespace-pre-wrap leading-7">

              {campaign.messageContent}

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="border-t p-5 flex justify-end">

          <button
            onClick={onClose}
            className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-xl font-semibold"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}