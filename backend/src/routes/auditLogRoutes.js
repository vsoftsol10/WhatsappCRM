const express = require("express");
const router = express.Router();

const { getAuditLogs } = require("../controllers/auditLogController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", authMiddleware, adminMiddleware, getAuditLogs);

module.exports = router;
