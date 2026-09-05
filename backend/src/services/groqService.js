const axios = require("axios");

const buildClassificationPrompt = require("../utils/classificationPromptBuilder");
const {
  ALLOWED_PRODUCTS,
  ALLOWED_INTENTS,
  PRODUCTS,
} = require("../utils/classificationPromptBuilder");

const { getAiSettings } = require("./aiSettingsService");

// Groq (console.groq.com — the LPU inference company, NOT xAI's Grok)
// exposes an OpenAI-compatible endpoint. Same request/response shape
// as OpenAI's chat completions, just a different base URL and model
// names. No new SDK needed, `axios` already covers this.
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Groq deprecates/renames models fairly often — check
// https://console.groq.com/docs/models for the current production
// list if this ever needs changing. gpt-oss-120b is currently listed
// as a production-grade model with good instruction-following, which
// matters for reliably returning clean JSON during classification.
const DEFAULT_MODEL = "openai/gpt-oss-120b";

// AiSettings.apiKey (set from the admin UI) takes priority over the
// env var, so an admin can rotate the key without a redeploy — but the
// env var still works out of the box for anyone who hasn't touched the
// settings page yet.
const resolveApiKey = (settings) =>
  settings?.apiKey || process.env.GROQ_API_KEY;

// Small delay helper for retry backoff.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Groq occasionally returns 429 (rate limited) or a 500/502/503/504
// server-side hiccup — transient, usually clears up within seconds.
// Anything else (401/403 invalid key, 400 malformed request, 404
// invalid model) is permanent — retrying won't help.
const isRetryableGroqError = (error) => {
  const status = error?.response?.status;
  return (
    status === 429 || status === 500 || status === 502 || status === 503 || status === 504
  );
};

// Groq (like most OpenAI-compatible APIs) sends a `retry-after` header
// (seconds) on 429s. Prefer that over guessing with fixed backoff.
const extractRetryDelayMs = (error) => {
  const raw = error?.response?.headers?.["retry-after"];
  if (!raw) return null;
  const seconds = parseFloat(raw);
  return Number.isFinite(seconds) ? seconds * 1000 : null;
};

const MAX_RESPECTED_RETRY_DELAY_MS = 8000;
const BASE_BACKOFF_MS = 2000;

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

// Builds a short, safe-to-store description of a Groq failure — never
// the raw error object (which could echo request details) and never
// the API key, just an HTTP-style status + message.
const describeGroqError = (error) => {
  if (!error) return null;
  const status = error?.response?.status || "UNKNOWN";
  const message =
    error?.response?.data?.error?.message || error?.message || "";

  // The nested shape we normally expect isn't always what the API
  // sends back — log the raw body too so real failures (bad model id,
  // unsupported param, malformed messages, invalid key, etc.) are
  // visible instead of Axios's generic "Request failed with status
  // code 400".
  if (error?.response?.data) {
    try {
      console.error("Groq raw error body:", JSON.stringify(error.response.data).slice(0, 500));
    } catch (_) {
      console.error("Groq raw error body (unstringifiable):", error.response.data);
    }
  }

  return `${status}${message ? " " + message : ""}`.slice(0, 200);
};

// Only 1 attempt, no retries — matches the fail-fast philosophy already
// established for classification (see the old geminiService.js): a
// failed AI call should surface the "Needs Review" banner immediately
// rather than making the customer/webhook wait through retry backoff.
const MAX_CLASSIFICATION_ATTEMPTS = 1;
const MAX_AUTOREPLY_ATTEMPTS = 1;

const CLASSIFICATION_MODEL_FALLBACK = DEFAULT_MODEL;

const callGroq = async ({ apiKey, model, messages, jsonMode }) => {
  const response = await axios.post(
    GROQ_API_URL,
    {
      model,
      messages,
      temperature: jsonMode ? 0.2 : 0.6,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    }
  );

  return response.data?.choices?.[0]?.message?.content || "";
};

