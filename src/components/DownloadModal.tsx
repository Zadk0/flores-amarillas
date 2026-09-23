import React, { useState } from 'react';
import { X, Download, FileCode, Check, Copy, ExternalLink } from 'lucide-react';
import {
  STANDALONE_INDEX_HTML,
  STANDALONE_STYLE_CSS,
  STANDALONE_SCRIPT_JS
} from '../utils/standaloneCode';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    downloadFile('index.html', STANDALONE_INDEX_HTML, 'text/html');
    setTimeout(() => {
      downloadFile('style.css', STANDALONE_STYLE_CSS, 'text/css');
    }, 200);
    setTimeout(() => {
      downloadFile('script.js', STANDALONE_SCRIPT_JS, 'text/javascript');
    }, 400);
  };

  const handleCopyCode = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const currentContent =
    activeTab === 'html'
      ? STANDALONE_INDEX_HTML
      : activeTab === 'css'
      ? STANDALONE_STYLE_CSS
      : STANDALONE_SCRIPT_JS;

  const currentFilename =
    activeTab === 'html' ? 'index.html' : activeTab === 'css' ? 'style.css' : 'script.js';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md no-raycast"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-neutral-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCode size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-amber-100 font-sans-ui">
                Descarga de Código Independiente
              </h2>
              <p className="text-xs text-amber-300/70 font-sans-ui">
                3 archivos limpios listos para abrir en cualquier navegador sin instalar nada
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-amber-300 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Botones de descarga rápida */}
        <div className="p-4 bg-neutral-900/90 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => downloadFile('index.html', STANDALONE_INDEX_HTML, 'text/html')}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-200 border border-amber-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download size={13} />
              <span>index.html</span>
            </button>
            <button
              onClick={() => downloadFile('style.css', STANDALONE_STYLE_CSS, 'text/css')}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-200 border border-amber-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download size={13} />
              <span>style.css</span>
            </button>
            <button
              onClick={() => downloadFile('script.js', STANDALONE_SCRIPT_JS, 'text/javascript')}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-200 border border-amber-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download size={13} />
              <span>script.js</span>
            </button>
          </div>

          <button
            onClick={handleDownloadAll}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-amber-900/30 transition-all active:scale-95"
          >
            <Download size={14} />
            <span>Descargar los 3 Archivos</span>
          </button>
        </div>

        {/* Pestañas de previsualización */}
        <div className="flex items-center justify-between px-6 pt-3 bg-neutral-950 border-b border-neutral-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'html'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              index.html
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'css'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              style.css
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'js'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              script.js (Three.js CDN)
            </button>
          </div>

          <button
            onClick={() => handleCopyCode(currentFilename, currentContent)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-400 hover:text-amber-300 hover:bg-neutral-800 rounded transition-colors mb-1"
          >
            {copiedFile === currentFilename ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copiedFile === currentFilename ? "Copiado" : `Copiar ${currentFilename}`}</span>
          </button>
        </div>

        {/* Visor de código */}
        <div className="p-4 bg-neutral-950 overflow-auto flex-1 font-mono text-xs leading-relaxed text-neutral-300 selection:bg-amber-900 selection:text-amber-100">
          <pre className="whitespace-pre">{currentContent}</pre>
        </div>

        {/* Pie con instrucciones */}
        <div className="px-6 py-3 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Solo coloca los 3 archivos en una misma carpeta y abre index.html.</span>
          <a
            href="/standalone/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:underline"
          >
            <span>Ver versión standalone en nueva pestaña</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};
