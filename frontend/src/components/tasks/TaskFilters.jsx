// import { Search, SlidersHorizontal } from "lucide-react";

// export default function TaskFilters({
//   search,
//   setSearch,
//   statusFilter,
//   setStatusFilter,
//   priorityFilter,
//   setPriorityFilter,
// }) {
//   return (
//     <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

//       {/* Header */}
//       <div className="mb-5 flex items-center gap-3">
//         <SlidersHorizontal
//           size={24}
//           className="text-blue-600"
//         />

//         <h2 className="text-xl font-semibold text-slate-800">
//           Filter Tasks
//         </h2>
//       </div>


//       {/* Filters Row */}
//       <div className="flex flex-col gap-4 lg:flex-row">


//         {/* Search */}
//         <div className="relative flex-1">

//           <Search
//             size={20}
//             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//           />

//           <input
//             type="text"
//             placeholder="Search task..."
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//             className="
//               h-14
//               w-full
//               rounded-2xl
//               border
//               border-gray-300
//               pl-12
//               pr-4
//               text-lg
//               outline-none
//               transition
//               focus:border-blue-500
//               focus:ring-2
//               focus:ring-blue-100
//             "
//           />

//         </div>



//         {/* Status */}
//         <select
//           value={statusFilter}
//           onChange={(e) =>
//             setStatusFilter(e.target.value)
//           }
//           className="
//             h-14
//             rounded-2xl
//             border
//             border-gray-300
//             px-5
//             text-lg
//             outline-none
//             focus:border-blue-500
//           "
//         >

//           <option value="ALL">
//             All Status
//           </option>

//           <option value="TODO">
//             Todo
//           </option>

//           <option value="IN_PROGRESS">
//             In Progress
//           </option>

//           <option value="REVIEW">
//             Review
//           </option>

//           <option value="COMPLETED">
//             Completed
//           </option>

//         </select>



//         {/* Priority */}
//         <select
//           value={priorityFilter}
//           onChange={(e) =>
//             setPriorityFilter(e.target.value)
//           }
//           className="
//             h-14
//             rounded-2xl
//             border
//             border-gray-300
//             px-5
//             text-lg
//             outline-none
//             focus:border-blue-500
//           "
//         >

//           <option value="ALL">
//             All Priority
//           </option>

//           <option value="LOW">
//             Low
//           </option>

//           <option value="MEDIUM">
//             Medium
//           </option>

//           <option value="HIGH">
//             High
//           </option>

//         </select>


//       </div>

//     </div>
//   );
// }

import {
  Search,
  Filter,
  Plus,
} from "lucide-react";

export default function TaskFilters({
  search,
  setSearch,
  priorityFilter,
  setPriorityFilter,
  onCreateTask,
  isAdmin,
}) {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      {/* Left Section */}

      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">

        {/* Search */}

        <div className="relative flex-1">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-300
              pl-11
              pr-4
              text-sm
              outline-none
              transition
              focus:border-[#25D366]
              focus:ring-2
              focus:ring-[#DCF8C6]
            "
          />

        </div>

        {/* Priority Filter */}

        <div className="relative">

          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="
              h-12
              rounded-xl
              border
              border-gray-300
              bg-white
              pl-10
              pr-10
              text-sm
              outline-none
              transition
              focus:border-[#25D366]
              focus:ring-2
              focus:ring-[#DCF8C6]
            "
          >
            <option value="ALL">
              All Priority
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="LOW">
              Low
            </option>
          </select>

        </div>

      </div>

      {/* Right Section */}

      {isAdmin && (
        <button
          onClick={onCreateTask}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#25D366]
            px-5
            py-3
            font-medium
            text-black
            transition
            hover:bg-[#128C7E]
          "
        >
          <Plus size={18} />
          Add Task
        </button>
      )}

    </div>
  );
}