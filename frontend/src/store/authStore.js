import { create } from 'zustand';
import apiClient from '../api/apiClient';
import {
  forgotPassword,
  resetPassword,
  updateProfile,
  uploadProfileImage,
  removeProfileImage,
} from "../api/authApi";
import { changePassword } from "../api/authApi";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  forcePasswordChange: false,

  // LOGIN
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });

      const { token, user, forcePasswordChange } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        token,
        user,
        forcePasswordChange: !!forcePasswordChange,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, forcePasswordChange: !!forcePasswordChange };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed';

      set({
        error: message,
        isLoading: false,
      });

      return { success: false, message };
    }
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      forcePasswordChange: false,
      error: null,
    });
  },

  // FORGOT PASSWORD
forgotPasswordAction: async (email) => {
  set({ isLoading: true, error: null });

  try {
    const data = await forgotPassword(email);

    set({
      isLoading: false,
      error: null,
    });

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
      console.log("ERROR RESPONSE:", error.response);
      console.log("ERROR DATA:", error.response?.data);
      console.log("FULL ERROR:", error);

  const message =
    error.response?.data?.message ||
    "Failed to send reset email";
    
    set({
      error: message,
      isLoading: false,
    });

    return {
      success: false,
      message,
    };
  }
},

// RESET PASSWORD
resetPasswordAction: async (token, password) => {
  set({ isLoading: true, error: null });

  try {
    const data = await resetPassword(
      token,
      password
    );

    set({
      isLoading: false,
      error: null,
    });

    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Password reset failed";

    set({
      error: message,
      isLoading: false,
    });

    return {
      success: false,
      message,
    };
  }
},

changePasswordAction: async (passwordData) => {
  set({ isLoading: true, error: null });

  try {
    const data = await changePassword(passwordData);

    set({
      isLoading: false,
      error: null,
    });

    return data;
  } catch (error) {
    set({
      isLoading: false,
      error:
        error.response?.data?.message ||
        "Password change failed",
    });

    throw error;
  }
},

  // UPDATE MY PROFILE (name, phone, address)
  updateProfileAction: async (profileData) => {
    set({ isLoading: true, error: null });

    try {
      const data = await updateProfile(profileData);

      set((state) => {
        const updatedUser = { ...state.user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        return {
          user: updatedUser,
          isLoading: false,
          error: null,
        };
      });

      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      const message =
        error.response?.data?.message || "Profile update failed";

      set({
        error: message,
        isLoading: false,
      });

      return { success: false, message };
    }
  },

  // UPLOAD MY PROFILE PHOTO
  uploadProfileImageAction: async (file) => {
    set({ isLoading: true, error: null });

    try {
      const data = await uploadProfileImage(file);

      set((state) => {
        const updatedUser = { ...state.user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        return {
          user: updatedUser,
          isLoading: false,
          error: null,
        };
      });

      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      const message =
        error.response?.data?.message || "Photo upload failed";

      set({
        error: message,
        isLoading: false,
      });

      return { success: false, message };
    }
  },

  // REMOVE MY PROFILE PHOTO
  removeProfileImageAction: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await removeProfileImage();

      set((state) => {
        const updatedUser = { ...state.user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        return {
          user: updatedUser,
          isLoading: false,
          error: null,
        };
      });

      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to remove photo";

      set({
        error: message,
        isLoading: false,
      });

      return { success: false, message };
    }
  },

  // CLEAR ERROR
  clearError: () => set({ error: null }),
}));