const prisma = require("../config/prisma");

// Step 5 - Product Router: turns an AI classification result into a
// Lead row in the CRM.
//
// Current rules (confirmed with the team):
// - No confidence threshold — any classification result creates a lead,
//   including low-confidence ones.
// - Every incoming classified message creates a NEW lead (no dedup
//   against existing leads for the same phone number).
// - "Other" product still creates a lead, tagged as "Unclassified" so a
//   human agent can review and route it manually.
//
// This is intentionally simple for now — Step 6 (Employee Assignment)
// will read `source` to decide which employee/team to notify and assign.
const createLeadFromClassification = async (
  conversation,
  classification,
  messageText
) => {
  const { product, confidence, summary } = classification;

  const customer = conversation.customer || null;
  const phone = conversation.phone;

  const productLabel = product === "Other" ? "Unclassified" : product;

  const lead = await prisma.lead.create({
    data: {
      name: customer?.name || `WhatsApp Lead (${phone})`,
      phone,
      email: customer?.email || null,
      company: customer?.company || null,
      status: "NEW",
      source: `WhatsApp - ${productLabel}`,
      requirements: summary || messageText,
      isConverted: false,
    },
  });

  console.log(
    `Lead created from WhatsApp message: #${lead.id} (${productLabel}, confidence ${confidence})`
  );

  return lead;
};

module.exports = {
  createLeadFromClassification,
};