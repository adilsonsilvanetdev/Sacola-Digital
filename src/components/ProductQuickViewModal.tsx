import React, { useState } from 'react';
import { X, ShoppingBag, Check, Ruler, Pencil } from 'lucide-react';
import { Product } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buildProductPurchaseWhatsAppLink, STORE_WHATSAPP_DISPLAY } from '../utils/whatsappHelper';

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

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0] || 'Único');

  const whatsappPurchaseUrl = buildProductPurchaseWhatsAppLink(product, selectedSize);
  const installmentValue = (product.price / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border border-[#F2DEE4] animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 backdrop-blur-sm rounded-full cursor-pointer shadow-sm transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-[3/4] md:aspect-auto bg-[#FAF3F5] relative">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 bg-[#141113]/85 text-[#F9D6DF] text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-xs">
              Ref: #{product.id}
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#9E6170] font-medium uppercase tracking-wider">
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.color}</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#181316] mt-1.5">
                {product.name}
              </h2>

              <div className="mt-2.5 pb-2 border-b border-[#F5E6EB] flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-bold text-[#181316] tabular-nums">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
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

              {/* Fabric Specs */}
              <div className="mt-4 p-3 rounded-xl bg-[#FAF6F7] border border-[#F2DEE4] space-y-1.5">
                <div className="text-xs">
                  <span className="font-semibold text-[#181316]">Composição: </span>
                  <span className="text-[#5A4D54]">{product.fabric}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[#181316]">Dica da Consultora Josy: </span>
                  <span className="text-[#5A4D54]">{product.fitTip}</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-[#5A4D54] mb-2">
                  <span className="font-medium">Selecione o tamanho desejado:</span>
                  <div className="flex items-center gap-1 text-[#7A6B73]">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Tamanhos disponíveis</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`text-sm px-3.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'border-[#B84E67] bg-[#B84E67] text-white font-medium shadow-2xs'
                          : 'border-[#F0D5DD] bg-white text-[#5A4D54] hover:border-[#D87F95] hover:bg-[#FDF2F4]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions: Venda Direta WhatsApp & Mala Digital */}
            <div className="pt-4 border-t border-[#F2DEE4] space-y-2.5">
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
                  <span>Substituir Foto, Descrição ou Valor Desta Peça</span>
                </button>
              )}

              {/* 1. Compra Direta no WhatsApp */}
              <a
                href={whatsappPurchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 text-sm font-semibold bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group/wa"
              >
                <WhatsAppIcon className="w-4 h-4 text-white group-hover/wa:scale-110 transition-transform" />
                <span>Comprar pelo WhatsApp · {STORE_WHATSAPP_DISPLAY}</span>
              </a>

              {/* 2. Mala Digital / Provador em Casa 48h */}
              {isInMala ? (
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
                    onAddToMala(product, selectedSize);
                    onClose();
                  }}
                  disabled={isMalaFull}
                  className={`w-full py-3 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isMalaFull
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-[#181316] text-[#FAF6F7] hover:bg-[#2A2025] border border-[#F2BAC7]/30 shadow-xs'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#F5BAC7]" />
                  <span>Adicionar à Mala Digital (Tam. {selectedSize})</span>
                </button>
              )}

              <p className="text-[11px] text-center text-[#7A6B73]">
                Entrega expressa ou retirada no balcão da loja física · Atendimento direto com Josy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
