// // Builds the prompt sent to Gemini to classify an incoming WhatsApp
// // message into a product interest, so Step 5 (Product Router) can
// // decide which team/lead pipeline it belongs to.
// //
// // TO ADD A NEW PRODUCT LATER: just add one entry to the PRODUCTS array
// // below (name + a short description to help Gemini tell it apart from
// // similar products, e.g. the different "CRM" variants). Nothing else
// // needs to change — the prompt, the allowed-value list, and the
// // validation in geminiService.js all read from this same array.
// const PRODUCTS = [
//   {
//     name: "ERP",
//     description:
//       "Enterprise Resource Planning — inventory, finance, manufacturing, construction, or overall business operations management.",
//   },
//   {
//     name: "CRM",
//     description:
//       "General-purpose Customer Relationship Management — sales pipeline, leads, deals, customer records (not specific to WhatsApp or marketing).",
//   },
//   {
//     name: "WhatsApp CRM",
//     description:
//       "CRM built specifically around WhatsApp business messaging, chat automation, WhatsApp campaigns, or WhatsApp-based customer support.",
//   },
//   {
//     name: "Digital Marketing CRM",
//     description:
//       "CRM/software for digital marketing — ad campaigns, social media management, lead generation, SEO, marketing automation.",
//   },
//   {
//     name: "HRMS",
//     description:
//       "Human Resource Management System — employee records, payroll, attendance, leave management, recruitment.",
//   },
//   {
//     name: "Vedacraft",
//     description: "Vedacraft product line.",
//   },
// ];

// const ALLOWED_PRODUCTS = [...PRODUCTS.map((p) => p.name), "Other"];

// // NEW: intent — separates "wants to buy / learn about a product"
// // (INQUIRY, the only kind that should ever become a sales Lead) from
// // "already has this product and is reporting a problem" (SUPPORT,
// // which should become a Ticket instead — see ticketEnrichmentHelper.js).
// // This is what stops "I have a problem in the ERP software" from being
// // misread as an ERP sales lead just because it mentions "ERP".
// const ALLOWED_INTENTS = ["INQUIRY", "SUPPORT"];

// const buildClassificationPrompt = (messageText) => {
//   const productList = PRODUCTS.map((p) => `- ${p.name}: ${p.description}`).join(
//     "\n"
//   );

//   return `You are a lead-classification assistant for a software company. Here are the products it sells:
// ${productList}

// A customer sent this message on WhatsApp:
// """
// ${messageText}
// """

// Classify which product they are most likely referring to, AND what they want.

// Rules:
// - product must be exactly one of: ${ALLOWED_PRODUCTS.join(", ")}.
// - Several products above are different kinds of CRM — read the message carefully and pick the most specific matching one (e.g. a message about WhatsApp automation is "WhatsApp CRM", not plain "CRM"; a message about ad campaigns or social media is "Digital Marketing CRM").
// - Use "Other" if the message is a greeting, small talk, unrelated, or too vague to tell (e.g. "hi", "hello", "ok").
// - IMPORTANT: a product name appearing in the message does NOT by itself mean the customer wants that product. If the message is just greeting the business/bot (possibly using the business or product's own name to say hello, e.g. "Hai WhatsApp crm", "Hello VsoftSolutions") with no actual description of a need, problem, or interest, classify it as "Other" — do not treat the presence of a product name alone as an inquiry. Only pick a specific product when the message expresses an actual need, question, or interest in it (e.g. "I want ERP software", "do you have a WhatsApp CRM", "need help with automating WhatsApp campaigns").
// - intent must be exactly one of: ${ALLOWED_INTENTS.join(", ")}.
//   - "INQUIRY" — the customer wants to learn about, evaluate, or buy this product (a new sales opportunity).
//   - "SUPPORT" — the customer already uses/has this product and is reporting a problem, bug, complaint, or asking for help with it (NOT a sales opportunity, even though the product name appears in the message). Examples: "I have a problem in the ERP software", "ERP is not working", "my WhatsApp CRM messages aren't sending".
//   - If product is "Other", intent should be "INQUIRY" by default.
// - confidence is a number between 0 and 1 representing how sure you are of the product AND intent together.
// - summary is one short sentence (max 15 words) describing what the customer wants, in your own words.

// Return ONLY raw JSON, no markdown, no code fences, no extra text, in exactly this shape:
// {
//   "product": "ERP",
//   "intent": "SUPPORT",
//   "confidence": 0.9,
//   "summary": "Customer is reporting an issue with their ERP software."
// }`;
// };

// module.exports = buildClassificationPrompt;
// module.exports.ALLOWED_PRODUCTS = ALLOWED_PRODUCTS;
// module.exports.ALLOWED_INTENTS = ALLOWED_INTENTS;
// module.exports.PRODUCTS = PRODUCTS;

