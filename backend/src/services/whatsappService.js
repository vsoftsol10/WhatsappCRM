// const axios = require("axios");

// const GRAPH_API_VERSION = "v23.0";

// const sendTextMessage = async (to, message) => {
//   console.log("Sending to:", to);
//   console.log("sendTextMessage called with:", { to, message });

//   if (!to || typeof to !== "string" || !to.trim()) {
//     console.error("WhatsApp recipient number is missing");

//     return {
//       success: false,
//       error: {
//         message: "Recipient phone number is required",
//       },
//     };
//   }

//   try {
//     const response = await axios.post(
//       `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to: to.trim(),
//         type: "text",
//         text: {
//           preview_url: false,
//           body: message,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("WhatsApp API Response:", JSON.stringify(response.data, null, 2));
    
//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error) {
//     console.error("WhatsApp Send Error:");

//     if (error.response) {
//       console.error(error.response.data);
//     } else {
//       console.error(error.message);
//     }

//     return {
//       success: false,
//       error: error.response?.data || error.message,
//     };
//   }
// };

// const sendImageMessage = async (to, imageUrl, caption = "") => {
//   console.log("Sending Image to:", to);

//   try {
//     const response = await axios.post(
//       `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to: to.trim(),
//         type: "image",
//         image: {
//           link: imageUrl,
//           caption,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error) {
//     console.error("WhatsApp Image Error:");

//     if (error.response) {
//       console.error(error.response.data);
//     } else {
//       console.error(error.message);
//     }

//     return {
//       success: false,
//       error: error.response?.data || error.message,
//     };
//   }
// };

// // Meta rejects template body parameters that contain newlines/tabs
// // or 4+ consecutive spaces (error 132018). Clean the text before sending.
// const sanitizeTemplateParam = (text) =>
//   String(text ?? "")
//     .replace(/[\n\r\t]+/g, " ") // newlines/tabs -> single space
//     .replace(/ {2,}/g, " ")     // collapse repeated spaces
//     .trim();

// const sendTemplateMessage = async (to, templateName, params = [], languageCode = "en_US") => {

//   if (!to || typeof to !== "string" || !to.trim()) {
//     return {
//       success: false,
//       error: {
//         message: "Recipient phone number is required",
//       },
//     };
//   }

//   try {
//     const response = await axios.post(
//       `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         to : to.trim(),
//         type: "template",
//         template: {
//           name: templateName,
//           language: { code: languageCode },
//           components: params.length > 0 ? [
//             {
//               type: "body",
//               parameters: params.map(p => ({ type: "text", text: sanitizeTemplateParam(p) }))
//             }
//           ] : []
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("WhatsApp Template Send Error:", error.response?.data || error.message);
//     return { success: false, error: error.response?.data || error.message };
//   }
// };

// // Template message with an Image header + body text variables.
// // Requires a Meta-approved template whose Header format is set to "Image"
// // (e.g. "custom_campaign_image_message"). imageUrl must be a publicly
// // accessible URL (your Cloudinary link works fine).
// const sendCampaignImageTemplate = async (to, templateName, imageUrl, params = [], languageCode = "en_US") => {

//   if (!to || typeof to !== "string" || !to.trim()) {
//     return {
//       success: false,
//       error: {
//         message: "Recipient phone number is required",
//       },
//     };
//   }

//   if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
//     return {
//       success: false,
//       error: {
//         message: "Image URL is required",
//       },
//     };
//   }

//   try {
//     const response = await axios.post(
//       `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         to: to.trim(),
//         type: "template",
//         template: {
//           name: templateName,
//           language: { code: languageCode },
//           components: [
//             {
//               type: "header",
//               parameters: [
//                 {
//                   type: "image",
//                   image: { link: imageUrl },
//                 },
//               ],
//             },
//             {
//               type: "body",
//               parameters: params.map((p) => ({
//                 type: "text",
//                 text: sanitizeTemplateParam(p),
//               })),
//             },
//           ],
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("WhatsApp Image Template Error:", error.response?.data || error.message);
//     return { success: false, error: error.response?.data || error.message };
//   }
// };

