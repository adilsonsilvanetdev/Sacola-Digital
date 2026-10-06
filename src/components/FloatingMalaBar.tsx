import React from 'react';
import { ShoppingBag, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { MalaItem } from '../types';
import { MAX_MALA_ITEMS } from '../data/products';

interface FloatingMalaBarProps {
  malaItems: MalaItem[];
  onOpenMala: () => void;
  onOpenAgendamento: () => void;
}

export const FloatingMalaBar: React.FC<FloatingMalaBarProps> = ({
  malaItems,
  onOpenMala,
  onOpenAgendamento,
}) => {
  if (malaItems.length === 0) return null;

  const totalValue = malaItems.reduce((acc, item) => acc + item.product.price, 0);

  return (
    <aside
      aria-label="Barra flutuante de agendamento da mala Jô Bolsas Glamour"
      className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-30 px-3 sm:px-4 pointer-events-none"
    >
      <div className="max-w-2xl mx-auto bg-[#141113]/95 text-white backdrop-blur-md rounded-xl sm:rounded-full p-2.5 sm:p-2 sm:pl-5 border border-[#F2BAC7]/35 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-auto transition-all duration-300">
        
        {/* Left info: pieces counter & total value */}
        <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4 px-1 sm:px-0">
          <button
            onClick={onOpenMala}
            className="flex items-center gap-2 hover:text-[#F5BAC7] transition-colors cursor-pointer text-left"
            title="Clique para revisar as peças na mala"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#F5BAC7]" />
              <span className="absolute -top-1 -right-2 bg-[#B84E67] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {malaItems.length}
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold block leading-tight text-white">
                {malaItems.length} de {MAX_MALA_ITEMS} peças
              </span>
              <span className="text-[11px] text-[#F9D6DF] leading-tight font-medium">
                Consignação: R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </button>

          <span className="hidden md:inline-block h-6 w-px bg-[#2F262B]" aria-hidden="true" />

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#F9D6DF]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F5BAC7] shrink-0" />
            <span>48h de prova no closet</span>
          </div>
        </div>

        {/* Right action buttons: Ver Mala & Agendar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMala}
            className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium text-[#FCE7EB] hover:text-white hover:bg-[#2A2025] rounded-lg sm:rounded-full transition-colors cursor-pointer whitespace-nowrap"
          >
            Ver Peças
          </button>

          <button
            type="button"
            onClick={onOpenAgendamento}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-[#F5BAC7] hover:bg-[#F2A3B4] text-[#141113] font-semibold text-xs rounded-lg sm:rounded-full transition-all shadow hover:shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap group"
          >
            <Calendar className="w-3.5 h-3.5 text-[#141113]" />
            <span>Agendar Mala</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </aside>
  );
};
