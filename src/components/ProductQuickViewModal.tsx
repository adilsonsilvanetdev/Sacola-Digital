import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, Ruler, Pencil, Flame, Info, Clock } from 'lucide-react';
import { Product } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buildProductPurchaseWhatsAppLink, STORE_WHATSAPP_DISPLAY, STORE_WHATSAPP_NUMBER } from '../utils/whatsappHelper';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isInMala: boolean;
  onAddToMala: (product: Product, size: string) => void;
  onRemoveFromMala: (productId: string) => void;
  isMalaFull: boolean;
  onEditProduct?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  isInMala,
  onAddToMala,
  onRemoveFromMala,
  isMalaFull,
  onEditProduct,
}) => {
  if (!product) return null;

  const isBagOrWallet =
    product.category.toLowerCase().includes('bolsa') ||
    product.category.toLowerCase().includes('carteira') ||
    (product.sizes && product.sizes.includes('CM')) ||
    Boolean(product.dimensionsCm);

  const defaultSize = isBagOrWallet ? 'CM' : product.sizes[0] || 'M';
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [showSizeTable, setShowSizeTable] = useState(false);

  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const whatsappPurchaseUrl = buildProductPurchaseWhatsAppLink(
    product,
    isBagOrWallet ? (product.dimensionsCm ? `CM (${product.dimensionsCm})` : 'CM') : selectedSize
  );

  const installmentValue = (product.price / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const isPromo = product.isPromotion || (product.originalPrice && product.originalPrice > product.price);
  const isAvailable = product.inStock !== false;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-xl md:max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-[#F2DEE4] animate-fadeIn max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar no Topo (Alto Contraste e Sempre Visível com ring e fundo escuro) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-50 p-2 sm:px-3 sm:py-1.5 bg-[#181316] hover:bg-[#B84E67] text-white rounded-full shadow-lg ring-2 ring-white/90 transition-all cursor-pointer flex items-center gap-1 group"
          title="Fechar Detalhes (Esc)"
          aria-label="Fechar Detalhes"
        >
          <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline">Fechar</span>
        </button>

        {/* Coluna da Imagem do Produto: Reduzida, elegante, contida sem estourar altura */}
        <div className="md:w-5/12 bg-gradient-to-b from-[#FAF3F5] to-[#F5E6EB]/60 p-4 sm:p-5 flex flex-col items-center justify-center relative shrink-0 border-b md:border-b-0 md:border-r border-[#F2DEE4]">
          {/* Badges de Referência, Promoção e Reserva */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className="bg-[#141113]/85 text-[#F9D6DF] text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-xs">
              Ref: #{product.id}
            </span>
            {!isAvailable && (
              <span className="bg-amber-950/90 text-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-amber-400/50 flex items-center gap-1 backdrop-blur-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Reservada na Mala</span>
              </span>
            )}
            {isPromo && (
              <span className="bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>{product.promotionTag || 'OFERTA ESPECIAL'}</span>
              </span>
            )}
          </div>

          {/* Foto compacta e contida (object-contain) */}
          <div className="w-full flex items-center justify-center pt-8 pb-2 sm:py-6">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-[220px] sm:max-h-[260px] md:max-h-[320px] w-auto max-w-full object-contain rounded-xl shadow-md border border-white/80 bg-white"
            />
          </div>

          <div className="text-[11px] text-[#8C7A83] font-medium text-center">
            {product.category} · {product.color}
          </div>
        </div>

        {/* Coluna dos Detalhes (Rolagem suave caso necessário) */}
        <div className="md:w-7/12 p-5 sm:p-6 overflow-y-auto max-h-[92vh] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#9E6170] font-medium uppercase tracking-wider pr-16 sm:pr-20">
              <div className="flex items-center gap-1.5">
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.color}</span>
              </div>
              {isAvailable ? (
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold normal-case">
                  Pronta Entrega
                </span>
              ) : (
                <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold normal-case flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-amber-600" />
                  Indisponível (Em Prova)
                </span>
              )}
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#181316] mt-1.5 pr-8">
              {product.name}
            </h2>

            {/* Preços e Parcelamento */}
            <div
              className={`mt-2.5 pb-2 border-b border-[#F5E6EB] flex items-baseline justify-between ${
                isPromo ? 'bg-[#FFF5F7] p-2.5 rounded-xl border border-[#FFE4E6]' : ''
              }`}
            >
              <div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-stone-400 line-through block">
                    De R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black tabular-nums ${isPromo ? 'text-[#E11D48]' : 'text-[#181316]'}`}>
                    {product.originalPrice && product.originalPrice > product.price ? 'Por ' : ''}
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-xs text-[#7A6B73] mt-0.5">
                  Em até 3x de R$ {installmentValue} sem juros ou à vista
                </div>
              </div>
              <span className="text-[11px] text-[#B84E67] font-semibold bg-[#FDF2F4] px-2 py-1 rounded border border-[#F2DEE4]">
                Pronta Entrega
              </span>
            </div>

            <p className="text-[#5A4D54] text-xs sm:text-sm mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Especificações de Tecido e Dica */}
            <div className="mt-3.5 p-3 rounded-xl bg-[#FAF6F7] border border-[#F2DEE4] space-y-1.5">
              <div className="text-xs">
                <span className="font-semibold text-[#181316]">Composição: </span>
                <span className="text-[#5A4D54]">{product.fabric}</span>
              </div>
              <div className="text-xs">
                <span className="font-semibold text-[#181316]">Dica da Consultora Josy: </span>
                <span className="text-[#5A4D54]">{product.fitTip}</span>
              </div>
            </div>

            {!isAvailable && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-900">Peça Reservada na Mala de Outra Cliente</span>
                  <span className="text-[11px] text-amber-800 leading-relaxed block mt-0.5">
                    Esta peça está reservada em provador particular 48h no momento e não pode ser reservada em outra mala. Consulte a Josy no WhatsApp para fila de espera ou peças similares!
                  </span>
                </div>
              </div>
            )}

            {/* Seleção de Tamanho OU Medidas em CM */}
            <div className="mt-4">
              {isBagOrWallet ? (
                /* Bolsas e Carteiras: Mostra CM onde será incluída a medida */
                <div className="bg-[#FAF6F7] p-3 rounded-xl border border-[#F0D5DD]">
                  <div className="flex items-center justify-between text-xs text-[#5A4D54] mb-1.5">
                    <span className="font-bold text-[#181316] flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#B84E67]" />
                      Medidas da Peça (CM):
                    </span>
                    <span className="text-xs font-bold text-[#B84E67] bg-[#FDF2F4] px-2 py-0.5 rounded border border-[#F2DEE4]">
                      CM (Centímetros)
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-[#181316] mt-1">
                    {product.dimensionsCm || '38cm x 28cm x 14cm (Largura x Altura x Profundidade)'}
                  </div>
                  <p className="text-[11px] text-[#7A6B73] mt-1">
                    Medidas precisas para acomodar seus pertences com elegância e conforto.
                  </p>
                </div>
              ) : (
                /* Roupas: Medidas padronizadas P, M, G1, G2, G3 */
                <div>
                  <div className="flex items-center justify-between text-xs text-[#5A4D54] mb-2">
                    <span className="font-semibold text-[#181316]">
                      Tamanho Desejado (P, M, G1, G2, G3):
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSizeTable(!showSizeTable)}
                      className="flex items-center gap-1 text-[#B84E67] hover:underline cursor-pointer text-xs font-medium"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{showSizeTable ? 'Fechar Tabela' : 'Ver Guia de Medidas (CM)'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`text-sm px-4 py-2 rounded-lg border transition-all cursor-pointer font-bold ${
                          selectedSize === size
                            ? 'border-[#B84E67] bg-[#B84E67] text-white shadow-xs scale-105'
                            : 'border-[#F0D5DD] bg-white text-[#5A4D54] hover:border-[#D87F95] hover:bg-[#FDF2F4]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Tabela de Medidas Informativa (P, M, G1, G2, G3) */}
                  {showSizeTable && (
                    <div className="mt-3 p-3 rounded-xl bg-white border border-[#E8C5CE] shadow-xs text-[11px] space-y-1.5 animate-fadeIn">
                      <div className="font-bold text-[#B84E67] flex items-center gap-1 mb-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>Tabela de Medidas do Ateliê Jô Bolsas Glamour (CM):</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 text-center font-medium">
                        <div className="bg-[#FAF6F7] p-1 rounded border border-[#F2DEE4]">
                          <span className="font-bold block text-[#B84E67]">P</span>
                          <span className="text-[10px] text-stone-600 block">Busto: 88-92</span>
                          <span className="text-[10px] text-stone-600 block">Quadril: 96-100</span>
                        </div>
                        <div className="bg-[#FAF6F7] p-1 rounded border border-[#F2DEE4]">
                          <span className="font-bold block text-[#B84E67]">M</span>
                          <span className="text-[10px] text-stone-600 block">Busto: 94-98</span>
                          <span className="text-[10px] text-stone-600 block">Quadril: 102-106</span>
                        </div>
                        <div className="bg-[#FAF6F7] p-1 rounded border border-[#F2DEE4]">
                          <span className="font-bold block text-[#B84E67]">G1</span>
                          <span className="text-[10px] text-stone-600 block">Busto: 100-106</span>
                          <span className="text-[10px] text-stone-600 block">Quadril: 108-114</span>
                        </div>
                        <div className="bg-[#FAF6F7] p-1 rounded border border-[#F2DEE4]">
                          <span className="font-bold block text-[#B84E67]">G2</span>
                          <span className="text-[10px] text-stone-600 block">Busto: 108-114</span>
                          <span className="text-[10px] text-stone-600 block">Quadril: 116-122</span>
                        </div>
                        <div className="bg-[#FAF6F7] p-1 rounded border border-[#F2DEE4]">
                          <span className="font-bold block text-[#B84E67]">G3</span>
                          <span className="text-[10px] text-stone-600 block">Busto: 116-122</span>
                          <span className="text-[10px] text-stone-600 block">Quadril: 124-130</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#7A6B73] text-center pt-1">
                        Na dúvida, enviamos um tamanho reserva na sua mala para você provar sem compromisso!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions: Venda Direta WhatsApp & Mala Digital & Fechar */}
          <div className="pt-3 border-t border-[#F2DEE4] space-y-2.5">
            {/* Botão de Edição para Vendedora */}
            {onEditProduct && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditProduct(product);
                }}
                className="w-full py-2.5 text-xs font-bold bg-[#FFF5F8] text-[#B84E67] border border-[#F8D2DD] rounded-xl hover:bg-[#FFEBF1] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs mb-1"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Substituir Foto, Medidas ou Valor Desta Peça</span>
              </button>
            )}

            {/* 1. Compra Direta no WhatsApp */}
            {isAvailable ? (
              <a
                href={whatsappPurchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 text-sm font-semibold bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group/wa"
              >
                <WhatsAppIcon className="w-4 h-4 text-white group-hover/wa:scale-110 transition-transform" />
                <span>Comprar pelo WhatsApp · {STORE_WHATSAPP_DISPLAY}</span>
              </a>
            ) : (
              <a
                href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Olá Josy! Vi que a peça "${product.name}" está reservada na mala. Gostaria de entrar na fila de espera caso retorne ou verificar peças parecidas!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 text-sm font-semibold bg-stone-800 hover:bg-stone-900 text-white rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Consultar Fila de Espera no WhatsApp</span>
              </a>
            )}

            {/* 2. Mala Digital / Provador em Casa 48h */}
            {!isAvailable ? (
              <button
                type="button"
                disabled
                className="w-full py-3 text-sm font-semibold rounded-xl bg-stone-100 text-stone-500 border border-stone-200 cursor-not-allowed flex items-center justify-center gap-2 shadow-none"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Peça Reservada na Mala (Indisponível no Momento)</span>
              </button>
            ) : isInMala ? (
              <button
                onClick={() => {
                  onRemoveFromMala(product.id);
                  onClose();
                }}
                className="w-full py-3 text-sm font-medium bg-[#FAF2F4] text-[#B84E67] border border-[#F0D5DD] rounded-xl hover:bg-[#FDE8ED] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#B84E67]" />
                <span>Peça já está na sua mala (Clique para remover)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isMalaFull) {
                    alert('Sua mala atingiu o limite de peças para esta entrega.');
                    return;
                  }
                  onAddToMala(product, isBagOrWallet ? 'CM' : selectedSize);
                  onClose();
                }}
                disabled={isMalaFull}
                className={`w-full py-3 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isMalaFull
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#181316] text-[#FAF6F7] hover:bg-[#2A2025] border border-[#F2BAC7]/30 shadow-xs'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#F5BAC7]" />
                <span>
                  {isBagOrWallet
                    ? 'Adicionar à Mala Digital (Medida CM)'
                    : `Adicionar à Mala Digital (Tam. ${selectedSize})`}
                </span>
              </button>
            )}

            {/* 3. Botão Explícito de Fechar no rodapé do modal */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4 text-stone-600" />
              <span>Fechar Detalhes</span>
            </button>

            <p className="text-[11px] text-center text-[#7A6B73]">
              Entrega expressa ou retirada no balcão da loja física · Atendimento direto com Josy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
