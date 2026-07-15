// import { create } from "zustand";

// import {
//   getDeals,
//   getDealById,
//   createDeal,
//   updateDeal,
//   updateDealStage,
//   deleteDeal,
//   getDealActivities,
//   createDealActivity,
// } from "../api/dealApi";

// import { getCustomers } from "../api/customerApi";
// import { getEmployees } from "../api/employeeApi";

// const useDealStore = create((set) => ({
//   deals: [],
//   selectedDeal: null,

//   activities: [],

//   customers: [],
//   employees: [],

//   isLoading: false,
//   error: null,

//   // ================= FETCH CUSTOMERS =================
//   fetchCustomers: async () => {
//     try {
//       const res = await getCustomers();

//       set({
//         customers: res.customers || [],
//       });
//     } catch (error) {
//       console.error("Failed to fetch customers", error);

//       set({
//         customers: [],
//       });
//     }
//   },

//   // ================= FETCH EMPLOYEES =================
//   fetchEmployees: async () => {
//     try {
//       const res = await getEmployees();

//       set({
//         employees: res.employees || [],
//       });
//     } catch (error) {
//       console.error("Failed to fetch employees", error);

//       set({
//         employees: [],
//       });
//     }
//   },

//   // ================= FETCH ALL DEALS =================
//   fetchDeals: async () => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const data = await getDeals();

//       set({
//         deals: data.data,
//         isLoading: false,
//       });
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });
//     }
//   },

//   // ================= FETCH SINGLE DEAL =================
//   fetchDealById: async (id) => {
//     console.trace("fetchDealById called");
    
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const data = await getDealById(id);

//       set({
//         selectedDeal: data.data,
//         activities: data.data.activities || [],
//         isLoading: false,
//       });
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });
//     }
//   },

//     // ================= CREATE =================
//   addDeal: async (dealData) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const data = await createDeal(dealData);

//       set((state) => ({
//         deals: [data.data, ...state.deals],
//         isLoading: false,
//       }));

//       return data;
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   // ================= UPDATE =================
//   editDeal: async (id, dealData) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const data = await updateDeal(id, dealData);

//       set((state) => ({
//         deals: state.deals.map((deal) =>
//           deal.id === id ? data.data : deal
//         ),
//         selectedDeal:
//           state.selectedDeal?.id === id
//             ? data.data
//             : state.selectedDeal,
//         isLoading: false,
//       }));

//       return data;
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   // ================= UPDATE STAGE =================
//   changeDealStage: async (id, stage) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const data = await updateDealStage(id, stage);

//       set((state) => ({
//         deals: state.deals.map((deal) =>
//           deal.id === id ? data.data : deal
//         ),
//         selectedDeal:
//           state.selectedDeal?.id === id
//             ? {
//                 ...data.data,
//                 activities:
//                   state.selectedDeal?.activities || [],
//               }
//             : state.selectedDeal,
//         isLoading: false,
//       }));

//       return data;
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   // ================= DELETE =================
//   removeDeal: async (id) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       await deleteDeal(id);

//       set((state) => ({
//         deals: state.deals.filter(
//           (deal) => deal.id !== id
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

//     // ================= FETCH ACTIVITIES =================
//   // fetchActivities: async (dealId) => {
//   //   set({
//   //     isLoading: true,
//   //     error: null,
//   //   });

//   //   try {
//   //     const data = await getDealActivities(dealId);

//   //     set((state) => ({
//   //       activities: data.data,
//   //       selectedDeal: state.selectedDeal
//   //         ? {
//   //             ...state.selectedDeal,
//   //             activities: data.data,
//   //           }
//   //         : null,
//   //       isLoading: false,
//   //     }));
//   //   } catch (error) {
//   //     set({
//   //       error: error.message,
//   //       isLoading: false,
//   //     });
//   //   }
//   // },

//   fetchActivities: async (dealId) => {
//     set({ activityLoading: true });

//     try {
//       const data = await getDealActivities(dealId);

//       set({
//         activities: data.data,
//         activityLoading: false,
//       });
//     } catch (error) {
//       set({
//         activityLoading: false,
//       });
//     }
//   },

//   // ================= ADD ACTIVITY =================
//   addActivity: async (dealId, activityData) => {
//     set({
//       isLoading: true,
//       error: null,
//     });

//     try {
//       const data = await createDealActivity(
//         dealId,
//         activityData
//       );

