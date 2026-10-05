import React from 'react';
import { X, Trash2, Calendar, ShieldCheck, ArrowRight, Sparkles, Plus, AlertCircle } from 'lucide-react';
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
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 bg-[#FAF9F5]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-amber-900 font-semibold">
                  {curationMode === 'stylist' ? 'Curadoria Personal Shopper' : 'Seleção Própria'}
                </span>
                <h2 className="font-editorial text-2xl font-medium text-stone-900">
                  Sua Mala Digital
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
              <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5 font-medium">
                <span>Capacidade da mala:</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {malaItems.length} de {MAX_MALA_ITEMS} peças
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-stone-900 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(malaItems.length / MAX_MALA_ITEMS) * 100}%` }}
                />
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {remainingSlots > 0 ? (
                  <span>Você ainda pode adicionar mais {remainingSlots} {remainingSlots === 1 ? 'peça' : 'peças'}.</span>
                ) : (
                  <span className="text-amber-800 font-medium">Mala completa com o número ideal para provar em casa!</span>
                )}
              </div>
            </div>

            {/* Stylist note snippet if curated */}
            {curationMode === 'stylist' && stylistNote && (
              <div className="mt-3 p-2.5 rounded bg-amber-50 border border-amber-200/70 text-[11px] text-stone-700 italic">
                <div className="font-semibold text-amber-900 not-italic mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Nota da Consultora:</span>
                </div>
                "{stylistNote.slice(0, 140)}..."
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {malaItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-editorial text-xl text-stone-800 font-medium">
                    Sua mala está vazia
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    Navegue pela loja e adicione até {MAX_MALA_ITEMS} peças femininas para experimentar em sua casa por 48 horas.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenQuiz();
                    }}
                    className="w-full py-2.5 px-4 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Quero que a Consultora Escolha por Mim</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 px-4 bg-white border border-stone-300 text-stone-700 rounded text-xs font-medium hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Ver Catálogo da Coleção
                  </button>
                </div>
              </div>
            ) : (
              malaItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded border border-stone-200 bg-white space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-20 object-cover rounded bg-stone-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-medium text-stone-900 leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          title="Remover peça"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {item.product.category} · {item.product.fabric}
                      </div>

                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-stone-900 tabular-nums">
                          R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Size selector */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[11px] text-stone-500">Tam. principal:</span>
                        <select
                          value={item.selectedSize}
                          onChange={(e) => onUpdateSize(item.product.id, e.target.value)}
                          className="text-xs bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5 font-medium text-stone-800 focus:outline-none focus:border-stone-900 cursor-pointer"
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

                  {/* Backup size checkbox for fitting peace of mind */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <label className="flex items-center gap-1.5 text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.requestSecondarySize || false}
                        onChange={() => onToggleSecondarySize(item.product.id)}
                        className="rounded border-stone-300 text-stone-900 focus:ring-0"
                      />
                      <span>Enviar tamanho reserva para comparar</span>
                    </label>
                    {item.requestSecondarySize && item.secondarySize && (
                      <span className="text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded font-medium">
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
            <div className="p-6 border-t border-stone-200 bg-[#FAF9F5] space-y-4">
              {/* Consignment explanation */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Valor das {malaItems.length} peças na mala:</span>
                  <span className="text-sm font-semibold text-stone-900 tabular-nums">
                    R$ {totalConsignado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-[11px] text-stone-600 bg-stone-100 p-2.5 rounded border border-stone-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Consignação Segura:</strong> Você não paga nada agora. Após 48h de prova no seu quarto, nossa equipe busca as peças restantes e gera o acerto apenas das que você amou.
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenAgendamento}
                className="w-full py-3.5 bg-stone-900 text-white rounded text-sm font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Agendar Entrega da Mala no Meu Endereço</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
