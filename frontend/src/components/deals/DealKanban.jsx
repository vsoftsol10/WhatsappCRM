import DealColumn from "./DealColumn";

const stages = [
  "LEAD",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

export default function DealKanban({
  deals,
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <div className="grid grid-cols-5 gap-4 mt-6">
      {stages.map((stage) => (
        <DealColumn
          key={stage}
          stage={stage}
          deals={(deals || []).filter(
            (deal) => deal.stage === stage
          )}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}