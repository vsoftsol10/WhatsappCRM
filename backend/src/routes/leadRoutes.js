// const express = require("express");

// const {
//   createLead,
//   getLeads,
//   updateLead,
//   updateLeadStatus,
//   deleteLead,
// } = require("../controllers/leadController");

// const router = express.Router();

// // Create Lead
// router.post("/", createLead);

// // Get All Leads
// router.get("/", getLeads);

// // Update Lead
// router.put("/:id", updateLead);

// // Update Lead Status
// router.patch("/:id/status", updateLeadStatus);

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

// Delete Lead
router.delete("/:id", deleteLead);

module.exports = router;