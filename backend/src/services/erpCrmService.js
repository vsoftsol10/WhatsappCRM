const axios = require("axios");

// Step 6 - sends a finalized, fully-enriched lead to the external ERP
// CRM. Confirmed against their live API on 2026-08-13 with a real test
// POST — this payload shape and these exact field names are required:
//   fullName, company, phone (10 digits, no country code), email,
//   status, plan, channel, date, requirements (min 10 chars)
//
// ASSUMPTIONS (flagged — change here if wrong):
// - plan: hardcoded to "Basic" for every WhatsApp-sourced ERP lead.
//   If plan should vary, this is the one place to change it.
// - status: hardcoded to "New" (their capitalization, not ours).
const ERP_CRM_URL =
  process.env.ERP_CRM_LEADS_URL ||
  "https://vconstech-crm-new.onrender.com/api/leads";

const DEFAULT_PLAN = "Basic";

// Their API wants a plain 10-digit number. Our numbers are stored with
// the country code (e.g. "919150425948") — take the last 10 digits.
const toTenDigitPhone = (phone) => {
  const digitsOnly = (phone || "").replace(/\D/g, "");
  return digitsOnly.slice(-10);
};

// Their API requires requirements to be at least 10 characters —
// pad it if our AI summary/message ever comes in shorter than that.
const ensureMinLength = (text, min = 10) => {
  const value = (text || "").trim();
  if (value.length >= min) return value;
  return `${value} - inquiry received via WhatsApp.`.trim();
};

const sendLeadToErpCrm = async (lead) => {
  const payload = {
    fullName: lead.name,
    company: lead.company,
    phone: toTenDigitPhone(lead.phone),
    email: lead.email,
    status: "New",
    plan: DEFAULT_PLAN,
    channel: "WhatsApp",
    date: new Date().toISOString().slice(0, 10),
    requirements: ensureMinLength(lead.requirements),
  };

  try {
    const response = await axios.post(ERP_CRM_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log(
      `Lead forwarded to ERP CRM successfully (local lead #${lead.id}). ERP CRM response:`,
      JSON.stringify(response.data)
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      `Failed to forward lead #${lead.id} to ERP CRM:`,
      error.response?.data || error.message
    );

    return { success: false, error: error.response?.data || error.message };
  }
};

module.exports = {
  sendLeadToErpCrm,
};