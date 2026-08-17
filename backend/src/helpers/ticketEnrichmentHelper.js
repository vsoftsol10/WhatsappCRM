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

// Same confidence threshold as leads (Step 6 decision) — a low-
// confidence SUPPORT guess shouldn't create a ticket or start asking
// the customer questions.
const MIN_CONFIDENCE = 0.5;

// A local Ticket is required for every SUPPORT message so agents can
// see it in the CRM's own Tickets page, and so repeat complaints from
// the same customer get deduped instead of spamming new tickets.
// Ticket.createdById / TicketWorkNote.employeeId / Customer.userId all
// require a real User — confirmed with the team to use the default
// admin account for anything auto-created from WhatsApp.
const SYSTEM_USER_EMAIL = process.env.SYSTEM_USER_EMAIL || "admin@crm.com";

// Marks tickets this code created, so the dedup search only matches
// auto-created WhatsApp tickets — never a human agent's own tickets
// that happen to share a customer.
const TICKET_TAG = "[WhatsApp]";

const isValidName = (text) => (text || "").trim().length >= 2;

let cachedSystemUserId = null;

const getSystemUserId = async () => {
  if (cachedSystemUserId) return cachedSystemUserId;

  const user = await prisma.user.findUnique({
    where: { email: SYSTEM_USER_EMAIL },
  });

  if (!user) {
    console.error(
      `System user (${SYSTEM_USER_EMAIL}) not found — cannot auto-create tickets. Set SYSTEM_USER_EMAIL or create this user.`
    );
    return null;
  }

  cachedSystemUserId = user.id;
  return cachedSystemUserId;
};

// Ticket.customerId is required, but a WhatsApp conversation may not
// be linked to a Customer yet. Find one by phone, or create a minimal
// placeholder one (same fallback-naming pattern as leadHelper.js).
const getOrCreateCustomerForConversation = async (conversation, systemUserId) => {
  if (conversation.customer) return conversation.customer;

  const phone = conversation.phone;

  let customer = await prisma.customer.findUnique({ where: { phone } });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: `WhatsApp Customer (${phone})`,
        phone,
        userId: systemUserId,
        source: "WhatsApp",
      },
    });
  }

  return customer;
};

const isPlaceholderCustomerName = (customer) =>
  customer.name === `WhatsApp Customer (${customer.phone})`;

const askQuestion = async (conversation, question) => {
  await sendAndSaveOutgoingMessage(conversation, question);
};

const findOpenWhatsAppTicket = (customerId) =>
  prisma.ticket.findFirst({
    where: {
      customerId,
      status: { in: ["OPEN", "IN_PROGRESS"] },
      title: { startsWith: TICKET_TAG },
    },
  });

// Call this when classification.intent === "SUPPORT". Confidence-gates
// the whole flow, creates (or dedupes onto) a local Ticket so it's
// visible in the CRM, then either forwards immediately (if we already
// know the customer's name) or asks for it first.
const startTicketEnrichment = async (conversation, classification, messageText) => {
  const { product, confidence, summary } = classification;

  if (confidence < MIN_CONFIDENCE) {
    console.log(
      `Skipping ticket creation for ${conversation.phone}: confidence=${confidence} (below threshold ${MIN_CONFIDENCE})`
    );
    return;
  }

  const systemUserId = await getSystemUserId();
  if (!systemUserId) return;

  const customer = await getOrCreateCustomerForConversation(conversation, systemUserId);
  const description = summary || messageText;
  const productLabel = product === "Other" ? "General" : product;
  const title = `${TICKET_TAG} ${productLabel} Support Issue`;

  const existingTicket = await findOpenWhatsAppTicket(customer.id);

  if (existingTicket) {
    // Dedup: same customer already has an open WhatsApp ticket — add a
    // work note instead of creating a duplicate / re-forwarding.
    await prisma.ticketWorkNote.create({
      data: {
        ticketId: existingTicket.id,
        employeeId: systemUserId,
        note: `New WhatsApp message from customer: ${description}`,
      },
    });

    console.log(
      `Added work note to existing ticket #${existingTicket.id} instead of creating a duplicate (customer ${conversation.phone}).`
    );
    return;
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      status: "OPEN",
      priority: "MEDIUM",
      customerId: customer.id,
      createdById: systemUserId,
    },
  });

  console.log(
    `Ticket created from WhatsApp complaint: #${ticket.id} (${productLabel}, confidence ${confidence})`
  );

  if (!PRODUCT_TICKET_SENDERS[product]) {
    // We don't forward this product's tickets externally yet — the
    // local ticket is still created above so agents can handle it.
    return;
  }

  if (!isPlaceholderCustomerName(customer)) {
    // Already have a real name — forward immediately, no questions.
    const result = await sendTicketToErpCrm({
      id: ticket.id,
      name: customer.name,
      description,
      phone: conversation.phone,
      email: customer.email,
    });
    if (!result?.success) {
      console.error(
        `Ticket #${ticket.id} was NOT forwarded to ${product} CRM. See error above.`
      );
    }
    return;
  }

  // Don't have a real name yet — ask for it before forwarding.
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

  // Save the real name onto the Customer record so future messages
  // (and the local Ticket) reflect it instead of the placeholder.
  const customer = await prisma.customer.findUnique({ where: { phone } });
  if (customer) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { name: trimmedAnswer },
    });
  }

  const sendToCrm = PRODUCT_TICKET_SENDERS[pendingTicketProduct];
  if (sendToCrm) {
    const result = await sendToCrm({
      id: phone,
      name: trimmedAnswer,
      description: pendingTicketDescription,
      phone,
      email: customer?.email,
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
// releaseStalePendingLeads. The local Ticket already exists by this
// point (created in startTicketEnrichment before asking for a name),
// so nothing is lost — this just stops the bot from waiting forever
// and lets a human agent take it from here.
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