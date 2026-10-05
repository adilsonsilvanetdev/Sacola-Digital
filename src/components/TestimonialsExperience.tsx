import React from 'react';
import { Heart, Sparkles, Check } from 'lucide-react';

export const TestimonialsExperience: React.FC = () => {
  const experiences = [
    {
      name: 'Camila Peixoto',
      role: 'Advogada & Cliente Bella Roupas & Acessórios',
      city: 'São Paulo, SP',
      text: 'Não tenho tempo de passar horas em shopping e detesto as luzes duras de provador. A consultora mandou o blazer de linho e a calça de crepe com um bilhete sugerindo sapatos que eu já tinha. Ficou perfeito no meu corpo e comprei as duas peças no mesmo dia.',
      lookKept: 'Ficou com: Blazer de Alfaiataria & Calça Pantalona',
    },
    {
      name: 'Heloísa Guimarães',
      role: 'Arquiteta & Designer de Interiores',
      city: 'Campinas, SP',
      text: 'O serviço de Mala em Casa mudou minha relação com compras. Provar o vestido acetinado no meu quarto, com meu salto e acessórios me deu 100% de segurança de que a peça funcionava. O motorista veio buscar o que não coube sem nenhum constrangimento.',
      lookKept: 'Ficou com: Vestido Acetinado Terracota',
    },
    {
      name: 'Beatriz Mendonça',
      role: 'Empresária',
      city: 'São Paulo, SP',
      text: 'Fiz o quiz do site e a consultora Sofia entendeu exatamente meu estilo minimalista. Ela ainda mandou um tamanho reserva que me salvou, pois o M ficou bem mais bonito que o P. Atendimento impecável.',
      lookKept: 'Ficou com: Camisa em Seda & Trench Coat Oliva',
    },
  ];

  return (
    <section id="depoimentos" className="py-16 bg-[#FAF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold block mb-2">
            A Experiência no Seu Closet
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium">
            Por que nossas clientes não voltam mais ao provador de loja tradicional
          </h2>
          <p className="text-stone-600 text-sm mt-3">
            Ouvimos relatos reais de mulheres que transformaram seu modo de experimentar e comprar moda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg bg-white border border-stone-200/80 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-800">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                  ))}
                </div>

                <p className="font-editorial text-stone-800 text-base italic leading-relaxed">
                  "{exp.text}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100">
                <div className="text-xs font-semibold text-stone-900">{exp.name}</div>
                <div className="text-[11px] text-stone-500">{exp.role} · {exp.city}</div>
                <div className="text-[11px] text-amber-900 font-medium mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
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
