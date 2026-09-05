const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const { getSettings, updateSettings } = require("../controllers/aiSettingsController");

// Only a logged-in ADMIN can view or change the Groq API key, model,
// system prompt, or the global auto-reply master switch.
router.use(authMiddleware, adminMiddleware);

router.get("/", getSettings);
router.patch("/", updateSettings);

module.exports = router;