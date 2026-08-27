// const prisma = require("../config/prisma");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const sendPasswordResetEmail = require("../services/passwordResetEmail");

// // ========================
// // REGISTER USER
// // ========================
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     return res.status(201).json({
//       message: "User registered successfully",
//       user,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // ========================
// // LOGIN USER
// // ========================
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(400).json({
//         message: "User not found",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!isPasswordValid) {
//       return res.status(400).json({
//         message: "Invalid password",
//       });
//     }

//     const token = jwt.sign(
//       {
//         userId: user.id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );

//     // First login check
//     if (user.isFirstLogin) {
//       return res.status(200).json({
//         message: "First login detected",
//         forcePasswordChange: true,
//         token,
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//         },
//       });
//     }

//     return res.status(200).json({
//       message: "Login successful",
//       forcePasswordChange: false,
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // ========================
// // GET CURRENT USER
// // ========================
// const getMe = async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         id: req.user.userId,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         createdAt: true,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // ========================
// // CHANGE PASSWORD
// // ========================
// const changePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const user = await prisma.user.findUnique({
//       where: {
//         id: req.user.userId,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const isPasswordValid = await bcrypt.compare(
//       currentPassword,
//       user.password
//     );

//     if (!isPasswordValid) {
//       return res.status(400).json({
//         message: "Current password is incorrect",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(
//       newPassword,
//       10
//     );

//     await prisma.user.update({
//       where: {
//         id: user.id,
//       },
//       data: {
//         password: hashedPassword,
//         isFirstLogin: false,
//       },
//     });

//     return res.status(200).json({
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     const resetToken = crypto.randomBytes(32).toString("hex");

//     const resetTokenExpiry = new Date(
//       Date.now() + 60 * 60 * 1000
//     );

//     await prisma.user.update({
//       where: {
//         id: user.id,
//       },
//       data: {
//         resetToken,
//         resetTokenExpiry,
//       },
//     });

//     const frontendUrl =
//       process.env.FRONTEND_URL || "http://localhost:5173";

//     const resetLink =
//       `${frontendUrl}/reset-password/${resetToken}`;

//     await sendPasswordResetEmail(
//       email,
//       resetLink
//     );

//     return res.status(200).json({
//       message: "Password reset email sent successfully",
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     const user = await prisma.user.findFirst({
//       where: {
//         resetToken: token,
//         resetTokenExpiry: {
//           gt: new Date(),
//         },
//       },
//     });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid or expired token",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(
//       password,
//       10
//     );

//     await prisma.user.update({
//       where: {
//         id: user.id,
//       },
//       data: {
//         password: hashedPassword,
//         resetToken: null,
//         resetTokenExpiry: null,
//         isFirstLogin: false,
//       },
//     });

//     return res.status(200).json({
//       message: "Password reset successful",
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // ========================
// // EXPORTS
// // ========================
// module.exports = {
//   registerUser,
//   loginUser,
//   getMe,
//   changePassword,
//   forgotPassword,
//   resetPassword,
// };

const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendPasswordResetEmail = require("../services/passwordResetEmail");
const { recordAuditLog } = require("../services/auditLogService");

// ========================
// REGISTER USER
// ========================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "USER_REGISTERED",
      entityType: "User",
      entityId: user.id,
      details: `${user.name} (${user.email})`,
      actorId: req.user?.userId,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// LOGIN USER
// ========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // No user row exists, so entityId can't reference one — the
      // attempted email is the only useful identifier here, and
      // actorId stays null since nobody authenticated.
      await recordAuditLog({
        action: "LOGIN_FAILED",
        entityType: "User",
        entityId: email || "unknown",
        details: `Login attempt for unknown email: ${email}`,
        actorId: null,
      });

      return res.status(400).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      await recordAuditLog({
        action: "LOGIN_FAILED",
        entityType: "User",
        entityId: user.id,
        details: `Incorrect password for ${user.email}`,
        actorId: null,
      });

      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "LOGIN_SUCCESS",
      entityType: "User",
      entityId: user.id,
      details: `${user.name} logged in`,
      actorId: user.id,
    });

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // First login check
    if (user.isFirstLogin) {
      return res.status(200).json({
        message: "First login detected",
        forcePasswordChange: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    return res.status(200).json({
      message: "Login successful",
      forcePasswordChange: false,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// GET CURRENT USER
// ========================
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// CHANGE PASSWORD
// ========================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        isFirstLogin: false,
      },
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "PASSWORD_CHANGED",
      entityType: "User",
      entityId: user.id,
      details: `${user.name} changed their password`,
      actorId: user.id,
    });

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenExpiry = new Date(
      Date.now() + 60 * 60 * 1000
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetLink =
      `${frontendUrl}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(
      email,
      resetLink
    );

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "PASSWORD_RESET_REQUESTED",
      entityType: "User",
      entityId: user.id,
      details: `Password reset requested for ${user.email}`,
      actorId: null,
    });

    return res.status(200).json({
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        isFirstLogin: false,
      },
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "PASSWORD_RESET_COMPLETED",
      entityType: "User",
      entityId: user.id,
      details: `${user.name} completed a password reset`,
      actorId: user.id,
    });

    return res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// EXPORTS
// ========================
module.exports = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
};