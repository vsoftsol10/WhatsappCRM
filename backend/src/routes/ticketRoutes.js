const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  updateTicketStatus,
} = require("../controllers/ticketController");

const authMiddleware = require("../middleware/authMiddleware");

// ===================== CREATE =====================
router.post("/", authMiddleware, createTicket);

// ===================== GET ALL =====================
router.get("/", authMiddleware, getTickets);

// ===================== GET SINGLE =====================
router.get("/:id", authMiddleware, getTicketById);

// ===================== UPDATE =====================
router.put("/:id", authMiddleware, updateTicket);

// ===================== DELETE =====================
router.delete("/:id", authMiddleware, deleteTicket);

// ===================== UPDATE STATUS =====================
router.patch("/:id/status", authMiddleware, updateTicketStatus);

module.exports = router;