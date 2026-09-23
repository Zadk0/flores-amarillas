import React from 'react';
import { Volume2, VolumeX, RotateCw, Download, Sparkles, Eye } from 'lucide-react';

interface TopBarProps {
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onSelectCameraPreset: (preset: 'center' | 'overview' | 'top') => void;
  onOpenLetter: () => void;
  onOpenDownload: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isAudioPlaying,
  onToggleAudio,
  autoRotate,
  onToggleAutoRotate,
  onSelectCameraPreset,
  onOpenLetter,
  onOpenDownload
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-amber-500/15 bg-neutral-950/40 backdrop-blur-md">
      {/* Zone 1: Brand title wordmark */}
      <div className="flex items-center gap-2.5">
        <span className="text-amber-400 text-sm animate-pulse">✦</span>
        <button
          onClick={() => onSelectCameraPreset('center')}
          className="text-lg sm:text-xl font-serif-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 hover:opacity-90 transition-opacity"
        >
          Flores Amarillas
        </button>
      </div>

      {/* Zone 2: Navigation Links / View controls */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-amber-200/80">
        <button
          onClick={() => onSelectCameraPreset('center')}
          className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
        >
          <Eye size={13} />
          <span>Enfocar Flor</span>
        </button>
        <button
          onClick={() => onSelectCameraPreset('overview')}
          className="hover:text-amber-300 transition-colors"
        >
          Vista Cósmica
        </button>
        <button
          onClick={onToggleAutoRotate}
          className={`flex items-center gap-1.5 transition-colors ${
            autoRotate ? 'text-amber-400 font-semibold' : 'text-amber-200/70 hover:text-amber-300'
          }`}
        >
          <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
          <span>Giro {autoRotate ? 'Activado' : 'Pausado'}</span>
        </button>
        <button
          onClick={onToggleAudio}
          className={`flex items-center gap-1.5 transition-colors ${
            isAudioPlaying ? 'text-amber-400 font-semibold' : 'text-amber-200/70 hover:text-amber-300'
          }`}
        >
          {isAudioPlaying ? <Volume2 size={14} className="text-amber-400 animate-pulse" /> : <VolumeX size={14} />}
          <span>{isAudioPlaying ? 'Música ON' : 'Música'}</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5">
        {/* En móvil: botón rápido de audio */}
        <button
          onClick={onToggleAudio}
          className="md:hidden p-2 rounded-full bg-neutral-900/60 border border-amber-500/20 text-amber-300"
          title="Música romántica"
        >
          {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Botón para descargar el código en 3 archivos (Requisito 5) */}
        <button
          onClick={onOpenDownload}
          className="px-3.5 py-1.5 text-xs font-medium text-amber-300/90 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/25 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          title="Descargar index.html, style.css y script.js"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Descargar Código</span>
          <span className="sm:hidden">Código</span>
        </button>

        {/* Botón "Para Ti" en el header para acceso rápido */}
        <button
          onClick={onOpenLetter}
          className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
        >
          <Sparkles size={13} />
          <span>Para Ti</span>
        </button>
      </div>
    </header>
  );
};
