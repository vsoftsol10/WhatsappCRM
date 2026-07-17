// import {
//   FileText,
//   CheckCircle,
//   XCircle,
//   Layers,
// } from "lucide-react";

// export default function TemplateStats({
//   templates = [],
// }) {
//   const totalTemplates =
//     templates.length;

//   const draftTemplates =
//     templates.filter(
//       (template) =>
//         template.status === "DRAFT"
//     ).length;

//   const activeTemplates =
//     templates.filter(
//       (template) =>
//         template.status === "ACTIVE"
//     ).length;

//   const inactiveTemplates =
//     templates.filter(
//       (template) =>
//         template.status === "INACTIVE"
//     ).length;

//   const stats = [
//     {
//       title: "Total Templates",
//       value: totalTemplates,
//       icon: Layers,
//       bg: "bg-blue-100",
//       text: "text-blue-600",
//     },
//     {
//       title: "Draft",
//       value: draftTemplates,
//       icon: FileText,
//       bg: "bg-gray-100",
//       text: "text-gray-600",
//     },
//     {
//       title: "Active",
//       value: activeTemplates,
//       icon: CheckCircle,
//       bg: "bg-green-100",
//       text: "text-[#128C7E]",
//     },
//     {
//       title: "Inactive",
//       value: inactiveTemplates,
//       icon: XCircle,
//       bg: "bg-red-100",
//       text: "text-red-600",
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
  FileText,
  CheckCircle,
  XCircle,
  Layers,
} from "lucide-react";

export default function TemplateStats({
  templates = [],
}) {
  const totalTemplates = templates.length;

  const draftTemplates = templates.filter(
    (template) => template.status === "DRAFT"
  ).length;

  const activeTemplates = templates.filter(
    (template) => template.status === "ACTIVE"
  ).length;

  const inactiveTemplates = templates.filter(
    (template) => template.status === "INACTIVE"
  ).length;

  const stats = [
    {
      title: "Total Templates",
      value: totalTemplates,
      icon: Layers,
    },
    {
      title: "Draft",
      value: draftTemplates,
      icon: FileText,
    },
    {
      title: "Active",
      value: activeTemplates,
      icon: CheckCircle,
    },
    {
      title: "Inactive",
      value: inactiveTemplates,
      icon: XCircle,
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