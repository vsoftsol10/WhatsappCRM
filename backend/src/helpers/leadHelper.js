const prisma = require("../config/prisma");

// Step 5 - Product Router: turns an AI classification result into a
// Lead row in the CRM.
//
// Updated rules (confirmed with the team):
// - CONFIDENCE THRESHOLD: only create/update a lead when confidence is
//   0.5 or above. Below that (or product === "Other"), we skip lead
//   creation entirely — the message is still saved and visible in the
//   Conversations tab for a human agent to review manually.
// - DEDUP: keyed on (phone + product), excluding leads marked LOST
//   (soft-deleted). If an active (non-LOST) lead already exists for
//   this phone number with the same product, we don't create a
//   duplicate — we update that lead's requirements with the latest
//   message/summary instead. A different product for the same phone
//   still creates a new, separate lead. If the only matching lead was
//   marked LOST, we treat it as gone and create a brand-new lead.
const MIN_CONFIDENCE = 0.5;

const createLeadFromClassification = async (
  conversation,
  classification,
  messageText
) => {
  const { product, confidence, summary } = classification;

  const customer = conversation.customer || null;
  const phone = conversation.phone;

  if (product === "Other" || confidence < MIN_CONFIDENCE) {
    console.log(
      `Skipping lead creation for ${phone}: product=${product}, confidence=${confidence} (below threshold ${MIN_CONFIDENCE} or unclassified)`
    );
    return { lead: null, isNew: false };
  }

  const source = `WhatsApp - ${product}`;
  const requirements = summary || messageText;

  const existingLead = await prisma.lead.findFirst({
    where: { phone, source, status: { not: "LOST" } },
  });

  if (existingLead) {
    const updatedLead = await prisma.lead.update({
      where: { id: existingLead.id },
      data: { requirements },
    });

    console.log(
      `Existing lead updated instead of duplicating: #${updatedLead.id} (${product}, phone ${phone})`
    );

    return { lead: updatedLead, isNew: false };
  }

  const lead = await prisma.lead.create({
    data: {
      name: customer?.name || `WhatsApp Lead (${phone})`,
      phone,
      email: customer?.email || null,
      company: customer?.company || null,
      status: "NEW",
      source,
      requirements,
      isConverted: false,
    },
  });

  console.log(
    `Lead created from WhatsApp message: #${lead.id} (${product}, confidence ${confidence})`
  );

  return { lead, isNew: true };
};

module.exports = {
  createLeadFromClassification,
};