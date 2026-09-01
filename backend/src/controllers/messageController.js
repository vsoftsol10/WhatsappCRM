const prisma = require("../config/prisma");
const { sendTextMessage } = require("../services/whatsappService");
const { getIO } = require("../config/socket");

const WHATSAPP_WINDOW_MS = 24 * 60 * 60 * 1000; // Meta's 24-hour customer service window

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const {
      conversationId,
      content,
      sender,
      messageType,
      status,
    } = req.body;

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        customer: true,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Send only AGENT messages to WhatsApp
    if (sender === "AGENT") {
      const recipientPhone =
        conversation.phone || conversation.customer?.phone;

      if (!recipientPhone) {
        return res.status(400).json({
          success: false,
          message: "Recipient phone number not found",
        });
      }

      // Free-form text only works inside Meta's 24-hour customer
      // service window (i.e. the customer messaged us within the
      // last 24hrs). Outside that window WhatsApp rejects the send
      // with a "re-engagement message" error — check locally first
      // so the agent gets a clear, immediate error instead of a
      // silent failure that only shows up later as a status webhook.
      const lastCustomerMessage = await prisma.message.findFirst({
        where: {
          conversationId,
          sender: "CUSTOMER",
        },
        orderBy: { createdAt: "desc" },
      });

      const windowOpen =
        lastCustomerMessage &&
        Date.now() - new Date(lastCustomerMessage.createdAt).getTime() <
          WHATSAPP_WINDOW_MS;

      if (!windowOpen) {
        return res.status(400).json({
          success: false,
          code: "WINDOW_CLOSED",
          message:
            "24-hour messaging window is closed for this customer. Send an approved template instead of a free-form message.",
        });
      }

      const result = await sendTextMessage(
        recipientPhone,
        content
      );

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to send WhatsApp message",
          error: result.error,
        });
      }
    }

    // Save message after successful send
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender,
        messageType,
        status,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessage: content,
        ...(sender === "CUSTOMER" && {
          unreadCount: {
            increment: 1,
          },
        }),
      },
    });

    // Broadcast so every other agent's dashboard updates without a
    // manual refresh — the agent who just sent it gets this too, but
    // that's harmless since the store dedupes by message id.
    try {
      const io = getIO();
      io.to("agents").emit("message:new", message);
      io.to(`conversation:${conversationId}`).emit("message:new", message);
      io.to("agents").emit("conversation:update", updatedConversation);
    } catch (socketError) {
      console.error("Socket broadcast failed:", socketError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// GET MESSAGES BY CONVERSATION ID
const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

// EDIT MESSAGE
const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const message = await prisma.message.update({
      where: { id },
      data: {
        content: content.trim(),
        isEdited: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Message updated successfully",
      data: message,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update message",
    });
  }
};

// DELETE MESSAGE
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.message.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};

// ================= MARK CLASSIFICATION AS MANUALLY RESOLVED =================
// Clears the "AI classification failed" review flag once an employee
// has handled it by hand (created a Lead, sent it to ERP-CRM, or
// decided it needed no action) — so the conversation stops showing
// the "Needs Review" banner. Reuses the same classificationStatus
// column the AI pipeline already writes to (see recordMessageClassification
// in messageHelper.js), just with a status value that means "a human
// handled this", not "the AI succeeded".
const resolveMessageClassification = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.findUnique({ where: { id } });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: {
        classificationStatus: "MANUALLY_RESOLVED",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Marked as manually resolved",
      data: updated,
    });
  } catch (error) {
    console.error("Resolve Message Classification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update this message",
    });
  }
};

module.exports = {
  sendMessage,
  getMessagesByConversation,
  editMessage,
  deleteMessage,
  resolveMessageClassification,
};