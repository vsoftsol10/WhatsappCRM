// import {
//   Users,
//   UserPlus,
//   PhoneCall,
//   BadgeCheck,
//   Trophy,
// } from "lucide-react";

// export default function LeadStats({
//   totalLeads,
//   newLeads,
//   contactedLeads,
//   qualifiedLeads,
//   wonLeads,
// }) {
//   const stats = [
//     {
//       title: "Total Leads",
//       value: totalLeads,
//       icon: Users,
//       border: "border-gray-300",
//     },
//     {
//       title: "New",
//       value: newLeads,
//       icon: UserPlus,
//       border: "border-[#25D366]",
//     },
//     {
//       title: "Contacted",
//       value: contactedLeads,
//       icon: PhoneCall,
//       border: "border-blue-500",
//     },
//     {
//       title: "Qualified",
//       value: qualifiedLeads,
//       icon: BadgeCheck,
//       border: "border-purple-500",
//     },
//     {
//       title: "Won",
//       value: wonLeads,
//       icon: Trophy,
//       border: "border-green-500",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
//       {stats.map((stat) => {
//         const Icon = stat.icon;

//         return (
//           <div
//             key={stat.title}
//             className={`bg-white rounded-2xl border-t-4 ${stat.border} p-5 shadow-sm`}
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-gray-500 text-sm">
//                   {stat.title}
//                 </p>

//                 <h2 className="text-3xl font-bold mt-2">
//                   {stat.value}
//                 </h2>
//               </div>

//               <Icon size={24} />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import {
  Users,
  UserPlus,
  PhoneCall,
  BadgeCheck,
  Trophy,
} from "lucide-react";

export default function LeadStats({
  totalLeads,
  newLeads,
  contactedLeads,
  qualifiedLeads,
  wonLeads,
}) {
  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
    },
    {
      title: "New",
      value: newLeads,
      icon: UserPlus,
    },
    {
      title: "Contacted",
      value: contactedLeads,
      icon: PhoneCall,
    },
    {
      title: "Qualified",
      value: qualifiedLeads,
      icon: BadgeCheck,
    },
    {
      title: "Won",
      value: wonLeads,
      icon: Trophy,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-6">
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
              hover:border-[#25D366]
              hover:bg-[#DCF8C6]
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

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCF8C6]">
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