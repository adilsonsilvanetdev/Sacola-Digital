import React, { useState } from 'react';
import { ShoppingBag, Check, Eye } from 'lucide-react';
import { Product, MalaItem } from '../types';

interface ProductCardProps {
  product: Product;
  isInMala: boolean;
  onAddToMala: (product: Product, size: string) => void;
  onRemoveFromMala: (productId: string) => void;
  onOpenQuickView: (product: Product) => void;
  isMalaFull: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInMala,
  onAddToMala,
  onRemoveFromMala,
  onOpenQuickView,
  isMalaFull,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleToggleMala = () => {
    if (isInMala) {
      onRemoveFromMala(product.id);
    } else {
      if (isMalaFull) {
        alert('Sua mala atingiu o limite de peças para esta entrega. Remova uma peça para adicionar outra.');
        return;
      }
      onAddToMala(product, selectedSize);
    }
  };

  return (
    <div className="group flex flex-col bg-white border border-stone-200 rounded overflow-hidden hover:border-stone-400 transition-all duration-200">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-[#F5F4EE] overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-100">
            <span className="font-editorial text-lg text-stone-700 italic">{product.name}</span>
            <span className="text-xs text-stone-500 mt-2">{product.fabric}</span>
          </div>
        )}

        {/* Quick View Overlay Button */}
        <button
          onClick={() => onOpenQuickView(product)}
          className="absolute bottom-3 left-3 right-3 py-2 bg-white/95 backdrop-blur-sm text-stone-900 text-xs font-medium rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 hover:bg-white cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-stone-600" />
          <span>Ver Detalhes & Caimento</span>
        </button>

        {/* Subtle Indicator if already in Mala */}
        {isInMala && (
          <div className="absolute top-3 right-3 bg-stone-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Na sua Mala</span>
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Clean Unboxed Metadata without pills */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.color}</span>
          </div>

          <h3 className="font-editorial text-lg font-medium text-stone-900 mt-1 line-clamp-1 group-hover:text-stone-700">
            {product.name}
          </h3>

          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-stone-900 tabular-nums">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-stone-400">
              Valor para consignação
            </span>
          </div>

          <p className="text-xs text-stone-500 line-clamp-2 mt-1.5">
            {product.fabric}
          </p>
        </div>

        {/* Size Selection */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
            <span>Tamanho para provar:</span>
            <button
              onClick={() => onOpenQuickView(product)}
              className="text-stone-600 underline hover:text-stone-900"
            >
              Guia de medidas
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                  selectedSize === size
                    ? 'border-stone-900 bg-stone-900 text-white font-medium'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {isInMala ? (
            <button
              onClick={handleToggleMala}
              className="w-full py-2.5 text-xs font-medium bg-stone-100 text-stone-800 border border-stone-300 rounded hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Remover da Mala</span>
            </button>
          ) : (
            <button
              onClick={handleToggleMala}
              disabled={isMalaFull}
              className={`w-full py-2.5 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                isMalaFull
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Colocar na Mala (Tam. {selectedSize})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
