const { GoogleGenAI } = require("@google/genai");
const buildCampaignPrompt = require("../utils/promptBuilder");
const buildTemplatePrompt = require("../utils/templatePromptBuilder");
const buildClassificationPrompt = require("../utils/classificationPromptBuilder");
const {
  ALLOWED_PRODUCTS,
  ALLOWED_INTENTS,
} = require("../utils/classificationPromptBuilder");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateCampaign = async (userPrompt) => {
  try {
    const prompt = buildCampaignPrompt(userPrompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    // Remove markdown code blocks if Gemini returns them
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const campaign = JSON.parse(text);

    return campaign;
  } catch (error) {
    console.error("Gemini Service Error:", error);

    throw new Error("Failed to generate AI campaign.");
  }
};

const generateTemplate = async (
  topic,
  tone = "Professional"
) => {
  try {
    const prompt = buildTemplatePrompt(
      topic,
      tone
    );

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    return response.text.trim();
  } catch (error) {
    console.error(
      "Gemini Template Error:",
      error
    );

    throw new Error(
      "Failed to generate AI template."
    );
  }
};

// Step 4 - AI Analysis: classifies an incoming customer message into
// { product, intent, confidence, summary } so Step 5 (Product Router)
// can decide which team the lead/ticket belongs to, and whether it's
// a sales opportunity (INQUIRY) or an existing-customer issue
// (SUPPORT).
// Never throws — on any failure (bad JSON, API error, etc.) it falls
// back to a safe "Other" / "INQUIRY" result so the webhook flow never
// breaks because of an AI hiccup.
const classifyCustomerMessage = async (messageText) => {
  const fallback = {
    product: "Other",
    intent: "INQUIRY",
    confidence: 0,
    summary: "",
  };

  if (!messageText || typeof messageText !== "string" || !messageText.trim()) {
    return fallback;
  }

  try {
    const prompt = buildClassificationPrompt(messageText);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const result = JSON.parse(text);

    const product = ALLOWED_PRODUCTS.includes(result.product)
      ? result.product
      : "Other";

    const intent = ALLOWED_INTENTS.includes(result.intent)
      ? result.intent
      : "INQUIRY";

    const confidence =
      typeof result.confidence === "number" &&
      result.confidence >= 0 &&
      result.confidence <= 1
        ? result.confidence
        : 0;

    const summary =
      typeof result.summary === "string" ? result.summary.trim() : "";

    return { product, intent, confidence, summary };
  } catch (error) {
    console.error("Gemini Classification Error:", error);
    return fallback;
  }
};

module.exports = {
  generateCampaign,
  generateTemplate,
  classifyCustomerMessage,
};