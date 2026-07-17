import { useState } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useCampaignStore from "../../store/campaignStore";

export default function AICampaignModal({
  isOpen,
  onClose,
  onUseCampaign,
}) {
  const { generateAI } = useCampaignStore();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return toast.error("Please enter a prompt.");
    }

    try {
      setLoading(true);
      const response = await generateAI(prompt);
      setCampaign(response);
      toast.success("Campaign generated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Unable to generate campaign");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCampaign = () => {
    onUseCampaign(campaign);
    setPrompt("");
    setCampaign(null);
    onClose();
  };

  return (
    // ✅ OUTER LAYER SCROLL FIX
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 py-8 sm:p-4 sm:py-10">

      {/* MODAL */}
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">

        {/* HEADER */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className="text-[#25D366]" />
            <h2 className="break-words text-xl font-bold sm:text-2xl">
              Generate Campaign with AI
            </h2>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* PROMPT */}
        <textarea
          rows={5}
          placeholder="Example: Create a Diwali sale campaign for existing customers with 30% discount."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="crm-input min-h-36"
        />

        {/* BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="crm-primary-button mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate
            </>
          )}
        </button>

        {/* PREVIEW */}
        {campaign && (
          <div className="mt-6 max-h-[50vh] overflow-y-auto rounded-xl border p-4 sm:p-5">
            
            <h3 className="font-bold text-xl mb-4">
              AI Generated Campaign
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Campaign Name</p>
              <h2 className="font-semibold text-lg">
                {campaign.name}
              </h2>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Campaign Type</p>
              <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                {campaign.type}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Message</p>
              <div className="whitespace-pre-wrap break-words rounded-xl border p-4">
                {campaign.messageContent}
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleGenerate}
                className="crm-secondary-button"
              >
                Generate Again
              </button>

              <button
                onClick={handleUseCampaign}
                className="crm-primary-button"
              >
                Use Campaign
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
