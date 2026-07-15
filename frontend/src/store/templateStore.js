import { create } from "zustand";

import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  sendTemplate,
} from "../api/templateApi";

const useTemplateStore = create((set) => ({
  templates: [],
  selectedTemplate: null,

  isLoading: false,
  error: null,

  // ================= FETCH ALL =================
  fetchTemplates: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getTemplates();

      set({
        templates: data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  // ================= FETCH ONE =================
  fetchTemplateById: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getTemplateById(id);

      set({
        selectedTemplate: data.data,
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
  addTemplate: async (templateData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await createTemplate(
        templateData
      );

      set((state) => ({
        templates: [
          data.data,
          ...state.templates,
        ],
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
  editTemplate: async (
    id,
    templateData
  ) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await updateTemplate(
        id,
        templateData
      );

      set((state) => ({
        templates: state.templates.map(
          (template) =>
            template.id === id
              ? data.data
              : template
        ),
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
  removeTemplate: async (id) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await deleteTemplate(id);

      set((state) => ({
        templates: state.templates.filter(
          (template) =>
            template.id !== id
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

  // ================= SEND TEMPLATE =================
    sendTemplate: async (
      templateId,
      customerId
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response =
          await sendTemplate(
            templateId,
            customerId
          );

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

  // ================= CLEAR ERROR =================
  clearError: () =>
    set({
      error: null,
    }),
}));

export default useTemplateStore;