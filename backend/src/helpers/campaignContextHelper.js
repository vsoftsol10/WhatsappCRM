const prisma = require("../config/prisma");

// How long after a campaign was sent a customer's message is still
// treated as a reply to it. Override with CAMPAIGN_REPLY_WINDOW_HOURS.
const REPLY_WINDOW_HOURS =
  parseInt(process.env.CAMPAIGN_REPLY_WINDOW_HOURS, 10) || 72;

const DELIVERED_STATUSES = ["SENT", "DELIVERED", "READ"];

// Finds the campaign a customer is most likely replying to, so the
// bot can answer using that campaign's details instead of guessing.
//
// 1. If the customer used WhatsApp's "swipe to reply" on the campaign
//    message, Meta sends message.context.id = the campaign message's
//    id, which we stored as CampaignRecipient.metaMessageId. Exact match.
// 2. Otherwise: the latest campaign delivered to this customer inside
//    the reply window.
//
// Never throws — returns null if nothing is found or on any error, so
// a lookup problem can never break the webhook.
const findCampaignContext = async (conversation, replyToMetaMessageId = null) => {
  try {
    if (replyToMetaMessageId) {
      const direct = await prisma.campaignRecipient.findFirst({
        where: { metaMessageId: replyToMetaMessageId },
        include: { campaign: true },
      });

      if (direct?.campaign) {
        return { campaign: direct.campaign, sentAt: direct.sentAt, matchedBy: "reply-context" };
      }
    }

    const customerId = conversation?.customerId;
    if (!customerId) return null;

    const since = new Date(Date.now() - REPLY_WINDOW_HOURS * 60 * 60 * 1000);

    const recent = await prisma.campaignRecipient.findFirst({
      where: {
        customerId,
        status: { in: DELIVERED_STATUSES },
        sentAt: { gte: since },
      },
      orderBy: { sentAt: "desc" },
      include: { campaign: true },
    });

    if (recent?.campaign) {
      return { campaign: recent.campaign, sentAt: recent.sentAt, matchedBy: "recent" };
    }

    return null;
  } catch (error) {
    console.error("Campaign context lookup failed:", error.message);
    return null;
  }
};

// templateParams is an ordered list of values for the Meta template's
// {{1}}, {{2}}... placeholders (e.g. event name, date, time, venue,
// phone). The labels aren't stored, so we pass the values in order
// and let the model read them together with the message text.
const formatTemplateParams = (params) => {
  if (!Array.isArray(params) || params.length === 0) return "";
  return params
    .map((value, index) => `${index + 1}. ${String(value ?? "").trim()}`)
    .filter((line) => line.length > 3)
    .join("\n");
};

const describeAge = (sentAt) => {
  if (!sentAt) return "recently";
  const hours = Math.max(0, Math.round((Date.now() - new Date(sentAt).getTime()) / 3600000));
  if (hours < 1) return "less than an hour ago";
  if (hours < 24) return `about ${hours} hour(s) ago`;
  return `about ${Math.round(hours / 24)} day(s) ago`;
};

// Plain-text block describing the campaign, for use inside prompts
// (classification + auto-reply). Everything here is data the company
// itself wrote — the model is told to treat it as the ONLY source of
// facts about the campaign.
const buildCampaignContextBlock = (campaign, sentAt = null) => {
  if (!campaign) return "";

  const lines = [
    `Campaign name: ${campaign.name}`,
    `Campaign type: ${campaign.type}`,
    `Sent to the customer: ${describeAge(sentAt)}`,
    "",
    "Message the customer received:",
    '"""',
    String(campaign.messageContent || "").trim(),
    '"""',
  ];

  const params = formatTemplateParams(campaign.templateParams);
  if (params) {
    lines.push("", "Values filled into the message template, in order:", params);
  }

  const extra = String(campaign.aiContext || "").trim();
  if (extra) {
    lines.push("", "Extra campaign information written by our team:", '"""', extra, '"""');
  }

  return lines.join("\n");
};

// For GREETING campaigns (festival / birthday wishes): true when the
// customer's reply is only an emoji, a thumbs-up, or "ok" — nothing
// worth answering. Replying to those just creates a pointless
// back-and-forth, so the webhook stays silent instead.
const isAcknowledgementOnly = (text) => {
  const value = String(text || "").trim().toLowerCase();
  if (!value) return true;

  // No letters or digits in any language = only emoji / punctuation.
  if (!/[\p{L}\p{N}]/u.test(value)) return true;

  return ["ok", "okay", "k", "kk", "okk", "okey", "ok da", "ok sir", "ok mam"].includes(
    value.replace(/[.!]+$/g, "")
  );
};

module.exports = {
  findCampaignContext,
  buildCampaignContextBlock,
  isAcknowledgementOnly,
  REPLY_WINDOW_HOURS,
};