import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Copy, Check, Sparkles, Heart, X, Edit3 } from 'lucide-react';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  customName?: string;
  onUpdateName?: (name: string) => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({
  isOpen,
  onClose,
  customName = "",
  onUpdateName
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

  const letterText = `Mi amor${customName ? ` ${customName}` : ""}:
Estas flores amarillas son como tú: brillantes, radiantes y llenas de alegría.
Gracias por iluminar cada uno de mis días. Eres simplemente hermosa.
Te amo mucho.`;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 no-raycast"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg parchment-paper rounded-2xl p-8 sm:p-10 text-stone-900 border-2 border-[#D4AF37] shadow-2xl transition-all duration-400 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Esquinas ornamentales estilo filigrana */}
        <span className="absolute top-3 left-4 text-[#B45309] text-xl select-none opacity-80">❦</span>
        <span className="absolute top-3 right-4 text-[#B45309] text-xl select-none opacity-80 scale-x-[-1]">❦</span>
        <span className="absolute bottom-3 left-4 text-[#B45309] text-xl select-none opacity-80 scale-y-[-1]">❦</span>
        <span className="absolute bottom-3 right-4 text-[#B45309] text-xl select-none opacity-80 scale-[-1]">❦</span>

        {/* Sello de cera dorado */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 border-2 border-amber-200 flex items-center justify-center shadow-lg shadow-amber-900/40 cursor-pointer hover:scale-105 transition-transform"
             onClick={handleTriggerSparkles}
             title="Toca para destellos de amor">
          <span className="text-amber-100 text-2xl font-serif">❦</span>
        </div>

        {/* Botón de cerrar superior */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-amber-800 transition-colors p-1 rounded-full"
          title="Cerrar"
        >
          <X size={20} />
        </button>

        {/* Encabezado de la carta */}
        <div className="text-center mt-3 mb-6">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-semibold mb-2">
            <span>Septiembre</span>
            <span>·</span>
            <span>Flores Amarillas</span>
          </div>

          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center justify-center gap-2 mt-2">
              <span className="font-serif-display text-2xl font-bold text-amber-950">Mi amor,</span>
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
                className="px-2.5 py-1 text-xs bg-amber-700 text-amber-50 rounded hover:bg-amber-800 font-sans-ui"
              >
                Listo
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2 group">
              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-amber-950 tracking-tight">
                Mi amor{customName ? `, ${customName}` : ""}
              </h2>
              <button
                onClick={() => setIsEditingName(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-700 hover:text-amber-900"
                title="Personalizar nombre"
              >
                <Edit3 size={16} />
              </button>
            </div>
          )}

          {/* Divisor dorado */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
            <span className="text-[#D4AF37] text-xs tracking-widest">✦ ❀ ✦</span>
            <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
          </div>
        </div>

        {/* Mensaje de la carta requerido */}
        <div className="text-center font-garamond text-xl sm:text-2xl text-amber-950 leading-relaxed space-y-4 my-6 px-2 sm:px-4">
          <p className="font-medium">
            Estas flores amarillas son como tú: <span className="text-amber-800 italic font-semibold">brillantes, radiantes y llenas de alegría.</span>
          </p>
          <p>
            Gracias por iluminar cada uno de mis días. Eres simplemente hermosa.
          </p>
          <div className="pt-2">
            <span className="font-script text-3xl sm:text-4xl font-bold text-amber-800 block text-shadow-sm">
              Te amo mucho.
            </span>
          </div>
        </div>

        {/* Pie de carta con acciones */}
        <div className="mt-8 pt-4 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-900 hover:bg-amber-100/70 border border-amber-300 transition-colors"
              title="Copiar texto de la carta"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? "¡Copiada!" : "Copiar mensaje"}</span>
            </button>
            <button
              onClick={handleTriggerSparkles}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-900 hover:bg-amber-100/70 border border-amber-300 transition-colors"
              title="Lanzar flores y destellos"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>Destellos</span>
            </button>
          </div>

          {/* Botón principal de Cerrar */}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-100 font-sans-ui text-sm font-semibold tracking-wide shadow-md transition-all hover:shadow-lg active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
