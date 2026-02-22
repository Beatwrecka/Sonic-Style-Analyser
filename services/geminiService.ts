import { GoogleGenAI, Type } from "@google/genai";
import { ANALYSIS_SCHEMA, ANALYSIS_SYSTEM_INSTRUCTION } from "../constants";
import { MusicAnalysis } from "../types";

const apiKey = process.env.API_KEY;
// We create the client instance lazily or per request to ensure latest key if needed, 
// but for this simple app, a module-level instance is fine if the env var is set.
const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzeAudioFile = async (
  base64Data: string, 
  mimeType: string
): Promise<MusicAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Capable of multimodal (audio) input
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Analyze this audio track. Provide a full sonic profile including BPM, Key, Instruments, and a generation prompt."
          }
        ]
      },
      config: {
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MusicAnalysis;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Audio Analysis Error:", error);
    throw error;
  }
};

export const analyzeLink = async (url: string): Promise<MusicAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Can use search tools
      contents: `You are a musicologist. I need you to analyze the track at this link: ${url}.
      
      CRITICAL INSTRUCTION: You cannot "listen" to the link directly. You MUST use the Google Search tool to find the following information about this specific track:
      1. Artist Name and Track Title (Verify these match the link)
      2. BPM (Beats Per Minute)
      3. Musical Key
      4. Exact Genre and Sub-genre
      5. Instrumentation (List specific instruments used)
      6. Production techniques (e.g., reverb, distortion, sampling style)
      7. Mood and Vibe

      Once you have gathered this factual data from search results, construct a "sonic profile" and a generation prompt.
      
      If the link is a YouTube link, search for the video title first to ensure you are analyzing the correct song.
      Do not hallucinate. If you cannot find specific details via search, make reasonable inferences based on the artist's typical style for that era/album, but prioritize search data.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MusicAnalysis;
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Link Analysis Error:", error);
    throw error;
  }
};
