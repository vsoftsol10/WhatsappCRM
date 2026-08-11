// Builds the prompt sent to Gemini to classify an incoming WhatsApp
// message into a product interest, so Step 5 (Product Router) can
// decide which team/lead pipeline it belongs to.
//
// Keep the allowed product list in sync with the "case" values used
// in the Step 5 router — anything Gemini returns outside this list
// should be treated as "Other" by the caller.
const ALLOWED_PRODUCTS = ["ERP", "CRM", "HRMS", "Vedacraft", "Other"];

const buildClassificationPrompt = (messageText) => {
  return `You are a lead-classification assistant for a software company that sells these products: ERP, CRM, HRMS, and Vedacraft.

A customer sent this message on WhatsApp:
"""
${messageText}
"""

Classify which product they are most likely interested in.

Rules:
- product must be exactly one of: ${ALLOWED_PRODUCTS.join(", ")}.
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