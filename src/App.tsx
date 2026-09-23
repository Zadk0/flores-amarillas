/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { LetterModal, LetterDetail } from './components/LetterModal';
import { DownloadModal } from './components/DownloadModal';
import { WelcomeNote } from './components/WelcomeNote';
import { romanticAudio } from './utils/audio';

export default function App() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [showWelcomeNote, setShowWelcomeNote] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'center' | 'overview' | 'top' | null>(null);
  const [customName, setCustomName] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<LetterDetail | null>(null);

  useEffect(() => {
    romanticAudio.init((playing) => {
      setIsAudioPlaying(playing);
    });
  }, []);

  const handleToggleAudio = () => {
    romanticAudio.toggle();
    setIsAudioPlaying(romanticAudio.getIsPlaying());
  };

  const handleOpenLetter = (detail?: LetterDetail) => {
    if (detail) {
      setSelectedLetter(detail);
    } else {
      setSelectedLetter({
        title: "Para ti mi amor",
        tagline: "FLORES AMARILLAS",
        message: "Eres la mujer de mis sueños, siempre quiero estar a tu lado"
      });
    }
    setIsLetterOpen(true);
    // Iniciar suavemente la música si no estaba sonando al interactuar
    if (!romanticAudio.getIsPlaying()) {
      romanticAudio.play();
    }
  };

  const handleCloseLetter = () => {
    setIsLetterOpen(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070401] text-amber-50 select-none font-sans-ui">
      {/* 1. Lienzo Three.js 3D a pantalla completa */}
      <ThreeCanvas
        onOpenLetter={handleOpenLetter}
        autoRotate={autoRotate}
        cameraPreset={cameraPreset}
        onPresetReset={() => setCameraPreset(null)}
      />

      {/* Recuadro de bienvenida sobrepuesto morado claro */}
      {showWelcomeNote && (
        <WelcomeNote onClose={() => setShowWelcomeNote(false)} />
      )}

      {/* Botón flotante discreto de música */}
      <button
        onClick={handleToggleAudio}
        className={`fixed bottom-6 right-6 z-30 p-3 rounded-full border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
          isAudioPlaying
            ? 'border-amber-400/50 bg-amber-950/60 text-amber-300 shadow-amber-500/20 hover:bg-amber-900/70'
            : 'border-white/15 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/70'
        }`}
        title={isAudioPlaying ? 'Silenciar música' : 'Reproducir música'}
        aria-label="Control de música"
      >
        {isAudioPlaying ? (
          <Volume2 size={18} className="animate-pulse text-amber-300" />
        ) : (
          <VolumeX size={18} />
        )}
      </button>

      {/* 3. Indicador y botón interactivo "Para Ti" en la base - diseño limpio y simple */}
      <div className="fixed bottom-7 left-0 right-0 z-20 flex flex-col items-center pointer-events-none px-4">
        {/* Botón Central Simple y Elegante "Para Ti" */}
        <div className="pointer-events-auto">
          <button
            onClick={() => handleOpenLetter()}
            className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-amber-400/90 hover:bg-amber-300 text-neutral-950 font-serif-display text-base font-semibold tracking-wide shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-amber-900 group-hover:scale-110 transition-transform">❦</span>
            <span>Para Ti</span>
          </button>
        </div>

        {/* Guía muy discreta */}
        <p className="mt-3 text-[11px] sm:text-xs text-white/40 tracking-wider font-light">
          Toca cualquier rosa o texto para leer su mensaje
        </p>
      </div>

      {/* 4. Modal de la Carta Romántica */}
      <LetterModal
        isOpen={isLetterOpen}
        onClose={handleCloseLetter}
        customName={customName}
        onUpdateName={setCustomName}
        letterDetail={selectedLetter}
      />

      {/* 5. Modal de Descarga de Código Independiente (Requisito 5) */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </div>
  );
}
