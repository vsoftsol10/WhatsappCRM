const express = require("express");
const router = express.Router();

const {
  createConversation,
  getConversations,
  getConversationById,
  updateConversationStatus,
  markConversationAsRead,
  markConversationAsUnread,
  clearConversationMessages,
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

// MARK CONVERSATION AS UNREAD
router.patch("/:id/unread", markConversationAsUnread);

// CLEAR CHAT (delete all messages)
router.delete("/:id/messages", clearConversationMessages);

// DELETE CONVERSATION
router.delete("/:id", deleteConversation);

module.exports = router;