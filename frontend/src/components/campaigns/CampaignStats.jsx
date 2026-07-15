// import {
//   Megaphone,
//   FileText,
//   Clock,
//   CheckCircle,
// } from "lucide-react";

// export default function CampaignStats({
//   campaigns = [],
// }) {
//   const totalCampaigns =
//     campaigns.length;

//   const draftCampaigns =
//     campaigns.filter(
//       (campaign) =>
//         campaign.status === "DRAFT"
//     ).length;

//   const scheduledCampaigns =
//     campaigns.filter(
//       (campaign) =>
//         campaign.status === "SCHEDULED"
//     ).length;

//   const completedCampaigns =
//     campaigns.filter(
//       (campaign) =>
//         campaign.status === "COMPLETED"
//     ).length;

//   const stats = [
//     {
//       title: "Total Campaigns",
//       value: totalCampaigns,
//       icon: Megaphone,
//       bg: "bg-blue-100",
//       text: "text-blue-600",
//     },
//     {
//       title: "Draft",
//       value: draftCampaigns,
//       icon: FileText,
//       bg: "bg-gray-100",
//       text: "text-gray-600",
//     },
//     {
//       title: "Scheduled",
//       value: scheduledCampaigns,
//       icon: Clock,
//       bg: "bg-yellow-100",
//       text: "text-yellow-600",
//     },
//     {
//       title: "Completed",
//       value: completedCampaigns,
//       icon: CheckCircle,
//       bg: "bg-green-100",
//       text: "text-green-600",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
//       {stats.map((stat) => {
//         const Icon = stat.icon;

//         return (
//           <div
//             key={stat.title}
//             className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-500">
//                   {stat.title}
//                 </p>

//                 <h3 className="text-3xl font-bold mt-2">
//                   {stat.value}
//                 </h3>
//               </div>

//               <div
//                 className={`p-3 rounded-xl ${stat.bg}`}
//               >
//                 <Icon
//                   size={24}
//                   className={stat.text}
//                 />
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import {
  Megaphone,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function CampaignStats({
  campaigns = [],
}) {
  const totalCampaigns = campaigns.length;

  const draftCampaigns = campaigns.filter(
    (campaign) => campaign.status === "DRAFT"
  ).length;

  const scheduledCampaigns = campaigns.filter(
    (campaign) => campaign.status === "SCHEDULED"
  ).length;

  const completedCampaigns = campaigns.filter(
    (campaign) => campaign.status === "COMPLETED"
  ).length;

  const stats = [
    {
      title: "Total Campaigns",
      value: totalCampaigns,
      icon: Megaphone,
    },
    {
      title: "Draft",
      value: draftCampaigns,
      icon: FileText,
    },
    {
      title: "Scheduled",
      value: scheduledCampaigns,
      icon: Clock,
    },
    {
      title: "Completed",
      value: completedCampaigns,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              p-5
              shadow-sm
              transition-all
              duration-200
              hover:border-yellow-300
              hover:bg-yellow-50
              hover:shadow-lg
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  {stat.value}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <Icon
                  size={24}
                  className="text-yellow-600"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}