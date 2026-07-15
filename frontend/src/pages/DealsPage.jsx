import { useEffect, useState } from "react";

import useDealStore from "../store/dealStore";

import DealsHeader from "../components/deals/DealsHeader";
import DealKanban from "../components/deals/DealKanban";
import DealListCard from "../components/deals/DealListCard";
import DealList from "../components/deals/DealList";

import AddDealModal from "../components/deals/AddDealModal";
import EditDealModal from "../components/deals/EditDealModal";
import DealDetailsModal from "../components/deals/DealDetailsModal";

export default function DealsPage() {

  console.log("DealsPage Render");

  const {
    deals,
    customers,
    employees,
    isLoading,
    isFetchingDeals,

    fetchDeals,
    fetchCustomers,
    fetchEmployees,

    addDeal,
    editDeal,
    removeDeal,
    changeDealStage,
  } = useDealStore();

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [selectedDeal, setSelectedDeal] = useState(null);

  // Header
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [view, setView] = useState("list");

  useEffect(() => {
    fetchDeals();
    fetchCustomers();
    fetchEmployees();
  }, []);

  // ================= ADD =================
  const handleAdd = async (form) => {
    try {
      await addDeal({
        title: form.title,
        description: form.description,
        customerId: form.customerId,
        assignedToId: form.assignedToId || null,
        value: Number(form.value),
        stage: form.stage,
      });

      setShowAdd(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (form) => {
    try {
      await editDeal(form.id, {
        title: form.title,
        description: form.description,
        customerId: form.customerId,
        assignedToId: form.assignedToId || null,
        value: Number(form.value),
        stage: form.stage,
      });

      setShowEdit(false);
      setSelectedDeal(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CHANGE STAGE =================
  const handleStageChange = async (id, stage) => {
    try {
      await changeDealStage(id, stage);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await removeDeal(id);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= VIEW =================
  const handleView = (deal) => {
    setSelectedDeal(deal);
    setShowDetails(true);
  };

  // ================= SEARCH + FILTER =================
  const filteredDeals = deals.filter((deal) => {
    const customerName = deal.customer?.name || "";

    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage =
      selectedStage === "ALL" || deal.stage === selectedStage;

    return matchesSearch && matchesStage;
  });

 if (isFetchingDeals) {
  return (
    <div className="p-6 ml-8.5 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-lg font-medium text-gray-600">
          Loading Deals...
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen ml-8.5 bg-gray-50 p-6 ml-8">
      <DealsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        view={view}
        setView={setView}
        onAddDeal={() => setShowAdd(true)}
      />

      {view === "list" ? (
        isLoading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-600 font-medium">
              Updating Deals...
            </p>
          </div>
              ) : (
          <DealList
            deals={filteredDeals}
            onView={handleView}
            onEdit={(deal) => {
              setSelectedDeal(deal);
              setShowEdit(true);
            }}
            onDelete={handleDelete}
            onStageChange={handleStageChange}
          />
        )
      ) : (
        isLoading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-600 font-medium">
              Updating Deals...
            </p>
          </div>
        ) : (
          <DealKanban
            deals={filteredDeals}
            onView={handleView}
            onEdit={(deal) => {
              setSelectedDeal(deal);
              setShowEdit(true);
            }}
            onDelete={handleDelete}
            onStageChange={handleStageChange}
          />
        )
     )}

      {showAdd && (
        <AddDealModal
          customers={customers}
          employees={employees}
          onClose={() => setShowAdd(false)}
          onAdd={handleAdd}
        />
      )}

      {showEdit && (
        <EditDealModal
          deal={selectedDeal}
          customers={customers}
          employees={employees}
          onClose={() => {
            setShowEdit(false);
            setSelectedDeal(null);
          }}
          onUpdate={handleUpdate}
        />
      )}

      <DealDetailsModal
        isOpen={showDetails}
        deal={selectedDeal}
        onClose={() => {
          setShowDetails(false);
          setSelectedDeal(null);
        }}
      />
    </div>
  );
}
