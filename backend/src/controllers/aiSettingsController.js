const { getAiSettings, updateAiSettings } = require("../services/aiSettingsService");

// Never send the real API key back to the browser — mask it so the
// settings page can show "a key is configured" without exposing the
// secret in a network response/devtools.
const maskApiKey = (key) => {
  if (!key) return null;
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 4)}${"•".repeat(8)}${key.slice(-4)}`;
};

// GET /api/ai-settings
const getSettings = async (req, res) => {
  try {
    const settings = await getAiSettings();

    res.status(200).json({
      success: true,
      settings: {
        autoReplyEnabled: settings.autoReplyEnabled,
        model: settings.model,
        systemPrompt: settings.systemPrompt,
        historyLimit: settings.historyLimit,
        apiKeyMasked: maskApiKey(settings.apiKey),
        usingEnvKey: !settings.apiKey, // true when falling back to GROK_API_KEY env var
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch AI settings",
    });
  }
};

// PATCH /api/ai-settings
const updateSettings = async (req, res) => {
  try {
    const { autoReplyEnabled, apiKey, model, systemPrompt, historyLimit } = req.body;

    const data = {};

    if (typeof autoReplyEnabled === "boolean") data.autoReplyEnabled = autoReplyEnabled;

    // Only touch apiKey if a non-empty value was actually sent — the
    // settings page shows a masked placeholder, not the real key, so
    // an unrelated save (e.g. just toggling the switch) should never
    // accidentally overwrite the stored key with a blank/masked value.
    if (typeof apiKey === "string" && apiKey.trim()) data.apiKey = apiKey.trim();

    if (typeof model === "string" && model.trim()) data.model = model.trim();

    if (typeof systemPrompt === "string") data.systemPrompt = systemPrompt.trim() || null;

    if (typeof historyLimit === "number" && historyLimit > 0) {
      data.historyLimit = Math.min(Math.floor(historyLimit), 50);
    }

    const settings = await updateAiSettings(data);

    res.status(200).json({
      success: true,
      message: "AI settings updated successfully",
      settings: {
        autoReplyEnabled: settings.autoReplyEnabled,
        model: settings.model,
        systemPrompt: settings.systemPrompt,
        historyLimit: settings.historyLimit,
        apiKeyMasked: maskApiKey(settings.apiKey),
        usingEnvKey: !settings.apiKey,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update AI settings",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};