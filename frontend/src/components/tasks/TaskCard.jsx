import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import {
  MoreVertical,
  Calendar,
  User,
  Flag,
} from "lucide-react";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const { user } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  // Use the correct user id field from your auth store
  const currentUserId =
    user?.id || user?.userId;

  const canUpdateStatus =
    isAdmin ||
    task.assignedToId === currentUserId;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600 bg-red-50";

      case "MEDIUM":
        return "text-[#25D366] bg-[#DCF8C6]";

      case "LOW":
        return "text-[#128C7E] bg-[#DCF8C6]";

      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "TODO":
        return "text-gray-600 bg-gray-100";

      case "IN_PROGRESS":
        return "text-blue-600 bg-blue-50";

      case "REVIEW":
        return "text-[#25D366] bg-[#DCF8C6]";

      case "COMPLETED":
        return "text-[#128C7E] bg-[#DCF8C6]";

      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 relative">
      {/* TOP MENU (ADMIN ONLY) */}
      {isAdmin && (
        <div className="absolute top-3 right-3">
          <div className="relative">
            <MoreVertical
              size={18}
              className="cursor-pointer text-gray-500"
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
            />

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-28 z-20">
                <button
                  onClick={() => {
                    onEdit(task);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm rounded-2xl"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    onDelete(task.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-sm text-red-600 rounded-2xl"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TITLE */}
      <h2 className="text-lg font-semibold pr-6">
        {task.title}
      </h2>

      {/* DESCRIPTION */}
      {task.description && (
        <p className="text-gray-500 text-sm">
          {task.description}
        </p>
      )}

      {/* ASSIGNED USER */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User size={16} />
        <span>
          {task.assignedTo?.name ||
            "Unassigned"}
        </span>
      </div>

      {/* DUE DATE */}
      {task.dueDate && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>
            {new Date(
              task.dueDate
            ).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* PRIORITY + STATUS */}
      <div className="flex flex-wrap gap-2 mt-2">
        {/* PRIORITY */}
        <span
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
            task.priority
          )}`}
        >
          <Flag size={14} />
          {task.priority}
        </span>

        {/* STATUS */}
        {canUpdateStatus ? (
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(
                task.id,
                e.target.value
              )
            }
            className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(
              task.status
            )}`}
          >
            <option value="TODO">
              TODO
            </option>

            <option value="IN_PROGRESS">
              IN PROGRESS
            </option>

            <option value="REVIEW">
              REVIEW
            </option>

            <option value="COMPLETED">
              COMPLETED
            </option>
          </select>
        ) : (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
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

