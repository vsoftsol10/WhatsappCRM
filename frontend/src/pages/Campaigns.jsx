// import { useEffect, useMemo, useState } from "react";

// import useCampaignStore from "../store/campaignStore";

// import CampaignStats from "../components/campaigns/CampaignStats";
// import CampaignFilters from "../components/campaigns/CampaignFilters";
// import CampaignCard from "../components/campaigns/CampaignCard";
// import CreateCampaignModal from "../components/campaigns/CreateCampaignModal";
// import EditCampaignModal from "../components/campaigns/EditCampaignModal";
// import toast from "react-hot-toast";

// export default function Campaigns() {
//   const {
//     campaigns,
//     fetchCampaigns,
//     removeCampaign,
//     editCampaign,
//     isLoading,
//   } = useCampaignStore();

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const [showEditModal, setShowEditModal] = useState(false);

//   const [selectedCampaign, setSelectedCampaign] = useState(null);

//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   const filteredCampaigns = useMemo(() => {
//     return campaigns.filter((campaign) => {
//       const matchesSearch =
//         campaign.name
//           ?.toLowerCase()
//           .includes(search.toLowerCase());

//       const matchesStatus =
//         statusFilter === "ALL"
//           ? true
//           : campaign.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   }, [
//     campaigns,
//     search,
//     statusFilter,
//   ]);

//   const handleEdit = (campaign) => {
//   setSelectedCampaign(campaign);
//   setShowEditModal(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await removeCampaign(id);
//       toast.success("Campaign deleted successfully!");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to delete campaign. Please try again.");
//     }
//   };

//  const handleStatusChange = async (id, status) => {
//   try {
//     await editCampaign(id, {
//       status,
//     });

//     toast.success(`Campaign status updated to ${status}.`);
//   } catch (error) {
//     console.error("STATUS UPDATE ERROR", error);

//     toast.error(
//       "Failed to update campaign status. Please try again."
//     );
//   }
// };

//   return (
//     <div className="p-6 ml-8.5">
//       {/* HEADER */}

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">
//             Campaigns
//           </h1>

//           <p className="text-gray-500">
//             Manage and monitor your campaigns
//           </p>
//         </div>

//         <button
//           onClick={() =>
//             setShowCreateModal(true)
//           }
//           className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium"
//         >
//           Create Campaign
//         </button>
//       </div>

//       {/* STATS */}

//       <CampaignStats campaigns={campaigns} />

//       {/* FILTERS */}

//       <CampaignFilters
//         search={search}
//         setSearch={setSearch}
//         statusFilter={statusFilter}
//         setStatusFilter={setStatusFilter}
//       />

//       {/* LOADING */}

//       {isLoading && (
//         <div className="mt-8 text-center">
//           Loading campaigns...
//         </div>
//       )}

//       {/* EMPTY */}

//       {!isLoading &&
//         filteredCampaigns.length === 0 && (
//           <div className="bg-white rounded-xl p-10 text-center mt-6">
//             <h3 className="font-semibold text-lg">
//               No Campaigns Found
//             </h3>

//             <p className="text-gray-500 mt-2">
//               Create your first campaign.
//             </p>
//           </div>
//         )}

//       {/* GRID */}

//       {!isLoading &&
//         filteredCampaigns.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
//             {filteredCampaigns.map(
//               (campaign) => (
//                 <CampaignCard
//                   key={campaign.id}
//                   campaign={campaign}
//                   onEdit={handleEdit}
//                   onDelete={handleDelete}
//                   onStatusChange={handleStatusChange}
//                 />
//               )
//             )}
//           </div>
//         )}

//       {/* MODAL */}

//       <CreateCampaignModal
//         isOpen={showCreateModal}
//         onClose={() =>
//           setShowCreateModal(false)
//         }
//       />

//       <EditCampaignModal
//         isOpen={showEditModal}
//         onClose={() => {
//           setShowEditModal(false);
//           setSelectedCampaign(null);
//         }}
//         campaign={selectedCampaign}
//       />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";

import useCampaignStore from "../store/campaignStore";

