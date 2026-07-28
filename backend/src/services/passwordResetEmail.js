// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendPasswordResetEmail = async (
//   email,
//   resetLink
// ) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Reset Your Password",
//     text: `
// Click the link below to reset your password:

// ${resetLink}

// This link expires in 1 hour.

// Regards,
// WhatsApp CRM Team
//     `,
//   });
// };

// module.exports = sendPasswordResetEmail;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Render's containers default to IPv6, which can hang indefinitely
  // when connecting to Gmail's SMTP server. Forcing IPv4 fixes it.
  family: 4,
  connectionTimeout: 15000, // fail fast instead of hanging forever
  greetingTimeout: 15000,
  socketTimeout: 15000,
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