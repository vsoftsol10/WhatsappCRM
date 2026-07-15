const express = require("express");
const router = express.Router();

const { 
  createCustomer, 
  getCustomers, 
  getCustomerById, 
  updateCustomer,
  deleteCustomer,
 } = require("../controllers/customerController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createCustomer);

router.get("/", authMiddleware, getCustomers);

router.get("/:id", authMiddleware, getCustomerById);

router.put("/:id", authMiddleware, updateCustomer);

router.delete("/:id", authMiddleware, deleteCustomer);

module.exports = router;