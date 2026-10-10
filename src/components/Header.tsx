import React from 'react';
import { ShoppingBag, Lock, ArrowLeft, Check, Flame } from 'lucide-react';
import { MalaItem } from '../types';
import { MAX_MALA_ITEMS } from '../data/products';
import { JoBolsasLogo } from './JoBolsasLogo';

interface HeaderProps {
  malaItems: MalaItem[];
  onOpenMala: () => void;
  activeView: 'store' | 'dashboard';
  setActiveView: (view: 'store' | 'dashboard') => void;
  onOpenSellerAuth: () => void;
  isSellerAuthenticated: boolean;
  addedToastMessage?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  malaItems,
  onOpenMala,
  activeView,
  setActiveView,
  onOpenSellerAuth,
  isSellerAuthenticated,
  addedToastMessage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F7]/95 backdrop-blur-md border-b border-[#F2DEE4]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4 min-h-[120px]">
          
          {/* Zone 1: Brand Wordmark with Emblem Icon on the upper-left */}
          <button
            onClick={() => setActiveView('store')}
            className="text-left group cursor-pointer flex items-center"
            aria-label="Ir para página inicial Jô Bolsas Glamour"
          >
            <JoBolsasLogo variant="full" size="md" />
          </button>

          {/* Zone 2: Customer Navigation links (Strictly customer-facing) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5A4D54]">
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('colecao');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#B84E67] transition-colors cursor-pointer"
            >
              Acesse a Loja
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('como-funciona');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#B84E67] transition-colors cursor-pointer"
            >
              Mala/Sacola Digital
            </button>
            
            {/* Promoções com cor em destaque para colocar produtos especiais */}
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('promocoes');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#E11D48] via-[#BE123C] to-[#9F1239] text-white text-xs font-bold shadow-sm hover:from-[#BE123C] hover:to-[#881337] transition-all cursor-pointer ring-2 ring-[#FFE4E6]/80 hover:scale-105 active:scale-95"
              title="Acesse produtos especiais e promoções em destaque"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
              <span>Promoções</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-bold">
                Especiais
              </span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3">
            {/* If in dashboard mode, show return to store */}
            {activeView === 'dashboard' ? (
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  setActiveView('store');
                }}
                className="text-xs font-semibold px-3 py-2 bg-[#181316] text-[#FAF6F7] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar à Loja</span>
              </button>
            ) : (
              /* Discreet lock for seller Josy */
              <button
                onClick={onOpenSellerAuth}
                className="p-2 text-stone-400 hover:text-[#B84E67] hover:bg-[#FDF2F4] rounded-lg transition-colors cursor-pointer"
                title="Acesso Vendedora"
                aria-label="Acesso Vendedora"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}

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
