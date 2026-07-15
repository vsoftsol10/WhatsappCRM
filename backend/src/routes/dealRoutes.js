const express = require("express");

const router = express.Router();

const {
  createDeal,
  getDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  updateDealStage,
} = require("../controllers/dealController");

const authMiddleware = require("../middleware/authMiddleware");

// ======================================================
// DEAL ROUTES
// ======================================================

// Create Deal
router.post("/", authMiddleware, createDeal);

// Get All Deals
router.get("/", authMiddleware, getDeals);

// Get Single Deal
router.get("/:id", authMiddleware, getDealById);

// Update Deal
router.put("/:id", authMiddleware, updateDeal);

// Update Deal Stage
router.patch("/:id/stage", authMiddleware, updateDealStage);

// Delete Deal
router.delete("/:id", authMiddleware, deleteDeal);

module.exports = router;