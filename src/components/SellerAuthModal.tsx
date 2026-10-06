import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X, KeyRound, AlertCircle } from 'lucide-react';

interface SellerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  currentPin: string;
}

export const SellerAuthModal: React.FC<SellerAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  currentPin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === currentPin.trim()) {
      setErrorMessage(null);
      setPinInput('');
      onAuthenticated();
    } else {
      setErrorMessage('PIN/Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-[#F2DEE4] animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[#F2DEE4] bg-[#FAF6F7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#181316] text-[#F5BAC7] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B84E67] block">
                Acesso Restrito
              </span>
              <h3 className="font-editorial text-lg font-medium text-[#181316]">
                Área da Vendedora Josy
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[#5A4D54] leading-relaxed">
            Área protegida para a vendedora Josy montar malas e gerenciar pedidos das clientes com privacidade.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#181316]">
              Digite sua Senha / PIN de Acesso
            </label>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                required
                placeholder="Digite o PIN de acesso"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full text-sm pl-9 pr-10 py-2.5 border border-[#F0D5DD] rounded-xl focus:outline-none focus:border-[#B84E67] focus:ring-1 focus:ring-[#B84E67]"
              />

              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                aria-label={showPin ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMessage ? (
              <div className="flex items-center gap-1.5 text-xs text-red-600 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : (
              <span className="text-[11px] text-[#7A6B73] block pt-0.5">
                Senha inicial padrão: <strong className="text-[#181316]">josy2026</strong>
              </span>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-xs font-medium hover:bg-stone-50 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#181316] text-[#FAF6F7] hover:bg-[#2A2025] rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F5BAC7]" />
              <span>Acessar Painel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
