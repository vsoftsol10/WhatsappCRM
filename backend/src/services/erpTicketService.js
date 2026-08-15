const axios = require("axios");

// Forwards a support/complaint ticket to the external ERP CRM's Tickets
// API. Confirmed against their live API on 2026-08-15 with a real test
// POST — this is the shape and defaults their endpoint returns:
//   required: caller, description (they store "description" as
//   "short_description" internally, but the field you POST is
//   "description")
//   optional (all have server-side defaults if omitted): email,
//   urgency (default "Medium"), category, contact_type, customer_id,
//   department_id, ticket_type (default "request")
//
// NOTE: unlike the Leads endpoint, Tickets has NO phone field — only
// email/customer_id/department_id for contact info. If you need the
// customer's phone on their side, fold it into the description text
// (done below) until they add a dedicated field.
//
// ASSUMPTIONS (flagged — change here if wrong):
// - urgency: left to their default ("Medium") for every WhatsApp-
//   sourced ticket. If urgency should vary (e.g. by keyword), this is
//   the one place to change it.
// - contact_type: hardcoded to "WhatsApp" so their agents can see the
//   channel at a glance. Remove if their UI doesn't surface this field.
const ERP_CRM_TICKETS_URL =
  process.env.ERP_CRM_TICKETS_URL ||
  "https://vconstech-crm-new.onrender.com/api/tickets";

// Their API requires description to be non-empty and meaningful —
// pad it if our source text ever comes in too short.
const ensureMinLength = (text, min = 10) => {
  const value = (text || "").trim();
  if (value.length >= min) return value;
  return `${value} - reported via WhatsApp.`.trim();
};

// Tickets has no phone field, so if we have a phone number, fold it
// into the description so agents on their side can still see it.
const buildDescription = (ticket) => {
  const base = ensureMinLength(ticket.description || ticket.requirements);
  if (ticket.phone) {
    return `${base} (WhatsApp: ${ticket.phone})`;
  }
  return base;
};

const sendTicketToErpCrm = async (ticket) => {
  const payload = {
    caller: ticket.name,
    description: buildDescription(ticket),
    contact_type: "WhatsApp",
    ...(ticket.email ? { email: ticket.email } : {}),
  };

  try {
    const response = await axios.post(ERP_CRM_TICKETS_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log(
      `Ticket forwarded to ERP CRM successfully (local ticket #${ticket.id}). ERP CRM response:`,
      JSON.stringify(response.data)
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      `Failed to forward ticket #${ticket.id} to ERP CRM:`,
      error.response?.data || error.message
    );

    return { success: false, error: error.response?.data || error.message };
  }
};

module.exports = {
  sendTicketToErpCrm,
};