// const express = require("express");
// const { createEmployee } = require("../controllers/userController");

// const router = express.Router();

// router.post("/create-employee", createEmployee);

// module.exports = router;

const express = require("express");
const { createEmployee } = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// This duplicates employeeController.createEmployee and isn't called
// by the frontend anywhere — kept for backward compatibility but
// locked down the same way. Previously had no auth at all.
router.post("/create-employee", authMiddleware, adminMiddleware, createEmployee);

module.exports = router;