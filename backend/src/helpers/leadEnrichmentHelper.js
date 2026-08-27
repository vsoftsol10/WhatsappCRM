const prisma = require("../config/prisma");
const {
  sendAndSaveOutgoingMessage,
} = require("../helpers/messageHelper");
const { sendLeadToErpCrm } = require("../services/erpCrmService");
const { getSystemUserId } = require("../helpers/ticketEnrichmentHelper");

// Step 6 - Lead Enrichment. Name/company/email collection now runs for
// EVERY product (not just ERP) so every genuine enquiry gets asked
// and gets a "team will reach out" reply — but only ERP has an actual
// external CRM to forward the finished lead to today. To wire up
// another product's CRM later, just add its sender here — everything
// else (the questions, the DB writes) already works for it.
const PRODUCT_CRM_SENDERS = {
  ERP: sendLeadToErpCrm,
};

// How long we wait for a reply before giving up and releasing the
// conversation back to a human agent (Step 6 decision: 15 minutes).
const PENDING_LEAD_TIMEOUT_MS = 15 * 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidName = (text) => (text || "").trim().length >= 2;
const isValidCompany = (text) => (text || "").trim().length >= 2;
const isValidEmail = (text) => EMAIL_REGEX.test((text || "").trim());

// Questions are asked in this order: NAME, then COMPANY, then EMAIL —
// whichever of these the lead doesn't already have.
const ORDERED_STEPS = ["NAME", "COMPANY", "EMAIL"];

// COMPANY's question mentions the product by name (e.g. "the right ERP
// proposal", "the right HRMS proposal") so it still reads naturally
// now that every product goes through this same flow.
const QUESTIONS = (product) => ({
  NAME: "Thanks for reaching out! Could you share your name, please?",
  COMPANY: `Great! Could you share your company name so we can get you the right ${product} proposal?`,
  EMAIL:
    "Thanks! Could you also share your email address so our team can reach you?",
});

const RETRY_MESSAGES = {
  NAME: "Sorry, I didn't quite get that. Could you share your name?",
  COMPANY:
    "Sorry, I didn't quite get that. Could you share your company name?",
  EMAIL:
    "That doesn't look like a valid email address. Could you share a valid email (e.g. name@example.com)?",
};

// leadHelper.js falls back to "WhatsApp Lead (<phone>)" when there's no
// linked Customer name — that placeholder means "we don't actually
// have a name yet" for enrichment purposes.
const isPlaceholderName = (lead) => lead.name === `WhatsApp Lead (${lead.phone})`;

const isFieldMissing = (lead, step) => {
  if (step === "NAME") return isPlaceholderName(lead);
  if (step === "COMPANY") return !lead.company;
  if (step === "EMAIL") return !lead.email;
  return false;
};

// Finds the next step (after `afterStep`, or from the start if omitted)
// that's still missing on this lead. Returns null if nothing's missing.
const nextMissingStep = (lead, afterStep = null) => {
  const startIndex = afterStep ? ORDERED_STEPS.indexOf(afterStep) + 1 : 0;
  for (let i = startIndex; i < ORDERED_STEPS.length; i++) {
    if (isFieldMissing(lead, ORDERED_STEPS[i])) return ORDERED_STEPS[i];
  }
  return null;
};

// Public helper: true if this lead is still missing name, company, or
// email. Used by the webhook to decide whether to (re-)start
// enrichment for a lead that already existed (not just brand-new
// leads) — e.g. an old lead created before enrichment questions were
// answered, or one that timed out (see releaseStalePendingLeads).
const leadNeedsEnrichment = (lead) => nextMissingStep(lead) !== null;

const askQuestion = async (conversation, question) => {
  await sendAndSaveOutgoingMessage(conversation, question);
};

const resetAskTimer = async (conversation) => {
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { pendingLeadAskedAt: new Date() },
  });
};

