import React from 'react';
import { Sparkles, Check } from 'lucide-react';

export const TestimonialsExperience: React.FC = () => {
  const experiences = [
    {
      name: 'Camila Peixoto',
      role: 'Advogada & Cliente Jô Bolsas Glamour',
      city: 'São Paulo, SP',
      text: 'Não tenho tempo de passar horas em shopping e detesto as luzes duras de provador. A consultora da Jô Bolsas me enviou a bolsa de couro caramelo com o blazer de linho e uma cartinha com dicas de styling. Ficou perfeito com os saltos que eu já tinha no quarto e fiquei com os dois no mesmo dia!',
      lookKept: 'Ficou com: Bolsa Tote Caramelo & Blazer Linho',
    },
    {
      name: 'Heloísa Guimarães',
      role: 'Arquiteta & Designer de Interiores',
      city: 'Campinas, SP',
      text: 'O serviço de Mala em Casa da Jô Bolsas Glamour mudou minha relação com compras. Provar com calma no meu espelho com minhas bolsas e sapatos me deu 100% de segurança. As peças e bolsas são impecáveis e muito sofisticadas.',
      lookKept: 'Ficou com: Vestido Acetinado & Bolsa Tiracolo Dourada',
    },
    {
      name: 'Beatriz Mendonça',
      role: 'Empresária',
      city: 'São Paulo, SP',
      text: 'Passei na loja no sábado de manhã, escolhi as peças rapidinho e retirei a mala para provar durante o fim de semana. Foi maravilhoso experimentar tudo no meu quarto sem nenhuma pressa. Recomendo de olhos fechados!',
      lookKept: 'Ficou com: Bolsa Estruturada Noir & Trench Coat',
    },
  ];

  return (
    <section id="depoimentos" className="py-16 bg-[#FAF6F7] border-b border-[#F2DEE4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#B84E67] font-semibold block mb-2">
            A Experiência no Seu Closet
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#181316] font-medium">
            Por que nossas clientes amam a experiência Jô Bolsas Glamour
          </h2>
          <p className="text-[#5A4D54] text-sm mt-3">
            Depoimentos reais de mulheres que transformaram sua forma de experimentar bolsas e roupas com muito conforto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-[#F0D5DD] shadow-2xs flex flex-col justify-between hover:border-[#D87F95] transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-3.5 h-3.5 fill-[#D97D93] text-[#D97D93]" />
                  ))}
                </div>

                <p className="font-editorial text-[#2B2327] text-base italic leading-relaxed">
                  "{exp.text}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F8E9ED]">
                <div className="text-xs font-semibold text-[#181316]">{exp.name}</div>
                <div className="text-[11px] text-[#7A6B73]">{exp.role} · {exp.city}</div>
                <div className="text-[11px] text-[#B84E67] font-medium mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#B84E67]" />
                  <span>{exp.lookKept}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
