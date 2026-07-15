const express = require("express");
const router = express.Router();

const {
  createConversation,
  getConversations,
  getConversationById,
  updateConversationStatus,
  markConversationAsRead,
  deleteConversation,
} = require("../controllers/conversationController");

// CREATE CONVERSATION
router.post("/", createConversation);

// GET ALL CONVERSATIONS
router.get("/", getConversations);

// GET CONVERSATION BY ID
router.get("/:id", getConversationById);

// UPDATE CONVERSATION STATUS
router.patch("/:id", updateConversationStatus);

// MARK CONVERSATION AS READ
router.patch("/:id/read", markConversationAsRead);

// DELETE CONVERSATION
router.delete("/:id", deleteConversation);

module.exports = router;