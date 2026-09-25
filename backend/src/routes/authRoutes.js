const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  uploadProfileImage,
  removeProfileImage,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Register new user (Admin creates employee). Previously this was
// completely public — anyone could POST here and create a User row
// without logging in. Restricted to logged-in admins.
router.post("/register", authMiddleware, adminMiddleware, registerUser);

// Login user
router.post("/login", loginUser);

// Get logged-in user (Protected route)
router.get("/me", authMiddleware, getMe);

// Logged-in user editing their own profile. Deliberately not the
// employeeController /api/employees/:id route (that one is admin-only
// and can also change role/status), and req.params is never used here
// so a user can never update anyone but themselves.
router.put("/profile", authMiddleware, updateProfile);
router.post("/profile-image", authMiddleware, upload.single("image"), uploadProfileImage);
router.delete("/profile-image", authMiddleware, removeProfileImage);

router.post("/change-password", authMiddleware, changePassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;