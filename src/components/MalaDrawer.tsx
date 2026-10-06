import React from 'react';
import { X, Trash2, Calendar, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { MalaItem } from '../types';
import { MAX_MALA_ITEMS } from '../data/products';

interface MalaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  malaItems: MalaItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateSize: (productId: string, newSize: string) => void;
  onToggleSecondarySize: (productId: string) => void;
  onOpenAgendamento: () => void;
  onOpenQuiz: () => void;
  curationMode: 'self' | 'stylist';
  stylistNote?: string;
}

export const MalaDrawer: React.FC<MalaDrawerProps> = ({
  isOpen,
  onClose,
  malaItems,
  onRemoveItem,
  onUpdateSize,
  onToggleSecondarySize,
  onOpenAgendamento,
  onOpenQuiz,
  curationMode,
  stylistNote,
}) => {
  if (!isOpen) return null;

  const totalConsignado = malaItems.reduce((acc, item) => acc + item.product.price, 0);
  const remainingSlots = MAX_MALA_ITEMS - malaItems.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#F2DEE4] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#F2DEE4] bg-[#FAF6F7]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#B84E67] font-semibold">
                  {curationMode === 'stylist' ? 'Curadoria Personal Shopper' : 'Sua Seleção'}
                </span>
                <h2 className="font-editorial text-2xl font-medium text-[#181316]">
                  Mala Jô Bolsas Glamour
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                aria-label="Fechar mala"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Capacity Counter Indicator */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-[#5A4D54] mb-1.5 font-medium">
                <span>Capacidade da mala:</span>
                <span className="font-semibold text-[#181316] tabular-nums">
                  {malaItems.length} de {MAX_MALA_ITEMS} peças e bolsas
                </span>
              </div>
              <div className="w-full bg-[#F0D5DD] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#B84E67] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(malaItems.length / MAX_MALA_ITEMS) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-[#7A6B73] mt-1">
                {remainingSlots > 0 ? (
                  <span>Você ainda pode adicionar mais {remainingSlots} {remainingSlots === 1 ? 'item' : 'itens'}.</span>
                ) : (
                  <span className="text-[#B84E67] font-medium">Mala completa com o número ideal para provar em casa!</span>
                )}
              </div>
            </div>

            {/* Stylist note snippet if curated */}
            {curationMode === 'stylist' && stylistNote && (
              <div className="mt-3 p-2.5 rounded-lg bg-[#FDF2F4] border border-[#F2DEE4] text-[11px] text-[#5A4D54] italic">
                <div className="font-semibold text-[#B84E67] not-italic mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#B84E67]" />
                  <span>Nota da Consultora:</span>
                </div>
                "{stylistNote.slice(0, 140)}..."
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {malaItems.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-stone-500 text-sm">
                  Sua mala ainda está vazia.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#181316] text-[#FAF6F7] rounded-lg text-xs font-medium hover:bg-[#2A2025] transition-colors cursor-pointer"
                >
                  Explorar Bolsas & Roupas
                </button>
              </div>
            ) : (
              malaItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl border border-[#F0D5DD] bg-[#FAF6F7]/60 space-y-2.5 hover:border-[#D87F95] transition-colors"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-20 object-cover object-center rounded-lg bg-stone-100 shrink-0 border border-[#F0D5DD]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#181316] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-[#B84E67] transition-colors p-1 cursor-pointer shrink-0"
                          title="Remover da mala"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#7A6B73] mt-0.5">
                        Cor: {item.product.color}
                      </div>

                      <div className="text-xs font-semibold text-[#181316] mt-1 tabular-nums">
                        R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>

                      <div className="mt-1.5 flex items-center gap-2">
                        <label className="text-[11px] text-[#5A4D54]">Tam:</label>
                        <select
                          value={item.selectedSize}
                          onChange={(e) => onUpdateSize(item.product.id, e.target.value)}
                          className="text-xs bg-white border border-[#F0D5DD] rounded-md px-1.5 py-0.5 font-medium text-[#181316] focus:outline-none focus:border-[#B84E67] cursor-pointer"
                        >
                          {item.product.sizes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Backup size checkbox */}
                  <div className="pt-2 border-t border-[#F0D5DD] flex items-center justify-between text-[11px]">
                    <label className="flex items-center gap-1.5 text-[#5A4D54] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.requestSecondarySize || false}
                        onChange={() => onToggleSecondarySize(item.product.id)}
                        className="rounded border-[#F0D5DD] text-[#B84E67] focus:ring-0"
                      />
                      <span>Enviar tamanho reserva para provar</span>
                    </label>
                    {item.requestSecondarySize && item.secondarySize && (
                      <span className="text-[#B84E67] bg-[#FDF2F4] px-1.5 py-0.5 rounded font-medium border border-[#F2DEE4]">
                        Tam. {item.secondarySize}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Scheduling Action */}
          {malaItems.length > 0 && (
            <div className="p-6 border-t border-[#F2DEE4] bg-[#FAF6F7] space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-[#5A4D54]">
                  <span>Total em consignação ({malaItems.length} itens):</span>
                  <span className="text-sm font-semibold text-[#181316] tabular-nums">
                    R$ {totalConsignado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-[11px] text-[#5A4D54] bg-white p-2.5 rounded-lg border border-[#F2DEE4]">
                  <ShieldCheck className="w-4 h-4 text-[#B84E67] shrink-0 mt-0.5" />
                  <span>
                    <strong>Consignação Segura:</strong> Sem cobrança antecipada. Você tem 48h para provar tudo no seu quarto e acerta apenas as peças e bolsas que decidir ficar!
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenAgendamento}
                className="w-full py-3.5 bg-[#181316] text-[#FAF6F7] rounded-xl text-sm font-medium hover:bg-[#2A2025] border border-[#F2BAC7]/30 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs group"
              >
                <Calendar className="w-4 h-4 text-[#F5BAC7]" />
                <span>Agendar Minha Mala (Entrega ou Retirada)</span>
                <ArrowRight className="w-4 h-4 text-[#F5BAC7] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
