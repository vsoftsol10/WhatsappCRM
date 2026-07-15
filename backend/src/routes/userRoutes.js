const express = require("express");
const { createEmployee } = require("../controllers/userController");

const router = express.Router();

router.post("/create-employee", createEmployee);

module.exports = router;