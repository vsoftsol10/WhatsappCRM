// import { Plus } from "lucide-react";

// function TicketHeader({
//   setShowForm,
//   setIsEditing,
//   setForm,
// }) {
//   const handleAddTicket = () => {
//     setForm({
//       id: null,
//       title: "",
//       description: "",
//       priority: "MEDIUM",
//       status: "OPEN",
//       customerId: "",
//       assignedToId: "",
//     });

//     setIsEditing(false);
//     setShowForm(true);
//   };

//   return (
//     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-800">
//           Tickets
//         </h1>

//         <p className="text-slate-500">
//           Manage customer support tickets
//         </p>
//       </div>

//       <button
//         onClick={handleAddTicket}
//         className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-semibold transition"
//       >
//         <Plus size={18} />
//         Add Ticket
//       </button>
//     </div>
//   );
// }

// export default TicketHeader;

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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Tickets
        </h1>

        <p className="text-slate-500">
          Manage customer support tickets
        </p>
      </div>

      <button
        onClick={handleAddTicket}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-xl font-semibold transition"
      >
        <Plus size={18} />
        Add Ticket
      </button>
    </div>
  );
}

export default TicketHeader;