// import axios from "axios";
// import apiClient from "./apiClient";

// export const forgotPassword = async (email) => {
//   const response = await axios.post(
//     "https://whatsappcrm-f1qj.onrender.com/api/auth/forgot-password",
//     { email }
//   );

//   return response.data;
// };

// export const resetPassword = async (
//   token,
//   password
// ) => {
//   const response = await axios.post(
//     `https://whatsappcrm-f1qj.onrender.com/api/auth/reset-password/${token}`,
//     { password }
//   );

//   return response.data;
// };

// export const changePassword = async (passwordData) => {
//   const response = await apiClient.post(
//     "/api/auth/change-password",
//     passwordData
//   );

//   return response.data;
// };

import apiClient from "./apiClient";

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const response = await apiClient.post(
    "/api/auth/forgot-password",
    { email }
  );

  return response.data;
};

// RESET PASSWORD
export const resetPassword = async (
  token,
  password
) => {
  const response = await apiClient.post(
    `/api/auth/reset-password/${token}`,
    { password }
  );

  return response.data;
};

// CHANGE PASSWORD
export const changePassword = async (passwordData) => {
  const response = await apiClient.post(
    "/api/auth/change-password",
    passwordData
  );

  return response.data;
};