const express = require("express");
const router = express.Router();

const {
  getDealActivities,
  createDealActivity,
} = require("../controllers/dealActivityController");

const authMiddleware = require("../middleware/authMiddleware");

// ======================================================
// DEAL ACTIVITY ROUTES
// ======================================================

// Get all activities for a deal
router.get(
  "/:dealId/activities",
  authMiddleware,
  getDealActivities
);

// Add a new activity to a deal
router.post(
  "/:dealId/activities",
  authMiddleware,
  createDealActivity
);

module.exports = router;