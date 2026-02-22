import React, { useState, useEffect } from 'react';
import { MusicAnalysis, AlertState } from './types';
import { analyzeAudioFile, analyzeLink } from './services/geminiService';
import InputSection from './components/InputSection';
import AnalysisResult from './components/AnalysisResult';
import Library from './components/Library';
import { AlertCircle, FileAudio, Sparkles, Waves } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MusicAnalysis | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [library, setLibrary] = useState<MusicAnalysis[]>([]);

  // Load library from local storage on mount
  useEffect(() => {
    const savedLibrary = localStorage.getItem('sonicStyleLibrary');
    if (savedLibrary) {
      try {
        setLibrary(JSON.parse(savedLibrary));
      } catch (e) {
        console.error("Failed to parse library from local storage", e);
      }
    }
  }, []);

  // Save library to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('sonicStyleLibrary', JSON.stringify(library));
  }, [library]);

  const showAlert = (type: AlertState['type'], message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const addToLibrary = (item: MusicAnalysis) => {
    // Check for duplicates based on title and artist if available, or just deep equality
    const exists = library.some(
      (libItem) => 
        (libItem.title === item.title && libItem.artist === item.artist && item.title) ||
        JSON.stringify(libItem) === JSON.stringify(item)
    );

    if (exists) {
      showAlert('info', 'This analysis is already in your library.');
      return;
    }

    setLibrary([item, ...library]);
    showAlert('success', 'Saved to library!');
  };

  const removeFromLibrary = (index: number) => {
    const newLibrary = [...library];
    newLibrary.splice(index, 1);
    setLibrary(newLibrary);
    showAlert('info', 'Removed from library.');
  };

  const loadFromLibrary = (item: MusicAnalysis) => {
    setAnalysisResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:audio/mp3;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyzeFile = async (file: File) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setAlert(null);

    try {
      if (file.size > 20 * 1024 * 1024) {
        throw new Error("File size too large. Please upload a file smaller than 20MB.");
      }
      
      const base64 = await fileToBase64(file);
      const result = await analyzeAudioFile(base64, file.type);
      setAnalysisResult(result);
      showAlert('success', 'Audio analysis complete!');
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Failed to analyze audio.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeUrl = async (url: string) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setAlert(null);

    try {
      const result = await analyzeLink(url);
      setAnalysisResult(result);
      showAlert('success', 'Link analysis complete!');
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'Failed to analyze link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white font-sans selection:bg-brand-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-slate-800/50 border border-slate-700 shadow-xl">
             <Waves className="text-brand-400 mr-2" size={24} />
             <span className="text-brand-100 font-mono font-bold tracking-tight">SONIC<span className="text-brand-500">STYLE</span> ANALYZER</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Deconstruct Any Sound
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Upload a track or paste a link. Get a detailed style profile, BPM, and a professional prompt for AI music generators.
          </p>
        </header>

        {/* Alert Toast */}
        {alert && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in-right backdrop-blur-md border ${
            alert.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-200' :
            alert.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-200' :
            'bg-blue-500/20 border-blue-500/50 text-blue-200'
          }`}>
            <AlertCircle size={20} />
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="w-full max-w-4xl flex flex-col items-center gap-12 mb-16">
          
          {/* Input Section - Only show if no result or if user wants to start over (handled by button below result) */}
          <InputSection 
            onAnalyzeFile={handleAnalyzeFile} 
            onAnalyzeUrl={handleAnalyzeUrl}
            isLoading={isLoading}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12 animate-pulse">
              <div className="relative w-20 h-20 mx-auto mb-6">
                 <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-t-brand-500 rounded-full animate-spin"></div>
                 <Sparkles className="absolute inset-0 m-auto text-brand-400 animate-pulse" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analyzing Sonic Characteristics...</h3>
              <p className="text-slate-400">Identifying instruments, BPM, and mood.</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && analysisResult && (
            <div className="w-full animate-fade-in-up">
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-2xl font-bold text-slate-200">Analysis Report</h2>
                <button 
                  onClick={() => setAnalysisResult(null)}
                  className="text-sm text-slate-400 hover:text-brand-400 transition-colors"
                >
                  Analyze Another Track
                </button>
              </div>
              <AnalysisResult 
                data={analysisResult} 
                onSave={addToLibrary}
              />
            </div>
          )}

          {/* Library Section */}
          {!isLoading && (
            <Library 
              items={library} 
              onDelete={removeFromLibrary} 
              onLoad={loadFromLibrary}
            />
          )}

        </main>

        <footer className="mt-auto py-6 text-center text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} SonicStyle Analyzer. Powered by Gemini 2.0 Flash.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
