// Fills the {{customer_name}} / {{company}} / {{phone}} / {{email}} tokens
// that Gemini is instructed (see templatePromptBuilder.js) to leave inside
// generated template/campaign copy. Without this, those tokens were being
// sent to WhatsApp verbatim as literal text.
//
// {{customer_name}} is filled per-recipient from the Customer record.
// {{company}} / {{phone}} / {{email}} are OUR business's contact details
// (same values already used in messageHelper.js's WELCOME_MESSAGE),
// configurable via env vars so they don't need another code change later.

const BUSINESS_INFO = {
  company: process.env.BUSINESS_COMPANY_NAME || "VsoftSolutions",
  phone: process.env.BUSINESS_SUPPORT_PHONE || "9876546375",
  email: process.env.BUSINESS_SUPPORT_EMAIL || "vsoft@gmail.com",
};

/**
 * Replace known {{token}} placeholders in template/campaign text.
 * @param {string} content - raw text, possibly containing {{customer_name}}, {{company}}, {{phone}}, {{email}}
 * @param {{ name?: string }} customer - recipient customer record
 * @returns {string} content with all known placeholders substituted
 */
const fillTemplatePlaceholders = (content, customer = {}) => {
  if (!content || typeof content !== "string") return content;

  const values = {
    customer_name: customer?.name?.trim() || "there",
    company: BUSINESS_INFO.company,
    phone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
  };

  return content.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(values, key)
      ? values[key]
      : match; // leave unrecognized tokens untouched instead of blanking them
  });
};

module.exports = { fillTemplatePlaceholders, BUSINESS_INFO };