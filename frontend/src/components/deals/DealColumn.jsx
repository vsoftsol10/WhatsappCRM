import DealCard from "./DealCard";

export default function DealColumn({
  stage,
  deals,
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-black">
          {stage}
        </h2>

        <span className="bg-[#DCF8C6] text-[#128C7E] px-2 py-1 text-xs rounded-full">
          {deals.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {deals.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-6">
            No Deals
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))
        )}
      </div>
    </div>
  );
}