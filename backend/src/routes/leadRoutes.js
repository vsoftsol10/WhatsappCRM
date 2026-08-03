// const authMiddleware = require("../middleware/authMiddleware");
// const express = require("express");

// const {
//   createLead,
//   getLeads,
//   updateLead,
//   updateLeadStatus,
//   convertLeadToCustomer,
//   deleteLead,
// } = require("../controllers/leadController");

// const router = express.Router();

// router.use(authMiddleware);

// // Create Lead
// router.post("/", createLead);

// // Get All Leads
// router.get("/", getLeads);

// // Update Lead
// router.put("/:id", updateLead);

// // Update Lead Status
// router.patch("/:id/status", updateLeadStatus);

// // Convert Lead to Customer
// router.post("/:id/convert", convertLeadToCustomer);

// // Delete Lead
// router.delete("/:id", deleteLead);

// module.exports = router;


const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");

const {
  createLead,
  getLeads,
  updateLead,
  updateLeadStatus,
  convertLeadToCustomer,
  deleteLead,
} = require("../controllers/leadController");

const {
  getLeadWorkNotes,
  createLeadWorkNote,
  updateLeadWorkNote,
  deleteLeadWorkNote,
} = require("../controllers/leadWorkNoteController");

const router = express.Router();

router.use(authMiddleware);

// Create Lead
router.post("/", createLead);

// Get All Leads
router.get("/", getLeads);

// Update Lead
router.put("/:id", updateLead);

// Update Lead Status
router.patch("/:id/status", updateLeadStatus);

// Convert Lead to Customer
router.post("/:id/convert", convertLeadToCustomer);

// ================= WORK NOTES =================

// Get Work Notes for a Lead
router.get("/:id/work-notes", getLeadWorkNotes);

// Add Work Note to a Lead
router.post("/:id/work-notes", createLeadWorkNote);

// Update a Work Note
router.put("/work-notes/:noteId", updateLeadWorkNote);

// Delete a Work Note
router.delete("/work-notes/:noteId", deleteLeadWorkNote);

// Delete Lead
router.delete("/:id", deleteLead);

module.exports = router;