import { useState } from "react";
import { MoreVertical, Calendar, User, Flag } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function KanbanTaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const { user } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const currentUserId = user?.id || user?.userId;

  const canUpdateStatus =
    isAdmin || task.assignedToId === currentUserId;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";

      case "MEDIUM":
        return "bg-[#DCF8C6] text-[#128C7E]";

      case "LOW":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "REVIEW":
        return "bg-[#DCF8C6] text-[#128C7E]";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative hover:shadow-md transition-all duration-200">
      {/* MENU */}
      {isAdmin && (
        <div className="absolute top-3 right-3">
          <MoreVertical
            size={18}
            className="cursor-pointer text-gray-500"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-28 rounded-lg border bg-white shadow-lg z-20">
              <button
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      {/* TITLE */}
      <h3 className="font-semibold text-gray-800 pr-6">
        {task.title}
      </h3>

      {/* DESCRIPTION */}
      {task.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* ASSIGNEE */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
        <User size={15} />
        <span>{task.assignedTo?.name || "Unassigned"}</span>
      </div>

      {/* DUE DATE */}
      {task.dueDate && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <Calendar size={15} />
          <span>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between mt-4 gap-2">
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
            task.priority
          )}`}
        >
          <Flag size={12} />
          {task.priority}
        </span>

        {canUpdateStatus ? (
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value)
            }
            className={`text-xs rounded-lg border px-2 py-1 ${getStatusColor(
              task.status
            )}`}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">
              IN PROGRESS
            </option>
            <option value="REVIEW">REVIEW</option>
            <option value="COMPLETED">
              COMPLETED
            </option>
          </select>
        ) : (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
        )}
      </div>
    </div>
  );
}