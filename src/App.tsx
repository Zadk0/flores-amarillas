/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { TopBar } from './components/TopBar';
import { LetterModal, LetterDetail } from './components/LetterModal';
import { DownloadModal } from './components/DownloadModal';
import { romanticAudio } from './utils/audio';

export default function App() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
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
        title: "Mi amor",
        tagline: "Septiembre de Flores Amarillas",
        textParagraph1: "Estas flores amarillas son como tú: brillantes, radiantes y llenas de alegría.",
        textParagraph2: "Gracias por iluminar cada uno de mis días. Eres simplemente hermosa.",
        signature: "Te amo mucho."
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#060402] text-amber-50 select-none font-sans-ui">
      {/* 1. Lienzo Three.js 3D a pantalla completa */}
      <ThreeCanvas
        onOpenLetter={handleOpenLetter}
        autoRotate={autoRotate}
        cameraPreset={cameraPreset}
        onPresetReset={() => setCameraPreset(null)}
      />

      {/* 2. Top Bar conforme al contrato de diseño */}
      <TopBar
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        onSelectCameraPreset={(preset) => setCameraPreset(preset)}
        onOpenLetter={handleOpenLetter}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

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
