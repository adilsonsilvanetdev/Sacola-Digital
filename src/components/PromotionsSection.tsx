import React from 'react';
import { Flame, Sparkles, Tag, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buildProductPurchaseWhatsAppLink } from '../utils/whatsappHelper';

interface PromotionsSectionProps {
  products: Product[];
  onOpenQuickView: (product: Product) => void;
  onAddToMala: (product: Product, selectedSize?: string) => void;
  isInMala: (productId: string) => boolean;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  products,
  onOpenQuickView,
  onAddToMala,
  isInMala,
}) => {
  // Filtra produtos especiais marcados como promoção ou com preço original superior
  const promoProducts = products.filter(
    (p) => p.isPromotion || (p.originalPrice && p.originalPrice > p.price)
  );

  if (promoProducts.length === 0) return null;

  return (
    <section id="promocoes" className="py-16 bg-gradient-to-b from-[#FFF5F7] via-[#FFF9FA] to-white border-y border-[#F7D3DD] scroll-mt-24 relative overflow-hidden">
      {/* Decorative luxury glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#E11D48]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#B84E67]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Highlighted Banner Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-extrabold uppercase tracking-widest shadow-md mb-3 ring-4 ring-[#FFE4E6]">
            <Flame className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
            <span>Promoções & Produtos Especiais</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#181316] font-medium mt-1">
            Peças Selecionadas com <span className="text-[#E11D48] underline decoration-[#FECDD3] decoration-wavy underline-offset-8">Valores Especiais</span>
          </h2>
          
          <p className="text-[#5A4D54] text-xs sm:text-sm mt-3 leading-relaxed">
            Aproveite nossa curadoria com descontos e vantagens exclusivas da consultora Josy. Garanta a pronta entrega pelo WhatsApp ou agende para provar na sua mala de 48 horas!
          </p>
        </div>

        {/* Promo Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {promoProducts.map((product) => {
            const inMala = isInMala(product.id);
            const isBagOrWallet =
              product.category.toLowerCase().includes('bolsa') ||
              product.category.toLowerCase().includes('carteira') ||
              (product.sizes && product.sizes.includes('CM')) ||
              Boolean(product.dimensionsCm);

            const displaySizeOrDimension = isBagOrWallet
              ? product.dimensionsCm || 'Medidas em CM'
              : product.sizes.join(', ');

            const defaultSize = product.sizes[0] || (isBagOrWallet ? 'CM' : 'M');

            const discountPercent = product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border-2 border-[#FBCFE8] hover:border-[#E11D48] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div
                    onClick={() => onOpenQuickView(product)}
                    className="relative aspect-4/5 overflow-hidden bg-stone-100 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Promo Highlight Badge */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      <span className="bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                        {product.promotionTag || 'Oferta Especial'}
                      </span>
                      {discountPercent && (
                        <span className="bg-[#181316] text-[#F9D6DF] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm w-fit">
                          -{discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Category pill */}
                    <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[#181316] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
                      {product.category}
                    </span>

                    {/* Quick view button overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                      <span className="text-white text-xs font-medium underline underline-offset-2">
                        Ver Detalhes & Medidas
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#9C384E] font-bold block">
                        {product.color}
                      </span>
                      <h3
                        onClick={() => onOpenQuickView(product)}
                        className="font-medium text-sm text-[#181316] group-hover:text-[#E11D48] transition-colors line-clamp-1 cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {/* Price with Highlight */}
                    <div className="bg-[#FFF5F7] p-2.5 rounded-xl border border-[#FFE4E6]">
                      <div className="flex items-baseline gap-2">
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                        <span className="text-lg font-black text-[#E11D48] tabular-nums">
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7A6B73] block mt-0.5">
                        Em até 3x sem juros ou via PIX com desconto
                      </span>
                    </div>

                    {/* Size / CM Dimension indicator */}
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-stone-500 font-medium">
                        {isBagOrWallet ? 'Medida (CM):' : 'Tamanhos:'}
                      </span>
                      <span className="font-semibold text-[#181316] bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {displaySizeOrDimension}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 space-y-2">
                  {/* Direct WhatsApp button */}
                  <a
                    href={buildProductPurchaseWhatsAppLink(product, defaultSize)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#0d6832] hover:bg-[#094d25] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                    <span>Garantir no WhatsApp</span>
                  </a>

                  {/* Mala Provador button */}
                  <button
                    type="button"
                    onClick={() => onAddToMala(product, defaultSize)}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                      inMala
                        ? 'bg-[#181316] text-[#F5BAC7] border-[#181316]'
                        : 'bg-white hover:bg-[#FDF2F4] text-[#B84E67] border-[#F2DEE4]'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{inMala ? 'Na Sua Mala ✓' : 'Provar na Mala'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner WhatsApp CTA */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-[#FBCFE8] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] border border-[#FFE4E6] flex items-center justify-center shrink-0">
              <Tag className="w-6 h-6 text-[#E11D48]" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#181316]">
                Deseja consultar uma condição especial com a Josy?
              </h4>
              <p className="text-xs text-[#5A4D54] mt-0.5">
                Entre em contato direto no WhatsApp para combinar pagamentos em PIX ou envio personalizado para Bauru e região.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/5514997224065?text=Ol%C3%A1%20Josy!%20Gostaria%20de%20consultar%20as%20pe%C3%A7as%20em%20promo%C3%A7%C3%A3o%20especial%20da%20J%C3%B4%20Bolsas%20Glamour."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span>Falar com a Josy sobre Promoções</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
