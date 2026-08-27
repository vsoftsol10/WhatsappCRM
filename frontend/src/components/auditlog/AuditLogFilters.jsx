// const ENTITY_TYPES = [
//   { key: "ALL", label: "All Types" },
//   { key: "Employee", label: "Employee" },
//   { key: "Customer", label: "Customer" },
// ];

// function AuditLogFilters({ entityType, setEntityType }) {
//   return (
//     <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
//       {ENTITY_TYPES.map((item) => {
//         const isActive = entityType === item.key;

//         return (
//           <button
//             key={item.key}
//             type="button"
//             onClick={() => setEntityType(item.key)}
//             className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all ${
//               isActive
//                 ? "border-[#25D366] bg-[#25D366] text-black shadow-md"
//                 : "border-gray-300 bg-white text-slate-700 hover:bg-[#DCF8C6] hover:border-[#25D366]"
//             }`}
//           >
//             {item.label}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// export default AuditLogFilters;

const ENTITY_TYPES = [
  { key: "ALL", label: "All Types" },
  { key: "Employee", label: "Employee" },
  { key: "Customer", label: "Customer" },
  { key: "Lead", label: "Lead" },
  { key: "Task", label: "Task" },
  { key: "Ticket", label: "Ticket" },
  { key: "Campaign", label: "Campaign" },
  { key: "Template", label: "Template" },
  { key: "User", label: "Authentication" },
];

function AuditLogFilters({ entityType, setEntityType }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3 lg:justify-end">
      {ENTITY_TYPES.map((item) => {
        const isActive = entityType === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setEntityType(item.key)}
            className={`flex-shrink-0 whitespace-nowrap rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? "border-[#25D366] bg-[#25D366] text-black shadow-md"
                : "border-gray-300 bg-white text-slate-700 hover:bg-[#DCF8C6] hover:border-[#25D366]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default AuditLogFilters;