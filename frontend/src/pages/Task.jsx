// import { useEffect, useMemo, useState } from "react";
// import toast from "react-hot-toast";

// import { useAuthStore } from "../store/authStore";
// import useTaskStore from "../store/taskStore";

// import TaskStats from "../components/tasks/TaskStats";
// import TaskFilters from "../components/tasks/TaskFilters";
// import TaskTable from "../components/tasks/TaskTable";
// import CreateTaskModal from "../components/tasks/CreateTaskModal";
// import EditTaskModal from "../components/tasks/EditTaskModal";
// import KanbanBoard from "../components/tasks/KanbanBoard";

// export default function Tasks() {
//   const { user } = useAuthStore();

//   const [viewMode, setViewMode] = useState("LIST");

//   const {
//     tasks,
//     fetchTasks,
//     removeTask,
//     changeTaskStatus,
//     isLoading,
//   } = useTaskStore();

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] =
//     useState("ALL");

//   const [priorityFilter, setPriorityFilter] =
//     useState("ALL");

//   const [showCreateModal, setShowCreateModal] =
//     useState(false);

//   const [showEditModal, setShowEditModal] =
//     useState(false);

//   const [selectedTask, setSelectedTask] =
//     useState(null);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const filteredTasks = useMemo(() => {
//     return tasks.filter((task) => {
//       const matchesSearch =
//         task.title
//           ?.toLowerCase()
//           .includes(search.toLowerCase());

//       const matchesStatus =
//         statusFilter === "ALL"
//           ? true
//           : task.status === statusFilter;

//       const matchesPriority =
//         priorityFilter === "ALL"
//           ? true
//           : task.priority === priorityFilter;

//       return (
//         matchesSearch &&
//         matchesStatus &&
//         matchesPriority
//       );
//     });
//   }, [
//     tasks,
//     search,
//     statusFilter,
//     priorityFilter,
//   ]);

//   const handleEdit = (task) => {
//     setSelectedTask(task);
//     setShowEditModal(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await removeTask(id);

//       toast.success(
//         "Task deleted successfully!"
//       );
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         "Failed to delete task."
//       );
//     }
//   };

//   const handleStatusChange = async (
//     id,
//     status
//   ) => {
//     try {
//       await changeTaskStatus(id, status);

//       toast.success(
//         "Task status updated successfully!"
//       );
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         "Failed to update task status."
//       );
//     }
//   };

//   return (
//     <div className="p-6 ml-8.5">
//       {/* HEADER */}

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">
//             Tasks
//           </h1>

//           <p className="text-gray-500">
//             Manage and monitor your tasks
//           </p>
//         </div>

//         {user?.role === "ADMIN" && (
//           <button
//             onClick={() =>
//               setShowCreateModal(true)
//             }
//             className="bg-yellow-400 text-black px-5 py-3 rounded-xl font-medium"
//           >
//             Create Task
//           </button>
//         )}
//       </div>

//       {/* STATS */}

//       <TaskStats tasks={tasks} />

//       {/* FILTERS */}

//       <TaskFilters
//         search={search}
//         setSearch={setSearch}
//         statusFilter={statusFilter}
//         setStatusFilter={setStatusFilter}
//         priorityFilter={priorityFilter}
//         setPriorityFilter={
//           setPriorityFilter
//         }
//       />

//       {/* VIEW TOGGLE */}
//       <div className="flex justify-end mt-4">
//         <div className="bg-white shadow-sm border rounded-lg p-1 flex gap-1">
//           <button
//             onClick={() => setViewMode("LIST")}
//             className={`px-4 py-2 text-sm rounded-md ${
//               viewMode === "LIST"
//                 ? "bg-yellow-400 text-black"
//                 : "text-gray-600"
//             }`}
//           >
//             List
//           </button>

//           <button
//             onClick={() => setViewMode("KANBAN")}
//             className={`px-4 py-2 text-sm rounded-md ${
//               viewMode === "KANBAN"
//                 ? "bg-yellow-400 text-black"
//                 : "text-gray-600"
//             }`}
//           >
//             Grid
//           </button>
//         </div>
//       </div>

//       {/* LOADING */}

//       {isLoading && (
//         <div className="mt-8 text-center">
//           Loading tasks...
//         </div>
//       )}

//       {/* EMPTY */}

//       {!isLoading &&
//         filteredTasks.length === 0 && (
//           <div className="bg-white rounded-xl p-10 text-center mt-6">
//             <h3 className="font-semibold text-lg">
//               No Tasks Found
//             </h3>

//             <p className="text-gray-500 mt-2">
//               {user?.role === "ADMIN"
//                 ? "Create your first task."
//                 : "No tasks have been assigned to you."}
//             </p>
//           </div>
//         )}

//       {/* GRID */}

//       {/* {!isLoading &&
//         filteredTasks.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
//             {filteredTasks.map((task) => (
//               <TaskCard
//                 key={task.id}
//                 task={task}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 onStatusChange={
//                   handleStatusChange
//                 }
//               />
//             ))}
//           </div>
//         )} */}