// Step 4 - AI Analysis: classifies an incoming customer message into
// { product, intent, confidence, summary } so the Product Router can
// decide which team the lead/ticket belongs to. Same input/output
// contract as the old Gemini version (see git history / geminiService.js)
// so nothing downstream (leadHelper, ticketEnrichmentHelper,
// messageHelper, webhook.js) needed to change.
// Never throws — on any failure it falls back to a safe "Other" /
// "INQUIRY" result so the webhook flow never breaks because of an AI
// hiccup. aiUnavailable is true only when the failure was transient
// (as opposed to the message genuinely being unclassifiable), so the
// caller can alert a human instead of silently treating a real
// enquiry like small talk.
const classifyCustomerMessage = async (messageText) => {
  const fallback = {
    product: "Other",
    intent: "INQUIRY",
    confidence: 0,
    summary: "",
    aiUnavailable: false,
    attempts: 0,
    errorMessage: null,
    model: CLASSIFICATION_MODEL_FALLBACK,
  };

  if (!messageText || typeof messageText !== "string" || !messageText.trim()) {
    return fallback;
  }

  const settings = await getAiSettings().catch(() => null);
  const apiKey = resolveApiKey(settings);
  const model = settings?.model || process.env.GROQ_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    console.error("Groq Classification Error: no GROQ_API_KEY configured.");
    return { ...fallback, model, aiUnavailable: true, errorMessage: "Missing Groq API key" };
  }

  const prompt = buildClassificationPrompt(messageText);
  let lastError = null;
  let attemptsMade = 0;

  for (let attempt = 1; attempt <= MAX_CLASSIFICATION_ATTEMPTS; attempt++) {
    attemptsMade = attempt;

    try {
      const raw = await callGroq({
        apiKey,
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a strict JSON API. Respond with ONLY raw JSON, no markdown, no code fences, no commentary.",
          },
          { role: "user", content: prompt },
        ],
        jsonMode: true,
      });

      let text = raw.replace(/```json/g, "").replace(/```/g, "").trim();
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
        model,
      };
    } catch (error) {
      lastError = error;

      if (isRetryableGroqError(error) && attempt < MAX_CLASSIFICATION_ATTEMPTS) {
        const delay = getRetryDelayMs(error, attempt);
        console.warn(
          `Groq Classification attempt ${attempt} failed (transient), retrying in ${delay}ms:`,
          error.message || error
        );
        await sleep(delay);
        continue;
      }

      break;
    }
  }

  console.error("Groq Classification Error (giving up):", describeGroqError(lastError));

  return {
    ...fallback,
    model,
    aiUnavailable: isRetryableGroqError(lastError),
    attempts: attemptsMade,
    errorMessage: describeGroqError(lastError),
  };
};

const DEFAULT_AUTOREPLY_SYSTEM_PROMPT = `You are the WhatsApp assistant for VSoft Solutions, a company offering: ${PRODUCTS.map(
  (p) => p.name
).join(", ")}.

Reply to the customer's WhatsApp message in a short, warm, professional tone (2-4 sentences max, no markdown, plain WhatsApp text).
- If they're asking something you can confidently answer about the company/products, answer helpfully.
- If the request is sensitive or complex (refund, complaint, pricing negotiation, contract/legal, or anything you're not fully sure about), acknowledge it briefly and let them know a team member will follow up shortly — do NOT make commitments on pricing, refunds, or timelines.
- Never invent facts about the company you don't know.
- Do not repeat the customer's message back to them.`;

// Generates a Groq-written, context-aware reply to a customer's
// WhatsApp message. Used as the conversational fallback for any
// message that didn't already get a deterministic reply this turn
// (see webhook.js) — e.g. small talk, a follow-up on an
// already-enriched lead, or a general question.
// Never throws — returns null on any failure so the caller simply
// skips sending a reply for this turn instead of breaking the webhook.
const generateAutoReply = async (messageText, classification, conversationHistory = []) => {
  if (!messageText || !messageText.trim()) return null;

  const settings = await getAiSettings().catch(() => null);

  if (settings && settings.autoReplyEnabled === false) {
    return null;
  }

  const apiKey = resolveApiKey(settings);
  const model = settings?.model || process.env.GROQ_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    console.error("Groq Auto-Reply Error: no GROQ_API_KEY configured.");
    return null;
  }

  const historyLimit = settings?.historyLimit ?? 10;

  const historyMessages = (conversationHistory || [])
    .slice(-historyLimit)
    .map((m) => ({
      role: m.sender === "CUSTOMER" ? "user" : "assistant",
      content: m.content,
    }));

  const systemPrompt = settings?.systemPrompt?.trim() || DEFAULT_AUTOREPLY_SYSTEM_PROMPT;

  const contextNote = classification
    ? `\n\n(Internal context, don't mention this to the customer: detected product interest = ${classification.product}, intent = ${classification.intent}.)`
    : "";

  for (let attempt = 1; attempt <= MAX_AUTOREPLY_ATTEMPTS; attempt++) {
    try {
      const reply = await callGroq({
        apiKey,
        model,
        messages: [
          { role: "system", content: systemPrompt + contextNote },
          ...historyMessages,
          { role: "user", content: messageText },
        ],
        jsonMode: false,
      });

      const trimmed = (reply || "").trim();
      return trimmed || null;
    } catch (error) {
      if (isRetryableGroqError(error) && attempt < MAX_AUTOREPLY_ATTEMPTS) {
        const delay = getRetryDelayMs(error, attempt);
        console.warn(
          `Groq Auto-Reply attempt ${attempt} failed (transient), retrying in ${delay}ms:`,
          error.message || error
        );
        await sleep(delay);
        continue;
      }

      console.error("Groq Auto-Reply Error (giving up):", describeGroqError(error));
      return null;
    }
  }

  return null;
};

module.exports = {
  classifyCustomerMessage,
  generateAutoReply,
};