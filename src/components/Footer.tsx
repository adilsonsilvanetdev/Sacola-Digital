import React from 'react';
import { MessageCircle, MapPin, Clock, CreditCard } from 'lucide-react';
import { JoBolsasLogo } from './JoBolsasLogo';
import { STORE_WHATSAPP_NUMBER, STORE_WHATSAPP_DISPLAY } from '../utils/whatsappHelper';

interface FooterProps {
  onOpenSellerArea?: () => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.32a6.32 6.32 0 0 0-.86-.06A6.34 6.34 0 0 0 3.1 15.6a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.58a8.28 8.28 0 0 0 4.81 1.54V6.69z" />
  </svg>
);

const PixIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.47 16.53l-4.59-4.59 4.59-4.59c.2-.2.2-.51 0-.71l-1.41-1.41a.5.5 0 00-.71 0l-4.59 4.59-4.59-4.59a.5.5 0 00-.71 0L4.05 6.64a.5.5 0 000 .71l4.59 4.59-4.59 4.59a.5.5 0 000 .71l1.41 1.41c.2.2.51.2.71 0l4.59-4.59 4.59 4.59c.2.2.51.2.71 0l1.41-1.41a.5.5 0 000-.71z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-[#141113] text-[#F0D5DD] text-xs py-12 lg:py-14 border-t border-[#2A2025]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-[#2A2025]">
          
          {/* Coluna 1: Marca & Redes Sociais */}
          <div className="space-y-4 min-w-0">
            {/* Logo com tamanho reduzido para não sobrepor outras colunas */}
            <div className="overflow-hidden">
              <JoBolsasLogo variant="full" size="sm" theme="dark" />
            </div>

            <p className="text-[#BFA8B1] text-xs leading-relaxed max-w-xs">
              Bolsas sofisticadas, moda feminina, acessórios elegantes e provador no conforto do seu closet.
            </p>

            {/* Redes Sociais com ícones e links solicitados */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-white uppercase tracking-wider block">
                Siga Nossas Redes
              </span>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.instagram.com/jo_bolsas__glamour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#E2CCD4] hover:text-[#F5BAC7] transition-colors group"
                  title="Instagram: @jo_bolsas__glamour"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#251E22] border border-[#3A2D35] flex items-center justify-center text-[#F5BAC7] group-hover:border-[#F5BAC7]/50 group-hover:scale-105 transition-all">
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-medium">@jo_bolsas__glamour</span>
                </a>

                <a
                  href="https://www.tiktok.com/@jobolsasglamurdemulher"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#E2CCD4] hover:text-[#F5BAC7] transition-colors group"
                  title="TikTok: jobolsasglamurdemulher"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#251E22] border border-[#3A2D35] flex items-center justify-center text-[#F5BAC7] group-hover:border-[#F5BAC7]/50 group-hover:scale-105 transition-all">
                    <TikTokIcon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-medium">@jobolsasglamurdemulher</span>
                </a>
              </div>
            </div>
          </div>

          {/* Coluna 2: Serviços Exclusivos */}
          <div className="space-y-2.5 min-w-0">
            <h4 className="text-white font-semibold tracking-wider uppercase text-[11px] mb-3">
              Serviços Exclusivos
            </h4>
            <ul className="space-y-2 text-[#BFA8B1]">
              <li>
                <a href="#como-funciona" className="hover:text-[#F5BAC7] transition-colors">
                  Mala/Sacola Digital (Provador 48h)
                </a>
              </li>
              <li>
                <a href="#colecao" className="hover:text-[#F5BAC7] transition-colors">
                  Acesse a Loja & Catálogo
                </a>
              </li>
              <li>
                <a href="#promocoes" className="hover:text-[#F5BAC7] transition-colors flex items-center gap-1.5 font-semibold text-[#F5BAC7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                  Promoções & Peças Especiais
                </a>
              </li>
              <li>
                <span className="text-[#8E7C85]">Mala Delivery Particular</span>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Localização em Bauru & Horários */}
          <div className="space-y-3 min-w-0">
            <h4 className="text-white font-semibold tracking-wider uppercase text-[11px] mb-3">
              Loja Física em Bauru
            </h4>
            <div className="space-y-2.5 text-[#BFA8B1]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F5BAC7] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="text-white font-medium block text-xs">Jô Bolsas Glamour</span>
                  <span className="text-[#E2CCD4] block mt-0.5">Rua: Dr José Ranieri N 5-28, Bauru - SP</span>
                  <span className="text-[11px] text-[#A6939B] block mt-0.5">
                    Retirada presencial ou envio para Bauru e região
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#F5BAC7] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="text-white font-medium block text-xs">Horário de Atendimento</span>
                  <span className="text-[#E2CCD4] block mt-0.5">Segunda a Sábado, das 09h às 19h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 4: Atendimento WhatsApp & Formas de Pagamento */}
          <div className="space-y-3.5 min-w-0">
            <h4 className="text-white font-semibold tracking-wider uppercase text-[11px]">
              Atendimento com Josy
            </h4>
            <p className="text-[#BFA8B1] leading-relaxed">
              Dúvidas sobre peças, compras no WhatsApp ou agendamento de mala? Fale direto conosco.
            </p>
            
            <a
              href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá Josy da Jô Bolsas Glamour! Gostaria de informações sobre produtos e compras.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#251E22] hover:bg-[#32282E] text-[#F9D6DF] hover:text-white rounded-xl border border-[#F2BAC7]/30 transition-colors w-full justify-center text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{STORE_WHATSAPP_DISPLAY}</span>
            </a>

            {/* Formas de Pagamento: Cartões Débito, Crédito e PIX */}
            <div className="pt-2 border-t border-[#2A2025]">
              <span className="text-white font-semibold tracking-wider uppercase text-[10px] block mb-2">
                Formas de Pagamento
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#E8D1D8]">
                <span className="px-2.5 py-1 rounded-lg bg-[#251E22] border border-[#3A2D35] flex items-center gap-1.5 font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-[#F5BAC7]" />
                  <span>Crédito</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#251E22] border border-[#3A2D35] flex items-center gap-1.5 font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-[#F5BAC7]" />
                  <span>Débito</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#251E22] border border-[#3A2D35] flex items-center gap-1.5 font-medium">
                  <PixIcon className="w-3.5 h-3.5 text-[#32BCAD]" />
                  <span>PIX</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Rodapé inferior com endereço e direitos */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[#8A7981] text-[11px] gap-4">
          <p>
            © {new Date().getFullYear()} Jô Bolsas Glamour · Rua: Dr José Ranieri N 5-28, Bauru - SP. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span>Privacidade & Termos</span>
            <span>Segurança de Dados</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