//         {!isLoading &&
//           filteredTasks.length > 0 &&
//           (viewMode === "LIST" ? (
//             <TaskTable
//               tasks={filteredTasks}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//               onStatusChange={handleStatusChange}
//             />
//           ) : (
//             <KanbanBoard
//               tasks={filteredTasks}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//               onStatusChange={handleStatusChange}
//             />
//           ))}

//       {/* MODALS */}

//       <CreateTaskModal
//         isOpen={showCreateModal}
//         onClose={() =>
//           setShowCreateModal(false)
//         }
//       />

//       <EditTaskModal
//         isOpen={showEditModal}
//         onClose={() => {
//           setShowEditModal(false);
//           setSelectedTask(null);
//         }}
//         task={selectedTask}
//       />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  LayoutGrid,
  Table2,
} from "lucide-react";

import { useAuthStore } from "../store/authStore";
import useTaskStore from "../store/taskStore";

import TaskStats from "../components/tasks/TaskStats";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskTable from "../components/tasks/TaskTable";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import EditTaskModal from "../components/tasks/EditTaskModal";
import KanbanBoard from "../components/tasks/KanbanBoard";
import Pagination from "../components/common/Pagination";

export default function Tasks() {
  const { user } = useAuthStore();

  const {
    tasks,
    fetchTasks,
    removeTask,
    changeTaskStatus,
    isLoading,
  } = useTaskStore();

  const [viewMode, setViewMode] = useState("LIST");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [priorityFilter, setPriorityFilter] =
    useState("ALL");

    const [currentPage, setCurrentPage] = useState(1);

const itemsPerPage = 10;

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL"
          ? true
          : task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
  ]);

  useEffect(() => {
  setCurrentPage(1);
}, [search, statusFilter, priorityFilter]);

const totalPages = Math.ceil(
  filteredTasks.length / itemsPerPage
);

const startIndex =
  (currentPage - 1) * itemsPerPage;

const paginatedTasks =
  filteredTasks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await removeTask(id);

      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete task.");
    }
  };

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      await changeTaskStatus(id, status);

      toast.success(
        "Task status updated successfully!"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update task status."
      );
    }
  };

  const { editTask } = useTaskStore();

  const handlePriorityChange = async (id, priority) => {
    try {
      const task = tasks.find((t) => t.id === id);

      await editTask(id, {
        ...task,
        priority,
      });

      toast.success("Task priority updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task priority.");
    }
  };

  return (
    <div className="p-6">

      {/* ========================= */}
      {/* PAGE HEADER */}
      {/* ========================= */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Tasks
        </h1>

        <p className="mt-1 text-gray-500">
          Manage and monitor your tasks
        </p>

      </div>

            {/* ========================= */}
      {/* STATS */}
      {/* ========================= */}

      <TaskStats tasks={tasks} />

      {/* ========================= */}
      {/* TOOLBAR */}
      {/* ========================= */}

      <TaskFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onCreateTask={() => setShowCreateModal(true)}
        isAdmin={user?.role === "ADMIN"}
      />

      {/* ========================= */}
      {/* FILTER CHIPS + VIEW TOGGLE */}
      {/* ========================= */}

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Filter Chips */}

        <div className="flex flex-wrap gap-3">

          {[
            "ALL",
            "TODO",
            "IN_PROGRESS",
            "REVIEW",
            "COMPLETED",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                statusFilter === status
                  ? "bg-yellow-400 text-black"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}

        </div>

        {/* View Toggle */}

        <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm">

          <button
            onClick={() => setViewMode("LIST")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              viewMode === "LIST"
                ? "bg-yellow-400 text-black"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Table2 size={18} />
            Table
          </button>

          <button
            onClick={() => setViewMode("KANBAN")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              viewMode === "KANBAN"
                ? "bg-yellow-400 text-black"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LayoutGrid size={18} />
            Grid
          </button>

        </div>

      </div>

      {/* ========================= */}
      {/* LOADING */}
      {/* ========================= */}

      {isLoading && (
        <div className="mt-10 text-center text-gray-500">
          Loading tasks...
        </div>
      )}

      {/* ========================= */}
      {/* EMPTY */}
      {/* ========================= */}

      {!isLoading &&
        filteredTasks.length === 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

            <h3 className="text-xl font-semibold text-slate-800">
              No Tasks Found
            </h3>

            <p className="mt-2 text-gray-500">
              {user?.role === "ADMIN"
                ? "Create your first task."
                : "No tasks have been assigned to you."}
            </p>

          </div>
        )}

      {/* ========================= */}
      {/* CONTENT */}
      {/* ========================= */}

      {!isLoading &&
        filteredTasks.length > 0 &&
        (viewMode === "LIST" ? (
          <TaskTable
            tasks={paginatedTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
          />
        ) : (
          <KanbanBoard
            tasks={paginatedTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}

        {filteredTasks.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTasks.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

      {/* ========================= */}
      {/* MODALS */}
      {/* ========================= */}

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
}