import axios from "axios";
import apiClient from "./apiClient";

export const forgotPassword = async (email) => {
  const response = await axios.post(
    "http://localhost:5000/api/auth/forgot-password",
    { email }
  );

  return response.data;
};

export const resetPassword = async (
  token,
  password
) => {
  const response = await axios.post(
    `http://localhost:5000/api/auth/reset-password/${token}`,
    { password }
  );

  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await apiClient.post(
    "/api/auth/change-password",
    passwordData
  );

  return response.data;
};