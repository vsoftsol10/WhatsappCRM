const express = require("express");
const router = express.Router();

const { getAuditLogs, getAuditLogStats, getAuditLogActions } = require("../controllers/auditLogController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/stats", authMiddleware, adminMiddleware, getAuditLogStats);

router.get("/actions", authMiddleware, adminMiddleware, getAuditLogActions);

router.get("/", authMiddleware, adminMiddleware, getAuditLogs);

module.exports = router;