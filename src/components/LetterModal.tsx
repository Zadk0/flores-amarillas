import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Copy, Check, Sparkles, Heart, X, Edit3 } from 'lucide-react';

export interface LetterDetail {
  title?: string;
  tagline?: string;
  message: string;
}

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  customName?: string;
  onUpdateName?: (name: string) => void;
  letterDetail?: LetterDetail | null;
}

export const LetterModal: React.FC<LetterModalProps> = ({
  isOpen,
  onClose,
  customName = "",
  onUpdateName,
  letterDetail = null
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(customName);

  // Efecto de lluvia dorada con destellos morados al abrirse la carta (amarillo preponderante)
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 75,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#FBBF24', '#F59E0B', '#FFFBEB', '#FEF08A', '#EAB308', '#C084FC', '#9333EA'],
          shapes: ['circle']
        });
      } catch (err) {
        console.warn("Confetti error", err);
      }
    }
  }, [isOpen]);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentMessage = letterDetail?.message || "Eres la mujer de mis sueños, siempre quiero estar a tu lado";
  const currentTagline = letterDetail?.tagline || "FLORES AMARILLAS";
  const currentGreeting = letterDetail?.title || "Para ti";

  const letterText = customName 
    ? `${currentGreeting}, ${customName}:\n\n"${currentMessage}"` 
    : `"${currentMessage}"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleTriggerSparkles = () => {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FBBF24', '#F59E0B', '#FEF3C7']
    });
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateName) {
      onUpdateName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity duration-300 no-raycast"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl p-8 sm:p-10 text-stone-900 border border-amber-300/40 shadow-2xl transition-all duration-400 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar superior */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors p-1.5 rounded-full hover:bg-stone-200/50 cursor-pointer"
          title="Cerrar"
        >
          <X size={18} />
        </button>

        {/* Encabezado de la carta */}
        <div className="text-center mt-1 mb-5">
          <div className="text-[11px] tracking-widest text-amber-700/80 uppercase font-medium mb-1.5">
            {currentTagline}
          </div>

          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center justify-center gap-2 mt-2">
              <span className="font-serif-display text-2xl font-bold text-amber-950">{currentGreeting},</span>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Nombre de ella..."
                className="border-b-2 border-amber-600 bg-transparent px-2 py-0.5 text-xl font-serif-display text-amber-900 outline-none text-center max-w-[170px]"
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1 text-xs bg-amber-700 text-amber-50 rounded hover:bg-amber-800 font-sans-ui cursor-pointer"
              >
                Listo
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 group">
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {currentGreeting}{customName ? `, ${customName}` : ""}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 hover:text-amber-800 cursor-pointer"
                title="Personalizar nombre"
              >
                <Edit3 size={15} />
              </button>
            </div>
          )}

          {/* Divisor sutil y simple */}
          <div className="w-12 h-0.5 bg-amber-400/50 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Mensaje con la frase romántica solicitada */}
        <div className="text-center font-serif-display my-8 px-2 sm:px-6">
          <p className="text-xl sm:text-2xl italic font-semibold text-stone-900 leading-relaxed tracking-wide">
            "{currentMessage}"
          </p>
        </div>

        {/* Pie de carta con acciones */}
        <div className="mt-8 pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-300 transition-colors cursor-pointer"
              title="Copiar texto de la carta"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? "¡Copiada!" : "Copiar mensaje"}</span>
            </button>
            <button
              onClick={handleTriggerSparkles}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:bg-stone-100 border border-stone-300 transition-colors cursor-pointer"
              title="Lanzar flores y destellos"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>Destellos</span>
            </button>
          </div>

          {/* Botón principal de Cerrar */}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans-ui text-xs font-medium tracking-wide shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
