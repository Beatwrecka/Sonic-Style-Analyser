import React, { useState, useEffect } from 'react';
import { MusicAnalysis, AlertState } from './types';
import { analyzeAudioFile, analyzeLink } from './services/geminiService';
import { logger } from './services/logger';
import { validateAndNormalizeUrl } from './services/urlUtils';
import InputSection from './components/InputSection';
import AnalysisResult from './components/AnalysisResult';
import Library from './components/Library';
import { AlertCircle, Sparkles, Waves } from 'lucide-react';

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
        const parsedData = JSON.parse(savedLibrary);
        if (Array.isArray(parsedData)) {
          setLibrary(parsedData);
        } else {
          logger.warn("Invalid library data in local storage. Expected an array.");
        }
      } catch (e) {
        logger.error("Failed to parse library from local storage", e);
      }
    }
  }, []);

  // Save library to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sonicStyleLibrary', JSON.stringify(library));
    } catch (e: unknown) {
      logger.error("Failed to save library to local storage", e);
      // We don't show an alert here as it might trigger continuously on changes
    }
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
      if (!file.type.startsWith('audio/')) {
        throw new Error("Invalid file type. Please upload an audio file.");
      }
      if (file.size > 20 * 1024 * 1024) {
        throw new Error("File size too large. Please upload a file smaller than 20MB.");
      }

      const base64 = await fileToBase64(file);
      const result = await analyzeAudioFile(base64, file.type);
      setAnalysisResult(result);
      showAlert('success', 'Audio analysis complete!');
    } catch (error: unknown) {
      logger.error("Audio analysis failed", error);
      if (error instanceof Error) {
        if (
          error.message === "File size too large. Please upload a file smaller than 20MB." ||
          error.message === "Invalid file type. Please upload an audio file."
        ) {
          showAlert('error', error.message);
        } else if (error.message === "Invalid file type. Please upload an audio file.") {
          showAlert('error', error.message);
        } else {
          showAlert('error', 'Failed to analyze audio. An unexpected error occurred.');
        }
      } else {
        showAlert('error', 'Failed to analyze audio. An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeUrl = async (url: string) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setAlert(null);

    try {
      const safeUrl = validateAndNormalizeUrl(url);

      const result = await analyzeLink(safeUrl);
      setAnalysisResult(result);
      showAlert('success', 'Link analysis complete!');
    } catch (error: unknown) {
      logger.error("Link analysis failed", error);
      if (error instanceof Error) {
        if (
          error.message === "Invalid URL protocol. Only http and https are allowed." ||
          error.message === "Invalid URL format." ||
          error.message.startsWith("Unauthorized domain.")
        ) {
          showAlert('error', error.message);
        } else {
          showAlert('error', 'Failed to analyze link. An unexpected error occurred.');
        }
      } else {
        showAlert('error', 'Failed to analyze link. An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient-light ambient-light--warm" />
      <div className="ambient-light ambient-light--cool" />

      <div className="app-core">
        <header className="app-header animate-fade-in-down">
          <div className="brand-badge">
            <Waves size={18} />
            <span className="mono">
              SONIC<span className="brand-mark">STYLE</span> ANALYZER
            </span>
            <span className="brand-led" aria-hidden="true" />
          </div>
          <h1 className="page-title">Sonic Style Console</h1>
          <p className="page-subtitle">
            Upload a track or paste a link to generate a producer-grade style readout, complete with timing, instrumentation, and a model-ready prompt.
          </p>
        </header>

        {alert && (
          <div className={`alert-toast alert-toast--${alert.type} animate-slide-in-right`}>
            <AlertCircle size={18} />
            <span>{alert.message}</span>
          </div>
        )}

        <main className="main-deck">
          <InputSection
            onAnalyzeFile={handleAnalyzeFile}
            onAnalyzeUrl={handleAnalyzeUrl}
            isLoading={isLoading}
            onError={(msg) => showAlert('error', msg)}
          />

          {isLoading && (
            <div className="loading-state animate-fade-in-up">
              <div className="loading-ring">
                <Sparkles size={22} />
              </div>
              <h3 className="loading-title">Analyzing Sonic Characteristics</h3>
              <p className="loading-subtitle">Parsing rhythm, timbre, mood, and arrangement details.</p>
            </div>
          )}

          {!isLoading && analysisResult && (
            <section className="analysis-stack animate-fade-in-up">
              <div className="section-head">
                <h2 className="section-title">Analysis Report</h2>
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="text-link"
                >
                  Analyze Another Track
                </button>
              </div>
              <AnalysisResult
                data={analysisResult}
                onSave={addToLibrary}
              />
            </section>
          )}

          {!isLoading && (
            <Library
              items={library}
              onDelete={removeFromLibrary}
              onLoad={loadFromLibrary}
            />
          )}
        </main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} SonicStyle Analyzer. Powered by Gemini 3 Flash.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
