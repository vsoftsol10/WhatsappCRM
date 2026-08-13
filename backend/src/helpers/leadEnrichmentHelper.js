const prisma = require("../config/prisma");
const {
  sendAndSaveOutgoingMessage,
} = require("../helpers/messageHelper");
const { sendLeadToErpCrm } = require("../services/erpCrmService");

// Step 6 - Lead Enrichment: only ERP is wired to an external CRM today.
// To support another product later, add it here and give it its own
// "send to <product> CRM" service, same shape as erpCrmService.
const PRODUCT_CRM_SENDERS = {
  ERP: sendLeadToErpCrm,
};

// How long we wait for a reply before giving up and releasing the
// conversation back to a human agent (Step 6 decision: 15 minutes).
const PENDING_LEAD_TIMEOUT_MS = 15 * 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidCompany = (text) => (text || "").trim().length >= 2;
const isValidEmail = (text) => EMAIL_REGEX.test((text || "").trim());

const askQuestion = async (conversation, question) => {
  await sendAndSaveOutgoingMessage(conversation, question);
};

// Call this right after a NEW lead is created (Step 5) for a product we
// forward externally. Figures out what's missing (company, email, or
// both) and asks for the first missing one. If nothing is missing, it
// forwards immediately without asking anything.
const startLeadEnrichment = async (conversation, product, lead) => {
  if (!PRODUCT_CRM_SENDERS[product]) {
    // We don't forward this product anywhere yet — nothing to do.
    return;
  }

  const missingCompany = !lead.company;
  const missingEmail = !lead.email;

  if (!missingCompany && !missingEmail) {
    // Already have everything (e.g. linked Customer record already had
    // company + email) — forward straight away, no questions needed.
    await sendLeadToErpCrm(lead);
    return;
  }

  const firstStep = missingCompany ? "COMPANY" : "EMAIL";
  const question = missingCompany
    ? "Great! Could you share your company name so we can get you the right ERP proposal?"
    : "Thanks! Could you share your email address so our team can reach you?";

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      pendingLeadProduct: product,
      pendingLeadStep: firstStep,
      pendingLeadAskedAt: new Date(),
    },
  });

  await askQuestion(conversation, question);
};

// Call this when conversation.pendingLeadStep is already set — this
// incoming message is the customer's answer, not a new topic to
// classify.
const handlePendingLeadAnswer = async (conversation, answerText) => {
  const { pendingLeadStep, pendingLeadProduct, phone } = conversation;
  const trimmedAnswer = (answerText || "").trim();

  if (pendingLeadStep === "COMPANY") {
    if (!isValidCompany(trimmedAnswer)) {
      // Not a usable answer — re-ask the same question instead of
      // moving on, and reset the wait timer.
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { pendingLeadAskedAt: new Date() },
      });
      await askQuestion(
        conversation,
        "Sorry, I didn't quite get that. Could you share your company name?"
      );
      return;
    }

    // Email may already be known from a linked Customer record —
    // check before asking for it too.
    const lead = await prisma.lead.findFirst({
      where: { phone, source: `WhatsApp - ${pendingLeadProduct}` },
    });

    if (lead?.email) {
      // Email already known — save company and finish immediately.
      await finalizeEnrichment(conversation, {
        company: trimmedAnswer,
        email: lead.email,
      });
      return;
    }

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        pendingLeadCompany: trimmedAnswer,
        pendingLeadStep: "EMAIL",
        pendingLeadAskedAt: new Date(),
      },
    });

    await askQuestion(
      conversation,
      "Thanks! Could you also share your email address so our team can reach you?"
    );
    return;
  }

  if (pendingLeadStep === "EMAIL") {
    if (!isValidEmail(trimmedAnswer)) {
      // Not a valid email — keep asking until we get a real one.
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { pendingLeadAskedAt: new Date() },
      });
      await askQuestion(
        conversation,
        "That doesn't look like a valid email address. Could you share a valid email (e.g. name@example.com)?"
      );
      return;
    }

    await finalizeEnrichment(conversation, {
      company: conversation.pendingLeadCompany,
      email: trimmedAnswer,
    });
  }
};

// Saves the collected company/email onto the lead, clears the pending
// state, forwards to the right external CRM, and lets the customer
// know their request has been sent along.
const finalizeEnrichment = async (conversation, { company, email }) => {
  const { pendingLeadProduct, phone } = conversation;

  const lead = await prisma.lead.findFirst({
    where: { phone, source: `WhatsApp - ${pendingLeadProduct}` },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      pendingLeadProduct: null,
      pendingLeadStep: null,
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
    data: { company, email },
  });

  const sendToCrm = PRODUCT_CRM_SENDERS[pendingLeadProduct];
  if (sendToCrm) {
    const result = await sendToCrm(updatedLead);
    if (!result?.success) {
      console.error(
        `Lead #${updatedLead.id} was NOT forwarded to ${pendingLeadProduct} CRM. See error above.`
      );
    }
  }

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
};