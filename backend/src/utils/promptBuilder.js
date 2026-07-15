const buildCampaignPrompt = (userPrompt) => {
  return `
You are an expert WhatsApp CRM marketing assistant.

Generate a professional WhatsApp campaign.

Return ONLY valid JSON.

JSON format:

{
  "name": "",
  "type": "",
  "messageContent": ""
}

Rules:

- Campaign name should be short.
- Type must be exactly one of:
  PROMOTIONAL
  BROADCAST
  FOLLOW_UP
  ANNOUNCEMENT
- Message should be engaging.
- Do not return markdown.
- Do not explain anything.
- Return only JSON.

User Request:

${userPrompt}
`;
};

module.exports = buildCampaignPrompt;