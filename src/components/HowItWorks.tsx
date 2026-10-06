import React from 'react';
import { ShoppingBag, Sparkles, Home, CheckCircle2, MessageCircle } from 'lucide-react';

interface HowItWorksProps {
  onExploreCatalog: () => void;
  onOpenSellerArea?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onExploreCatalog, onOpenSellerArea }) => {
  const steps = [
    {
      num: '01',
      title: 'Você Escolhe Suas Peças & Bolsas',
      description: 'Navegue pelo nosso acervo de bolsas e roupas femininas, selecione suas peças favoritas (até 15 itens) para experimentar com calma no seu quarto.',
      icon: ShoppingBag,
    },
    {
      num: '02',
      title: 'Entregamos ou Você Retira',
      description: 'Sua mala exclusiva é preparada pela Josy com todo o capricho, higienizada, com tamanhos reservas e bolsas selecionadas. Entregamos na sua casa ou você retira na loja!',
      icon: Home,
    },
    {
      num: '03',
      title: '48 Horas de Provador no seu Closet',
      description: 'Prove as peças e teste as bolsas com seus próprios sapatos, acessórios, maquiagem e na luz natural do seu espelho. Sem filas e sem pressa.',
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'Retiramos e Você só Paga o que Amar',
      description: 'Buscamos o que não servir. O acerto é feito de forma 100% prática via WhatsApp apenas pelas peças que você decidiu ficar.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="como-funciona" className="py-16 bg-white border-b border-[#F2DEE4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#B84E67] font-semibold block mb-2">
            Como Funciona a Mala Jô Bolsas Glamour
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#181316] font-medium text-balance">
            O conforto e glamour da loja no seu próprio quarto.
          </h2>
          <p className="text-[#5A4D54] text-sm sm:text-base mt-3">
            Criada para mulheres elegantes que valorizam praticidade, estilo e bom gosto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-xl border border-[#F2DEE4] bg-[#FDF9FA] flex flex-col justify-between hover:border-[#E598A9] hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial text-2xl font-semibold text-[#B84E67]">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-[#B84E67]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#181316] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A4D54] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="mt-12 p-6 rounded-xl bg-[#FAF6F7] border border-[#F2DEE4] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-semibold text-[#181316]">
              Pronta para montar a sua mala de provador?
            </h4>
            <p className="text-xs sm:text-sm text-[#5A4D54]">
              Você seleciona até 15 peças para receber em casa ou retirar no balcão da loja física.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExploreCatalog}
              className="px-5 py-2.5 bg-[#181316] text-[#FAF6F7] rounded-lg text-xs font-semibold hover:bg-[#2A2025] border border-[#F2BAC7]/30 transition-colors cursor-pointer shadow-xs"
            >
              <span>Explorar Coleção & Bolsas</span>
            </button>
            {onOpenSellerArea && (
              <button
                onClick={onOpenSellerArea}
                className="px-4 py-2.5 bg-white text-[#B84E67] border border-[#F0D5DD] rounded-lg text-xs font-medium hover:bg-[#FDF2F4] transition-colors cursor-pointer"
              >
                <span>Área da Josy (Vendedora)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
