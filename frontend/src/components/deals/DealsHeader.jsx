import { Search, Plus, LayoutGrid, Rows3 } from "lucide-react";

const stages = [
  "ALL",
  "LEAD",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

export default function DealsHeader({
  searchTerm,
  setSearchTerm,
  selectedStage,
  setSelectedStage,
  view,
  setView,
  onAddDeal,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Top */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Deals Pipeline
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your deals and sales pipeline
          </p>
        </div>

        <button
          onClick={onAddDeal}
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] transition px-5 py-3 rounded-xl font-semibold shadow"
        >
          <Plus size={18} />
          Add Deal
        </button>
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between mt-6">
        <div className="relative flex-1 max-w-xl">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deals..."
            className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366]"
          />
        </div>

        <div className="flex rounded-xl border overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-5 py-3 transition ${
              view === "list"
                ? "bg-[#25D366] font-semibold"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <Rows3 size={18} />
            List
          </button>

          <button
            onClick={() => setView("kanban")}
            className={`flex items-center gap-2 px-5 py-3 transition ${
              view === "kanban"
                ? "bg-[#25D366] font-semibold"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <LayoutGrid size={18} />
            Grid
          </button>
        </div>
      </div>

      {/* Stage Filter */}
      <div className="flex flex-wrap gap-3 mt-6">
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => setSelectedStage(stage)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedStage === stage
                ? "bg-[#25D366] text-black"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {stage}
          </button>
        ))}
      </div>
    </div>
  );
}