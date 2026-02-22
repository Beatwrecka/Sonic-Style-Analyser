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
    <div className="analysis-stack">
      <section className="hw-module analysis-summary">
        <div className="summary-top">
          <div>
            <h2 className="track-title">
              <Disc className="animate-spin-slow" size={20} />
              {data.title || 'Unknown Track'}
            </h2>
            <p className="track-artist">{data.artist || 'Unknown Artist'}</p>
          </div>

          <div className="summary-actions">
            <div className="summary-tags">
              <span className="status-tag status-tag--accent">{data.genre}</span>
              {data.subGenre && <span className="status-tag">{data.subGenre}</span>}
            </div>
            {onSave && (
              <button
                onClick={handleSave}
                disabled={saved}
                className={`panel-button ${saved ? '' : 'panel-button--accent'}`}
              >
                {saved ? 'Saved!' : 'Save to Library'}
              </button>
            )}
          </div>
        </div>

        <div className="display-window description-window">
          <p>{data.description}</p>
        </div>
      </section>

      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-knob metric-knob--accent">
            <Activity />
          </div>
          <div className="metric-meta">
            <span className="metric-label">BPM</span>
            <p className="metric-value mono">{data.bpm}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-knob">
            <Music />
          </div>
          <div className="metric-meta">
            <span className="metric-label">Key</span>
            <p className="metric-value mono">{data.key}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-knob">
            <Mic2 />
          </div>
          <div className="metric-meta">
            <span className="metric-label">Vocals</span>
            <p className="metric-value">{data.vocalStyle || 'N/A'}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-knob metric-knob--accent">
            <Sliders />
          </div>
          <div className="metric-meta">
            <span className="metric-label">Signature</span>
            <p className="metric-value mono">{data.timeSignature}</p>
          </div>
        </div>
      </section>

      <section className="details-grid">
        <article className="detail-card">
          <h3 className="detail-heading">Instrumentation</h3>
          <ul className="detail-list">
            {data.instruments.map((inst, i) => (
              <li key={i} className="detail-item">
                <span className="mini-led" />
                {inst}
              </li>
            ))}
          </ul>
        </article>

        <article className="detail-card">
          <h3 className="detail-heading">Mood & Production</h3>
          <div className="mood-tags">
            {data.mood.map((m, i) => (
              <span key={i} className="status-tag status-tag--dark">
                {m}
              </span>
            ))}
          </div>
          <div>
            {data.productionTechniques.map((tech, i) => (
              <p key={i} className="tech-line">● {tech}</p>
            ))}
          </div>
        </article>
      </section>

      <section className="hw-module prompt-module">
        <div className="prompt-head">
          <h3 className="prompt-title">AI Generation Prompt</h3>
          <button
            onClick={handleCopyPrompt}
            className="panel-button panel-button--ghost"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {' '}
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        </div>

        <div className="display-window prompt-window">
          <p className="prompt-body">{data.generationPrompt}</p>
          <p className="prompt-help">
            Use this in Suno, Udio, MusicLM, or any music model prompt field.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AnalysisResult;
