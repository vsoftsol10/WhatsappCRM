const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessagesByConversation,
  editMessage,
  deleteMessage,
} = require("../controllers/messageController");

// SEND MESSAGE
router.post("/", sendMessage);

// GET ALL MESSAGES OF A CONVERSATION
router.get("/:conversationId", getMessagesByConversation);

// EDIT MESSAGE
router.put("/:id", editMessage);

// DELETE MESSAGE
router.delete("/:id", deleteMessage);

module.exports = router;