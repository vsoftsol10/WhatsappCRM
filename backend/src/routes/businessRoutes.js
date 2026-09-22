const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getBusinesses, createBusiness, updateBusiness } = require("../controllers/businessController");
router.get("/", authMiddleware, getBusinesses);
router.post("/", authMiddleware, adminMiddleware, createBusiness);
router.put("/:id", authMiddleware, adminMiddleware, updateBusiness);
module.exports = router;