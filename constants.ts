import { Type } from "@google/genai";

export const ANALYSIS_SYSTEM_INSTRUCTION = `
You are an expert musicologist and audio engineer. Your task is to analyze music inputs (either audio files or descriptions/search results via links) and provide a highly technical and descriptive breakdown suitable for music production and AI music generation.

Focus on:
1. Precise genre and style identification.
2. Technical details: BPM, Key, Time Signature.
3. Instrumentation: List specific instruments (e.g., "Roland TR-808 kick", "Stratocaster clean tone", "Moog bass").
4. Mood and Vibe: Atmospheric descriptors.
5. Generation Prompt: Create a concise but detailed prompt that could be pasted into an AI music generator (like MusicLM, Suno, or Udio) to recreate this exact style.
`;

export const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Title of the track if known" },
    artist: { type: Type.STRING, description: "Artist if known" },
    genre: { type: Type.STRING, description: "Main genre" },
    subGenre: { type: Type.STRING, description: "Specific sub-genre" },
    bpm: { type: Type.STRING, description: "Tempo in Beats Per Minute (e.g. '128')" },
    key: { type: Type.STRING, description: "Musical Key (e.g. 'C Minor')" },
    timeSignature: { type: Type.STRING, description: "Time Signature (e.g. '4/4')" },
    mood: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of mood adjectives"
    },
    instruments: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of instruments heard"
    },
    vocalStyle: { type: Type.STRING, description: "Description of vocals if present, or 'Instrumental'" },
    productionTechniques: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific production techniques (e.g., 'Sidechain compression', 'Lo-fi saturation')"
    },
    description: { type: Type.STRING, description: "A comprehensive paragraph describing the track" },
    generationPrompt: { type: Type.STRING, description: "An optimized prompt for AI music generation" }
  },
  required: ["genre", "bpm", "key", "mood", "instruments", "description", "generationPrompt"]
};
