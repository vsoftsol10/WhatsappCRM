import { Plus } from "lucide-react";

function TicketHeader({
  setShowForm,
  setIsEditing,
  setForm,
}) {
  const handleAddTicket = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "OPEN",
      customerId: "",
      assignedToId: "",
    });

    setIsEditing(false);
    setShowForm(true);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h1 className="crm-title text-slate-800">
          Tickets
        </h1>

        <p className="crm-subtitle text-slate-500">
          Manage customer support tickets
        </p>
      </div>

      <button
        onClick={handleAddTicket}
        className="crm-primary-button w-full sm:w-auto"
      >
        <Plus size={18} />
        Add Ticket
      </button>
    </div>
  );
}

export default TicketHeader;
