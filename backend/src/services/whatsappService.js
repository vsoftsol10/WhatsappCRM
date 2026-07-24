const axios = require("axios");

const GRAPH_API_VERSION = "v23.0";

const sendTextMessage = async (to, message) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
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