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

// Gemini occasionally returns 429 (rate limited), 503 ("high demand"),
// or a generic 500/504 server-side hiccup — all transient and usually
// clear up within seconds. Worth a couple of quick retries before
// giving up, since falling back straight away was silently dropping
// genuine enquiries (customer says "I want ERP", Gemini is briefly
// overloaded, message gets treated exactly like a "hi"). Anything
// else (401/403 invalid key, 400 malformed request, 404 invalid
// model) is permanent — retrying won't help, so those fail fast.
const isRetryableGeminiError = (error) => {
  const status = error?.status || error?.error?.code;
  return (
    status === 429 ||
    status === 500 ||
    status === 503 ||
    status === 504 ||
    status === "UNAVAILABLE"
  );
};

// The @google/genai SDK throws an error whose .message is the raw
// JSON text of Google's error response (that's why the logs show
// "ApiError: {...}" rather than a plain sentence). When Gemini is
// rate-limited it includes a RetryInfo detail telling us exactly how
// long to wait — e.g. "51.028571703s" — which is far more accurate
// than guessing with a fixed delay or blind exponential backoff.
// Returns milliseconds, or null if no retryDelay was present/parseable.
const extractRetryDelayMs = (error) => {
  try {
    const body =
      typeof error?.error === "object"
        ? error.error
        : JSON.parse(error?.message || "{}").error;

    const retryInfo = body?.details?.find((d) =>
      String(d?.["@type"] || "").endsWith("RetryInfo")
    );

    const raw = retryInfo?.retryDelay; // e.g. "51.028571703s"

    if (!raw) return null;

    const seconds = parseFloat(raw);

    return Number.isFinite(seconds) ? seconds * 1000 : null;
  } catch (_) {
    return null;
  }
};

// Only 1 attempt, no retries — a failed Gemini call now falls
// straight to the "Needs Review" banner in the Conversations page
// instead of the customer/employee waiting through 6-16+ seconds of
// retry backoff. Trade-off: a quick transient hiccup that would have
// self-healed on a 2nd attempt now goes to manual review instead —
// acceptable since Gemini's paid tier makes genuine failures rarer,
// and the manual Create Lead / Send to ERP-CRM flow makes recovering
// from a failure fast and low-friction for an employee.
const MAX_CLASSIFICATION_ATTEMPTS = 1;

// Cap how long we'll actually wait on Gemini's own suggested delay.
// It can legitimately ask for 50+ seconds under sustained free-tier
// overuse — but this runs inside the webhook's fire-and-forget
// background handler (per-conversation), so waiting a full minute on
// one message risks a customer's next message arriving and being
// processed out of order. Anything Gemini asks for beyond this cap
// falls back to exponential backoff instead of trusting it verbatim.
const MAX_RESPECTED_RETRY_DELAY_MS = 8000;

const BASE_BACKOFF_MS = 2000; // Step 3 spec: ~2s, ~4s, ~8s

// Exponential backoff (2s, 4s, 8s, ...) with up to ±20% jitter so a
// burst of simultaneously-failing requests doesn't all retry at
// exactly the same instant and immediately re-trip the rate limit.
const getBackoffDelayMs = (attempt) => {
  const base = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
  const jitter = base * 0.2 * (Math.random() * 2 - 1); // ±20%
  return Math.round(base + jitter);
};

const getRetryDelayMs = (error, attempt) => {
  const suggested = extractRetryDelayMs(error);

  if (suggested !== null && suggested <= MAX_RESPECTED_RETRY_DELAY_MS) {
    return Math.round(suggested);
  }

  return getBackoffDelayMs(attempt);
};

// Builds a short, safe-to-store description of a Gemini failure for
// the classificationError column — never the raw error object (which
// could theoretically echo back request details) and never any
// secret/API key, just the HTTP-style status and Gemini's status text.
const describeGeminiError = (error) => {
  if (!error) return null;

  const status = error?.status || error?.error?.code || "UNKNOWN";

  let statusText = "";

  try {
    const body =
      typeof error?.error === "object"
        ? error.error
        : JSON.parse(error?.message || "{}").error;

    statusText = body?.status || "";
  } catch (_) {
    // fall through with whatever we already have
  }

  return `${status}${statusText ? " " + statusText : ""}`.slice(0, 200);
};

const CLASSIFICATION_MODEL = "gemini-2.5-flash";

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
// treating a real enquiry like small talk. Also returns `attempts`,
// `errorMessage`, and `model` so the caller can persist a durable
// classification record on the Message row (Step 6).
const classifyCustomerMessage = async (messageText) => {
  const fallback = {
    product: "Other",
    intent: "INQUIRY",
    confidence: 0,
    summary: "",
    aiUnavailable: false,
    attempts: 0,
    errorMessage: null,
    model: CLASSIFICATION_MODEL,
  };

  if (!messageText || typeof messageText !== "string" || !messageText.trim()) {
    return fallback;
  }

  const prompt = buildClassificationPrompt(messageText);
  let lastError = null;
  let attemptsMade = 0;

  for (let attempt = 1; attempt <= MAX_CLASSIFICATION_ATTEMPTS; attempt++) {
    attemptsMade = attempt;

    try {
      const response = await ai.models.generateContent({
        model: CLASSIFICATION_MODEL,
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

      return {
        product,
        intent,
        confidence,
        summary,
        aiUnavailable: false,
        attempts: attemptsMade,
        errorMessage: null,
        model: CLASSIFICATION_MODEL,
      };
    } catch (error) {
      lastError = error;

      if (isRetryableGeminiError(error) && attempt < MAX_CLASSIFICATION_ATTEMPTS) {
        const delay = getRetryDelayMs(error, attempt);

        console.warn(
          `Gemini Classification attempt ${attempt} failed (transient), retrying in ${delay}ms:`,
          error.message || error
        );

        await sleep(delay);
        continue;
      }

      break;
    }
  }

  console.error("Gemini Classification Error (giving up):", lastError);

  return {
    ...fallback,
    aiUnavailable: isRetryableGeminiError(lastError),
    attempts: attemptsMade,
    errorMessage: describeGeminiError(lastError),
  };
};

module.exports = {
  generateCampaign,
  generateTemplate,
  classifyCustomerMessage,
};