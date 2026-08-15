const prisma = require("../config/prisma");
const {
  sendAndSaveOutgoingMessage,
} = require("../helpers/messageHelper");
const { sendTicketToErpCrm } = require("../services/erpTicketService");

// Mirrors leadEnrichmentHelper.js, but for SUPPORT-intent messages
// (existing customer reporting a problem) instead of INQUIRY-intent
// messages (new sales lead). Only forwards externally for products
// that have a registered ticket sender below — add more here the same
// way erpTicketService.js was added for ERP.
const PRODUCT_TICKET_SENDERS = {
  ERP: sendTicketToErpCrm,
};

// Same 15-minute wait policy as lead enrichment (Step 6 decision).
const PENDING_TICKET_TIMEOUT_MS = 15 * 60 * 1000;

const isValidName = (text) => (text || "").trim().length >= 2;

const askQuestion = async (conversation, question) => {
  await sendAndSaveOutgoingMessage(conversation, question);
};

// Call this right after a SUPPORT-intent message is classified for a
// product we forward externally (Step 5b). If we already know the
// customer's name (linked Customer record), forwards immediately with
// no questions. Otherwise asks for the name first.
const startTicketEnrichment = async (conversation, product, ticketDraft) => {
  if (!PRODUCT_TICKET_SENDERS[product]) {
    // We don't forward this product's tickets anywhere yet — the
    // message just stays in Conversations for a human agent.
    return;
  }

  const { name, description, phone } = ticketDraft;

  if (name) {
    await sendTicketToErpCrm({ id: phone, name, description, phone });
    return;
  }

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      pendingTicketProduct: product,
      pendingTicketStep: "NAME",
      pendingTicketDescription: description,
      pendingTicketAskedAt: new Date(),
    },
  });

  await askQuestion(
    conversation,
    "Sorry to hear that! Could you share your name so we can log this as a support ticket?"
  );
};

// Call this when conversation.pendingTicketStep is already set — this
// incoming message is the customer's name, not a new topic to
// classify.
const handlePendingTicketAnswer = async (conversation, answerText) => {
  const {
    pendingTicketStep,
    pendingTicketProduct,
    pendingTicketDescription,
    phone,
  } = conversation;
  const trimmedAnswer = (answerText || "").trim();

  if (pendingTicketStep !== "NAME") return;

  if (!isValidName(trimmedAnswer)) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { pendingTicketAskedAt: new Date() },
    });
    await askQuestion(
      conversation,
      "Sorry, I didn't quite get that. Could you share your name?"
    );
    return;
  }

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      pendingTicketProduct: null,
      pendingTicketStep: null,
      pendingTicketDescription: null,
      pendingTicketAskedAt: null,
    },
  });

  const sendToCrm = PRODUCT_TICKET_SENDERS[pendingTicketProduct];
  if (sendToCrm) {
    const result = await sendToCrm({
      id: phone,
      name: trimmedAnswer,
      description: pendingTicketDescription,
      phone,
    });
    if (!result?.success) {
      console.error(
        `Ticket for ${phone} was NOT forwarded to ${pendingTicketProduct} CRM. See error above.`
      );
    }
  }

  await sendAndSaveOutgoingMessage(
    conversation,
    "Thank you! We've logged your issue and our support team will reach out to you shortly."
  );
};

// Run periodically (see server.js), same pattern as
// releaseStalePendingLeads.
const releaseStalePendingTickets = async () => {
  const cutoff = new Date(Date.now() - PENDING_TICKET_TIMEOUT_MS);

  const stale = await prisma.conversation.findMany({
    where: {
      pendingTicketStep: { not: null },
      pendingTicketAskedAt: { lt: cutoff },
    },
  });

  for (const conversation of stale) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        pendingTicketProduct: null,
        pendingTicketStep: null,
        pendingTicketDescription: null,
        pendingTicketAskedAt: null,
      },
    });
    console.log(
      `Released stale ticket-enrichment wait for conversation ${conversation.id} (no reply within 15 min) — left for manual agent handling.`
    );
  }
};

module.exports = {
  startTicketEnrichment,
  handlePendingTicketAnswer,
  releaseStalePendingTickets,
};