// const prisma = require("../config/prisma");
// const { sendTextMessage } = require("../services/whatsappService");

// // SEND MESSAGE
// const sendMessage = async (req, res) => {
//   try {
//     const {
//       conversationId,
//       content,
//       sender,
//       messageType,
//       status,
//     } = req.body;

//     const conversation = await prisma.conversation.findUnique({
//       where: {
//         id: conversationId,
//       },
//       include: {
//         customer: true,
//       },
//     });

//     if (!conversation) {
//       return res.status(404).json({
//         success: false,
//         message: "Conversation not found",
//       });
//     }

//     // Send only AGENT messages to WhatsApp
//     if (sender === "AGENT") {
//       const recipientPhone =
//         conversation.phone || conversation.customer?.phone;

//       if (!recipientPhone) {
//         return res.status(400).json({
//           success: false,
//           message: "Recipient phone number not found",
//         });
//       }

//       const result = await sendTextMessage(
//         recipientPhone,
//         content
//       );

//       if (!result.success) {
//         return res.status(500).json({
//           success: false,
//           message: "Failed to send WhatsApp message",
//           error: result.error,
//         });
//       }
//     }

//     // Save message after successful send
//     const message = await prisma.message.create({
//       data: {
//         conversationId,
//         content,
//         sender,
//         messageType,
//         status,
//       },
//     });

//     await prisma.conversation.update({
//       where: {
//         id: conversationId,
//       },
//       data: {
//         lastMessage: content,
//         ...(sender === "CUSTOMER" && {
//           unreadCount: {
//             increment: 1,
//           },
//         }),
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Message sent successfully",
//       data: message,
//     });

//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to send message",
//     });
//   }
// };

// // GET MESSAGES BY CONVERSATION ID
// const getMessagesByConversation = async (req, res) => {
//   try {
//     const { conversationId } = req.params;

//     const messages = await prisma.message.findMany({
//       where: {
//         conversationId,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });

//     res.status(200).json({
//       success: true,
//       messages,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch messages",
//     });
//   }
// };

// // DELETE MESSAGE
// const deleteMessage = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await prisma.message.delete({
//       where: {
//         id,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Message deleted successfully",
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to delete message",
//     });
//   }
// };

// module.exports = {
//   sendMessage,
//   getMessagesByConversation,
//   deleteMessage,
// };


const prisma = require("../config/prisma");
const { sendTextMessage } = require("../services/whatsappService");

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

    let metaMessageId = null;

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

      // WhatsApp only allows free-form (non-template) messages within
      // 24 hours of the customer's last incoming message. Outside that
      // window, Meta silently rejects the send — check it ourselves so
      // we can return a clear error instead of a confusing failure.
      const lastCustomerMessage = await prisma.message.findFirst({
        where: {
          conversationId,
          sender: "CUSTOMER",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const WINDOW_MS = 24 * 60 * 60 * 1000;
      const withinWindow =
        lastCustomerMessage &&
        Date.now() - new Date(lastCustomerMessage.createdAt).getTime() <
          WINDOW_MS;

      if (!withinWindow) {
        return res.status(400).json({
          success: false,
          message:
            "24-hour messaging window is closed for this customer. Send an approved template message to restart the conversation.",
          code: "WINDOW_CLOSED",
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

      metaMessageId = result.data?.messages?.[0]?.id || null;
    }

    // Save message after successful send
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        sender,
        messageType,
        status,
        metaMessageId,
      },
    });

    await prisma.conversation.update({
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

module.exports = {
  sendMessage,
  getMessagesByConversation,
  deleteMessage,
};