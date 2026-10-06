import React from 'react';
import { MessageCircle, MapPin, Clock, ShieldCheck, Lock } from 'lucide-react';
import { JoBolsasLogo } from './JoBolsasLogo';

interface FooterProps {
  onOpenSellerArea: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSellerArea }) => {
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
              <li className="pt-2">
                <button
                  onClick={onOpenSellerArea}
                  className="hover:text-[#F5BAC7] transition-colors cursor-pointer text-left flex items-center gap-1.5 text-[11px] text-[#A6939B]"
                  title="Acesso exclusivo para a equipe da loja"
                >
                  <Lock className="w-3 h-3 text-[#F5BAC7]" />
                  <span>Área da Equipe / Josy (Protegido por Senha)</span>
                </button>
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
                <MapPin className="w-3.5 h-3.5 text-[#F5BAC7] shrink-0 mt-0.5" />
                <span>
                  Retirada no balcão da loja física ou entregas na Grande São Paulo e região.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F5BAC7] shrink-0 mt-0.5" />
                <span>
                  Segunda a Sábado, das 09h às 19h (turnos manhã, tarde e noite).
                </span>
              </div>
            </div>
          </div>

          {/* Concierge & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold tracking-wider uppercase text-[11px]">
              Atendimento Direto com Josy
            </h4>
            <p className="text-[#BFA8B1] leading-relaxed">
              Dúvidas sobre o provador em casa ou ajuste da sua mala? Fale conosco no WhatsApp.
            </p>
            <a
              href="https://wa.me/5511999998888?text=Olá Josy da Jô Bolsas Glamour! Gostaria de tirar uma dúvida sobre a Mala Digital."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#251E22] hover:bg-[#32282E] text-[#F9D6DF] hover:text-white rounded-lg border border-[#F2BAC7]/30 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#F5BAC7]" />
              <span>WhatsApp da Loja</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[#8A7981] text-[11px] gap-4">
          <p>
            © {new Date().getFullYear()} Jô Bolsas Glamour. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span>Privacidade & Consignação</span>
            <span>Termos de Prova</span>
            <span>Segurança de Dados</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
