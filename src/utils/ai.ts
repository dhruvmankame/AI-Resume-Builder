import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
});

export const generateSummary = async (title: string, skills: string[], experience: string) => {
  const prompt = `
    You are an expert resume writer. Generate a professional and impactful resume summary (objective) for a candidate with the following profile:
    Job Title: ${title || "Professional"}
    Key Skills: ${skills && skills.length > 0 ? skills.join(", ") : "Various professional skills"}
    Experience Overview: ${experience || "Experienced professional"}
    
    Keep the summary between 3 to 4 sentences. Make it engaging, action-oriented, and highlight their potential value to an employer. Do not include any introductory text like "Here is a summary", just return the summary itself.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  return response.text;
};