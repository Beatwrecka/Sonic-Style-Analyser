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
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
        alert('Please upload an audio file.');
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
    <section className="hw-module input-module">
      <div className="mode-switch">
        <button
          onClick={() => setMode('file')}
          className={`mode-tab ${mode === 'file' ? 'is-active' : ''}`}
        >
          <UploadCloud size={18} />
          Upload Audio
        </button>
        <button
          onClick={() => setMode('url')}
          className={`mode-tab ${mode === 'url' ? 'is-active' : ''}`}
        >
          <LinkIcon size={18} />
          YouTube / Spotify
        </button>
      </div>

      <div className="input-panel-body">
        {mode === 'file' ? (
          <form onSubmit={handleSubmit} className="stack-form">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`drop-well ${dragActive ? 'is-drag' : ''} ${selectedFile ? 'has-file' : ''}`}
            >
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="drop-input"
                disabled={isLoading}
              />

              <div className="drop-content">
                {selectedFile ? (
                  <div className="animate-fade-in-up">
                    <div className="drop-knob">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="drop-title">{selectedFile.name}</p>
                    <p className="drop-subtitle mono">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p className="drop-detail">Drop a new file or click to replace</p>
                  </div>
                ) : (
                  <div>
                    <div className="drop-knob">
                      <Music size={32} />
                    </div>
                    <p className="drop-title">Drag and drop audio file</p>
                    <p className="drop-subtitle">or click to browse your local tracks</p>
                    <p className="drop-detail">Supports MP3, WAV, AAC, FLAC</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="panel-button panel-button--accent action-key"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Audio File'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="stack-form">
            <div className="url-group">
              <label htmlFor="url-input" className="url-label">
                Paste Link (YouTube, Spotify, SoundCloud)
              </label>
              <div className="url-field">
                <Youtube className="url-icon" />
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="url-input"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="url-help">
                Online metadata and context are used to build the style profile for link-based analysis.
              </p>
            </div>

            <button
              type="submit"
              disabled={!url || isLoading}
              className="panel-button panel-button--accent action-key"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Link'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default InputSection;
