// import { useEffect, useMemo, useState } from "react";
// import useLeadStore from "../store/leadStore";

// import LeadCard from "../components/leads/LeadCard";
// import LeadStats from "../components/leads/LeadStats";
// import LeadFilters from "../components/leads/LeadFilters";
// import AddLeadModal from "../components/leads/AddLeadModal";
// import EditLeadModal from "../components/leads/EditLeadModal";

// import LeadTable from "../components/leads/LeadTable";
// import { LayoutGrid, List } from "lucide-react";

// export default function Lead() {
//   const {
//     leads,
//     isLoading,
//     error,
//     fetchLeads,
//     removeLead,
//     changeLeadStatus,
//   } = useLeadStore();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("ALL");

//   const [showAddModal, setShowAddModal] = useState(false);

//   const [showEditModal, setShowEditModal] = useState(false);

//   const [selectedLead, setSelectedLead] = useState(null);

//   const [viewMode, setViewMode] = useState("grid");

//   useEffect(() => {
//     fetchLeads();
//   }, [fetchLeads]);

//   // =========================
//   // LEAD STATS
//   // =========================

//   const totalLeads = leads.length;

//   const newLeads = leads.filter(
//     (lead) => lead.status === "NEW"
//   ).length;

//   const contactedLeads = leads.filter(
//     (lead) => lead.status === "CONTACTED"
//   ).length;

//   const qualifiedLeads = leads.filter(
//     (lead) => lead.status === "QUALIFIED"
//   ).length;

//   const wonLeads = leads.filter(
//     (lead) => lead.status === "WON"
//   ).length;

//   // =========================
//   // SEARCH
//   // =========================

//   const searchedLeads = useMemo(() => {
//     return leads.filter((lead) =>
//       `${lead.name || ""} ${lead.email || ""} ${
//         lead.phone || ""
//       }`
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//   }, [leads, searchTerm]);

//   // =========================
//   // STATUS FILTER
//   // =========================

//   const filteredLeads = useMemo(() => {
//     if (selectedStatus === "ALL")
//       return searchedLeads;

//     return searchedLeads.filter(
//       (lead) => lead.status === selectedStatus
//     );
//   }, [searchedLeads, selectedStatus]);

//   // ===============================

//   const handleEdit = (lead) => {
//     setSelectedLead(lead);
//     setShowEditModal(true);
//   };

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this lead?"
//     );

//     if (!confirmed) return;

//     try {
//       await removeLead(id);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleStatusChange = async (
//     id,
//     status
//   ) => {
//     try {
//       await changeLeadStatus(id, status);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // =========================
//   // ERROR
//   // =========================

//   if (error) {
//     return (
//       <div className="p-6 text-red-500">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6 ml-8.5">

//       {/* ================= HEADER ================= */}

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

//           <div>
//             <h1 className="text-4xl font-bold">
//               Leads
//             </h1>

//             <p className="text-gray-500">
//               Manage your WhatsApp CRM leads
//             </p>
//           </div>

//           <div className="flex gap-3">
            
//             {/* <input
//               type="text"
//               placeholder="Search leads..."
//               value={searchTerm}
//               onChange={(e) =>
//                 setSearchTerm(e.target.value)
//               }
//               className="border rounded-xl px-4 py-2 w-80"
//             /> */}

//             <button
//               onClick={() =>
//                 setShowAddModal(true)
//               }
//               className="bg-[#25D366] px-5 py-2 rounded-xl font-semibold"
//             >
//               + Add Lead
//             </button>

//           </div>

//         </div>

//       {/* ================= STATS ================= */}

//       <LeadStats
//         totalLeads={totalLeads}
//         newLeads={newLeads}
//         contactedLeads={contactedLeads}
//         qualifiedLeads={qualifiedLeads}
//         wonLeads={wonLeads}
//       />

//       {/* ================= FILTERS ================= */}

//       <LeadFilters
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         selectedStatus={selectedStatus}
//         setSelectedStatus={setSelectedStatus}
//       />

//       {/* ================= LOADING ================= */}

//       {isLoading ? (
//         <div className="text-center py-10">
//           Loading leads...
//         </div>
//       ) : filteredLeads.length === 0 ? (
//         <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

//           <h3 className="text-xl font-semibold">
//             No Leads Found
//           </h3>

//           <p className="text-gray-500 mt-2">
//             Create your first lead to get started.
//           </p>

//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

//           {filteredLeads.map((lead) => (
//             <LeadCard
//               key={lead.id}
//               lead={lead}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//               onStatusChange={handleStatusChange}
//             />
//           ))}

//         </div>
//       )}

//       {/* ================= ADD MODAL ================= */}

//       <AddLeadModal
//         isOpen={showAddModal}
//         onClose={() =>
//           setShowAddModal(false)
//         }
//       />

