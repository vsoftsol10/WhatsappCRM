const prisma = require("../config/prisma");
const { sendTextMessage } = require("../services/whatsappService");
const { getIO } = require("../config/socket");

// Broadcasts a saved message + its updated conversation to every
// connected agent, and specifically to anyone with that conversation
// open. Wrapped in try/catch so a socket hiccup never breaks the
// underlying WhatsApp send/save flow.
const broadcastMessage = (message, conversation) => {
  try {
    const io = getIO();
    io.to("agents").emit("message:new", message);
    io.to(`conversation:${message.conversationId}`).emit("message:new", message);

    if (conversation) {
      io.to("agents").emit("conversation:update", conversation);
    }
  } catch (error) {
    console.error("Socket broadcast failed:", error.message);
  }
};

const WELCOME_MESSAGE =
  process.env.WHATSAPP_WELCOME_MESSAGE ||
  `Hello,

Welcome to VsoftSolutions, and thank you for connecting with us. We're pleased to have the opportunity to assist you.

For any assistance, please contact us:
📞 9095422237 | 📧 [info@thevsoft.com](mailto:info@thevsoft.com)

We look forward to serving you.`;

// Sent right after the welcome message, only for a brand-new
// conversation — nudges the customer to say what they're actually
// looking for instead of the bot silently waiting. Whatever the
// customer replies with goes through the normal AI classification on
// the next incoming message, same as if they'd said it unprompted.
const INTENT_QUESTION =
  process.env.WHATSAPP_INTENT_QUESTION ||
  `To assist you better, please let us know which product or service you're interested in.

*VSoft Solutions offers:*
\u2022 ERP Solutions
\u2022 WhatsApp CRM
\u2022 Digital Marketing
\u2022 Software & Web Development
\u2022 Mobile Apps & UI/UX Design
\u2022 Vedacraft Solutions
\u2022 Training & Internship Programs
\u2022 HRMS

Please share your requirement, and our team will guide you with the right solution.`;

// Sends a one-time acknowledgement to a customer the first time they
// message us on a conversation, and saves that outbound message so it
// shows up in the chat thread like a normal agent reply.
// Guarded by conversation.welcomeSent so returning customers don't get
// "thanks for contacting us" on every single message.
// Returns true only when the welcome message was actually sent just
// now (brand-new conversation) — false for returning customers or on
// failure — so the caller can decide whether to follow it up with the
// "what are you looking for" intent question (only makes sense for a
// genuinely new customer, not on every message).
const sendWelcomeReplyIfNeeded = async (conversation) => {
  if (!conversation || conversation.welcomeSent) {
    return false;
  }

  const recipientPhone = conversation.phone;

  if (!recipientPhone) {
    console.warn(
      "Skipping auto-reply: conversation has no phone number",
      conversation.id
    );
    return false;
  }

  const result = await sendTextMessage(recipientPhone, WELCOME_MESSAGE);

  if (!result.success) {
    console.error(
      "Auto-reply failed to send, will retry on next incoming message:",
      result.error
    );
    return false;
  }

  const metaMessageId = result.data?.messages?.[0]?.id || null;

  const savedMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      content: WELCOME_MESSAGE,
      sender: "AGENT",
      messageType: "TEXT",
      status: "SENT",
      metaMessageId,
    },
  });

  const updatedConversation = await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      welcomeSent: true,
      lastMessage: WELCOME_MESSAGE,
    },
  });

  broadcastMessage(savedMessage, updatedConversation);

  console.log("Auto-reply sent and saved for conversation:", conversation.id);

  return true;
};

const saveIncomingMessage = async (
  conversationId,
  text,
  metaMessageId = null
) => {
  try {
    console.log("========== SAVE MESSAGE ==========");
    console.log("Conversation ID:", conversationId);
    console.log("Message:", text);

    // Save incoming message. metaMessageId is stored (when the
    // webhook passes it) so a retried Meta delivery of the same
    // message hits the unique constraint on Message.metaMessageId
    // and can be caught as a duplicate instead of being saved and
    // reprocessed a second time.
    const message = await prisma.message.create({
      data: {
        conversationId,
        content: text,
        sender: "CUSTOMER",
        messageType: "TEXT",
        status: "RECEIVED",
        metaMessageId,
      },
    });

    // Update conversation
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessage: text,
        unreadCount: {
          increment: 1,
        },
      },
    });

    console.log("Message Saved Successfully");
    console.log(message);

    broadcastMessage(message, updatedConversation);

    return message;
  } catch (error) {
    console.error("SAVE MESSAGE ERROR");
    console.error(error);

    throw error;
  }
};

// Sends any outbound bot/agent message and saves it to the DB so it
// shows up in the CRM conversation thread — used by the lead
// enrichment questions/confirmation (and reusable for future
// automated replies) instead of calling sendTextMessage raw.
const sendAndSaveOutgoingMessage = async (conversation, text) => {
  const result = await sendTextMessage(conversation.phone, text);

  if (!result.success) {
    console.error("Failed to send outgoing message:", result.error);
    return null;
  }

  const metaMessageId = result.data?.messages?.[0]?.id || null;

  const savedMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      content: text,
      sender: "AGENT",
      messageType: "TEXT",
      status: "SENT",
      metaMessageId,
    },
  });

  const updatedConversation = await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessage: text },
  });

  broadcastMessage(savedMessage, updatedConversation);

  return savedMessage;
};

// Step 6: persists the outcome of an AI classification attempt onto
// the Message row itself, so a Gemini failure leaves a durable,
// queryable record ("show me every message where classification
// failed") instead of relying solely on the one-time admin
// notification firing and being seen. Deliberately swallows its own
// errors — failing to WRITE this tracking metadata should never take
// down the actual classification/lead/ticket flow around it.
const recordMessageClassification = async (
  messageId,
  { status, attempts = 0, errorMessage = null, model = null }
) => {
  if (!messageId) return;

  try {
    await prisma.message.update({
      where: { id: messageId },
      data: {
        classificationStatus: status,
        classificationAttempts: attempts,
        classificationError: errorMessage,
        classificationModel: model,
        classifiedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to record message classification status:", error);
  }
};

module.exports = {
  saveIncomingMessage,
  sendWelcomeReplyIfNeeded,
  sendAndSaveOutgoingMessage,
  recordMessageClassification,
  INTENT_QUESTION,
};