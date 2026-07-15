const express = require("express");
const router = express.Router();

const {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  sendTemplate,
} = require("../controllers/templateController");

const authMiddleware = require("../middleware/authMiddleware");

// ================= TEMPLATE ROUTES =================

router.post("/", authMiddleware, createTemplate);

router.get("/", authMiddleware, getTemplates);

router.get("/:id", authMiddleware, getTemplateById);

router.put("/:id", authMiddleware, updateTemplate);

router.delete("/:id", authMiddleware, deleteTemplate);

router.post("/send", authMiddleware, sendTemplate);

module.exports = router;