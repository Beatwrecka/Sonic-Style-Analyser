export interface MusicAnalysis {
  title?: string;
  artist?: string;
  genre: string;
  subGenre?: string;
  bpm: string | number;
  key: string;
  timeSignature: string;
  mood: string[];
  instruments: string[];
  vocalStyle?: string;
  productionTechniques: string[];
  description: string;
  generationPrompt: string;
}

export type AnalysisMode = 'file' | 'url';

export interface AlertState {
  type: 'error' | 'success' | 'info';
  message: string;
}
