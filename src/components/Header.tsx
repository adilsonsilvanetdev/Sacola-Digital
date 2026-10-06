import React from 'react';
import { ShoppingBag, Sparkles, UserCheck, Check } from 'lucide-react';
import { MalaItem } from '../types';
import { MAX_MALA_ITEMS } from '../data/products';
import { JoBolsasLogo } from './JoBolsasLogo';

interface HeaderProps {
  malaItems: MalaItem[];
  onOpenMala: () => void;
  onOpenQuiz: () => void;
  activeView: 'store' | 'dashboard';
  setActiveView: (view: 'store' | 'dashboard') => void;
  addedToastMessage?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  malaItems,
  onOpenMala,
  onOpenQuiz,
  activeView,
  setActiveView,
  addedToastMessage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F7]/95 backdrop-blur-md border-b border-[#F2DEE4]">
      {/* Slim service top-bar notice with luxury onyx & blush accent */}
      <div className="bg-[#141113] text-[#F9D6DF] text-xs py-1.5 px-4 text-center tracking-wide border-b border-[#2A2025]">
        <span className="font-light">
          Mala Delivery Exclusiva · Experimente até {MAX_MALA_ITEMS} bolsas e peças por 48h no seu quarto sem compromisso
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Zone 1: Brand Wordmark with Emblem Icon on the upper-left */}
          <button
            onClick={() => setActiveView('store')}
            className="text-left group cursor-pointer flex items-center"
            aria-label="Ir para página inicial Jô Bolsas Glamour"
          >
            <JoBolsasLogo variant="full" size="md" />
          </button>

          {/* Zone 2: Clean Navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A4D54]">
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('colecao');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#B84E67] transition-colors cursor-pointer"
            >
              Bolsas & Coleção
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('como-funciona');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#B84E67] transition-colors cursor-pointer"
            >
              Como Funciona
            </button>
            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 text-[#B84E67] hover:text-[#9A384F] transition-colors font-medium cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D96B85]" />
              <span>Curadoria de Estilo</span>
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('depoimentos');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#B84E67] transition-colors cursor-pointer"
            >
              Experiência no Quarto
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            {/* Toggle Seller / Dashboard Mode */}
            <button
              onClick={() => setActiveView(activeView === 'store' ? 'dashboard' : 'store')}
              className={`text-xs font-medium px-3 py-2 rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-[#B84E67] text-white border-[#B84E67] shadow-xs'
                  : 'bg-white text-[#5A4D54] border-[#F0D5DD] hover:bg-[#FDF2F4] hover:text-[#B84E67]'
              }`}
              title="Alternar entre visão da cliente e painel da vendedora"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {activeView === 'store' ? 'Área da Consultora' : 'Voltar à Loja'}
              </span>
            </button>

            {/* Mala Bag Button */}
            <button
              onClick={onOpenMala}
              className="relative flex items-center gap-2 px-4 py-2 bg-[#161214] text-[#FAF6F7] rounded-lg text-xs font-medium hover:bg-[#251E22] border border-[#F2BAC7]/30 transition-all shadow-sm cursor-pointer group"
              aria-label="Abrir Mala Digital"
            >
              <ShoppingBag className="w-4 h-4 text-[#F5BAC7] group-hover:scale-105 transition-transform" />
              <span className="font-medium">Minha Mala</span>
              <span className="bg-[#B84E67] text-white rounded-full px-1.5 py-0.2 text-[11px] tabular-nums font-semibold">
                {malaItems.length}/{MAX_MALA_ITEMS}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating feedback toast */}
      {addedToastMessage && (
        <div className="bg-[#161214] text-[#FAF6F7] text-xs py-2 px-4 text-center flex items-center justify-center gap-2 border-t border-[#F2BAC7]/30 animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-[#F5BAC7]" />
          <span>{addedToastMessage}</span>
          <button
            onClick={onOpenMala}
            className="underline underline-offset-2 ml-2 hover:text-[#F5BAC7] font-semibold cursor-pointer text-[#FAD7DF]"
          >
            Abrir mala agora
          </button>
        </div>
      )}
    </header>
  );
};
