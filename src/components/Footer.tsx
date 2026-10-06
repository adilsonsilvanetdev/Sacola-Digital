import React from 'react';
import { Sparkles, MessageCircle, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { JoBolsasLogo } from './JoBolsasLogo';

export const Footer: React.FC<{ onOpenQuiz: () => void }> = ({ onOpenQuiz }) => {
  return (
    <footer className="bg-[#141113] text-[#F0D5DD] text-xs py-14 border-t border-[#2A2025]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#2A2025]">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <JoBolsasLogo variant="full" size="md" theme="dark" />
            <p className="text-[#BFA8B1] text-xs leading-relaxed max-w-xs pt-1">
              Bolsas elegantes, acessórios e moda feminina contemporânea. Experimente suas peças e bolsas favoritas no conforto do seu closet por 48 horas.
            </p>
            <div className="flex items-center gap-2 text-[#F5BAC7] text-[11px] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#F5BAC7]" />
              <span>Consignação 100% Segura & Segurada</span>
            </div>
          </div>

          {/* Service Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold tracking-wider uppercase text-[11px] mb-3">
              Serviços Exclusivos
            </h4>
            <ul className="space-y-2 text-[#BFA8B1]">
              <li>
                <button
                  onClick={onOpenQuiz}
                  className="hover:text-[#F5BAC7] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#F5BAC7]" />
                  <span>Curadoria da Consultora de Estilo</span>
                </button>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-[#F5BAC7] transition-colors">
                  Como Funciona o Provador 48h
                </a>
              </li>
              <li>
                <a href="#colecao" className="hover:text-[#F5BAC7] transition-colors">
                  Catálogo de Bolsas & Peças
                </a>
              </li>
              <li>
                <span className="text-[#7A6A71]">Mala Delivery Corporativa (Em Breve)</span>
              </li>
            </ul>
          </div>

          {/* Delivery & Areas */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold tracking-wider uppercase text-[11px] mb-3">
              Atendimento & Região
            </h4>
            <div className="space-y-2 text-[#BFA8B1]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F5BAC7] shrink-0 mt-0.5" />
                <span>Entregas presenciais e retirada física na loja em São Paulo e região</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F5BAC7] shrink-0 mt-0.5" />
                <span>Segunda a Sábado: 09h às 19h</span>
              </div>
            </div>
          </div>

          {/* Direct Concierge Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold tracking-wider uppercase text-[11px] mb-2">
              Atendimento Glamour
            </h4>
            <p className="text-[#BFA8B1] text-xs">
              Dúvidas sobre modelos, cores ou retirada de malas? Fale direto com a nossa equipe:
            </p>
            <a
              href="https://wa.me/5511999998888?text=Olá Jô Bolsas Glamour! Gostaria de tirar uma dúvida sobre a Mala de Peças e Bolsas."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#251E22] hover:bg-[#32282E] text-[#FAF6F7] hover:text-[#F5BAC7] rounded-lg border border-[#F2BAC7]/30 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#F5BAC7]" />
              <span>WhatsApp: (11) 99999-8888</span>
            </a>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[#8A7880] text-[11px] gap-4">
          <p>© {new Date().getFullYear()} JÔ BOLSAS GLAMOUR. Todos os direitos reservados. Moda feminina & bolsas de luxo.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#F5BAC7] transition-colors cursor-pointer">Privacidade de Dados</span>
            <span>·</span>
            <span className="hover:text-[#F5BAC7] transition-colors cursor-pointer">Termos de Consignação</span>
            <span>·</span>
            <span className="hover:text-[#F5BAC7] transition-colors cursor-pointer">Regras de Higienização</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
