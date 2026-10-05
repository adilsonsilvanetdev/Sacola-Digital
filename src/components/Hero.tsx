import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';

interface HeroProps {
  onOpenQuiz: () => void;
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuiz, onExploreCatalog }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs tracking-widest uppercase font-semibold text-amber-900/80">
              O Provador Mais Elegante é o Seu Próprio Closet
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-900 leading-[1.12] text-balance">
              Sua mala de roupas entregue em casa para experimentar com calma.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl">
              Escolha suas peças favoritas ou deixe que nossa consultora de estilo monte uma seleção sob medida para seu biotipo e rotina. Você tem 48 horas para provar com seus sapatos e espelho. Pague apenas o que decidir guardar.
            </p>

            {/* Direct Dual Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenQuiz}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-stone-900 text-stone-50 rounded hover:bg-stone-800 transition-colors text-sm font-medium shadow-sm group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 transition-transform group-hover:scale-110" />
                <span>Curadoria da Consultora de Estilo</span>
              </button>

              <button
                onClick={onExploreCatalog}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-stone-800 border border-stone-300 rounded hover:bg-stone-50 transition-colors text-sm font-medium cursor-pointer"
              >
                <span>Eu Quero Escolher Minhas Peças</span>
                <ArrowRight className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            {/* Trust and Comfort Metrics without fake pills */}
            <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-stone-900 text-sm font-medium">
                  <Clock className="w-4 h-4 text-stone-700 shrink-0" />
                  <span>48h de prova</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                  Sem pressa de provador
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-stone-900 text-sm font-medium">
                  <RefreshCw className="w-4 h-4 text-stone-700 shrink-0" />
                  <span>Retirada grátis</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                  Buscamos o que não ficar
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-stone-900 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
                  <span>Pague só o que amar</span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                  Cobrança após devolução
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Fashion Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-lg overflow-hidden border border-stone-200 shadow-md bg-stone-100 aspect-[16/10] sm:aspect-[16/11]">
              <img
                src={HERO_IMAGE}
                alt="Showroom Bella Roupas & Acessórios com araras e mala de entrega"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-wider text-stone-300 font-medium">
                  Atendimento Personalizado
                </div>
                <div className="font-editorial text-xl sm:text-2xl mt-1 text-white font-medium">
                  Peças selecionadas no cabide, higienizadas e prontas para vestir.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
