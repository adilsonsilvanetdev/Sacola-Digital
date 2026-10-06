import React from 'react';
import { ArrowRight, ShieldCheck, Clock, RefreshCw, ShoppingBag, Sparkles, UserCheck } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenSellerArea?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onOpenSellerArea }) => {
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

              {onOpenSellerArea && (
                <button
                  onClick={onOpenSellerArea}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#B84E67] border border-[#F0D5DD] rounded-lg hover:bg-[#FDF2F4] transition-colors text-sm font-semibold cursor-pointer shadow-2xs"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Área da Vendedora Josy</span>
                </button>
              )}
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

          {/* Right Column: Hero Fashion Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-xl overflow-hidden border border-[#F2DEE4] shadow-md bg-white aspect-[16/10] sm:aspect-[16/11]">
              <img
                src={HERO_IMAGE}
                alt="Showroom Jô Bolsas Glamour com bolsas, malas e roupas para provador em casa"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141113]/85 via-[#141113]/30 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-wider text-[#F5BAC7] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5BAC7]" />
                  <span>Jô Bolsas Glamour · Atendimento da Josy</span>
                </div>
                <div className="font-editorial text-xl sm:text-2xl mt-1 text-white font-medium">
                  Peças e bolsas selecionadas no cabide, higienizadas e prontas para você brilhar.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
