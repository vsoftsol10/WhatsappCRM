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

// UPDATE MY PROFILE (name, phone, address only — email/role/department
// are read-only and never sent here)
export const updateProfile = async (profileData) => {
  const response = await apiClient.put(
    "/api/auth/profile",
    profileData
  );

  return response.data;
};

// UPLOAD MY PROFILE PHOTO
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.post(
    "/api/auth/profile-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};

// REMOVE MY PROFILE PHOTO
export const removeProfileImage = async () => {
  const response = await apiClient.delete("/api/auth/profile-image");

  return response.data;
};