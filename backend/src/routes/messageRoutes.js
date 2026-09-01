const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessagesByConversation,
  editMessage,
  deleteMessage,
  resolveMessageClassification,
} = require("../controllers/messageController");

// All message routes require a logged-in user — previously none of
// these had auth, so anyone with the URL could send/edit/delete
// WhatsApp messages through this API without a token.
router.use(authMiddleware);

// SEND MESSAGE
router.post("/", sendMessage);

// GET ALL MESSAGES OF A CONVERSATION
router.get("/:conversationId", getMessagesByConversation);

// EDIT MESSAGE
router.put("/:id", editMessage);

// Mark a failed AI classification as manually resolved
router.patch("/:id/resolve-classification", resolveMessageClassification);

// DELETE MESSAGE
router.delete("/:id", deleteMessage);

module.exports = router;