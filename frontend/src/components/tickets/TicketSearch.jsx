// import { Search } from "lucide-react";

// function TicketSearch({
//   searchTerm,
//   setSearchTerm,
// }) {
//   return (
//     <div className="mb-10">
//       <div className="relative w-full max-w-xl">
//         <Search
//           size={22}
//           className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
//         />

//         <input
//           type="text"
//           placeholder="Search tickets..."
//           value={searchTerm}
//           onChange={(e) =>
//             setSearchTerm(e.target.value)
//           }
//           className="
//             w-full
//             h-14
//             rounded-2xl
//             border
//             border-gray-300
//             bg-white
//             pl-14
//             pr-5
//             text-lg
//             placeholder:text-gray-400
//             shadow-sm
//             transition
//             focus:outline-none
//             focus:ring-2
//             focus:ring-[#25D366]
//             focus:border-[#25D366]
//           "
//         />
//       </div>
//     </div>
//   );
// }

// export default TicketSearch;

import { Search } from "lucide-react";

function TicketSearch({
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div>
      <div className="relative w-full max-w-xl">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="
            w-full
            h-12
            rounded-2xl
            border
            border-gray-300
            bg-white
            pl-12
            pr-4
            text-base
            placeholder:text-gray-400
            shadow-sm
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-[#25D366]
            focus:border-[#25D366]
          "
        />
      </div>
    </div>
  );
}

export default TicketSearch;