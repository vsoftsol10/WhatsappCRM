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

      // Deliberately the same message as a wrong password below —
      // returning "User not found" here let anyone probe which
      // emails have accounts on this system (user enumeration).
      return res.status(400).json({
        message: "Invalid email or password",
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
        message: "Invalid email or password",
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
          phone: user.phone,
          department: user.department,
          designation: user.designation,
          address: user.address,
          profileImage: user.profileImage,
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
        phone: user.phone,
        department: user.department,
        designation: user.designation,
        address: user.address,
        profileImage: user.profileImage,
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
        phone: true,
        department: true,
        designation: true,
        address: true,
        profileImage: true,
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

    // Always respond with the same generic message whether or not
    // this email has an account — returning 404 "User not found"
    // previously let anyone check which emails exist in the system.
    // The reset email itself is still only sent when a real user
    // matches.
    const genericResponse = {
      message:
        "If an account exists with that email, a password reset link has been sent.",
    };

    if (!user) {
      return res.status(200).json(genericResponse);
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

    return res.status(200).json(genericResponse);

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
// UPDATE MY PROFILE
// ========================
// Deliberately separate from employeeController.updateEmployee: this is
// for the logged-in user editing themselves, so it only ever touches
// req.user.userId (never req.params.id) and only accepts a fixed
// whitelist of fields. email, role, status, department and designation
// are never read from the body here, so this route can't be used to
// self-promote or change what only an admin should change.
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (name !== undefined && name.trim().length < 3) {
      return res.status(400).json({
        message: "Name must be at least 3 characters",
      });
    }

    if (phone !== undefined && phone !== null && phone !== "" && !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: "Enter a valid 10-digit phone number",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        name,
        phone,
        address,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        department: true,
        designation: true,
        address: true,
        profileImage: true,
      },
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "PROFILE_UPDATED",
      entityType: "User",
      entityId: user.id,
      details: `${user.name} updated their profile`,
      actorId: user.id,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// UPLOAD MY PROFILE IMAGE
// ========================
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file provided",
      });
    }

    const { uploadProfileImage: uploadToCloudinary } = require("../services/cloudinaryService");

    const result = await uploadToCloudinary(req.file);

    if (!result) {
      return res.status(500).json({
        message: "Image upload failed",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        profileImage: result.imageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        department: true,
        designation: true,
        address: true,
        profileImage: true,
      },
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "PROFILE_UPDATED",
      entityType: "User",
      entityId: user.id,
      details: `${user.name} updated their profile photo`,
      actorId: user.id,
    });

    return res.status(200).json({
      message: "Profile photo updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ========================
// REMOVE MY PROFILE IMAGE
// ========================
// Just clears the DB field; the app doesn't currently store Cloudinary
// publicIds for any of its images (campaign/template uploads don't
// either), so the old file is left in Cloudinary rather than deleted.
const removeProfileImage = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        profileImage: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        department: true,
        designation: true,
        address: true,
        profileImage: true,
      },
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "PROFILE_UPDATED",
      entityType: "User",
      entityId: user.id,
      details: `${user.name} removed their profile photo`,
      actorId: user.id,
    });

    return res.status(200).json({
      message: "Profile photo removed successfully",
      user,
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
  updateProfile,
  uploadProfileImage,
  removeProfileImage,
  changePassword,
  forgotPassword,
  resetPassword,
};