// const express = require("express");
// const router = express.Router();

// const { getAuditLogs } = require("../controllers/auditLogController");
// const authMiddleware = require("../middleware/authMiddleware");
// const adminMiddleware = require("../middleware/adminMiddleware");

// router.get("/", authMiddleware, adminMiddleware, getAuditLogs);

// module.exports = router;


const express = require("express");
const router = express.Router();

const { getAuditLogs, getAuditLogStats } = require("../controllers/auditLogController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Must come before "/" doesn't actually matter here since "/stats" is
// a distinct literal path, not a param — but keeping it above for
// readability alongside the other route.
router.get("/stats", authMiddleware, adminMiddleware, getAuditLogStats);

router.get("/", authMiddleware, adminMiddleware, getAuditLogs);

module.exports = router;