# Sonic Style Analyzer

Sonic Style Analyzer is a web app for breaking down the sound and production style of a track.
You can upload an audio file or paste a track link, then generate a structured sonic profile and
an AI-ready music generation prompt.

## What It Does

- Analyzes uploaded audio files (multimodal Gemini flow)
- Analyzes music links (search-assisted Gemini flow)
- Returns structured results, including:
  - Title and artist
  - Genre and sub-genre
  - BPM, key, and time signature
  - Instrumentation
  - Mood and production techniques
  - A reusable generation prompt for tools like Suno/Udio
- Saves analyses to a local in-app library (`localStorage`)
- Lets you reload and copy previous prompts quickly

## Tech Stack

- React 19 + TypeScript
- Vite
- Gemini API (`@google/genai`)
- Lucide icons

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20+ recommended)

### Install and Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the local URL shown by Vite (usually `http://localhost:3000` or `http://127.0.0.1:3000`).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Create a production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Type-check the project (`tsc --noEmit`)

## Project Structure

```text
.
├── App.tsx
├── components/
│   ├── InputSection.tsx
│   ├── AnalysisResult.tsx
│   └── Library.tsx
├── services/
│   └── geminiService.ts
├── constants.ts
├── types.ts
├── index.tsx
├── index.css
└── index.html
```

## Notes

- The API key is required only when running analysis actions.
- `.env` files are ignored by git in this project.
- For production deployments, consider moving Gemini calls behind a server/API layer to avoid exposing client credentials.
