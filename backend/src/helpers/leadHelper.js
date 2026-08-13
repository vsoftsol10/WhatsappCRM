// const prisma = require("../config/prisma");

// // Step 5 - Product Router: turns an AI classification result into a
// // Lead row in the CRM.
// //
// // Current rules (confirmed with the team):
// // - No confidence threshold — any classification result creates a lead,
// //   including low-confidence ones.
// // - Every incoming classified message creates a NEW lead (no dedup
// //   against existing leads for the same phone number).
// // - "Other" product still creates a lead, tagged as "Unclassified" so a
// //   human agent can review and route it manually.
// //
// // This is intentionally simple for now — Step 6 (Employee Assignment)
// // will read `source` to decide which employee/team to notify and assign.
// const createLeadFromClassification = async (
//   conversation,
//   classification,
//   messageText
// ) => {
//   const { product, confidence, summary } = classification;

//   const customer = conversation.customer || null;
//   const phone = conversation.phone;

//   const productLabel = product === "Other" ? "Unclassified" : product;

//   const lead = await prisma.lead.create({
//     data: {
//       name: customer?.name || `WhatsApp Lead (${phone})`,
//       phone,
//       email: customer?.email || null,
//       company: customer?.company || null,
//       status: "NEW",
//       source: `WhatsApp - ${productLabel}`,
//       requirements: summary || messageText,
//       isConverted: false,
//     },
//   });

//   console.log(
//     `Lead created from WhatsApp message: #${lead.id} (${productLabel}, confidence ${confidence})`
//   );

//   return lead;
// };

// module.exports = {
//   createLeadFromClassification,
// };

const prisma = require("../config/prisma");

// Step 5 - Product Router: turns an AI classification result into a
// Lead row in the CRM.
//
// Updated rules (confirmed with the team):
// - CONFIDENCE THRESHOLD: only create/update a lead when confidence is
//   0.5 or above. Below that (or product === "Other"), we skip lead
//   creation entirely — the message is still saved and visible in the
//   Conversations tab for a human agent to review manually.
// - DEDUP: keyed on (phone + product). If a lead already exists for
//   this phone number with the same product, we don't create a
//   duplicate — we update that lead's requirements with the latest
//   message/summary instead. A different product for the same phone
//   still creates a new, separate lead.
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
    return null;
  }

  const source = `WhatsApp - ${product}`;
  const requirements = summary || messageText;

  const existingLead = await prisma.lead.findFirst({
    where: { phone, source },
  });

  if (existingLead) {
    const updatedLead = await prisma.lead.update({
      where: { id: existingLead.id },
      data: { requirements },
    });

    console.log(
      `Existing lead updated instead of duplicating: #${updatedLead.id} (${product}, phone ${phone})`
    );

    return updatedLead;
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

  return lead;
};

module.exports = {
  createLeadFromClassification,
};