// // ================= FETCH APPROVED TEMPLATES FROM META =================
// // Used to populate the Campaign/Template "Meta Approved Template" dropdown
// // in the frontend, instead of the customer typing a template name and
// // language code by hand. Typing it manually is exactly what caused the
// // 132001 "template name does not exist in the translation" errors we hit
// // earlier (a one-letter typo in the name, and a guessed-wrong language
// // code) — pulling the live, approved list directly from Meta makes that
// // entire class of mistake structurally impossible.
// const getMessageTemplates = async () => {
//   if (!process.env.WHATSAPP_BUSINESS_ACCOUNT_ID) {
//     return {
//       success: false,
//       error: {
//         message:
//           "WHATSAPP_BUSINESS_ACCOUNT_ID is not configured on the server",
//       },
//     };
//   }

//   try {
//     const response = await axios.get(
//       `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`,
//       {
//         params: {
//           // Meta's default page size is small; 200 covers virtually every
//           // small/mid business's template count in one request. If a
//           // business ever exceeds this, paging.next handling can be
//           // added later — not needed for the CRM's current scale.
//           limit: 200,
//           fields: "name,language,category,status,components",
//         },
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//         },
//       }
//     );

//     const templates = (response.data?.data || [])
//       // Only APPROVED templates are actually sendable — Meta also returns
//       // PENDING/REJECTED ones in this same list, which would otherwise
//       // show up as selectable options and fail exactly like the manual
//       // typo did.
//       .filter((t) => t.status === "APPROVED")
//       .map((t) => {
//         const bodyComponent = (t.components || []).find(
//           (c) => c.type === "BODY"
//         );

//         // Count {{1}}, {{2}}, ... placeholders in the approved body so
//         // the frontend knows exactly how many parameter fields to render
//         // — no guessing, no mismatched count rejections from Meta.
//         const paramCount = bodyComponent?.text
//           ? new Set(
//               [...bodyComponent.text.matchAll(/\{\{\s*(\d+)\s*\}\}/g)].map(
//                 (m) => m[1]
//               )
//             ).size
//           : 0;

//         const headerComponent = (t.components || []).find(
//           (c) => c.type === "HEADER"
//         );

//         return {
//           name: t.name,
//           language: t.language,
//           category: t.category,
//           bodyText: bodyComponent?.text || "",
//           paramCount,
//           hasImageHeader: headerComponent?.format === "IMAGE",
//         };
//       });

//     return { success: true, data: templates };
//   } catch (error) {
//     console.error(
//       "WhatsApp Fetch Templates Error:",
//       error.response?.data || error.message
//     );
//     return { success: false, error: error.response?.data || error.message };
//   }
// };

// module.exports = {
//   sendTextMessage,
//   sendImageMessage,
//   sendTemplateMessage,
//   sendCampaignImageTemplate,
//   getMessageTemplates,
// };

const axios = require("axios");

const GRAPH_API_VERSION = "v23.0";

// Previously every call below used the raw axios module with no
// timeout, so a hung Meta API request (network blip, Graph API
// outage) would wait indefinitely and block the webhook's background
// processing for that conversation. A dedicated instance with a
// 15s timeout applies to every call in this file automatically.
const whatsappApi = axios.create({
  timeout: 15000,
});

