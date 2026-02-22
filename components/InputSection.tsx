import React, { useCallback, useState } from 'react';
import { UploadCloud, Link as LinkIcon, Music, Youtube, CheckCircle2 } from 'lucide-react';
import { AnalysisMode } from '../types';

interface InputSectionProps {
  onAnalyzeFile: (file: File) => void;
  onAnalyzeUrl: (url: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyzeFile, onAnalyzeUrl, isLoading }) => {
  const [mode, setMode] = useState<AnalysisMode>('file');
  const [url, setUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
      } else {
        alert("Please upload an audio file.");
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'file' && selectedFile) {
      onAnalyzeFile(selectedFile);
    } else if (mode === 'url' && url) {
      onAnalyzeUrl(url);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setMode('file')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            mode === 'file' 
              ? 'bg-slate-700/50 text-brand-400 border-b-2 border-brand-500' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <UploadCloud size={18} />
          Upload Audio
        </button>
        <button
          onClick={() => setMode('url')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            mode === 'url' 
              ? 'bg-slate-700/50 text-brand-400 border-b-2 border-brand-500' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <LinkIcon size={18} />
          YouTube / Spotify
        </button>
      </div>

      <div className="p-8">
        {mode === 'file' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
                dragActive 
                  ? 'border-brand-500 bg-brand-500/10' 
                  : selectedFile 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-slate-600 bg-slate-900/50 hover:border-slate-500'
              }`}
            >
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
              
              {selectedFile ? (
                <div className="text-center animate-fade-in">
                   <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-lg font-medium text-white mb-1">{selectedFile.name}</p>
                  <p className="text-sm text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p className="text-xs text-slate-500 mt-4">Click or drag to replace</p>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                    <Music size={32} />
                  </div>
                  <p className="text-lg font-medium text-white mb-2">Drag and drop audio file</p>
                  <p className="text-sm text-slate-400">or click to browse</p>
                  <p className="text-xs text-slate-500 mt-4">Supports MP3, WAV, AAC, FLAC</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedFile || isLoading}
              className={`w-full py-3.5 rounded-lg font-semibold text-white shadow-lg transition-all ${
                !selectedFile || isLoading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 hover:shadow-brand-500/20'
              }`}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Audio File'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="url-input" className="block text-sm font-medium text-slate-300">
                Paste Link (YouTube, Spotify, SoundCloud)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Youtube className="text-slate-500" size={20} />
                </div>
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="block w-full pl-10 pr-3 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-slate-500">
                The AI will use online data to analyze the track's characteristics.
              </p>
            </div>

            <button
              type="submit"
              disabled={!url || isLoading}
              className={`w-full py-3.5 rounded-lg font-semibold text-white shadow-lg transition-all ${
                !url || isLoading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 hover:shadow-brand-500/20'
              }`}
            >
               {isLoading ? 'Analyzing...' : 'Analyze Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InputSection;
