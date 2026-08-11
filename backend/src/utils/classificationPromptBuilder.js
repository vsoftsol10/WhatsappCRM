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
    name: "ERP",
    description:
      "Enterprise Resource Planning — inventory, finance, manufacturing, construction, or overall business operations management.",
  },
  {
    name: "CRM",
    description:
      "General-purpose Customer Relationship Management — sales pipeline, leads, deals, customer records (not specific to WhatsApp or marketing).",
  },
  {
    name: "WhatsApp CRM",
    description:
      "CRM built specifically around WhatsApp business messaging, chat automation, WhatsApp campaigns, or WhatsApp-based customer support.",
  },
  {
    name: "Digital Marketing CRM",
    description:
      "CRM/software for digital marketing — ad campaigns, social media management, lead generation, SEO, marketing automation.",
  },
  {
    name: "HRMS",
    description:
      "Human Resource Management System — employee records, payroll, attendance, leave management, recruitment.",
  },
  {
    name: "Vedacraft",
    description: "Vedacraft product line.",
  },
];

const ALLOWED_PRODUCTS = [...PRODUCTS.map((p) => p.name), "Other"];

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

Classify which product they are most likely interested in.

Rules:
- product must be exactly one of: ${ALLOWED_PRODUCTS.join(", ")}.
- Several products above are different kinds of CRM — read the message carefully and pick the most specific matching one (e.g. a message about WhatsApp automation is "WhatsApp CRM", not plain "CRM"; a message about ad campaigns or social media is "Digital Marketing CRM").
- Use "Other" if the message is a greeting, small talk, unrelated, or too vague to tell (e.g. "hi", "hello", "ok").
- confidence is a number between 0 and 1 representing how sure you are.
- summary is one short sentence (max 15 words) describing what the customer wants, in your own words.

Return ONLY raw JSON, no markdown, no code fences, no extra text, in exactly this shape:
{
  "product": "ERP",
  "confidence": 0.9,
  "summary": "Customer needs Construction ERP."
}`;
};

module.exports = buildClassificationPrompt;
module.exports.ALLOWED_PRODUCTS = ALLOWED_PRODUCTS;
module.exports.PRODUCTS = PRODUCTS;