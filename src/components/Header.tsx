import React from 'react';
import { ShoppingBag, Sparkles, UserCheck, Check } from 'lucide-react';
import { MalaItem } from '../types';
import { MAX_MALA_ITEMS } from '../data/products';

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
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200">
      {/* Slim service top-bar notice */}
      <div className="bg-[#1C1917] text-stone-200 text-xs py-1.5 px-4 text-center tracking-wide">
        <span>Mala Delivery Exclusiva · Experimente até {MAX_MALA_ITEMS} peças por 48 horas em casa sem compromisso</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Single text element Brand Wordmark */}
          <button
            onClick={() => setActiveView('store')}
            className="text-left group cursor-pointer"
          >
            <span className="font-editorial text-2xl sm:text-3xl font-medium tracking-wide uppercase text-stone-900 block group-hover:text-stone-700 transition-colors">
              BELLA ROUPAS & ACESSÓRIOS
            </span>
          </button>

          {/* Zone 2: 4 Clean Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('colecao');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-stone-900 transition-colors"
            >
              Coleção Feminina
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('como-funciona');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-stone-900 transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 text-stone-900 hover:text-amber-800 transition-colors font-medium"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Curadoria da Consultora</span>
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                const el = document.getElementById('depoimentos');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-stone-900 transition-colors"
            >
              Experiência no Quarto
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            {/* Toggle Seller / Dashboard Mode */}
            <button
              onClick={() => setActiveView(activeView === 'store' ? 'dashboard' : 'store')}
              className={`text-xs font-medium px-3 py-2 rounded border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeView === 'dashboard'
                  ? 'bg-amber-800 text-white border-amber-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
              title="Alternar entre visão da cliente e painel da vendedora/estilista"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {activeView === 'store' ? 'Área da Vendedora' : 'Voltar à Loja'}
              </span>
            </button>

            {/* Bag Button */}
            <button
              onClick={onOpenMala}
              className="relative flex items-center gap-2 px-4 py-2 bg-stone-900 text-stone-50 rounded text-xs font-medium hover:bg-stone-800 transition-colors shadow-sm"
              aria-label="Abrir Mala Digital"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-medium">Minha Mala</span>
              <span className="bg-stone-700 text-white rounded-full px-1.5 py-0.2 text-[11px] tabular-nums font-semibold">
                {malaItems.length}/{MAX_MALA_ITEMS}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating feedback toast */}
      {addedToastMessage && (
        <div className="bg-stone-900 text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2 border-t border-stone-800 animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{addedToastMessage}</span>
          <button
            onClick={onOpenMala}
            className="underline underline-offset-2 ml-2 hover:text-stone-300 font-semibold cursor-pointer"
          >
            Abrir mala agora
          </button>
        </div>
      )}
    </header>
  );
};
