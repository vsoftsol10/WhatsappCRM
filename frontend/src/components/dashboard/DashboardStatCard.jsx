// import { ArrowUpRight } from "lucide-react";

// export default function DashboardStatCard({
//   title,
//   value,
//   subtitle,
//   icon: Icon,
//   iconBg = "bg-yellow-100",
//   iconColor = "text-yellow-600",
//   borderColor = "from-yellow-500 to-orange-500",
// }) {
//   return (
//     <div
//       className="
//         group
//         relative
//         overflow-hidden
//         rounded-2xl
//         border
//         border-gray-200
//         bg-white
//         p-5
//         shadow-sm
//         transition-all
//         duration-300
//         hover:-translate-y-1
//         hover:shadow-lg
//         hover:border-blue-200
//       "
//     >
//       {/* Gradient Top Border */}
//       <div
//         className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${borderColor}`}
//       />

//       {/* Decorative Background */}
//       <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gray-100 blur-3xl opacity-70"></div>

//       <div className="relative flex items-start justify-between">
//         {/* Left */}
//         <div>
//           <p className="text-sm font-medium text-gray-500">
//             {title}
//           </p>

//           <h2 className="mt-2 text-3xl font-bold text-gray-900">
//             {value ?? 0}
//           </h2>

//           {subtitle && (
//             <p className="mt-2 text-sm text-gray-500">
//               {subtitle}
//             </p>
//           )}
//         </div>

//         {/* Right Icon */}
//         <div
//           className={`
//             flex
//             h-14
//             w-14
//             items-center
//             justify-center
//             rounded-2xl
//             ${iconBg}
//             transition-transform
//             duration-300
//             group-hover:scale-110
//           `}
//         >
//           {Icon && (
//             <Icon
//               size={28}
//               className={iconColor}
//             />
//           )}
//         </div>
//       </div>

//       {/* Bottom */}
//       <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
//         <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//           Live Data
//         </span>

//         <ArrowUpRight
//           size={18}
//           className="text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-600"
//         />
//       </div>
//     </div>
//   );
// }

import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = "bg-yellow-100",
  iconColor = "text-yellow-600",
  borderColor = "from-yellow-500 to-orange-500",
  path,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => path && navigate(path)}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
        hover:border-blue-200
        cursor-pointer
      "
    >
      {/* Gradient Top Border */}
      <div
        className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${borderColor}`}
      />

      {/* Decorative Background */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gray-100 blur-3xl opacity-70"></div>

      <div className="relative flex items-start justify-between">
        {/* Left */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {value ?? 0}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Icon */}
        <div
          className={`
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            ${iconBg}
            transition-transform
            duration-300
            group-hover:scale-110
          `}
        >
          {Icon && (
            <Icon
              size={28}
              className={iconColor}
            />
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Live Data
        </span>

        <ArrowUpRight
          size={18}
          className="text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-600"
        />
      </div>
    </div>
  );
}