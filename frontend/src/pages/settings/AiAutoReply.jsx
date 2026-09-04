import { useEffect, useState } from "react";
import { Bot, Save, KeyRound, MessageSquareText, History } from "lucide-react";
import { getAiSettings, updateAiSettings } from "../../api/aiSettingsApi";

function AiAutoReply() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [apiKeyMasked, setApiKeyMasked] = useState(null);
  const [usingEnvKey, setUsingEnvKey] = useState(true);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [model, setModel] = useState("grok-4-fast");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [historyLimit, setHistoryLimit] = useState(10);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getAiSettings();
      const s = data.settings;

      setAutoReplyEnabled(s.autoReplyEnabled);
      setApiKeyMasked(s.apiKeyMasked);
      setUsingEnvKey(s.usingEnvKey);
      setModel(s.model || "grok-4-fast");
      setSystemPrompt(s.systemPrompt || "");
      setHistoryLimit(s.historyLimit || 10);
    } catch (err) {
      console.error(err);
      setError("Failed to load AI settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const payload = {
        autoReplyEnabled,
        model,
        systemPrompt,
        historyLimit: Number(historyLimit),
      };

      // Only send apiKey if the admin actually typed a new one — an
      // empty field means "leave the stored/env key as-is".
      if (apiKeyInput.trim()) {
        payload.apiKey = apiKeyInput.trim();
      }

      const data = await updateAiSettings(payload);
      const s = data.settings;

      setApiKeyMasked(s.apiKeyMasked);
      setUsingEnvKey(s.usingEnvKey);
      setApiKeyInput("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save AI settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="crm-page bg-slate-50">
        <p className="text-slate-500">Loading AI settings...</p>
      </div>
    );
  }

  return (
    <div className="crm-page bg-slate-50">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#128C7E]">
          <Bot size={22} />
        </div>
        <div>
          <h1 className="crm-title text-slate-900">AI Auto-Reply</h1>
          <p className="mt-1 text-slate-500">
            Configure Grok — the AI that classifies WhatsApp leads and
            auto-replies to customers.
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* MASTER SWITCH */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="font-semibold text-slate-800">
              Master Auto-Reply Switch
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Emergency kill-switch. Turning this OFF stops Grok from
              replying in EVERY conversation, regardless of each chat's
              own Bot ON/OFF pill. Lead classification and ERP-CRM
              forwarding keep working either way.
            </p>
          </div>

          <button
            onClick={() => setAutoReplyEnabled((prev) => !prev)}
            className={`relative h-7 w-13 shrink-0 rounded-full transition ${
              autoReplyEnabled ? "bg-[#25D366]" : "bg-slate-300"
            }`}
            style={{ width: "52px" }}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                autoReplyEnabled ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* API KEY */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <KeyRound size={16} />
            <p className="font-semibold">Grok API Key</p>
          </div>

          <p className="mb-3 text-sm text-slate-500">
            {usingEnvKey
              ? "Currently using the GROK_API_KEY environment variable (no override saved here)."
              : `Currently using an override key saved here: ${apiKeyMasked}`}
          </p>

          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Paste a new Grok API key to override the .env value..."
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#25D366]"
          />
        </div>

        {/* MODEL */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-3 font-semibold text-slate-800">Grok Model</p>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="grok-4-fast"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#25D366]"
          />
          <p className="mt-2 text-xs text-slate-400">
            e.g. grok-4-fast, grok-4, grok-3
          </p>
        </div>

        {/* SYSTEM PROMPT */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <MessageSquareText size={16} />
            <p className="font-semibold">Auto-Reply System Prompt</p>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            placeholder="Leave blank to use the built-in default prompt (introduces VSoft Solutions' products, escalates sensitive queries to a human, keeps replies short)."
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#25D366]"
          />
        </div>

        {/* HISTORY LIMIT */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-800">
            <History size={16} />
            <p className="font-semibold">Conversation History Limit</p>
          </div>
          <p className="mb-3 text-sm text-slate-500">
            How many of the most recent messages Grok reads for context
            before writing a reply.
          </p>
          <input
            type="number"
            min={1}
            max={50}
            value={historyLimit}
            onChange={(e) => setHistoryLimit(e.target.value)}
            className="w-32 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#25D366]"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#128C7E] disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Settings"}
          </button>

          {saved && (
            <span className="text-sm font-medium text-[#128C7E]">
              Saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AiAutoReply;