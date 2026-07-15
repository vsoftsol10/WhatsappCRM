const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (
  email,
  resetLink
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    text: `
Click the link below to reset your password:

${resetLink}

This link expires in 1 hour.

Regards,
WhatsApp CRM Team
    `,
  });
};

module.exports = sendPasswordResetEmail;