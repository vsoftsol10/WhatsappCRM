// const express = require("express");

// const {
//   createCampaign,
//   getCampaigns,
//   getCampaignById,
//   updateCampaign,
//   deleteCampaign,
// } = require("../controllers/campaignController");

// const authMiddleware = require("../middleware/authMiddleware");

// const router = express.Router();

// // ================= CREATE CAMPAIGN =================
// router.post("/", authMiddleware, createCampaign);

// // ================= GET ALL CAMPAIGNS =================
// router.get("/", authMiddleware, getCampaigns);

// // ================= GET SINGLE CAMPAIGN =================
// router.get("/:id", authMiddleware, getCampaignById);

// // ================= UPDATE CAMPAIGN =================
// router.put("/:id", authMiddleware, updateCampaign);

// // ================= DELETE CAMPAIGN =================
// router.delete("/:id", authMiddleware, deleteCampaign);

// module.exports = router;

const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  generateAICampaign,
  sendCampaign,
} = require("../controllers/campaignController");

// =====================================
// CREATE CAMPAIGN
// =====================================
router.post("/", authMiddleware, createCampaign);

// =====================================
// GENERATE AI CAMPAIGN
// =====================================
router.post(
  "/generate-ai",
  authMiddleware,
  generateAICampaign
);

// =====================================
// SEND CAMPAIGN TO CUSTOMERS
// =====================================
router.post(
  "/send",
  authMiddleware,
  sendCampaign
);

// =====================================
// GET ALL CAMPAIGNS
// =====================================
router.get("/", authMiddleware, getCampaigns);

// =====================================
// GET SINGLE CAMPAIGN
// =====================================
router.get("/:id", authMiddleware, getCampaignById);

// =====================================
// UPDATE CAMPAIGN
// =====================================
router.put("/:id", authMiddleware, updateCampaign);

// =====================================
// DELETE CAMPAIGN
// =====================================
router.delete("/:id", authMiddleware, deleteCampaign);

module.exports = router;