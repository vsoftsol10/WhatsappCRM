// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendEmployeeCredentials = async (name, email, tempPassword) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Welcome to WhatsApp CRM",
//     text: `
// Hello ${name},

// Your account has been created successfully.

// Email: ${email}
// Temporary Password: ${tempPassword}

// Login URL:
// http://localhost:5173/login

// Please change your password after your first login.

// Regards,
// WhatsApp CRM Team
//     `,
//   });
// };



// module.exports = sendEmployeeCredentials;
  
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

const sendEmployeeCredentials = async (name, email, tempPassword) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to WhatsApp CRM",
    text: `
Hello ${name},

Your account has been created successfully.

Email: ${email}
Temporary Password: ${tempPassword}

Login URL:
http://localhost:5173/login

Please change your password after your first login.

Regards,
WhatsApp CRM Team
    `,
  });
};



module.exports = sendEmployeeCredentials;