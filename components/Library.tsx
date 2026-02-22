import React from 'react';
import { MusicAnalysis } from '../types';
import { Trash2, Copy, Play, Database } from 'lucide-react';

interface LibraryProps {
  items: MusicAnalysis[];
  onDelete: (index: number) => void;
  onLoad: (item: MusicAnalysis) => void;
}

const Library: React.FC<LibraryProps> = ({ items, onDelete, onLoad }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopyPrompt = (prompt: string, index: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        <Database className="text-brand-400" size={24} />
        <h2 className="text-2xl font-bold text-slate-200">Sonic Library</h2>
        <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">{items.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={index} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:border-brand-500/30 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-white truncate max-w-[200px]">{item.title || "Untitled Track"}</h3>
                <p className="text-sm text-slate-400 truncate max-w-[200px]">{item.artist || "Unknown Artist"}</p>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => onLoad(item)}
                  className="p-2 hover:bg-brand-500/20 text-slate-400 hover:text-brand-400 rounded-lg transition-colors"
                  title="Load Analysis"
                >
                  <Play size={16} />
                </button>
                <button 
                  onClick={() => onDelete(index)}
                  className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded border border-slate-600">
                {item.bpm} BPM
              </span>
              <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded border border-slate-600">
                {item.key}
              </span>
              <span className="text-xs bg-brand-900/30 text-brand-300 px-2 py-1 rounded border border-brand-800/30">
                {item.genre}
              </span>
            </div>

            <div className="bg-black/20 rounded p-2 mb-3">
               <p className="text-xs text-slate-400 line-clamp-2 font-mono">{item.generationPrompt}</p>
            </div>

            <button
              onClick={() => handleCopyPrompt(item.generationPrompt, index)}
              className="w-full py-2 flex items-center justify-center gap-2 text-xs font-medium bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              {copiedIndex === index ? (
                <>Copied!</>
              ) : (
                <>
                  <Copy size={14} /> Copy Prompt
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
