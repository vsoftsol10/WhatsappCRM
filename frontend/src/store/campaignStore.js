// import { create } from "zustand";

// import {
//   getCampaigns,
//   getCampaignById,
//   createCampaign,
//   updateCampaign,
//   deleteCampaign,
//   generateAICampaign,
//   sendCampaign,
// } from "../api/campaignApi";

// const useCampaignStore = create((set, get) => ({
//   campaigns: [],
//   selectedCampaign: null,

//   isLoading: false,
//   error: null,

//   // ===============================
//   // FETCH ALL CAMPAIGNS
//   // ===============================
//   fetchCampaigns: async () => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const response = await getCampaigns();

//       set({
//         campaigns: response.data || [],
//         isLoading: false,
//       });
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });
//     }
//   },

//   // ===============================
//   // FETCH SINGLE CAMPAIGN
//   // ===============================
//   fetchCampaignById: async (id) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const response = await getCampaignById(id);

//       set({
//         selectedCampaign: response.data,
//         isLoading: false,
//       });
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });
//     }
//   },

//   // ===============================
//   // CREATE CAMPAIGN
//   // ===============================
//   addCampaign: async (campaignData) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const response = await createCampaign(campaignData);

//       set((state) => ({
//         campaigns: [response.data, ...state.campaigns],
//         isLoading: false,
//       }));

//       return response;
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   // ===============================
//   // UPDATE CAMPAIGN
//   // ===============================
//   editCampaign: async (id, campaignData) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const response = await updateCampaign(
//         id,
//         campaignData
//       );

//       set((state) => ({
//         campaigns: state.campaigns.map((campaign) =>
//           campaign.id === response.data.id
//             ? response.data
//             : campaign
//         ),
//         isLoading: false,
//       }));

//       return response;
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   // ===============================
//   // DELETE CAMPAIGN
//   // ===============================
//   removeCampaign: async (id) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       await deleteCampaign(id);

//       set((state) => ({
//         campaigns: state.campaigns.filter(
//           (campaign) => campaign.id !== id
//         ),
//         isLoading: false,
//       }));
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   // ===============================
//   // GENERATE AI CAMPAIGN
//   // ===============================
//   generateAI: async (prompt) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const response =
//         await generateAICampaign(prompt);

//       set({
//         isLoading: false,
//       });

//       return response.data;
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   // ===============================
//   // SEND CAMPAIGN
//   // ===============================
//   sendCampaign: async (
//     campaignId,
//     customerIds
//   ) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const response = await sendCampaign(
//         campaignId,
//         customerIds
//       );
//       await get().fetchCampaigns();

//       set({
//         isLoading: false,
//       });

//       return response;
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   // ===============================
//   // CLEAR ERROR
//   // ===============================
//   clearError: () =>
//     set({
//       error: null,
//     }),
// }));

// export default useCampaignStore;

import { create } from "zustand";

import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  generateAICampaign,
  sendCampaign,
} from "../api/campaignApi";

const useCampaignStore = create((set, get) => ({
  campaigns: [],
  selectedCampaign: null,

  isLoading: false,
  error: null,

  // ===============================
  // FETCH ALL CAMPAIGNS
  // ===============================
  fetchCampaigns: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await getCampaigns();

      set({
        campaigns: response.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  // ===============================
  // FETCH SINGLE CAMPAIGN
  // ===============================
  fetchCampaignById: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await getCampaignById(id);

      set({
        selectedCampaign: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  // ===============================
  // CREATE CAMPAIGN
  // ===============================
  addCampaign: async (campaignData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await createCampaign(campaignData);

set((state) => ({
  campaigns: [response.data, ...state.campaigns],
  isLoading: false,
}));

console.log("Created Campaign Response:", response);

return response.data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ===============================
  // UPDATE CAMPAIGN
  // ===============================
  editCampaign: async (id, campaignData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await updateCampaign(
        id,
        campaignData
      );

      set((state) => ({
        campaigns: state.campaigns.map((campaign) =>
          campaign.id === response.data.id
            ? response.data
            : campaign
        ),
        isLoading: false,
      }));

      return response;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ===============================
  // DELETE CAMPAIGN
  // ===============================
  removeCampaign: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await deleteCampaign(id);

      set((state) => ({
        campaigns: state.campaigns.filter(
          (campaign) => campaign.id !== id
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ===============================
  // GENERATE AI CAMPAIGN
  // ===============================
  generateAI: async (prompt) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response =
        await generateAICampaign(prompt);

      set({
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ===============================
  // SEND CAMPAIGN
  // ===============================
  sendCampaign: async (
    campaignId,
    customerIds
  ) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await sendCampaign(
        campaignId,
        customerIds
      );
      await get().fetchCampaigns();

      set({
        isLoading: false,
      });

      return response;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ===============================
  // CLEAR ERROR
  // ===============================
  clearError: () =>
    set({
      error: null,
    }),
}));

export default useCampaignStore;