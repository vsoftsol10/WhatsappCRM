// import apiClient from "./apiClient";

// // ================= GET ALL TEMPLATES =================
// export const getTemplates = async () => {
//   const response = await apiClient.get(
//     "/api/templates"
//   );

//   return response.data;
// };

// // ================= GET SINGLE TEMPLATE =================
// export const getTemplateById = async (id) => {
//   const response = await apiClient.get(
//     `/api/templates/${id}`
//   );

//   return response.data;
// };

// // ================= CREATE TEMPLATE =================
// export const createTemplate = async (
//   templateData
// ) => {
//   const response = await apiClient.post(
//     "/api/templates",
//     templateData
//   );

//   return response.data;
// };

// // ================= UPDATE TEMPLATE =================
// export const updateTemplate = async (
//   id,
//   templateData
// ) => {
//   const response = await apiClient.put(
//     `/api/templates/${id}`,
//     templateData
//   );

//   return response.data;
// };

// // ================= DELETE TEMPLATE =================
// export const deleteTemplate = async (id) => {
//   const response = await apiClient.delete(
//     `/api/templates/${id}`
//   );

//   return response.data;
// };

// // ================= SEND TEMPLATE =================
// export const sendTemplate = async (
//   templateId,
//   customerId
// ) => {
//   const response = await apiClient.post(
//     "/api/templates/send",
//     {
//       templateId,
//       customerId,
//     }
//   );

//   return response.data;
// };

import apiClient from "./apiClient";


// ================= GET ALL TEMPLATES =================
export const getTemplates = async () => {

  const response = await apiClient.get(
    "/api/templates"
  );

  return response.data;

};



// ================= GET SINGLE TEMPLATE =================
export const getTemplateById = async (id) => {

  const response = await apiClient.get(
    `/api/templates/${id}`
  );

  return response.data;

};



// ================= CREATE TEMPLATE =================
export const createTemplate = async (
  templateData
) => {

  const response = await apiClient.post(
    "/api/templates",
    templateData
  );

  return response.data;

};



// ================= UPDATE TEMPLATE =================
export const updateTemplate = async (
  id,
  templateData
) => {

  const response = await apiClient.put(
    `/api/templates/${id}`,
    templateData
  );

  return response.data;

};



// ================= DELETE TEMPLATE =================
export const deleteTemplate = async (
  id
) => {

  const response = await apiClient.delete(
    `/api/templates/${id}`
  );

  return response.data;

};



// ================= SEND TEMPLATE =================
export const sendTemplate = async (
  templateId,
  customerIds
) => {


  console.log(
    "SEND TEMPLATE REQUEST:",
    {
      templateId,
      customerIds
    }
  );


  const response = await apiClient.post(

    "/api/templates/send",

    {
      templateId,
      customerIds
    }

  );


  return response.data;

};