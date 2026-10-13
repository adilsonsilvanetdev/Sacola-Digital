import React from 'react';
import { ShoppingBag, Sparkles, Home, CheckCircle2, MessageCircle } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '../utils/whatsappHelper';

interface HowItWorksProps {
  onExploreCatalog: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onExploreCatalog }) => {
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

        {/* Showcase Visual & Action Callout: Imagem 2 da Loja com a Experiência da Mala */}
        <div className="mt-12 rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF9FA] to-[#FAF3F5] border border-[#F2DEE4] shadow-md grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 relative h-64 sm:h-72 lg:h-full min-h-[260px] overflow-hidden group">
            <img
              src="/images/jo_bolsas_boutique_hallway_1791846824164.jpg"
              alt="Corredor do showroom Jô Bolsas Glamour de Mulher com vestidos, bolsas e balcão de atendimento"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141113]/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5BAC7] bg-[#141113]/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#F2BAC7]/30 inline-block mb-1">
                Showroom Físico · Balcão & Acervo
              </span>
              <p className="text-xs text-white/90 font-medium">
                Retire sua mala pronta ou solicite entrega no conforto da sua casa.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#B84E67]">
                Mala Provador Digital Particular
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#181316]">
                Monte sua mala com até 15 peças e experimente sem compromisso por 48 horas.
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4D54] leading-relaxed">
                Todas as peças são higienizadas com carinho pela Josy, com tamanhos reservas e bolsas selecionadas. Experimente com seus próprios sapatos e acessórios antes de decidir.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F0D5DD]">
              <button
                onClick={onExploreCatalog}
                className="px-5 py-3 bg-[#181316] text-[#FAF6F7] rounded-xl text-xs font-semibold hover:bg-[#2A2025] border border-[#F2BAC7]/30 transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#F5BAC7]" />
                <span>Escolher Peças para a Mala</span>
              </button>
              <a
                href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá Josy! Gostaria de tirar uma dúvida sobre a Mala Jô Bolsas Glamour.')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 bg-white text-[#B84E67] border border-[#F0D5DD] rounded-xl text-xs font-medium hover:bg-[#FDF2F4] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Tirar Dúvida no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