const sendTextMessage = async (to, message) => {
  if (!to || typeof to !== "string" || !to.trim()) {
    console.error("WhatsApp recipient number is missing");

    return {
      success: false,
      error: {
        message: "Recipient phone number is required",
      },
    };
  }

  try {
    const response = await whatsappApi.post(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to.trim(),
        type: "text",
        text: {
          preview_url: false,
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("WhatsApp Send Error:");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

const sendImageMessage = async (to, imageUrl, caption = "") => {
  try {
    const response = await whatsappApi.post(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to.trim(),
        type: "image",
        image: {
          link: imageUrl,
          caption,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("WhatsApp Image Error:");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

// Meta rejects template body parameters that contain newlines/tabs
// or 4+ consecutive spaces (error 132018). Clean the text before sending.
const sanitizeTemplateParam = (text) =>
  String(text ?? "")
    .replace(/[\n\r\t]+/g, " ") // newlines/tabs -> single space
    .replace(/ {2,}/g, " ")     // collapse repeated spaces
    .trim();

const sendTemplateMessage = async (to, templateName, params = [], languageCode = "en_US") => {

  if (!to || typeof to !== "string" || !to.trim()) {
    return {
      success: false,
      error: {
        message: "Recipient phone number is required",
      },
    };
  }

  try {
    const response = await whatsappApi.post(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to : to.trim(),
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components: params.length > 0 ? [
            {
              type: "body",
              parameters: params.map(p => ({ type: "text", text: sanitizeTemplateParam(p) }))
            }
          ] : []
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("WhatsApp Template Send Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Template message with an Image header + body text variables.
// Requires a Meta-approved template whose Header format is set to "Image"
// (e.g. "custom_campaign_image_message"). imageUrl must be a publicly
// accessible URL (your Cloudinary link works fine).
const sendCampaignImageTemplate = async (to, templateName, imageUrl, params = [], languageCode = "en_US") => {

  if (!to || typeof to !== "string" || !to.trim()) {
    return {
      success: false,
      error: {
        message: "Recipient phone number is required",
      },
    };
  }

  if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
    return {
      success: false,
      error: {
        message: "Image URL is required",
      },
    };
  }

  try {
    const response = await whatsappApi.post(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to.trim(),
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: { link: imageUrl },
                },
              ],
            },
            {
              type: "body",
              parameters: params.map((p) => ({
                type: "text",
                text: sanitizeTemplateParam(p),
              })),
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("WhatsApp Image Template Error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// ================= FETCH APPROVED TEMPLATES FROM META =================
// Used to populate the Campaign/Template "Meta Approved Template" dropdown
// in the frontend, instead of the customer typing a template name and
// language code by hand. Typing it manually is exactly what caused the
// 132001 "template name does not exist in the translation" errors we hit
// earlier (a one-letter typo in the name, and a guessed-wrong language
// code) — pulling the live, approved list directly from Meta makes that
// entire class of mistake structurally impossible.
const getMessageTemplates = async () => {
  if (!process.env.WHATSAPP_BUSINESS_ACCOUNT_ID) {
    return {
      success: false,
      error: {
        message:
          "WHATSAPP_BUSINESS_ACCOUNT_ID is not configured on the server",
      },
    };
  }

  try {
    const response = await whatsappApi.get(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`,
      {
        params: {
          // Meta's default page size is small; 200 covers virtually every
          // small/mid business's template count in one request. If a
          // business ever exceeds this, paging.next handling can be
          // added later — not needed for the CRM's current scale.
          limit: 200,
          fields: "name,language,category,status,components",
        },
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        },
      }
    );

    const templates = (response.data?.data || [])
      // Only APPROVED templates are actually sendable — Meta also returns
      // PENDING/REJECTED ones in this same list, which would otherwise
      // show up as selectable options and fail exactly like the manual
      // typo did.
      .filter((t) => t.status === "APPROVED")
      .map((t) => {
        const bodyComponent = (t.components || []).find(
          (c) => c.type === "BODY"
        );

        // Count {{1}}, {{2}}, ... placeholders in the approved body so
        // the frontend knows exactly how many parameter fields to render
        // — no guessing, no mismatched count rejections from Meta.
        const paramCount = bodyComponent?.text
          ? new Set(
              [...bodyComponent.text.matchAll(/\{\{\s*(\d+)\s*\}\}/g)].map(
                (m) => m[1]
              )
            ).size
          : 0;

        const headerComponent = (t.components || []).find(
          (c) => c.type === "HEADER"
        );

        return {
          name: t.name,
          language: t.language,
          category: t.category,
          bodyText: bodyComponent?.text || "",
          paramCount,
          hasImageHeader: headerComponent?.format === "IMAGE",
        };
      });

    return { success: true, data: templates };
  } catch (error) {
    console.error(
      "WhatsApp Fetch Templates Error:",
      error.response?.data || error.message
    );
    return { success: false, error: error.response?.data || error.message };
  }
};

module.exports = {
  sendTextMessage,
  sendImageMessage,
  sendTemplateMessage,
  sendCampaignImageTemplate,
  getMessageTemplates,
};