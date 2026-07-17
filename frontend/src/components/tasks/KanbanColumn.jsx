import KanbanTaskCard from "./KanbanTaskCard";

export default function KanbanColumn({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const getHeaderColor = () => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-700 border-gray-300";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-300";

      case "REVIEW":
        return "bg-[#DCF8C6] text-[#128C7E] border-[#25D366]";

      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-300";

      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 min-h-[650px] flex flex-col">
      {/* HEADER */}
      <div
        className={`flex items-center justify-between px-5 py-4 rounded-t-2xl border-b ${getHeaderColor()}`}
      >
        <h2 className="font-semibold text-sm tracking-wide">
          {title}
        </h2>

        <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {tasks.length}
        </span>
      </div>

      {/* TASK LIST */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <KanbanTaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl">
            <p className="text-sm text-gray-400">
              No tasks available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}