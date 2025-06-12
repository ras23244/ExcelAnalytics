const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports.getInsights = async (req, res) => {
  try {
    if (!req.body.data || !Array.isArray(req.body.data)) {
      return res.status(400).json({ error: "No data provided" });
    }
    const dataSample = JSON.stringify(req.body.data.slice(0, 10));
    const prompt = `
      Given the following tabular data (as JSON array), suggest:
      1. The best chart types to visualize the data,give its name and in one line between which fields it should be plotted.
      Data: ${dataSample}
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    res.json({ insights: response.text });
  } catch (err) {
    console.error("Error generating insights:", err);
    res.status(500).json({ error: "Failed to generate insights" });
  }
};