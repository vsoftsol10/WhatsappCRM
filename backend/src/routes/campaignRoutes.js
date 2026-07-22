// const express = require("express");

// const router = express.Router();

// const authMiddleware = require("../middleware/authMiddleware");

// const {
//   createCampaign,
//   getCampaigns,
//   getCampaignById,
//   updateCampaign,
//   deleteCampaign,
//   generateAICampaign,
//   sendCampaign,
//   getCampaignRecipients,
// } = require("../controllers/campaignController");

// // =====================================
// // CREATE CAMPAIGN
// // =====================================
// router.post(
//   "/",
//   authMiddleware,
//   createCampaign
// );

// // =====================================
// // GENERATE AI CAMPAIGN
// // =====================================
// router.post(
//   "/generate-ai",
//   authMiddleware,
//   generateAICampaign
// );

// // =====================================
// // SEND CAMPAIGN
// // =====================================
// router.post(
//   "/send",
//   authMiddleware,
//   sendCampaign
// );

// // =====================================
// // GET ALL CAMPAIGNS
// // =====================================
// router.get(
//   "/",
//   authMiddleware,
//   getCampaigns
// );

// // =====================================
// // GET CAMPAIGN RECIPIENTS
// // IMPORTANT: Keep this ABOVE "/:id"
// // =====================================
// router.get(
//   "/:id/recipients",
//   authMiddleware,
//   getCampaignRecipients
// );

// // =====================================
// // GET SINGLE CAMPAIGN
// // =====================================
// router.get(
//   "/:id",
//   authMiddleware,
//   getCampaignById
// );

// // =====================================
// // UPDATE CAMPAIGN
// // =====================================
// router.put(
//   "/:id",
//   authMiddleware,
//   updateCampaign
// );

// // =====================================
// // DELETE CAMPAIGN
// // =====================================
// router.delete(
//   "/:id",
//   authMiddleware,
//   deleteCampaign
// );

// module.exports = router;

const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  generateAICampaign,
  sendCampaign,
  getCampaignRecipients,
} = require("../controllers/campaignController");

// =====================================
// CREATE CAMPAIGN
// =====================================
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createCampaign
);

// =====================================
// GENERATE AI CAMPAIGN
// =====================================
router.post(
  "/generate-ai",
  authMiddleware,
  generateAICampaign
);

// =====================================
// SEND CAMPAIGN
// =====================================
router.post(
  "/send",
  authMiddleware,
  sendCampaign
);

// =====================================
// GET ALL CAMPAIGNS
// =====================================
router.get(
  "/",
  authMiddleware,
  getCampaigns
);

// =====================================
// GET CAMPAIGN RECIPIENTS
// IMPORTANT: Keep this ABOVE "/:id"
// =====================================
router.get(
  "/:id/recipients",
  authMiddleware,
  getCampaignRecipients
);

// =====================================
// GET SINGLE CAMPAIGN
// =====================================
router.get(
  "/:id",
  authMiddleware,
  getCampaignById
);

// =====================================
// UPDATE CAMPAIGN
// =====================================
router.put(
  "/:id",
  authMiddleware,
  updateCampaign
);

// =====================================
// DELETE CAMPAIGN
// =====================================
router.delete(
  "/:id",
  authMiddleware,
  deleteCampaign
);

module.exports = router;