import React, { useState, useEffect } from 'react';
import { Heart, X, Sparkles } from 'lucide-react';

interface WelcomeNoteProps {
  onClose?: () => void;
}

export const WelcomeNote: React.FC<WelcomeNoteProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Breve retraso suave de entrada para una transición natural
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  return (
    <div
      className={`fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-purple-100/90 dark:bg-purple-950/85 backdrop-blur-md border border-purple-300/80 shadow-2xl shadow-purple-950/40 p-5 sm:p-6 text-purple-950 dark:text-purple-100">
        {/* Adorno decorativo de luz sutil */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-300/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-fuchsia-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Botón de cerrar */}
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-purple-700 dark:text-purple-300 hover:text-purple-900 hover:bg-purple-200/60 dark:hover:bg-purple-900/60 transition-colors cursor-pointer"
          aria-label="Cerrar mensaje"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Contenido del recuadro */}
        <div className="flex items-start gap-3.5 pr-5">
          <div className="mt-0.5 p-2 rounded-xl bg-purple-200/80 dark:bg-purple-900/70 text-purple-700 dark:text-purple-300 shrink-0 shadow-inner">
            <Heart className="w-5 h-5 fill-purple-500 text-purple-600" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-purple-800 dark:text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
              <span>Un Mensaje Para Ti</span>
            </div>

            <p className="font-serif-display font-semibold text-sm sm:text-base text-purple-950 dark:text-purple-50 leading-snug">
              PERDON POR LA TARDANZA MI AMOR, PERO MÁS VALE TARDE QUE NUNCA
            </p>

            <p className="font-serif-display font-bold text-xs sm:text-sm text-purple-800 dark:text-purple-200 tracking-wide">
              TE AMO MUCHISIMO CHAPARRITA HERMOSA 💛
            </p>
          </div>
        </div>

        {/* Botoncito sutil para descartar */}
        <div className="mt-4 pt-3 border-t border-purple-200/70 dark:border-purple-800/60 flex justify-end">
          <button
            onClick={handleDismiss}
            className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-200/70 hover:bg-purple-300/80 dark:bg-purple-900/70 dark:hover:bg-purple-800 text-purple-900 dark:text-purple-100 transition-all cursor-pointer"
          >
            Entendido, mi amor 💕
          </button>
        </div>
      </div>
    </div>
  );
};
