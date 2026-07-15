const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const generatePassword = require("../utils/generatePassword");
const sendEmployeeCredentials = require("../services/emailService");

const createEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;

    // check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Employee already exists",
      });
    }

    // generate temporary password
    const tempPassword = generatePassword();

    // hash password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // create employee
    const employee = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    await sendEmployeeCredentials(
      name,
      email,
      tempPassword
    );

    res.status(201).json({
      message: "Employee created successfully and email sent",
      // employee,
      // temporaryPassword: tempPassword,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createEmployee,
};