// import { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import {
//   ArrowLeft,
//   Calendar,
//   Users,
//   MessageSquare,
//   User,
// } from "lucide-react";

// import useCampaignStore from "../store/campaignStore";

// export default function CampaignDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const {
//     selectedCampaign,
//     fetchCampaignById,
//     isLoading,
//   } = useCampaignStore();

//   useEffect(() => {
//     fetchCampaignById(id);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   if (isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
//         <h1 className="text-white text-2xl font-semibold animate-pulse">
//           Loading...
//         </h1>
//       </div>
//     );
//   }

//   if (!selectedCampaign) {
//     return (
//       <div className="crm-page">
//         <p>Campaign not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="crm-page space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <button
//           onClick={() => navigate("/campaigns")}
//           className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#128C7E]"
//         >
//           <ArrowLeft size={18} />
//           Back
//         </button>

//         <h1 className="break-words text-2xl font-bold sm:text-3xl">
//           {selectedCampaign.name}
//         </h1>
//       </div>

//       {/* Campaign Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         <div className="crm-page-surface p-5">
//           <h2 className="font-semibold mb-4">
//             Campaign Information
//           </h2>

//           <div className="space-y-3">

//             <div className="flex flex-wrap justify-between gap-2">
//               <span>Status</span>
//               <span className="font-semibold">
//                 {selectedCampaign.status}
//               </span>
//             </div>

//             <div className="flex flex-wrap justify-between gap-2">
//               <span>Type</span>
//               <span className="font-semibold">
//                 {selectedCampaign.type}
//               </span>
//             </div>

//             <div className="flex flex-wrap justify-between gap-2">
//               <span>Audience</span>
//               <span className="font-semibold">
//                 {selectedCampaign.audienceCount}
//               </span>
//             </div>

//           </div>
//         </div>

//         <div className="crm-page-surface p-5">
//           <h2 className="font-semibold mb-4">
//             Schedule
//           </h2>

//           <div className="space-y-3">

//             <div className="flex items-center gap-2 break-words">
//               <User size={18} />
//               <span>
//                 {selectedCampaign.createdBy?.name}
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               <Calendar size={18} />
//               <span>
//                 {new Date(
//                   selectedCampaign.createdAt
//                 ).toLocaleString()}
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               <Calendar size={18} />
//               <span>
//                 {selectedCampaign.scheduledAt
//                   ? new Date(
//                       selectedCampaign.scheduledAt
//                     ).toLocaleString()
//                   : "Not Scheduled"}
//               </span>
//             </div>

//           </div>
//         </div>

//       </div>

//       {/* Message */}
//         <div className="crm-page-surface p-5">
//         <div className="flex items-center gap-2 mb-4">
//           <MessageSquare size={20} />
//           <h2 className="font-semibold">
//             Message
//           </h2>
//         </div>

//         <div className="whitespace-pre-wrap break-words rounded-lg border p-4">
//           {selectedCampaign.messageContent}
//         </div>
//       </div>

//       {/* Audience */}
//       <div className="crm-page-surface p-5">
//         <div className="flex items-center gap-2 mb-4">
//           <Users size={20} />
//           <h2 className="font-semibold">
//             Recipients
//           </h2>
//         </div>

//         <div className="overflow-x-auto">

//           <table className="w-full min-w-[640px] border">

//             <thead className="bg-gray-100">

//               <tr>
//                 <th className="p-3 text-left">
//                   Name
//                 </th>

//                 <th className="p-3 text-left">
//                   Phone
//                 </th>

//                 <th className="p-3 text-left">
//                   Email
//                 </th>
//               </tr>

//             </thead>

//             <tbody>

//               {selectedCampaign.recipients.map(
//                 (recipient) => (
//                   <tr
//                     key={recipient.id}
//                     className="border-t"
//                   >
//                     <td className="p-3">
//                       {recipient.customer?.name}
//                     </td>

//                     <td className="p-3">
//                       {recipient.customer?.phone}
//                     </td>

//                     <td className="p-3">
//                       {recipient.customer?.email}
//                     </td>
//                   </tr>
//                 )
//               )}

//             </tbody>

//           </table>

//         </div>
//       </div>
//     </div>
//   );
// }

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

// Small color-coded pill for a recipient's WhatsApp delivery status —
// mirrors Meta's own Sent/Delivered/Read/Failed lifecycle so
// non-technical users recognize it immediately.
const STATUS_STYLES = {
  PENDING: "bg-gray-100 text-gray-600",
  SENT: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-amber-100 text-amber-700",
  READ: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
};

function RecipientStatusBadge({ status, failureReason }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style}`}
      title={status === "FAILED" && failureReason ? failureReason : undefined}
    >
      {status || "PENDING"}
    </span>
  );
}

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="crm-page">
        <p>Campaign not found.</p>
      </div>
    );
  }

  return (
    <div className="crm-page space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate("/campaigns")}
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#128C7E]"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="break-words text-2xl font-bold sm:text-3xl">
          {selectedCampaign.name}
        </h1>
      </div>

      {/* Campaign Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="crm-page-surface p-5">
          <h2 className="font-semibold mb-4">
            Campaign Information
          </h2>

          <div className="space-y-3">

            <div className="flex flex-wrap justify-between gap-2">
              <span>Status</span>
              <span className="font-semibold">
                {selectedCampaign.status}
              </span>
            </div>

            <div className="flex flex-wrap justify-between gap-2">
              <span>Type</span>
              <span className="font-semibold">
                {selectedCampaign.type}
              </span>
            </div>

            <div className="flex flex-wrap justify-between gap-2">
              <span>Audience</span>
              <span className="font-semibold">
                {selectedCampaign.audienceCount}
              </span>
            </div>

          </div>
        </div>

        <div className="crm-page-surface p-5">
          <h2 className="font-semibold mb-4">
            Schedule
          </h2>

          <div className="space-y-3">

            <div className="flex items-center gap-2 break-words">
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
        <div className="crm-page-surface p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={20} />
          <h2 className="font-semibold">
            Message
          </h2>
        </div>

        <div className="whitespace-pre-wrap break-words rounded-lg border p-4">
          {selectedCampaign.messageContent}
        </div>
      </div>

      {/* Audience */}
      <div className="crm-page-surface p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <h2 className="font-semibold">
              Recipients
            </h2>
          </div>

          {/* Quick status summary counts */}
          <div className="flex flex-wrap gap-2 text-xs">
            {["SENT", "DELIVERED", "READ", "FAILED"].map((s) => {
              const count = selectedCampaign.recipients.filter(
                (r) => r.status === s
              ).length;

              if (count === 0) return null;

              return (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1 font-semibold ${STATUS_STYLES[s]}`}
                >
                  {s}: {count}
                </span>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[720px] border">

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

                <th className="p-3 text-left">
                  Status
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

                    <td className="p-3">
                      <RecipientStatusBadge
                        status={recipient.status}
                        failureReason={recipient.failureReason}
                      />

                      {recipient.status === "FAILED" &&
                        recipient.failureReason && (
                          <p className="mt-1 text-xs text-red-500">
                            {recipient.failureReason}
                          </p>
                        )}
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