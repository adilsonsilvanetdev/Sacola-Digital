import React, { useState } from 'react';
import { ShoppingBag, Check, Eye, Pencil } from 'lucide-react';
import { Product } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buildProductPurchaseWhatsAppLink, STORE_WHATSAPP_DISPLAY } from '../utils/whatsappHelper';

interface ProductCardProps {
  product: Product;
  isInMala: boolean;
  onAddToMala: (product: Product, size: string) => void;
  onRemoveFromMala: (productId: string) => void;
  onOpenQuickView: (product: Product) => void;
  isMalaFull: boolean;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInMala,
  onAddToMala,
  onRemoveFromMala,
  onOpenQuickView,
  isMalaFull,
  onEditProduct,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0] || 'Único');
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

  const whatsappPurchaseUrl = buildProductPurchaseWhatsAppLink(product, selectedSize);
  const installmentValue = (product.price / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="group flex flex-col bg-white border border-[#F0D8DF] rounded-xl overflow-hidden hover:border-[#D87F95] hover:shadow-md transition-all duration-200">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-[#FAF3F5] overflow-hidden">
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
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#FAF3F5]">
            <span className="font-editorial text-lg text-[#181316] italic">{product.name}</span>
            <span className="text-xs text-[#7A6B73] mt-2">{product.fabric}</span>
          </div>
        )}

        {/* Quick View Overlay Button */}
        <button
          onClick={() => onOpenQuickView(product)}
          className="absolute bottom-3 left-3 right-3 py-2 bg-white/95 backdrop-blur-sm text-[#181316] text-xs font-medium rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 hover:bg-[#FDF2F4] hover:text-[#B84E67] cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#B84E67]" />
          <span>Ver Detalhes & Fotos</span>
        </button>

        {/* Edit Button for Seller (if authenticated) */}
        {onEditProduct && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            title="Substituir foto, descrição ou valor desta peça"
            className="absolute top-3 left-3 bg-white/95 hover:bg-[#FDF2F4] text-[#B84E67] text-[11px] font-bold px-2.5 py-1 rounded-md shadow border border-[#F2DEE4] flex items-center gap-1 cursor-pointer transition-all hover:scale-105 z-10"
          >
            <Pencil className="w-3 h-3 text-[#B84E67]" />
            <span>Editar Peça</span>
          </button>
        )}

        {/* Subtle Indicator if already in Mala */}
        {isInMala && (
          <div className="absolute top-3 right-3 bg-[#181316] text-[#FAF6F7] text-[11px] font-medium px-2.5 py-1 rounded-md shadow border border-[#F5BAC7]/40 flex items-center gap-1">
            <Check className="w-3 h-3 text-[#F5BAC7]" />
            <span>Na sua Mala</span>
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Color */}
          <div className="flex items-center justify-between text-xs text-[#9E6170] font-medium">
            <div className="flex items-center gap-1.5">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.color}</span>
            </div>
            <span className="text-[10px] text-[#7A6B73] bg-[#FAF6F7] px-1.5 py-0.5 rounded border border-[#F2DEE4]">
              Pronta Entrega
            </span>
          </div>

          <h3 className="font-editorial text-lg font-medium text-[#181316] mt-1.5 line-clamp-1 group-hover:text-[#B84E67] transition-colors">
            {product.name}
          </h3>

          {/* Pricing with Installments */}
          <div className="mt-1.5 pt-1 border-t border-[#F7E6EB]">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-[#181316] tabular-nums">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-[#7A6B73]">
                À vista ou 3x de R$ {installmentValue}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#5A4D54] line-clamp-2 mt-1.5">
            {product.fabric}
          </p>
        </div>

        {/* Size Selection */}
        <div className="pt-2 border-t border-[#F2DEE4]">
          <div className="flex items-center justify-between text-[11px] text-[#7A6B73] mb-1.5">
            <span>Tamanho desejado:</span>
            <button
              onClick={() => onOpenQuickView(product)}
              className="text-[#B84E67] underline hover:text-[#8F2E45] cursor-pointer"
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
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
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

        {/* Double Action Buttons: 1) Comprar no WhatsApp & 2) Colocar na Mala Digital */}
        <div className="pt-2 space-y-2">
          {/* Botão de Compra Direta pelo WhatsApp com ícone (14) 99722-4065 */}
          <a
            href={whatsappPurchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Comprar ${product.name} diretamente pelo WhatsApp ${STORE_WHATSAPP_DISPLAY}`}
            className="w-full py-2.5 px-3 text-xs font-semibold bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group/wa"
          >
            <WhatsAppIcon className="w-4 h-4 text-white shrink-0 group-hover/wa:scale-110 transition-transform" />
            <span>Comprar no WhatsApp</span>
            <span className="text-[10px] font-normal opacity-90 hidden sm:inline">
              · {STORE_WHATSAPP_DISPLAY}
            </span>
          </a>

          {/* Botão de Adicionar à Mala Digital (Provador 48h em Casa) */}
          {isInMala ? (
            <button
              onClick={handleToggleMala}
              className="w-full py-2.5 px-3 text-xs font-medium bg-[#FAF2F4] text-[#B84E67] border border-[#F0D5DD] rounded-lg hover:bg-[#FDE8ED] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-[#B84E67]" />
              <span>Na sua Mala (Clique para Remover)</span>
            </button>
          ) : (
            <button
              onClick={handleToggleMala}
              disabled={isMalaFull}
              className={`w-full py-2.5 px-3 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                isMalaFull
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-[#181316] text-[#FAF6F7] hover:bg-[#2A2025] border border-[#F2BAC7]/30 shadow-xs'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#F5BAC7]" />
              <span>Experimentar na Mala (Tam. {selectedSize})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