//       set((state) => ({
//         activities: [
//           data.data,
//           ...state.activities,
//         ],
//         selectedDeal: state.selectedDeal
//           ? {
//               ...state.selectedDeal,
//               activities: [
//                 data.data,
//                 ...(state.selectedDeal.activities || []),
//               ],
//             }
//           : null,
//         isLoading: false,
//       }));

//       return data;
//     } catch (error) {
//       set({
//         error: error.message,
//         isLoading: false,
//       });

//       throw error;
//     }
//   },

//   // ================= CLEAR SELECTED DEAL =================
//   clearSelectedDeal: () =>
//     set({
//       selectedDeal: null,
//       activities: [],
//     }),

//   // ================= CLEAR ERROR =================
//   clearError: () =>
//     set({
//       error: null,
//     }),
// }));

// export default useDealStore;

import { create } from "zustand";

import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
  getDealActivities,
  createDealActivity,
} from "../api/dealApi";

import { getCustomers } from "../api/customerApi";
import { getEmployees } from "../api/employeeApi";

const useDealStore = create((set) => ({
  deals: [],
  selectedDeal: null,

  activities: [],

  customers: [],
  employees: [],

  // Loading States
  isLoading: false,          // CRUD Loading
  isFetchingDeals: false,    // Initial Page Loading
  activityLoading: false,

  error: null,

  // ================= FETCH CUSTOMERS =================
  fetchCustomers: async () => {
    try {
      const res = await getCustomers();

      set({
        customers: res.customers || [],
      });
    } catch (error) {
      console.error("Failed to fetch customers", error);

      set({
        customers: [],
      });
    }
  },

  // ================= FETCH EMPLOYEES =================
  fetchEmployees: async () => {
    try {
      const res = await getEmployees();

      set({
        employees: res.employees || [],
      });
    } catch (error) {
      console.error("Failed to fetch employees", error);

      set({
        employees: [],
      });
    }
  },

  // ================= FETCH ALL DEALS =================
  fetchDeals: async () => {
    set({
      isFetchingDeals: true,
      error: null,
    });

    try {
      const data = await getDeals();

      set({
        deals: data.data,
        isFetchingDeals: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isFetchingDeals: false,
      });
    }
  },

  // ================= FETCH SINGLE DEAL =================
  fetchDealById: async (id) => {
    console.trace("fetchDealById called");

    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getDealById(id);

      set({
        selectedDeal: data.data,
        activities: data.data.activities || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  // ================= CREATE =================
  addDeal: async (dealData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await createDeal(dealData);

      set((state) => ({
        deals: [data.data, ...state.deals],
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ================= UPDATE =================
  editDeal: async (id, dealData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await updateDeal(id, dealData);

      set((state) => ({
        deals: state.deals.map((deal) =>
          deal.id === id ? data.data : deal
        ),
        selectedDeal:
          state.selectedDeal?.id === id
            ? data.data
            : state.selectedDeal,
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ================= UPDATE STAGE =================
  changeDealStage: async (id, stage) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await updateDealStage(id, stage);

      set((state) => ({
        deals: state.deals.map((deal) =>
          deal.id === id ? data.data : deal
        ),
        selectedDeal:
          state.selectedDeal?.id === id
            ? {
                ...data.data,
                activities:
                  state.selectedDeal?.activities || [],
              }
            : state.selectedDeal,
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ================= DELETE =================
  removeDeal: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await deleteDeal(id);

      set((state) => ({
        deals: state.deals.filter(
          (deal) => deal.id !== id
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

  // ================= FETCH ACTIVITIES =================
  fetchActivities: async (dealId) => {
    set({
      activityLoading: true,
    });

    try {
      const data = await getDealActivities(dealId);

      set({
        activities: data.data,
        activityLoading: false,
      });
    } catch (error) {
      set({
        activityLoading: false,
      });
    }
  },

  // ================= ADD ACTIVITY =================
  addActivity: async (dealId, activityData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await createDealActivity(
        dealId,
        activityData
      );

      set((state) => ({
        activities: [
          data.data,
          ...state.activities,
        ],
        selectedDeal: state.selectedDeal
          ? {
              ...state.selectedDeal,
              activities: [
                data.data,
                ...(state.selectedDeal.activities || []),
              ],
            }
          : null,
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });

      throw error;
    }
  },

  // ================= CLEAR SELECTED DEAL =================
  clearSelectedDeal: () =>
    set({
      selectedDeal: null,
      activities: [],
    }),

  // ================= CLEAR ERROR =================
  clearError: () =>
    set({
      error: null,
    }),
}));

export default useDealStore;