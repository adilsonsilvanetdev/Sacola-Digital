import React from 'react';
import { ShoppingBag, Sparkles, Home, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  onOpenQuiz: () => void;
  onExploreCatalog: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenQuiz, onExploreCatalog }) => {
  const steps = [
    {
      num: '01',
      title: 'Você Escolhe ou Pede Curadoria',
      description: 'Navegue pelo nosso acervo de peças femininas ou responda ao quiz rápido para que nossa consultora monte sua mala com peças que combinam com seu biotipo e rotina.',
      icon: ShoppingBag,
    },
    {
      num: '02',
      title: 'Entregamos no Seu Endereço',
      description: 'Sua mala exclusiva é enviada higienizada, com as peças nos cabides e opções de tamanhos reservas para você testar com total tranquilidade.',
      icon: Home,
    },
    {
      num: '03',
      title: '48 Horas de Provador no seu Closet',
      description: 'Prove as peças com seus próprios sapatos, bolsas, maquiagem e na luz natural do seu espelho. Sem filas, sem luzes artificiais e sem pressa de vendedor.',
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'Retiramos e Você só Paga o que Amar',
      description: 'Nosso portador busca as peças que não vestiram tão bem. O acerto é feito de forma 100% digital apenas para o que você decidiu incluir no seu armário.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="como-funciona" className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-900/80 font-semibold block mb-2">
            Como Funciona a Mala Digital
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium text-balance">
            O conforto do shopping, sem precisar sair de casa.
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            Criada especialmente para mulheres que valorizam tempo, conforto e caimento impecável.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded border border-stone-200 bg-[#FAF9F5] flex flex-col justify-between hover:border-stone-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial text-2xl font-semibold text-amber-900">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-stone-700" />
                  </div>
                  <h3 className="text-base font-semibold text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dual Mode Switch Callout */}
        <div className="mt-12 p-6 rounded-lg bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-semibold text-stone-900">
              Qual das duas experiências você prefere hoje?
            </h4>
            <p className="text-xs sm:text-sm text-stone-600">
              Você pode selecionar pessoalmente peça a peça, ou receber a seleção pensada pela nossa Personal Shopper.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenQuiz}
              className="px-4 py-2.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Pedir Curadoria da Vendedora</span>
            </button>
            <button
              onClick={onExploreCatalog}
              className="px-4 py-2.5 bg-white text-stone-900 border border-stone-300 rounded text-xs font-medium hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span>Escolher Minhas Peças</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
