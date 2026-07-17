const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================
router.get("/", authMiddleware, getNotifications);

// ==========================================
// MARK SINGLE NOTIFICATION AS READ
// ==========================================
router.patch("/:id/read", authMiddleware, markAsRead);

// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================
router.patch("/read-all", authMiddleware, markAllAsRead);

// ==========================================
// DELETE NOTIFICATION
// ==========================================
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;