const axios = require("axios");

const GRAPH_API_VERSION = "v23.0";

const sendTextMessage = async (to, message) => {
  console.log("Sending to:", to);
  console.log("sendTextMessage called with:", { to, message });

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
    const response = await axios.post(
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

module.exports = {
  sendTextMessage,
};
