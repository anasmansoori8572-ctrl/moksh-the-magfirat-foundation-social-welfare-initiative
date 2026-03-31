import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const translateText = async (text: string, targetLanguage: string = "Hindi") => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text to ${targetLanguage}. Provide only the translated text without any explanations or extra characters: \n\n${text}`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export const detectLanguage = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Detect the language of the following text. Return only the language name (e.g., "English", "Hindi", "Urdu"): \n\n${text}`,
    });
    return response.text?.trim() || "Unknown";
  } catch (error) {
    console.error("Language detection error:", error);
    return "Unknown";
  }
};
