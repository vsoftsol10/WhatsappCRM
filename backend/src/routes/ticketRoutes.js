// const express = require("express");
// const router = express.Router();

// const {
//   createTicket,
//   getTickets,
//   getTicketById,
//   updateTicket,
//   deleteTicket,
//   updateTicketStatus,
// } = require("../controllers/ticketController");

// const authMiddleware = require("../middleware/authMiddleware");

// // ===================== CREATE =====================
// router.post("/", authMiddleware, createTicket);

// // ===================== GET ALL =====================
// router.get("/", authMiddleware, getTickets);

// // ===================== GET SINGLE =====================
// router.get("/:id", authMiddleware, getTicketById);

// // ===================== UPDATE =====================
// router.put("/:id", authMiddleware, updateTicket);

// // ===================== DELETE =====================
// router.delete("/:id", authMiddleware, deleteTicket);

// // ===================== UPDATE STATUS =====================
// router.patch("/:id/status", authMiddleware, updateTicketStatus);

// module.exports = router;

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

const {
  getTicketWorkNotes,
  createTicketWorkNote,
  updateTicketWorkNote,
  deleteTicketWorkNote,
} = require("../controllers/ticketWorkNoteController");

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

// ===================== WORK NOTES =====================
router.get("/:id/work-notes", authMiddleware, getTicketWorkNotes);

router.post("/:id/work-notes", authMiddleware, createTicketWorkNote);

router.put("/work-notes/:noteId", authMiddleware, updateTicketWorkNote);

router.delete("/work-notes/:noteId", authMiddleware, deleteTicketWorkNote);

module.exports = router;