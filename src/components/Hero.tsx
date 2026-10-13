import React from 'react';
import { ShieldCheck, Clock, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';

interface HeroProps {
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#F2DEE4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs tracking-widest uppercase font-semibold text-[#B84E67] flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#E594A7]" />
              <span>O Provador Mais Glamouroso é o Seu Próprio Closet</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#181316] leading-[1.12] text-balance">
              Sua mala de bolsas e looks entregue em casa para provar com calma.
            </h1>

            <p className="text-base sm:text-lg text-[#5A4D54] font-normal leading-relaxed max-w-xl">
              Escolha suas peças e bolsas favoritas para montar sua mala de provador particular. Você tem 48 horas para provar no seu espelho com tranquilidade. Pague apenas pelo que decidir guardar!
            </p>

            {/* Direct Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onExploreCatalog}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#181316] text-[#FAF6F7] rounded-lg hover:bg-[#2A2025] transition-colors text-sm font-medium shadow-sm border border-[#F2BAC7]/30 group cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#F5BAC7] transition-transform group-hover:scale-110" />
                <span>Escolher Minhas Peças na Coleção</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('como-funciona');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#4A3E44] border border-[#F0D5DD] rounded-lg hover:bg-[#FDF2F4] hover:text-[#B84E67] transition-colors text-sm font-medium cursor-pointer shadow-2xs"
              >
                <span>Como Funciona o Provador</span>
                <ArrowRight className="w-4 h-4 text-[#B84E67]" />
              </button>
            </div>

            {/* Trust and Comfort Metrics */}
            <div className="pt-6 border-t border-[#F2DEE4] grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-[#181316] text-sm font-medium">
                  <Clock className="w-4 h-4 text-[#B84E67] shrink-0" />
                  <span>48h de prova</span>
                </div>
                <p className="text-xs text-[#7A6B73] mt-0.5 leading-snug">
                  Sem pressa de provador
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#181316] text-sm font-medium">
                  <RefreshCw className="w-4 h-4 text-[#B84E67] shrink-0" />
                  <span>Retirada ou entrega</span>
                </div>
                <p className="text-xs text-[#7A6B73] mt-0.5 leading-snug">
                  Balcão ou na sua porta
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#181316] text-sm font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#B84E67] shrink-0" />
                  <span>Pague só o que amar</span>
                </div>
                <p className="text-xs text-[#7A6B73] mt-0.5 leading-snug">
                  Acerto após as 48 horas
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Fashion Visual Showcase (Foto Principal ao lado da tela inicial) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#F2DEE4] shadow-lg bg-stone-900 aspect-[4/3] group select-none">
              <img
                src={HERO_IMAGE}
                alt="Foto principal da loja Jô Bolsas Glamour de Mulher"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
              />
              
              {/* Subtle elegant gradient only at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#141113]/80 via-[#141113]/25 to-transparent pointer-events-none" />
              
              {/* Caption Tag */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-white">
                <div className="text-[11px] sm:text-xs uppercase tracking-wider text-[#F5BAC7] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F5BAC7] animate-pulse" />
                  <span>Jô Bolsas · Glamour de Mulher</span>
                </div>
                <div className="font-editorial text-base sm:text-xl mt-0.5 text-white font-medium leading-snug drop-shadow-xs">
                  Nosso espaço exclusivo com acervo completo de bolsas e looks.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
