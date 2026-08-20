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

// Small delay helper for retry backoff.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Gemini occasionally returns 503/UNAVAILABLE ("high demand") or 429
// (rate limited) — both are transient and usually clear up within a
// couple seconds. Worth a couple of quick retries before giving up,
// since falling back straight away was silently dropping genuine
// enquiries (customer says "I want ERP", Gemini is briefly
// overloaded, message gets treated exactly like a "hi").
const isRetryableGeminiError = (error) => {
  const status = error?.status || error?.error?.code;
  return status === 503 || status === 429 || status === "UNAVAILABLE";
};

const MAX_CLASSIFICATION_ATTEMPTS = 3; // 1 initial try + 2 retries
const RETRY_DELAY_MS = 1500;

// Step 4 - AI Analysis: classifies an incoming customer message into
// { product, intent, confidence, summary } so Step 5 (Product Router)
// can decide which team the lead/ticket belongs to, and whether it's
// a sales opportunity (INQUIRY) or an existing-customer issue
// (SUPPORT).
// Never throws — on any failure (bad JSON, API error, etc.) it falls
// back to a safe "Other" / "INQUIRY" result so the webhook flow never
// breaks because of an AI hiccup. The fallback carries aiUnavailable:
// true only when every retry hit a transient Gemini error (as opposed
// to the message genuinely being unclassifiable), so the caller can
// tell the two cases apart and alert a human instead of silently
// treating a real enquiry like small talk.
const classifyCustomerMessage = async (messageText) => {
  const fallback = {
    product: "Other",
    intent: "INQUIRY",
    confidence: 0,
    summary: "",
    aiUnavailable: false,
  };

  if (!messageText || typeof messageText !== "string" || !messageText.trim()) {
    return fallback;
  }

  const prompt = buildClassificationPrompt(messageText);
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_CLASSIFICATION_ATTEMPTS; attempt++) {
    try {
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

      return { product, intent, confidence, summary, aiUnavailable: false };
    } catch (error) {
      lastError = error;

      if (isRetryableGeminiError(error) && attempt < MAX_CLASSIFICATION_ATTEMPTS) {
        console.warn(
          `Gemini Classification attempt ${attempt} failed (transient), retrying in ${RETRY_DELAY_MS}ms:`,
          error.message || error
        );
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      break;
    }
  }

  console.error("Gemini Classification Error (giving up):", lastError);
  return { ...fallback, aiUnavailable: isRetryableGeminiError(lastError) };
};

module.exports = {
  generateCampaign,
  generateTemplate,
  classifyCustomerMessage,
};