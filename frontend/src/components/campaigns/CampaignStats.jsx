// import {
//   Megaphone,
//   FileText,
//   Clock,
//   CheckCircle,
// } from "lucide-react";

// export default function CampaignStats({
//   campaigns = [],
// }) {
//   const totalCampaigns = campaigns.length;

//   const draftCampaigns = campaigns.filter(
//     (campaign) => campaign.status === "DRAFT"
//   ).length;

//   const scheduledCampaigns = campaigns.filter(
//     (campaign) => campaign.status === "SCHEDULED"
//   ).length;

//   const completedCampaigns = campaigns.filter(
//     (campaign) => campaign.status === "COMPLETED"
//   ).length;

//   const stats = [
//     {
//       title: "Total Campaigns",
//       value: totalCampaigns,
//       icon: Megaphone,
//     },
//     {
//       title: "Draft",
//       value: draftCampaigns,
//       icon: FileText,
//     },
//     {
//       title: "Scheduled",
//       value: scheduledCampaigns,
//       icon: Clock,
//     },
//     {
//       title: "Completed",
//       value: completedCampaigns,
//       icon: CheckCircle,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
//       {stats.map((stat) => {
//         const Icon = stat.icon;

//         return (
//           <div
//             key={stat.title}
//             className="
//               bg-white
//               rounded-2xl
//               border
//               border-gray-200
//               p-5
//               shadow-sm
//               transition-all
//               duration-200
//               hover:border-[#25D366]
//               hover:bg-[#DCF8C6]
//               hover:shadow-lg
//             "
//           >
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">
//                   {stat.title}
//                 </p>

//                 <h2 className="mt-3 text-3xl font-bold text-gray-900">
//                   {stat.value}
//                 </h2>
//               </div>

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCF8C6]">
//                 <Icon
//                   size={24}
//                   className="text-[#25D366]"
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

  const cards = [
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              p-5
              shadow-sm
              transition-all
              duration-200
              hover:border-[#25D366]
              hover:bg-[#DCF8C6]
              hover:shadow-lg
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  {card.value}
                </h2>
              </div>

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#DCF8C6]
                "
              >
                <Icon
                  size={24}
                  className="text-[#25D366]"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}