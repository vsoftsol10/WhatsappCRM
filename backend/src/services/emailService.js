const axios = require("axios");

const sendEmployeeCredentials = async (name, email, tempPassword) => {
  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "WhatsApp CRM",
        email: process.env.EMAIL_USER, // must be a verified sender in Brevo
      },
      to: [{ email, name }],
      subject: "Welcome to WhatsApp CRM",
      textContent: `
Hello ${name},

Your account has been created successfully.

Email: ${email}
Temporary Password: ${tempPassword}

Login URL:
${process.env.FRONTEND_URL || "http://localhost:5173"}/login

Please change your password after your first login.

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



module.exports = sendEmployeeCredentials;