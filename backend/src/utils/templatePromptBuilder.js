const buildTemplatePrompt = (topic, tone = "Professional") => {
  return `
You are an expert CRM and WhatsApp business copywriter.

Generate a professional WhatsApp message template.

Requirements:
- Topic: ${topic}
- Tone: ${tone}
- Keep it clear and concise.
- Use professional business language.
- Include placeholders when appropriate:
  {{customer_name}}
  {{company}}
  {{phone}}
  {{email}}
- Do NOT include explanations.
- Do NOT wrap the response in markdown.
- Return ONLY the message content.
`;
};

module.exports = buildTemplatePrompt;