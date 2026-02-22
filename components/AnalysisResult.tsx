import React from 'react';
import { MusicAnalysis } from '../types';
import { Music, Activity, Disc, Mic2, Sliders, Copy, Check } from 'lucide-react';

interface AnalysisResultProps {
  data: MusicAnalysis;
  onSave?: (data: MusicAnalysis) => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onSave }) => {
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(data.generationPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Info */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Disc className="text-brand-500 animate-spin-slow" />
              {data.title || "Unknown Track"}
            </h2>
            <p className="text-slate-400 text-lg">{data.artist || "Unknown Artist"}</p>
          </div>
          <div className="flex gap-3 items-center">
             <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-900/50 text-brand-100 border border-brand-700 text-sm font-mono">
                {data.genre}
                </span>
                {data.subGenre && (
                <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600 text-sm font-mono">
                    {data.subGenre}
                </span>
                )}
             </div>
             {onSave && (
               <button 
                 onClick={handleSave}
                 disabled={saved}
                 className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                   saved 
                     ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                     : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                 }`}
               >
                 {saved ? 'Saved!' : 'Save to Library'}
               </button>
             )}
          </div>
        </div>
        
        <p className="mt-4 text-slate-300 leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Technical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">BPM</p>
            <p className="text-xl font-mono text-white">{data.bpm}</p>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <Music size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Key</p>
            <p className="text-xl font-mono text-white">{data.key}</p>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
            <Mic2 size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Vocals</p>
            <p className="text-sm font-medium text-white truncate max-w-[100px]">{data.vocalStyle || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
            <Sliders size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Signature</p>
            <p className="text-xl font-mono text-white">{data.timeSignature}</p>
          </div>
        </div>
      </div>

      {/* Instruments & Moods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Instrumentation</h3>
          <ul className="space-y-2">
            {data.instruments.map((inst, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                {inst}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Mood & Production</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.mood.map((m, i) => (
              <span key={i} className="px-2 py-1 text-xs font-medium rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {m}
              </span>
            ))}
          </div>
          <div className="space-y-2">
             {data.productionTechniques.map((tech, i) => (
              <p key={i} className="text-sm text-slate-400 italic">
                 ✨ {tech}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Generation Prompt Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-brand-500/30 rounded-xl p-6 shadow-lg shadow-brand-900/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <Disc size={100} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-3">
             <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
               AI Generation Prompt
             </h3>
             <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors border border-slate-600"
             >
               {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
               {copied ? 'Copied!' : 'Copy Prompt'}
             </button>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-slate-300 border border-white/5 leading-relaxed">
            {data.generationPrompt}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Use this prompt in MusicLM, Suno, Udio, or other music generation tools to create a track with this style.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