// Once we have name + company + email for a WhatsApp lead, that's
// also enough to create a Customer record — not just a Lead. Finds an
// existing Customer by phone first (never overwrites data an agent
// may have already entered, only fills in blanks), otherwise creates
// one under the same system/admin account ticketEnrichmentHelper.js
// uses for auto-created records. Also links the conversation to the
// customer so the chat UI shows a real name instead of "Not linked
// yet" from here on.
const getOrCreateCustomerFromLead = async (conversation, lead) => {
  const phone = conversation.phone;
  if (!phone) return null;

  const systemUserId = await getSystemUserId();
  if (!systemUserId) {
    console.error(
      "Cannot auto-create customer from WhatsApp lead: system user not configured."
    );
    return null;
  }

  let customer = await prisma.customer.findUnique({ where: { phone } });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: lead.name,
        phone,
        email: lead.email,
        company: lead.company,
        requirements: lead.requirements,
        source: lead.source,
        userId: systemUserId,
      },
    });
    console.log(
      `Auto-created customer #${customer.id} from WhatsApp lead #${lead.id}`
    );
  } else {
    const isPlaceholderCustomerName =
      customer.name === `WhatsApp Customer (${customer.phone})`;
    const updateData = {};
    if (isPlaceholderCustomerName && lead.name) updateData.name = lead.name;
    if (!customer.email && lead.email) updateData.email = lead.email;
    if (!customer.company && lead.company) updateData.company = lead.company;
    if (!customer.requirements && lead.requirements) {
      updateData.requirements = lead.requirements;
    }

    if (Object.keys(updateData).length > 0) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: updateData,
      });
    }
  }

  if (!conversation.customerId) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { customerId: customer.id },
    });
  }

  return customer;
};

// Call this right after a NEW lead is created (Step 5) for ANY
// INQUIRY-intent product. Figures out what's missing (name, company,
// email — in that order) and asks for the first missing one. If
// nothing is missing, it finalizes immediately (forwarding to the
// product's CRM if one is wired up — see PRODUCT_CRM_SENDERS —
// otherwise just a thank-you reply).
const startLeadEnrichment = async (conversation, product, lead) => {
  const firstStep = nextMissingStep(lead);

  if (!firstStep) {
    // Already have everything (e.g. linked Customer record already had
    // name + company + email) — finalize straight away, no questions.
    await finalizeEnrichment(conversation, {
      name: lead.name,
      company: lead.company,
      email: lead.email,
      product,
    });
    return;
  }

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      pendingLeadProduct: product,
      pendingLeadStep: firstStep,
      pendingLeadAskedAt: new Date(),
    },
  });

  await askQuestion(conversation, QUESTIONS(product)[firstStep]);
};

// Call this when conversation.pendingLeadStep is already set — this
// incoming message is the customer's answer, not a new topic to
// classify.
const handlePendingLeadAnswer = async (conversation, answerText) => {
  const { pendingLeadStep, pendingLeadProduct, phone } = conversation;
  const trimmedAnswer = (answerText || "").trim();

  const lead = await prisma.lead.findFirst({
    where: { phone, source: `WhatsApp - ${pendingLeadProduct}` },
  });

  if (!lead) {
    console.error(
      `Lead enrichment answer received but no lead found for ${phone} / ${pendingLeadProduct} — clearing pending state.`
    );
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        pendingLeadProduct: null,
        pendingLeadStep: null,
        pendingLeadName: null,
        pendingLeadCompany: null,
        pendingLeadEmail: null,
        pendingLeadAskedAt: null,
      },
    });
    return;
  }

  if (pendingLeadStep === "NAME") {
    if (!isValidName(trimmedAnswer)) {
      await resetAskTimer(conversation);
      await askQuestion(conversation, RETRY_MESSAGES.NAME);
      return;
    }

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { pendingLeadName: trimmedAnswer },
    });

    await advanceOrFinalize(conversation, lead, "NAME", { name: trimmedAnswer }, pendingLeadProduct);
    return;
  }

  if (pendingLeadStep === "COMPANY") {
    if (!isValidCompany(trimmedAnswer)) {
      await resetAskTimer(conversation);
      await askQuestion(conversation, RETRY_MESSAGES.COMPANY);
      return;
    }

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { pendingLeadCompany: trimmedAnswer },
    });

    await advanceOrFinalize(conversation, lead, "COMPANY", {
      company: trimmedAnswer,
    }, pendingLeadProduct);
    return;
  }

  if (pendingLeadStep === "EMAIL") {
    if (!isValidEmail(trimmedAnswer)) {
      await resetAskTimer(conversation);
      await askQuestion(conversation, RETRY_MESSAGES.EMAIL);
      return;
    }

    await advanceOrFinalize(conversation, lead, "EMAIL", {
      email: trimmedAnswer,
    }, pendingLeadProduct);
  }
};