import CampaignStats from "../components/campaigns/CampaignStats";
import CampaignFilters from "../components/campaigns/CampaignFilters";
import CampaignCard from "../components/campaigns/CampaignCard";
import CreateCampaignModal from "../components/campaigns/CreateCampaignModal";
import EditCampaignModal from "../components/campaigns/EditCampaignModal";
import AICampaignModal from "../components/campaigns/AICampaignModal";
import ViewCampaignModal from "../components/campaigns/ViewCampaignModal";
import SendCampaignModal from "../components/campaigns/SendCampaignModal";

export default function Campaigns() {
  const {
    campaigns,
    fetchCampaigns,
    removeCampaign,
    editCampaign,
    isLoading,
  } = useCampaignStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // NEW
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [aiCampaign, setAiCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch = campaign.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : campaign.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [campaigns, search, statusFilter]);

  // ===============================
  // VIEW
  // ===============================

  const handleView = (campaign) => {
    setSelectedCampaign(campaign);
    setShowViewModal(true);
  };

  // ===============================
  // SEND
  // ===============================

  const handleSend = (campaign) => {
    setSelectedCampaign(campaign);
    setShowSendModal(true);
  };

  // ===============================
  // EDIT
  // ===============================

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setShowEditModal(true);
  };

  // ===============================
  // DELETE
  // ===============================

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;

    try {
      await removeCampaign(id);

      toast.success("Campaign deleted successfully");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // ===============================
  // STATUS
  // ===============================

  const handleStatusChange = async (id, status) => {
    try {
      await editCampaign(id, {
        status,
      });

      toast.success("Campaign status updated");
    } catch (error) {
      toast.error("Unable to update campaign");
    }
  };

  // ===============================
  // AI → CREATE
  // ===============================

  const handleUseCampaign = (campaign) => {
    setAiCampaign(campaign);

    setShowAIModal(false);

    setShowCreateModal(true);
  };

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Campaigns
          </h1>

          <p className="text-gray-500">
            Manage your marketing campaigns
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-3 rounded-xl hover:opacity-90"
          >
            <Sparkles size={18} />

            AI Generate
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-yellow-400 text-black px-5 py-3 rounded-xl hover:bg-yellow-500"
          >
            Create Campaign
          </button>

        </div>

      </div>

      {/* Stats */}

      <CampaignStats campaigns={campaigns} />

      {/* Filters */}

      <CampaignFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Loading */}

      {isLoading && (
        <div className="text-center mt-10">
          Loading campaigns...
        </div>
      )}

      {/* Empty */}

      {!isLoading &&
        filteredCampaigns.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center mt-6 shadow">

            <h2 className="font-semibold text-lg">
              No Campaigns Found
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first campaign.
            </p>

          </div>
        )}

      {/* Campaign Grid */}

      {!isLoading &&
        filteredCampaigns.length > 0 && (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">

            {filteredCampaigns.map((campaign) => (

              <CampaignCard
                key={campaign.id}
                campaign={campaign}

                onView={handleView}

                onSend={handleSend}

                onEdit={handleEdit}

                onDelete={handleDelete}

                onStatusChange={handleStatusChange}
              />

            ))}

          </div>

        )}

      {/* ========================= */}

      {/* AI */}

      {/* ========================= */}

      <AICampaignModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onUseCampaign={handleUseCampaign}
      />

      {/* ========================= */}

      {/* CREATE */}

      {/* ========================= */}

      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);

          setAiCampaign(null);
        }}
        aiCampaign={aiCampaign}
      />

      {/* ========================= */}

      {/* VIEW */}

      {/* ========================= */}

      <ViewCampaignModal
        isOpen={showViewModal}
        campaign={selectedCampaign}
        onClose={() => {
          setShowViewModal(false);

          setSelectedCampaign(null);
        }}
      />

      {/* ========================= */}

      {/* SEND */}

      {/* ========================= */}

      <SendCampaignModal
        isOpen={showSendModal}
        campaign={selectedCampaign}
        onClose={() => {
          setShowSendModal(false);

          setSelectedCampaign(null);
        }}
      />

      {/* ========================= */}

      {/* EDIT */}

      {/* ========================= */}

      <EditCampaignModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);

          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
      />

    </div>
  );
}