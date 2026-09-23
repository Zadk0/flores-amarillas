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

      {/* 3. Indicador y botón interactivo destacado "PARA TI" en la base */}
      <div className="fixed bottom-6 left-0 right-0 z-20 flex flex-col items-center pointer-events-none px-4">
        {/* Guía de navegación sutil */}
        <div className="mb-4 text-center pointer-events-auto">
          <p className="text-xs sm:text-sm text-amber-200/60 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Gira con el mouse o dedo · Zoom con la rueda · Toca la flor central
          </p>
        </div>

        {/* Botón Destacado "Para Ti" con resplandor dorado */}
        <div className="pointer-events-auto">
          <button
            onClick={handleOpenLetter}
            className="group relative inline-flex items-center gap-3.5 px-8 sm:px-12 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-neutral-950 font-serif-display text-base sm:text-lg font-bold tracking-wide border-2 border-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_45px_rgba(245,158,11,0.75)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 font-serif">
              ❦
            </span>
            <span className="drop-shadow-sm font-semibold tracking-wider">
              Para Ti
            </span>
            <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-1000 group-hover:left-[100%]"></span>
            </span>
          </button>
        </div>
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
