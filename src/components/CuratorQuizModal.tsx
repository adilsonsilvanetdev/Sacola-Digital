import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ArrowLeft, Check, Heart } from 'lucide-react';
import { StylistQuizAnswers, MalaItem } from '../types';
import { generateStylistCuration, CurationResult } from '../utils/curationEngine';

interface CuratorQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCuration: (items: MalaItem[], quiz: StylistQuizAnswers, stylistNote: string) => void;
}

export const CuratorQuizModal: React.FC<CuratorQuizModalProps> = ({
  isOpen,
  onClose,
  onApplyCuration,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [answers, setAnswers] = useState<StylistQuizAnswers>({
    clientName: '',
    whatsapp: '',
    primaryStyle: 'Casual Elegante',
    occasion: 'Dia a Dia Prático & Chic',
    topSize: 'M',
    bottomSize: '38',
    palettePreference: 'Neutros & Terrosos',
    fitPreference: 'Modelagem Soltinha e Fluida',
    specificNotes: '',
  });

  const [curationResult, setCurationResult] = useState<CurationResult | null>(null);

  if (!isOpen) return null;

  const styleOptions: {
    title: StylistQuizAnswers['primaryStyle'];
    desc: string;
  }[] = [
    {
      title: 'Casual Elegante',
      desc: 'Peças práticas e refinadas que transitam facilmente entre compromissos diurnos e jantares descontraídos.',
    },
    {
      title: 'Alfaiataria Sofisticada',
      desc: 'Linhas retas, blazers estruturados, pantalonas fluidas e presença imponente com corte impecável.',
    },
    {
      title: 'Romântica & Fluida',
      desc: 'Vestidos em corte viés, tecidos esvoaçantes, detalhes botânicos e modelagens femininas que valorizam o movimento.',
    },
    {
      title: 'Moderna & Minimalista',
      desc: 'Design limpo, peças atemporais, assimetrias sutis e paleta refinada de alta versatilidade.',
    },
    {
      title: 'Festiva & Noite',
      desc: 'Brilho acetinado de seda, ombro único, recortes dramáticos e elegância para ocasiões especiais.',
    },
  ];

  const occasionOptions: StylistQuizAnswers['occasion'][] = [
    'Trabalho & Reuniões',
    'Dia a Dia Prático & Chic',
    'Jantar Especial',
    'Fim de Semana & Lazer',
    'Viagem & Resort',
  ];

  const paletteOptions: {
    title: StylistQuizAnswers['palettePreference'];
    colors: string[];
    desc: string;
  }[] = [
    {
      title: 'Neutros & Terrosos',
      colors: ['#E3DCD0', '#B85D43', '#D7C2AB', '#FAF8F5'],
      desc: 'Areia, linho cru, terracota, champanhe e amêndoa.',
    },
    {
      title: 'Preto & Branco / Minimal',
      colors: ['#181716', '#FAF8F5', '#8C857B'],
      desc: 'Preto noir profundo, off-white e fendi contemporâneo.',
    },
    {
      title: 'Tons Suaves & Pastel',
      colors: ['#93A492', '#B5CFE3', '#F7F3E8', '#F5C2CD'],
      desc: 'Sálvia botânico, azul celeste, champanhe e blush suave.',
    },
    {
      title: 'Cores Marcantes',
      colors: ['#1B4D3E', '#9C582B', '#B85D43'],
      desc: 'Verde esmeralda nobre, caramelo cognac e terracota.',
    },
  ];

  const handleFinishQuiz = () => {
    const result = generateStylistCuration(answers);
    setCurationResult(result);
    setStep(5);
  };

  const handleAcceptCuration = () => {
    if (curationResult) {
      onApplyCuration(curationResult.items, answers, curationResult.stylistNote);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-[#F2DEE4] animate-fadeIn">
        {/* Header bar */}
        <div className="p-6 border-b border-[#F2DEE4] bg-[#FAF6F7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B84E67]" />
            <div>
              <h2 className="font-editorial text-xl font-medium text-[#181316]">
                Curadoria Personal Shopper · Jô Bolsas Glamour
              </h2>
              <p className="text-xs text-[#7A6B73]">
                {step < 5 ? `Passo ${step} de 4 · Montando seu perfil de estilo` : 'Sua Mala sob Medida'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Style Vibe */}
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B84E67] font-semibold block mb-1">
                Passo 1
              </span>
              <h3 className="font-editorial text-2xl text-[#181316] font-medium">
                Qual estilo melhor define o que você busca nesta mala?
              </h3>
              <p className="text-[#5A4D54] text-xs sm:text-sm mt-1">
                Isso guiará a consultora na escolha das silhuetas, bolsas e dos tecidos.
              </p>
            </div>

            <div className="space-y-3">
              {styleOptions.map((opt) => (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => setAnswers({ ...answers, primaryStyle: opt.title })}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                    answers.primaryStyle === opt.title
                      ? 'border-[#B84E67] bg-[#FDF2F4] ring-1 ring-[#B84E67]'
                      : 'border-[#F0D5DD] hover:border-[#D87F95] bg-white'
                  }`}
                >
                  <div className="pr-4">
                    <div className="font-medium text-sm text-[#181316] flex items-center gap-2">
                      <span>{opt.title}</span>
                    </div>
                    <p className="text-xs text-[#5A4D54] mt-1 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                  {answers.primaryStyle === opt.title && (
                    <Check className="w-4 h-4 text-[#B84E67] shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#F2DEE4]">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#181316] text-[#FAF6F7] text-xs font-medium rounded-lg hover:bg-[#2A2025] border border-[#F2BAC7]/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Avançar para Ocasião</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F5BAC7]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Occasion */}
        {step === 2 && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B84E67] font-semibold block mb-1">
                Passo 2
              </span>
              <h3 className="font-editorial text-2xl text-[#181316] font-medium">
                Para quais ocasiões você precisa das peças e bolsas?
              </h3>
              <p className="text-[#5A4D54] text-xs sm:text-sm mt-1">
                Ajudará a calibrar o equilíbrio entre sofisticação formal e conforto.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {occasionOptions.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setAnswers({ ...answers, occasion: occ })}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    answers.occasion === occ
                      ? 'border-[#B84E67] bg-[#FDF2F4] ring-1 ring-[#B84E67]'
                      : 'border-[#F0D5DD] hover:border-[#D87F95] bg-white'
                  }`}
                >
                  <span className="text-sm font-medium text-[#181316]">{occ}</span>
                  {answers.occasion === occ && (
                    <Check className="w-4 h-4 text-[#B84E67]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F2DEE4]">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-[#5A4D54] text-xs font-medium hover:text-[#181316] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-[#181316] text-[#FAF6F7] text-xs font-medium rounded-lg hover:bg-[#2A2025] border border-[#F2BAC7]/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Avançar para Medidas & Cores</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F5BAC7]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sizing & Palette */}
        {step === 3 && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B84E67] font-semibold block mb-1">
                Passo 3
              </span>
              <h3 className="font-editorial text-2xl text-[#181316] font-medium">
                Seus tamanhos e preferências cromáticas
              </h3>
              <p className="text-[#5A4D54] text-xs sm:text-sm mt-1">
                Garantimos que a consultora envie o caimento perfeito no seu número.
              </p>
            </div>

            {/* Sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#181316] mb-2">
                  Tamanho Superior (Blusas, Blazers e Vestidos):
                </label>
                <div className="flex gap-2">
                  {(['PP', 'P', 'M', 'G', 'GG'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setAnswers({ ...answers, topSize: sz })}
                      className={`flex-1 py-2 text-xs rounded-lg border transition-colors cursor-pointer ${
                        answers.topSize === sz
                          ? 'bg-[#B84E67] text-white font-medium border-[#B84E67]'
                          : 'bg-white text-[#5A4D54] border-[#F0D5DD] hover:border-[#D87F95]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181316] mb-2">
                  Tamanho Inferior (Calças e Saias):
                </label>
                <div className="flex gap-1.5">
                  {(['36', '38', '40', '42', '44'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setAnswers({ ...answers, bottomSize: sz })}
                      className={`flex-1 py-2 text-xs rounded-lg border transition-colors cursor-pointer ${
                        answers.bottomSize === sz
                          ? 'bg-[#B84E67] text-white font-medium border-[#B84E67]'
                          : 'bg-white text-[#5A4D54] border-[#F0D5DD] hover:border-[#D87F95]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Palette */}
            <div>
              <label className="block text-xs font-semibold text-[#181316] mb-2">
                Cartela de cores favorita para experimentar:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paletteOptions.map((pal) => (
                  <button
                    key={pal.title}
                    type="button"
                    onClick={() => setAnswers({ ...answers, palettePreference: pal.title })}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      answers.palettePreference === pal.title
                        ? 'border-[#B84E67] bg-[#FDF2F4] ring-1 ring-[#B84E67]'
                        : 'border-[#F0D5DD] hover:border-[#D87F95] bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#181316]">{pal.title}</div>
                      <div className="text-[11px] text-[#7A6B73] mt-0.5">{pal.desc}</div>
                      <div className="flex gap-1.5 mt-2">
                        {pal.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-2xs"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    {answers.palettePreference === pal.title && (
                      <Check className="w-4 h-4 text-[#B84E67]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F2DEE4]">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-[#5A4D54] text-xs font-medium hover:text-[#181316] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 bg-[#181316] text-[#FAF6F7] text-xs font-medium rounded-lg hover:bg-[#2A2025] border border-[#F2BAC7]/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Avançar para Observações</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F5BAC7]" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Notes and Personal Contact */}
        {step === 4 && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B84E67] font-semibold block mb-1">
                Passo 4 de 4
              </span>
              <h3 className="font-editorial text-2xl text-[#181316] font-medium">
                Algum detalhe especial para sua consultora?
              </h3>
              <p className="text-[#5A4D54] text-xs sm:text-sm mt-1">
                Conte-nos sobre preferências de bolsas, estilo, altura ou peças que deseja evitar.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#181316] mb-1">
                  Seu Nome Completo:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mariana Silva"
                  value={answers.clientName}
                  onChange={(e) => setAnswers({ ...answers, clientName: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#181316] mb-1">
                  WhatsApp para contato e acompanhamento do provador:
                </label>
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={answers.whatsapp}
                  onChange={(e) => setAnswers({ ...answers, whatsapp: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#181316] mb-1">
                  Preferências adicionais para a consultora (opcional):
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Gostaria de uma bolsa estruturada para trabalho e um look para jantar; prefiro peças confortáveis..."
                  value={answers.specificNotes}
                  onChange={(e) => setAnswers({ ...answers, specificNotes: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F2DEE4]">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 text-[#5A4D54] text-xs font-medium hover:text-[#181316] flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 bg-[#181316] text-[#FAF6F7] text-xs font-medium rounded-lg hover:bg-[#2A2025] border border-[#F2BAC7]/30 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#F5BAC7]" />
                <span>Gerar Curadoria Personalizada</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Curation Reveal */}
        {step === 5 && curationResult && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="bg-[#FDF2F4] border border-[#F2DEE4] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#B84E67]">
                <Heart className="w-3.5 h-3.5 fill-[#B84E67] text-[#B84E67]" />
                <span>Curadoria da Consultora · Jô Bolsas Glamour</span>
              </div>
              <p className="font-editorial text-base text-[#181316] mt-2 italic leading-relaxed">
                "{curationResult.stylistNote}"
              </p>
              <div className="text-xs text-[#9C384E] mt-2 font-medium">
                Conceito: {curationResult.capsuleConcept}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-[#181316]">
                  {curationResult.items.length} Peças Selecionadas para o seu Provador em Casa:
                </h4>
                <span className="text-xs text-[#7A6B73]">
                  Tamanhos já ajustados ao seu perfil
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {curationResult.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-[#F0D5DD] bg-white"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover rounded-lg bg-stone-100 shrink-0 border border-[#F0D5DD]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#181316] truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-[#7A6B73] flex items-center gap-2 mt-0.5">
                        <span>Tam: <strong className="text-[#181316]">{item.selectedSize}</strong></span>
                        <span>·</span>
                        <span>{item.product.category}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-[#181316] tabular-nums">
                        R$ {item.product.price.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2DEE4] space-y-3">
              <button
                onClick={handleAcceptCuration}
                className="w-full py-3.5 bg-[#181316] text-[#FAF6F7] rounded-xl text-sm font-medium hover:bg-[#2A2025] border border-[#F2BAC7]/30 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#F5BAC7]" />
                <span>Carregar Esta Seleção na Minha Mala Digital</span>
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-xs text-[#7A6B73] hover:text-[#B84E67] cursor-pointer"
              >
                Refazer questionário com outras preferências
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
