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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start overflow-y-auto py-10 z-50">

      {/* MODAL */}
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-500" />
            <h2 className="text-2xl font-bold">
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
          className="w-full border rounded-xl p-4"
        />

        {/* BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 rounded-xl px-5 py-3 font-semibold flex items-center gap-2"
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
          <div className="mt-6 border rounded-xl p-5 max-h-[50vh] overflow-y-auto">
            
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
              <div className="border rounded-xl p-4 whitespace-pre-wrap">
                {campaign.messageContent}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleGenerate}
                className="border px-4 py-2 rounded-xl"
              >
                Generate Again
              </button>

              <button
                onClick={handleUseCampaign}
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
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