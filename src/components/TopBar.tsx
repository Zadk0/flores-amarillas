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
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5 sm:px-8 py-3.5 bg-neutral-950/20 backdrop-blur-sm transition-all">
      {/* Título minimalista */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSelectCameraPreset('center')}
          className="text-base sm:text-lg font-serif-display tracking-wider text-amber-200/90 hover:text-amber-100 transition-colors cursor-pointer"
        >
          Flores Amarillas
        </button>
      </div>

      {/* Controles simples y elegantes */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        {/* Giro automático */}
        <button
          onClick={onToggleAutoRotate}
          className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
            autoRotate
              ? 'border-amber-400/40 text-amber-300 bg-amber-950/20'
              : 'border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
          }`}
          title="Pausar o reanudar giro"
        >
          <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">{autoRotate ? 'Giro' : 'Pausado'}</span>
        </button>

        {/* Música */}
        <button
          onClick={onToggleAudio}
          className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
            isAudioPlaying
              ? 'border-amber-400/40 text-amber-300 bg-amber-950/20'
              : 'border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
          }`}
          title="Música de fondo"
        >
          {isAudioPlaying ? <Volume2 size={13} className="text-amber-300 animate-pulse" /> : <VolumeX size={13} />}
          <span className="hidden sm:inline">Música</span>
        </button>

        {/* Descargar Código */}
        <button
          onClick={onOpenDownload}
          className="px-3 py-1.5 rounded-full border border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Descargar archivos"
        >
          <Download size={13} />
          <span className="hidden md:inline">Descargar</span>
        </button>

        {/* Abrir carta */}
        <button
          onClick={onOpenLetter}
          className="px-4 py-1.5 rounded-full font-medium text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-sm shadow-amber-500/20 cursor-pointer"
        >
          <Sparkles size={13} />
          <span>Para Ti</span>
        </button>
      </div>
    </header>
  );
};