//       <EditLeadModal
//         isOpen={showEditModal}
//         onClose={() =>
//           setShowEditModal(false)
//         }
//         lead={selectedLead}
//       />

//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";

import useLeadStore from "../store/leadStore";

import LeadCard from "../components/leads/LeadCard";
import LeadTable from "../components/leads/LeadTable";
import LeadStats from "../components/leads/LeadStats";
import LeadFilters from "../components/leads/LeadFilters";
import AddLeadModal from "../components/leads/AddLeadModal";
import EditLeadModal from "../components/leads/EditLeadModal";
import toast from "react-hot-toast";
import { getCustomers } from "../api/customerApi";
import useCustomerStore from "../store/customerStore";
import Pagination from "../components/common/Pagination";

export default function Lead() {
  const {
    leads,
    isLoading,
    error,
    fetchLeads,
    removeLead,
    changeLeadStatus,
    convertLead,
  } = useLeadStore();

  const setCustomers = useCustomerStore(
  (state) => state.setCustomers
);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [viewMode, setViewMode] =
    useState("grid");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedLead, setSelectedLead] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 9;

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    console.log("Leads:", leads);
  }, [leads]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedStatus,
    viewMode,
  ]);

  // =========================
  // LEAD STATS
  // =========================

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "NEW"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "CONTACTED"
  ).length;

  const qualifiedLeads = leads.filter(
    (lead) => lead.status === "QUALIFIED"
  ).length;

  const wonLeads = leads.filter(
    (lead) => lead.status === "WON"
  ).length;

  // =========================
  // SEARCH
  // =========================

  const searchedLeads = useMemo(() => {
    return leads.filter((lead) =>
      `${lead.name || ""} ${lead.email || ""} ${
        lead.phone || ""
      }`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  // =========================
  // STATUS FILTER
  // =========================

  const filteredLeads = useMemo(() => {
    if (selectedStatus === "ALL") {
      return searchedLeads;
    }

    return searchedLeads.filter(
      (lead) => lead.status === selectedStatus
    );
  }, [searchedLeads, selectedStatus]);

      // =========================
    // PAGINATION
    // =========================

    const totalPages = Math.ceil(
      filteredLeads.length / itemsPerPage
    );

    const startIndex =
      (currentPage - 1) * itemsPerPage;

    const paginatedLeads =
      filteredLeads.slice(
        startIndex,
        startIndex + itemsPerPage
      );


  // =========================
  // HANDLERS
  // =========================

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this lead?"
  );

  if (!confirmed) return;

  try {
    await removeLead(id);

    toast.success("Lead deleted successfully");
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to delete lead"
    );
  }
};

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      await changeLeadStatus(id, status);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="crm-page text-red-500">
        {error}
      </div>
    );
  }

  const handleConvert = async (id) => {
     console.log("handleConvert called", id);
  try {
    await convertLead(id);

    const response = await getCustomers();
    setCustomers(response.data);

    await fetchLeads();

    toast.success("Lead converted to customer successfully");
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
        "Failed to convert lead"
    );
  }
};

  return (

        <div className="crm-page space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0">
          <h1 className="crm-title">
            Leads
          </h1>

          <p className="crm-subtitle">
            Manage your WhatsApp CRM leads
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* Grid / List Toggle */}

          <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">

            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition ${
                viewMode === "grid"
                  ? "bg-[#25D366]"
                  : "hover:bg-gray-100"
              }`}
            >
              <LayoutGrid size={18} />
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition ${
                viewMode === "list"
                  ? "bg-[#25D366]"
                  : "hover:bg-gray-100"
              }`}
            >
              <List size={18} />
            </button>

          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="crm-primary-button w-full sm:w-auto"
          >
            + Add Lead
          </button>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <LeadStats
        totalLeads={totalLeads}
        newLeads={newLeads}
        contactedLeads={contactedLeads}
        qualifiedLeads={qualifiedLeads}
        wonLeads={wonLeads}
      />

      {/* ================= FILTERS ================= */}

      <LeadFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* ================= CONTENT ================= */}

      {isLoading ? (
        <div className="py-10 text-center">
          Loading leads...
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="crm-page-surface p-8 text-center sm:p-10">

          <h3 className="text-xl font-semibold">
            No Leads Found
          </h3>

          <p className="text-gray-500 mt-2">
            Create your first lead to get started.
          </p>

        </div>
      ) : viewMode === "grid" ? (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">

          {paginatedLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
               onConvert={handleConvert}
            />
          ))}

        </div>

      ) : (

        <LeadTable
          leads={paginatedLeads}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onConvert={handleConvert}
        />

      )}

      {filteredLeads.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLeads.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

      {/* ================= ADD MODAL ================= */}

      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* ================= EDIT MODAL ================= */}

      <EditLeadModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        lead={selectedLead}
      />

    </div>
  );
}
