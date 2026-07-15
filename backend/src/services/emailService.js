const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
  