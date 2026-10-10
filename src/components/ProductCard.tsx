import React, { useState } from 'react';
import { ShoppingBag, Check, Eye, Pencil, Flame, Ruler } from 'lucide-react';
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
  const isBagOrWallet =
    product.category.toLowerCase().includes('bolsa') ||
    product.category.toLowerCase().includes('carteira') ||
    (product.sizes && product.sizes.includes('CM')) ||
    Boolean(product.dimensionsCm);

  const defaultSize = isBagOrWallet
    ? 'CM'
    : product.sizes[0] || 'M';

  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
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
      onAddToMala(product, isBagOrWallet ? 'CM' : selectedSize);
    }
  };

  const whatsappPurchaseUrl = buildProductPurchaseWhatsAppLink(
    product,
    isBagOrWallet ? (product.dimensionsCm ? `CM (${product.dimensionsCm})` : 'CM') : selectedSize
  );

  const installmentValue = (product.price / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const isPromo = product.isPromotion || (product.originalPrice && product.originalPrice > product.price);

  return (
    <div className={`group flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-200 border ${
      isPromo
        ? 'border-[#F8B4C4] hover:border-[#E11D48] shadow-sm hover:shadow-lg'
        : 'border-[#F0D8DF] hover:border-[#D87F95] hover:shadow-md'
    }`}>
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

        {/* Promo Highlight Badge */}
        {isPromo && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            <span className="bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>{product.promotionTag || 'OFERTA ESPECIAL'}</span>
            </span>
          </div>
        )}

        {/* Quick View Overlay Button */}
        <button
          onClick={() => onOpenQuickView(product)}
          className="absolute bottom-3 left-3 right-3 py-2 bg-white/95 backdrop-blur-sm text-[#181316] text-xs font-medium rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 hover:bg-[#FDF2F4] hover:text-[#B84E67] cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#B84E67]" />
          <span>Ver Detalhes & Medidas</span>
        </button>

        {/* Edit Button for Seller (if authenticated) */}
        {onEditProduct && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            title="Substituir foto, descrição, medidas ou valor desta peça"
            className={`absolute ${isPromo ? 'top-10' : 'top-3'} left-3 bg-white/95 hover:bg-[#FDF2F4] text-[#B84E67] text-[11px] font-bold px-2.5 py-1 rounded-md shadow border border-[#F2DEE4] flex items-center gap-1 cursor-pointer transition-all hover:scale-105 z-10`}
          >
            <Pencil className="w-3 h-3 text-[#B84E67]" />
            <span>Editar Peça</span>
          </button>
        )}

        {/* Subtle Indicator if already in Mala */}
        {isInMala && (
          <div className="absolute top-3 right-3 bg-[#181316] text-[#FAF6F7] text-[11px] font-medium px-2.5 py-1 rounded-md shadow border border-[#F5BAC7]/40 flex items-center gap-1 z-10">
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

          {/* Pricing with Installments & Promo Highlight */}
          <div className={`mt-1.5 pt-1.5 border-t ${isPromo ? 'border-[#FCE4EC] bg-[#FFF5F7] p-2 rounded-lg' : 'border-[#F7E6EB]'}`}>
            <div className="flex items-baseline justify-between">
              <div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[11px] text-stone-400 line-through block">
                    De R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
                <span className={`text-base font-extrabold tabular-nums ${isPromo ? 'text-[#E11D48]' : 'text-[#181316]'}`}>
                  {product.originalPrice && product.originalPrice > product.price ? 'Por ' : ''}
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-[11px] text-[#7A6B73]">
                À vista ou 3x de R$ {installmentValue}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#5A4D54] line-clamp-2 mt-1.5">
            {product.fabric}
          </p>
        </div>

        {/* Size Selection OR CM Dimensions */}
        <div className="pt-2 border-t border-[#F2DEE4]">
          {isBagOrWallet ? (
            /* Bolsas e Carteiras: Mostra CM onde está incluída a medida */
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#7A6B73] mb-1">
                <span className="font-semibold text-stone-700 flex items-center gap-1">
                  <Ruler className="w-3 h-3 text-[#B84E67]" />
                  Medida do Produto (CM):
                </span>
                <span className="text-[10px] font-bold text-[#B84E67] bg-[#FDF2F4] px-1.5 py-0.2 rounded border border-[#F2DEE4]">
                  CM
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#FAF6F7] border border-[#F0D5DD] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#181316]">
                  {product.dimensionsCm || 'Medidas sob consulta'}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenQuickView(product)}
                  className="text-[11px] text-[#B84E67] underline hover:text-[#8F2E45] cursor-pointer"
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ) : (
            /* Roupas: Medidas padronizadas P, M, G1, G2, G3 */
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#7A6B73] mb-1.5">
                <span>Tamanho desejado (P, M, G1, G2, G3):</span>
                <button
                  onClick={() => onOpenQuickView(product)}
                  className="text-[#B84E67] underline hover:text-[#8F2E45] cursor-pointer text-[11px]"
                >
                  Tabela
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
                        ? 'border-[#B84E67] bg-[#B84E67] text-white font-bold shadow-2xs'
                        : 'border-[#F0D5DD] bg-white text-[#5A4D54] hover:border-[#D87F95] hover:bg-[#FDF2F4]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
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
              <span>
                {isBagOrWallet
                  ? 'Experimentar na Mala (Medida CM)'
                  : `Experimentar na Mala (Tam. ${selectedSize})`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
