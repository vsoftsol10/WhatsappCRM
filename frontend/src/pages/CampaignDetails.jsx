import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Calendar,
  Users,
  MessageSquare,
  User,
} from "lucide-react";

import useCampaignStore from "../store/campaignStore";

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    selectedCampaign,
    fetchCampaignById,
    isLoading,
  } = useCampaignStore();

  useEffect(() => {
    fetchCampaignById(id);
  }, [id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <h1 className="text-white text-2xl font-semibold animate-pulse">
          Loading...
        </h1>
      </div>
    );
  }

  if (!selectedCampaign) {
    return (
      <div className="p-6">
        <p>Campaign not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 ml-8.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/campaigns")}
          className="flex items-center gap-2 text-sm font-medium hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-3xl font-bold">
          {selectedCampaign.name}
        </h1>
      </div>

      {/* Campaign Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-4">
            Campaign Information
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-semibold">
                {selectedCampaign.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Type</span>
              <span className="font-semibold">
                {selectedCampaign.type}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Audience</span>
              <span className="font-semibold">
                {selectedCampaign.audienceCount}
              </span>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-4">
            Schedule
          </h2>

          <div className="space-y-3">

            <div className="flex items-center gap-2">
              <User size={18} />
              <span>
                {selectedCampaign.createdBy?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {new Date(
                  selectedCampaign.createdAt
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {selectedCampaign.scheduledAt
                  ? new Date(
                      selectedCampaign.scheduledAt
                    ).toLocaleString()
                  : "Not Scheduled"}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Message */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={20} />
          <h2 className="font-semibold">
            Message
          </h2>
        </div>

        <div className="border rounded-lg p-4 whitespace-pre-wrap">
          {selectedCampaign.messageContent}
        </div>
      </div>

      {/* Audience */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} />
          <h2 className="font-semibold">
            Recipients
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full border">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Phone
                </th>

                <th className="p-3 text-left">
                  Email
                </th>
              </tr>

            </thead>

            <tbody>

              {selectedCampaign.recipients.map(
                (recipient) => (
                  <tr
                    key={recipient.id}
                    className="border-t"
                  >
                    <td className="p-3">
                      {recipient.customer?.name}
                    </td>

                    <td className="p-3">
                      {recipient.customer?.phone}
                    </td>

                    <td className="p-3">
                      {recipient.customer?.email}
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}