const express = require("express");
const router = express.Router();

const {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  sendTemplate,
  getTemplateRecipients,
  generateTemplateWithAI,
  getMetaApprovedTemplates,
} = require("../controllers/templateController");

const authMiddleware = require("../middleware/authMiddleware");

// ================= TEMPLATE ROUTES =================

router.post("/", authMiddleware, createTemplate);

router.post("/generate", authMiddleware, generateTemplateWithAI);

// Must come before "/:id" — otherwise Express matches "meta/approved" as
// an :id param and this route is never reached.
router.get("/meta/approved", authMiddleware, getMetaApprovedTemplates);

router.get("/", authMiddleware, getTemplates);

router.get("/:id/recipients", authMiddleware, getTemplateRecipients);

router.get("/:id", authMiddleware, getTemplateById);

router.put("/:id", authMiddleware, updateTemplate);

router.delete("/:id", authMiddleware, deleteTemplate);

router.post("/send", authMiddleware, sendTemplate);

module.exports = router;