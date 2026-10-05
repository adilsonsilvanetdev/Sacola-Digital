import React, { useState } from 'react';
import { X, ShoppingBag, Check, Sparkles, Ruler, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isInMala: boolean;
  onAddToMala: (product: Product, size: string) => void;
  onRemoveFromMala: (productId: string) => void;
  isMalaFull: boolean;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  isInMala,
  onAddToMala,
  onRemoveFromMala,
  isMalaFull,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden border border-stone-200 animate-fadeIn">
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
          <div className="aspect-[3/4] md:aspect-auto bg-[#F5F4EE] relative">
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
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium uppercase tracking-wider">
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.color}</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900 mt-2">
                {product.name}
              </h2>

              <div className="mt-2 text-lg font-semibold text-stone-900 tabular-nums">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <span className="text-xs text-stone-400 font-normal ml-2">
                  (só paga se decidir ficar)
                </span>
              </div>

              <p className="text-stone-600 text-sm mt-4 leading-relaxed">
                {product.description}
              </p>

              {/* Fabric Specs */}
              <div className="mt-5 p-3.5 rounded bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="text-xs">
                  <span className="font-semibold text-stone-900">Composição: </span>
                  <span className="text-stone-600">{product.fabric}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-stone-900">Dica da Consultora: </span>
                  <span className="text-stone-600">{product.fitTip}</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
                  <span className="font-medium">Escolha o tamanho para entrega:</span>
                  <div className="flex items-center gap-1 text-stone-500">
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
                      className={`text-sm px-3.5 py-1.5 rounded border transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'border-stone-900 bg-stone-900 text-white font-medium shadow-sm'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-stone-200 space-y-2">
              {isInMala ? (
                <button
                  onClick={() => {
                    onRemoveFromMala(product.id);
                    onClose();
                  }}
                  className="w-full py-3 text-sm font-medium bg-stone-100 text-stone-800 border border-stone-300 rounded hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-600" />
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
                  className={`w-full py-3 text-sm font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isMalaFull
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-900 text-white hover:bg-stone-800 shadow'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar à Minha Mala no Tamanho {selectedSize}</span>
                </button>
              )}

              <p className="text-[11px] text-center text-stone-400">
                Você pode solicitar tamanhos reservas diretamente no carrinho.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
