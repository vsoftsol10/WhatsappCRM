import { useMemo } from "react";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const columns = useMemo(() => {
    return {
      TODO: tasks.filter((task) => task.status === "TODO"),

      IN_PROGRESS: tasks.filter(
        (task) => task.status === "IN_PROGRESS"
      ),

      REVIEW: tasks.filter(
        (task) => task.status === "REVIEW"
      ),

      COMPLETED: tasks.filter(
        (task) => task.status === "COMPLETED"
      ),
    };
  }, [tasks]);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KanbanColumn
          title="Todo"
          status="TODO"
          tasks={columns.TODO}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />

        <KanbanColumn
          title="In Progress"
          status="IN_PROGRESS"
          tasks={columns.IN_PROGRESS}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />

        <KanbanColumn
          title="Review"
          status="REVIEW"
          tasks={columns.REVIEW}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />

        <KanbanColumn
          title="Completed"
          status="COMPLETED"
          tasks={columns.COMPLETED}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}