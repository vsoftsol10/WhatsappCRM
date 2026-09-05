const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createConversation,
  getConversations,
  getConversationById,
  updateConversationStatus,
  markConversationAsRead,
  markConversationAsUnread,
  clearConversationMessages,
  deleteConversation,
  toggleConversationBot,
} = require("../controllers/conversationController");

// All conversation routes require a logged-in user — previously none
// of these had auth, so anyone with the URL could read/delete
// customer conversations without a token.
router.use(authMiddleware);

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

// TOGGLE BOT (Groq Auto-Reply) FOR THIS CONVERSATION -- ChatHeader "Bot ON/OFF" pill
router.patch("/:id/bot-toggle", toggleConversationBot);

// CLEAR CHAT (delete all messages)
router.delete("/:id/messages", clearConversationMessages);

// DELETE CONVERSATION
router.delete("/:id", deleteConversation);

module.exports = router;