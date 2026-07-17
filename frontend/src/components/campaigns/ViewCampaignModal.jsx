// import { X, Calendar, Tag, FileText } from "lucide-react";

// export default function ViewCampaignModal({
//   isOpen,
//   onClose,
//   campaign,
// }) {
//   if (!isOpen || !campaign) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">

//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

//         {/* Header */}

//         <div className="flex justify-between items-center border-b px-6 py-4">

//           <div>

//             <h2 className="text-2xl font-bold">
//               Campaign Details
//             </h2>

//             <p className="text-gray-500 text-sm">
//               View complete campaign
//             </p>

//           </div>

//           <button
//             onClick={onClose}
//             className="hover:bg-gray-100 rounded-full p-2"
//           >
//             <X size={22} />
//           </button>

//         </div>

//         {/* Body */}

//         <div className="p-6 space-y-6">

//           {/* Name */}

//           <div>

//             <p className="text-sm text-gray-500">
//               Campaign Name
//             </p>

//             <h2 className="text-2xl font-bold mt-1">
//               {campaign.name}
//             </h2>

//           </div>

//           {/* Type */}

//           <div className="flex items-center gap-3">

//             <Tag
//               size={18}
//               className="text-purple-600"
//             />

//             <div>

//               <p className="text-sm text-gray-500">
//                 Campaign Type
//               </p>

//               <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">

//                 {campaign.type}

//               </span>

//             </div>

//           </div>

//           {/* Status */}

//           <div>

//             <p className="text-sm text-gray-500">
//               Status
//             </p>

//             <span
//               className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
//                 campaign.status === "COMPLETED"
//                   ? "bg-green-100 text-green-700"
//                   : campaign.status === "SCHEDULED"
//                   ? "bg-[#DCF8C6] text-[#128C7E]"
//                   : campaign.status === "FAILED"
//                   ? "bg-red-100 text-red-700"
//                   : "bg-blue-100 text-blue-700"
//               }`}
//             >
//               {campaign.status}
//             </span>

//           </div>

//           {/* Scheduled */}

//           {campaign.scheduledAt && (

//             <div className="flex items-center gap-3">

//               <Calendar
//                 size={18}
//                 className="text-blue-600"
//               />

//               <div>

//                 <p className="text-sm text-gray-500">
//                   Scheduled Time
//                 </p>

//                 <p className="font-medium">
//                   {new Date(
//                     campaign.scheduledAt
//                   ).toLocaleString()}
//                 </p>

//               </div>

//             </div>

//           )}

//           {/* Message */}

//           <div>

//             <div className="flex items-center gap-2 mb-3">

//               <FileText size={18} />

//               <h3 className="font-semibold">
//                 Message Content
//               </h3>

//             </div>

//             <div className="border rounded-xl p-4 bg-gray-50 whitespace-pre-wrap leading-7">

//               {campaign.messageContent}

//             </div>

//           </div>

//         </div>

//         {/* Footer */}

//         <div className="border-t p-5 flex justify-end">

//           <button
//             onClick={onClose}
//             className="bg-[#25D366] hover:bg-[#128C7E] px-6 py-2 rounded-xl font-semibold"
//           >
//             Close
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }

import {
  X,
  Calendar,
  Tag,
  FileText,
  Megaphone,
  CheckCircle2,
} from "lucide-react";

export default function ViewCampaignModal({
  isOpen,
  onClose,
  campaign,
}) {
  if (!isOpen || !campaign) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";

      case "SENDING":
        return "bg-[#DCF8C6] text-[#128C7E]";

      case "FAILED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "PROMOTIONAL":
        return "bg-purple-100 text-purple-700";

      case "BROADCAST":
        return "bg-indigo-100 text-indigo-700";

      case "FOLLOW_UP":
        return "bg-orange-100 text-orange-700";

      case "ANNOUNCEMENT":
        return "bg-cyan-100 text-cyan-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="bg-gradient-to-r from-[#25D366] via-[#25D366] to-[#128C7E] px-8 py-6 flex justify-between items-start">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center shadow-sm">

              <Megaphone
                size={28}
                className="text-[#128C7E]"
              />

            </div>

            <div>

              <p className="text-sm font-medium text-gray-600">
                Campaign Details
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {campaign.name}
              </h2>

            </div>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/50 transition"
          >
            <X size={24} />
          </button>

        </div>

        {/* Body */}

        <div className="p-8 space-y-6 bg-gray-50">

          {/* Type & Status */}

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-white rounded-2xl shadow-sm p-5">

              <div className="flex items-center gap-3 mb-3">

                <Tag
                  size={20}
                  className="text-purple-600"
                />

                <h3 className="font-semibold text-gray-700">
                  Campaign Type
                </h3>

              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getTypeColor(
                  campaign.type
                )}`}
              >
                {campaign.type}
              </span>

            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">

              <div className="flex items-center gap-3 mb-3">

                <CheckCircle2
                  size={20}
                  className="text-[#128C7E]"
                />

                <h3 className="font-semibold text-gray-700">
                  Campaign Status
                </h3>

              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  campaign.status
                )}`}
              >
                {campaign.status}
              </span>

            </div>

          </div>

          {/* Schedule */}

          <div className="bg-white rounded-2xl shadow-sm p-5">

            <div className="flex items-center gap-3 mb-3">

              <Calendar
                size={20}
                className="text-blue-600"
              />

              <h3 className="font-semibold text-gray-700">
                Scheduled Time
              </h3>

            </div>

            <p className="text-gray-700">
              {campaign.scheduledAt
                ? new Date(
                    campaign.scheduledAt
                  ).toLocaleString()
                : "Not Scheduled"}
            </p>

          </div>

          {/* Message */}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <div className="bg-gray-100 px-5 py-4 flex items-center gap-3">

              <FileText
                size={20}
                className="text-[#25D366]"
              />

              <h3 className="font-semibold text-gray-800">
                Message Content
              </h3>

            </div>

            <div className="p-6 whitespace-pre-wrap leading-8 text-gray-700">
              {campaign.messageContent ||
                "No message available."}
            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="bg-white px-8 py-5 flex justify-end shadow-inner">

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#128C7E] transition font-semibold text-gray-800"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}