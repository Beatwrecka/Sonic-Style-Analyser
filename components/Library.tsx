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
    <section className="library-stack animate-fade-in-up">
      <div className="library-head">
        <Database size={20} />
        <h2 className="section-title">Sonic Library</h2>
        <span className="status-tag library-count">{items.length}</span>
      </div>

      <div className="library-grid">
        {items.map((item, index) => (
          <article key={index} className="hw-module library-card">
            <div className="library-top">
              <div>
                <h3 className="library-title">{item.title || 'Untitled Track'}</h3>
                <p className="library-subtitle">{item.artist || 'Unknown Artist'}</p>
              </div>
              <div className="icon-row">
                <button
                  onClick={() => onLoad(item)}
                  className="icon-button"
                  title="Load Analysis"
                >
                  <Play size={16} />
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="icon-button icon-button--danger"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="chip-row">
              <span className="status-tag">{item.bpm} BPM</span>
              <span className="status-tag">{item.key}</span>
              <span className="status-tag status-tag--accent">{item.genre}</span>
            </div>

            <div className="prompt-preview">
              <p className="line-clamp-2">{item.generationPrompt}</p>
            </div>

            <button
              onClick={() => handleCopyPrompt(item.generationPrompt, index)}
              className="panel-button panel-button--ghost action-key"
            >
              {copiedIndex === index ? 'Copied!' : (
                <>
                  <Copy size={14} /> Copy Prompt
                </>
              )}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Library;
