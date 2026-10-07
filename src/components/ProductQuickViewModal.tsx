import React, { useState } from 'react';
import { X, ShoppingBag, Check, Ruler, Pencil } from 'lucide-react';
import { Product } from '../types';

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

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border border-[#F2DEE4] animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 backdrop-blur-sm rounded-full cursor-pointer"
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
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#9E6170] font-medium uppercase tracking-wider">
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.color}</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#181316] mt-2">
                {product.name}
              </h2>

              <div className="mt-2 text-lg font-semibold text-[#181316] tabular-nums">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <span className="text-xs text-[#7A6B73] font-normal ml-2">
                  (só paga se decidir ficar)
                </span>
              </div>

              <p className="text-[#5A4D54] text-sm mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Fabric Specs */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#FAF6F7] border border-[#F2DEE4] space-y-2">
                <div className="text-xs">
                  <span className="font-semibold text-[#181316]">Composição: </span>
                  <span className="text-[#5A4D54]">{product.fabric}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-[#181316]">Dica da Consultora: </span>
                  <span className="text-[#5A4D54]">{product.fitTip}</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-[#5A4D54] mb-2">
                  <span className="font-medium">Escolha o tamanho para provar:</span>
                  <div className="flex items-center gap-1 text-[#7A6B73]">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Provador 48h</span>
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

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#F2DEE4] space-y-2">
              {onEditProduct && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditProduct(product);
                  }}
                  className="w-full py-2.5 text-xs font-bold bg-[#FFF5F8] text-[#B84E67] border border-[#F8D2DD] rounded-xl hover:bg-[#FFEBF1] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs mb-2"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Substituir Foto, Descrição ou Valor Desta Peça</span>
                </button>
              )}

              {isInMala ? (
                <button
                  onClick={() => {
                    onRemoveFromMala(product.id);
                    onClose();
                  }}
                  className="w-full py-3 text-sm font-medium bg-[#FAF2F4] text-[#B84E67] border border-[#F0D5DD] rounded-xl hover:bg-[#FDE8ED] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#B84E67]" />
                  <span>Item já está na sua mala (Clique para remover)</span>
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
                  <span>Adicionar à Minha Mala no Tamanho {selectedSize}</span>
                </button>
              )}

              <p className="text-[11px] text-center text-[#7A6B73]">
                Você pode solicitar tamanhos reservas diretamente no carrinho.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