// After saving the answer for `completedStep`, either asks the next
// missing question or — if nothing's left — finalizes the lead.
// `justCollected` carries whatever was just answered (not yet reflected
// on `lead`, since we don't re-fetch); earlier steps' answers are read
// from `conversation.pendingLeadName` / `pendingLeadCompany`, which are
// already up to date because `conversation` is re-fetched fresh at the
// start of every incoming webhook call.
const advanceOrFinalize = async (conversation, lead, completedStep, justCollected, product) => {
  const next = nextMissingStep(lead, completedStep);

  if (next) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        pendingLeadStep: next,
        pendingLeadAskedAt: new Date(),
      },
    });
    await askQuestion(conversation, QUESTIONS(product)[next]);
    return;
  }

  const name =
    justCollected.name || conversation.pendingLeadName || lead.name;
  const company =
    justCollected.company || conversation.pendingLeadCompany || lead.company;
  const email = justCollected.email || lead.email;

  await finalizeEnrichment(conversation, { name, company, email, product });
};

// Saves the collected name/company/email onto the lead, clears the
// pending state, forwards to the right external CRM if one's wired up
// for this product (see PRODUCT_CRM_SENDERS), and lets the customer
// know their request has been received either way.
const finalizeEnrichment = async (conversation, { name, company, email, product }) => {
  const pendingLeadProduct = product || conversation.pendingLeadProduct;
  const { phone } = conversation;

  const lead = await prisma.lead.findFirst({
    where: { phone, source: `WhatsApp - ${pendingLeadProduct}` },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      pendingLeadProduct: null,
      pendingLeadStep: null,
      pendingLeadName: null,
      pendingLeadCompany: null,
      pendingLeadEmail: null,
      pendingLeadAskedAt: null,
    },
  });

  if (!lead) {
    console.error(
      `Could not finalize lead enrichment: no lead found for ${phone} / ${pendingLeadProduct}`
    );
    return;
  }

  const updatedLead = await prisma.lead.update({
    where: { id: lead.id },
    data: { name, company, email },
  });

  // Same info that just went onto the Lead also makes this person a
  // Customer — never let a customer-creation hiccup break the reply
  // the customer is waiting for. Note: we intentionally do NOT flip
  // isConverted here — customer creation and lead conversion are kept
  // separate, so the lead stays visible under its normal status
  // (NEW/CONTACTED/etc.) instead of moving to the "Converted" tab.
  // isConverted is set explicitly elsewhere (e.g. by an agent) when a
  // lead is actually won/converted.
  try {
    await getOrCreateCustomerFromLead(conversation, updatedLead);
  } catch (customerError) {
    console.error(
      `Failed to auto-create/link customer for lead #${updatedLead.id}:`,
      customerError
    );
  }

  const sendToCrm = PRODUCT_CRM_SENDERS[pendingLeadProduct];
  let forwarded = false;

  if (sendToCrm) {
    const result = await sendToCrm(updatedLead);
    forwarded = !!result?.success;
    if (!forwarded) {
      console.error(
        `Lead #${updatedLead.id} was NOT forwarded to ${pendingLeadProduct} CRM. See error above.`
      );
    }
  }

  // Same reassurance either way — customers don't need to know whether
  // there's an external CRM behind the scenes, only that someone will
  // follow up. Internally, forwarded vs. DB-only is still visible from
  // whether PRODUCT_CRM_SENDERS had an entry for this product.
  await sendAndSaveOutgoingMessage(
    conversation,
    "Thank you! We've forwarded your request to our team and they'll reach out to you shortly."
  );
};

// Run periodically (see server.js). Any conversation that's been
// waiting longer than PENDING_LEAD_TIMEOUT_MS for an answer gets its
// pending state cleared — the conversation just sits normally for a
// human agent to pick up, no more auto-questions.
const releaseStalePendingLeads = async () => {
  const cutoff = new Date(Date.now() - PENDING_LEAD_TIMEOUT_MS);

  const stale = await prisma.conversation.findMany({
    where: {
      pendingLeadStep: { not: null },
      pendingLeadAskedAt: { lt: cutoff },
    },
  });

  for (const conversation of stale) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        pendingLeadProduct: null,
        pendingLeadStep: null,
        pendingLeadName: null,
        pendingLeadCompany: null,
        pendingLeadEmail: null,
        pendingLeadAskedAt: null,
      },
    });
    console.log(
      `Released stale lead-enrichment wait for conversation ${conversation.id} (no reply within 15 min) — left for manual agent handling.`
    );
  }
};

module.exports = {
  startLeadEnrichment,
  handlePendingLeadAnswer,
  releaseStalePendingLeads,
  leadNeedsEnrichment,
};