// Builds the prompt sent to Gemini to classify an incoming WhatsApp
// message into a product interest, so Step 5 (Product Router) can
// decide which team/lead pipeline it belongs to.
//
// TO ADD A NEW PRODUCT LATER: just add one entry to the PRODUCTS array
// below (name + a short description to help Gemini tell it apart from
// similar products, e.g. the different "CRM" variants). Nothing else
// needs to change — the prompt, the allowed-value list, and the
// validation in geminiService.js all read from this same array.
const PRODUCTS = [
  {
    name: "ERP Solutions",
    description:
      "Enterprise Resource Planning — inventory, finance, manufacturing, construction, or overall business operations management.",
  },
  {
    name: "WhatsApp CRM",
    description:
      "CRM built specifically around WhatsApp business messaging, chat automation, WhatsApp campaigns, or WhatsApp-based customer support.",
  },
  {
    name: "Digital Marketing",
    description:
      "Digital marketing services — ad campaigns, social media management, lead generation, SEO, marketing strategy/automation.",
  },
  {
    name: "HRMS",
    description:
      "Human Resource Management System — employee records, payroll, attendance, leave management, recruitment.",
  },
  {
    name: "Software & Web Development",
    description:
      "Custom software development, business websites, web applications, e-commerce sites, or web-based portals/systems.",
  },
  {
    name: "Mobile Apps & UI/UX Design",
    description:
      "Mobile app development (Android/iOS), or UI/UX design work — app screens, product design, wireframes, prototypes.",
  },
  {
    name: "Vedacraft Solutions",
    description: "Vedacraft product line.",
  },
  {
    name: "Training & Internship Programs",
    description:
      "Training courses, internship programs, skill development, or student/fresher placement programs offered by the company.",
  },
];

const ALLOWED_PRODUCTS = [...PRODUCTS.map((p) => p.name), "Other"];

// NEW: intent — separates "wants to buy / learn about a product"
// (INQUIRY, the only kind that should ever become a sales Lead) from
// "already has this product and is reporting a problem" (SUPPORT,
// which should become a Ticket instead — see ticketEnrichmentHelper.js).
// This is what stops "I have a problem in the ERP software" from being
// misread as an ERP sales lead just because it mentions "ERP".
const ALLOWED_INTENTS = ["INQUIRY", "SUPPORT"];

const buildClassificationPrompt = (messageText) => {
  const productList = PRODUCTS.map((p) => `- ${p.name}: ${p.description}`).join(
    "\n"
  );

  return `You are a lead-classification assistant for a software company. Here are the products it sells:
${productList}

A customer sent this message on WhatsApp:
"""
${messageText}
"""

Classify which product they are most likely referring to, AND what they want.

Rules:
- product must be exactly one of: ${ALLOWED_PRODUCTS.join(", ")}.
- Some products can overlap — read the message carefully and pick the most specific matching one. A message about a business website or custom software is "Software & Web Development". A message about a phone/Android/iOS app or app design/screens is "Mobile Apps & UI/UX Design". A message about ad campaigns, social media, or SEO is "Digital Marketing". A message about WhatsApp automation/chat/campaigns specifically is "WhatsApp CRM". A message about courses, internships, or skill training is "Training & Internship Programs".
- Use "Other" if the message is a greeting, small talk, unrelated, or too vague to tell (e.g. "hi", "hello", "ok").
- IMPORTANT: a product name appearing in the message does NOT by itself mean the customer wants that product. If the message is just greeting the business/bot (possibly using the business or product's own name to say hello, e.g. "Hai WhatsApp crm", "Hello VsoftSolutions") with no actual description of a need, problem, or interest, classify it as "Other" — do not treat the presence of a product name alone as an inquiry. Only pick a specific product when the message expresses an actual need, question, or interest in it (e.g. "I want ERP software", "do you have a WhatsApp CRM", "need help with automating WhatsApp campaigns").
- intent must be exactly one of: ${ALLOWED_INTENTS.join(", ")}.
  - "INQUIRY" — the customer wants to learn about, evaluate, or buy this product (a new sales opportunity).
  - "SUPPORT" — the customer already uses/has this product and is reporting a problem, bug, complaint, or asking for help with it (NOT a sales opportunity, even though the product name appears in the message). Examples: "I have a problem in the ERP software", "ERP is not working", "my WhatsApp CRM messages aren't sending".
  - If product is "Other", intent should be "INQUIRY" by default.
- confidence is a number between 0 and 1 representing how sure you are of the product AND intent together.
- summary is one short sentence (max 15 words) describing what the customer wants, in your own words.

Return ONLY raw JSON, no markdown, no code fences, no extra text, in exactly this shape:
{
  "product": "ERP Solutions",
  "intent": "SUPPORT",
  "confidence": 0.9,
  "summary": "Customer is reporting an issue with their ERP software."
}`;
};

module.exports = buildClassificationPrompt;
module.exports.ALLOWED_PRODUCTS = ALLOWED_PRODUCTS;
module.exports.ALLOWED_INTENTS = ALLOWED_INTENTS;
module.exports.PRODUCTS = PRODUCTS;