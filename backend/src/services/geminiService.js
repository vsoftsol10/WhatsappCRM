const { GoogleGenAI } = require("@google/genai");
const buildCampaignPrompt = require("../utils/promptBuilder");

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

module.exports = {
  generateCampaign,
};