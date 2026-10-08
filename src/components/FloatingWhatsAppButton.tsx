import React, { useState } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { STORE_WHATSAPP_NUMBER, STORE_WHATSAPP_DISPLAY } from '../utils/whatsappHelper';

interface FloatingWhatsAppButtonProps {
  hasActiveMalaItems?: boolean;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  hasActiveMalaItems = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const defaultMessage = encodeURIComponent(
    'Olá Josy da Jô Bolsas Glamour! Gostaria de consultar peças, valores e compras pelo WhatsApp.'
  );

  return (
    <aside
      aria-label="Atendimento via WhatsApp Jô Bolsas Glamour"
      className={`fixed right-4 sm:right-6 z-40 transition-all duration-300 pointer-events-auto ${
        hasActiveMalaItems ? 'bottom-24 sm:bottom-28' : 'bottom-6'
      }`}
    >
      <a
        href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 border border-white/20 cursor-pointer"
        title={`Falar no WhatsApp com a Josy: ${STORE_WHATSAPP_DISPLAY}`}
      >
        <WhatsAppIcon className="w-6 h-6 text-white shrink-0" />
        <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
          <span className="text-[10px] font-medium opacity-90 uppercase tracking-wider">
            Compre ou Tire Dúvidas
          </span>
          <span className="text-xs font-bold tracking-tight">
            {STORE_WHATSAPP_DISPLAY}
          </span>
        </div>
      </a>
    </aside>
  );
};
