const axios = require("axios");

const sendPasswordResetEmail = async (
  email,
  resetLink
) => {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "WhatsApp CRM",
        email: process.env.EMAIL_USER, // must be a verified sender in Brevo
      },
      to: [{ email }],
      subject: "Reset Your Password",
      textContent: `
Click the link below to reset your password:

${resetLink}

This link expires in 1 hour.

Regards,
WhatsApp CRM Team
      `,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    }
  );
};

module.exports = sendPasswordResetEmail;