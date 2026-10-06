import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { MalaDrawer } from './components/MalaDrawer';
import { CheckoutAgendamentoModal } from './components/CheckoutAgendamentoModal';
import { ConsultoraDashboard } from './components/ConsultoraDashboard';
import { TestimonialsExperience } from './components/TestimonialsExperience';
import { Footer } from './components/Footer';
import { FloatingMalaBar } from './components/FloatingMalaBar';

import { Product, MalaItem, MalaOrder } from './types';
import { SAMPLE_PRODUCTS, MAX_MALA_ITEMS } from './data/products';
import { SlidersHorizontal, RotateCcw, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export default function App() {
  // Store or Stylist Dashboard view
  const [activeView, setActiveView] = useState<'store' | 'dashboard'>('store');

  // Mala State
  const [malaItems, setMalaItems] = useState<MalaItem[]>([]);

  // Modals & Drawers
  const [isMalaOpen, setIsMalaOpen] = useState(false);
  const [isAgendamentoOpen, setIsAgendamentoOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedStyle, setSelectedStyle] = useState<string>('Todos');

  // Feedback Toast
  const [addedToastMessage, setAddedToastMessage] = useState<string | null>(null);

  // Demo Orders for the Consultora Dashboard
  const [orders, setOrders] = useState<MalaOrder[]>([
    {
      id: 'JB-ML-7842',
      customerName: 'Mariana de Albuquerque',
      customerPhone: '(11) 98123-4567',
      deliveryType: 'delivery',
      address: 'Alameda Lorena, 1420 - Apto 91',
      neighborhood: 'Jardins',
      city: 'São Paulo - SP',
      scheduledDate: '2026-10-04',
      scheduledTimeSlot: 'Manhã (09h às 13h)',
      curationMode: 'stylist',
      stylistNote: 'Mariana solicitou mala com opções de bolsas estruturadas e looks para reuniões e jantar. Selecionei blazer de linho areia, bolsa caramelo e vestido terracota.',
      status: 'em_separacao',
      createdAt: 'Hoje às 10:15',
      items: [
        {
          product: SAMPLE_PRODUCTS[0], // Blazer Linho
          selectedSize: 'M',
          requestSecondarySize: true,
          secondarySize: 'G',
        },
        {
          product: SAMPLE_PRODUCTS[3], // Pantalona Crepe
          selectedSize: '40',
          requestSecondarySize: true,
          secondarySize: '42',
        },
        {
          product: SAMPLE_PRODUCTS[7], // Blusa Ombro Só Noir
          selectedSize: 'M',
          requestSecondarySize: false,
        },
        {
          product: SAMPLE_PRODUCTS[2], // Camisa Seda Champanhe
          selectedSize: 'M',
          requestSecondarySize: false,
        },
      ],
    },
    {
      id: 'JB-ML-6291',
      customerName: 'Beatriz Fontes',
      customerPhone: '(11) 99876-5432',
      deliveryType: 'pickup',
      address: 'Retirada na loja física (balcão)',
      neighborhood: 'Loja Física',
      city: 'São Paulo - SP',
      scheduledDate: '2026-10-03',
      scheduledTimeSlot: 'Tarde (14h às 18h)',
      curationMode: 'self',
      status: 'em_provador_48h',
      createdAt: 'Ontem às 16:30',
      items: [
        {
          product: SAMPLE_PRODUCTS[1], // Vestido Acetinado Terracota
          selectedSize: 'P',
          requestSecondarySize: true,
          secondarySize: 'M',
        },
        {
          product: SAMPLE_PRODUCTS[4], // Conjunto Tricot
          selectedSize: 'P',
          requestSecondarySize: false,
        },
        {
          product: SAMPLE_PRODUCTS[8], // Saia Couro Caramelo
          selectedSize: '38',
          requestSecondarySize: true,
          secondarySize: '40',
        },
      ],
    },
  ]);

  // Add Item to Mala
  const handleAddToMala = (product: Product, size: string) => {
    if (malaItems.length >= MAX_MALA_ITEMS) {
      alert(`Sua mala atingiu o limite de ${MAX_MALA_ITEMS} peças.`);
      return;
    }

    if (malaItems.some((item) => item.product.id === product.id)) {
      return;
    }

    const newItem: MalaItem = {
      product,
      selectedSize: size,
      requestSecondarySize: false,
      secondarySize: getNextSize(size),
    };

    setMalaItems((prev) => [...prev, newItem]);
    showToast(`"${product.name}" foi colocada na sua mala (Tam. ${size})`);
  };

  // Remove Item from Mala
  const handleRemoveFromMala = (productId: string) => {
    setMalaItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Update Size in Mala
  const handleUpdateSize = (productId: string, newSize: string) => {
    setMalaItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, selectedSize: newSize, secondarySize: getNextSize(newSize) }
          : item
      )
    );
  };

  // Toggle Secondary Size Request
  const handleToggleSecondarySize = (productId: string) => {
    setMalaItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, requestSecondarySize: !item.requestSecondarySize }
          : item
      )
    );
  };

  // Order completed from customer checkout
  const handleOrderSuccess = (newOrder: MalaOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Toast trigger
  const showToast = (msg: string) => {
    setAddedToastMessage(msg);
    setTimeout(() => {
      setAddedToastMessage(null);
    }, 4500);
  };

  // Status update from dashboard
  const handleUpdateOrderStatus = (orderId: string, newStatus: MalaOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // Filter products
  const categories = ['Todas', 'Vestidos', 'Blazers & Alfaiataria', 'Camisas & Blusas', 'Calças & Shorts', 'Conjuntos & Tricot', 'Casacos'];
  const styles = ['Todos', 'Alfaiataria Sofisticada', 'Casual Elegante', 'Romântica & Fluida', 'Moderna & Minimalista', 'Festiva & Noite'];

  const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
    const matchCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchStyle = selectedStyle === 'Todos' || product.styleKeywords.includes(selectedStyle);
    return matchCategory && matchStyle;
  });

  const isMalaFull = malaItems.length >= MAX_MALA_ITEMS;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        malaItems={malaItems}
        onOpenMala={() => setIsMalaOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        addedToastMessage={addedToastMessage}
      />

      {activeView === 'dashboard' ? (
        /* Área da Vendedora Josy (Montar mala para cliente & gerenciar pedidos) */
        <ConsultoraDashboard
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onReturnToStore={() => setActiveView('store')}
          onCreateOrderByStylist={(newOrder) => setOrders((prev) => [newOrder, ...prev])}
        />
      ) : (
        /* Boutique Customer Storefront View */
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onExploreCatalog={() => {
              const el = document.getElementById('colecao');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenSellerArea={() => setActiveView('dashboard')}
          />

          {/* How it works 4-step Section */}
          <HowItWorks
            onExploreCatalog={() => {
              const el = document.getElementById('colecao');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenSellerArea={() => setActiveView('dashboard')}
          />

          {/* Catalog Section: 15 Fictional Women's Garments */}
          <section id="colecao" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Catalog Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B84E67] font-semibold block mb-1">
                  Bolsas & Peças Exclusivas para o seu Provador em Casa
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#181316] font-medium">
                  Coleção Jô Bolsas Glamour
                </h2>
                <p className="text-[#5A4D54] text-xs sm:text-sm mt-1">
                  Adicione até {MAX_MALA_ITEMS} peças na sua mala para experimentar em casa por 48 horas. Pague apenas pelo que decidir ficar!
                </p>
              </div>

              {/* Counter Pill */}
              <div className="flex items-center gap-3">
                <div className="bg-[#FAF6F7] border border-[#F2DEE4] px-4 py-2 rounded-xl flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#B84E67]" />
                  <span className="text-xs text-[#5A4D54]">Sua Mala:</span>
                  <span className="text-xs font-semibold text-[#181316]">
                    {malaItems.length} de {MAX_MALA_ITEMS} peças
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Category Navigation */}
            <div className="space-y-4 mb-10 pb-6 border-b border-[#F2DEE4]">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs font-semibold text-stone-500 mr-2 shrink-0 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Categorias:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#181316] text-[#F5BAC7] font-medium shadow-2xs'
                        : 'bg-white text-[#5A4D54] border border-[#F0D5DD] hover:bg-[#FAF6F7]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Style Sub-filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
                <span className="text-xs text-stone-400 mr-2 shrink-0">Estilos:</span>
                {styles.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStyle(st)}
                    className={`text-xs px-3 py-1 rounded-md transition-colors shrink-0 cursor-pointer ${
                      selectedStyle === st
                        ? 'bg-[#FDF2F4] text-[#B84E67] font-semibold border border-[#F2DEE4]'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}

                {(selectedCategory !== 'Todas' || selectedStyle !== 'Todos') && (
                  <button
                    onClick={() => {
                      setSelectedCategory('Todas');
                      setSelectedStyle('Todos');
                    }}
                    className="text-xs text-[#B84E67] hover:text-[#9C384E] flex items-center gap-1 ml-auto shrink-0 underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpar Filtros</span>
                  </button>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => {
                const isInMala = malaItems.some((item) => item.product.id === product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isInMala={isInMala}
                    onAddToMala={handleAddToMala}
                    onRemoveFromMala={handleRemoveFromMala}
                    onOpenQuickView={(prod: Product) => setQuickViewProduct(prod)}
                    isMalaFull={isMalaFull}
                  />
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border border-stone-200">
                <p className="text-sm text-stone-500">
                  Nenhuma peça encontrada para os filtros selecionados.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Todas');
                    setSelectedStyle('Todos');
                  }}
                  className="mt-3 text-xs text-stone-900 font-medium underline cursor-pointer"
                >
                  Restaurar todas as 15 roupas da coleção
                </button>
              </div>
            )}

            {/* Mala Bottom Callout */}
            {malaItems.length > 0 && (
              <div className="mt-12 p-6 md:p-8 rounded-2xl bg-[#141113] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-[#F2BAC7]/35">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#F5BAC7] font-semibold block">
                    Provador em Casa · Jô Bolsas Glamour
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-medium mt-1">
                    Pronta para receber seus {malaItems.length} itens no conforto do seu closet?
                  </h3>
                  <p className="text-xs text-[#BFA8B1] mt-1.5 max-w-lg">
                    Entregamos na sua porta ou deixamos pronto para retirada no balcão da loja. Você experimenta no seu próprio espelho por 48 horas!
                  </p>
                </div>
                <button
                  onClick={() => setIsAgendamentoOpen(true)}
                  className="px-6 py-3.5 bg-[#F5BAC7] text-[#141113] rounded-xl font-semibold text-xs sm:text-sm hover:bg-[#F2A3B4] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <span>Agendar Minha Mala</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>

          {/* Testimonials & Experience Section */}
          <TestimonialsExperience />
        </main>
      )}

      {/* Floating Mala Action Bar (Agendamento Flutuante) */}
      {activeView === 'store' && (
        <FloatingMalaBar
          malaItems={malaItems}
          onOpenMala={() => setIsMalaOpen(true)}
          onOpenAgendamento={() => setIsAgendamentoOpen(true)}
        />
      )}

      {/* Footer */}
      <Footer onOpenSellerArea={() => setActiveView('dashboard')} />

      {/* Drawers & Modals */}
      <MalaDrawer
        isOpen={isMalaOpen}
        onClose={() => setIsMalaOpen(false)}
        malaItems={malaItems}
        onRemoveItem={handleRemoveFromMala}
        onUpdateSize={handleUpdateSize}
        onToggleSecondarySize={handleToggleSecondarySize}
        onOpenAgendamento={() => {
          setIsMalaOpen(false);
          setIsAgendamentoOpen(true);
        }}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isInMala={quickViewProduct ? malaItems.some((item) => item.product.id === quickViewProduct.id) : false}
        onAddToMala={handleAddToMala}
        onRemoveFromMala={handleRemoveFromMala}
        isMalaFull={isMalaFull}
      />

      <CheckoutAgendamentoModal
        isOpen={isAgendamentoOpen}
        onClose={() => setIsAgendamentoOpen(false)}
        malaItems={malaItems}
        curationMode="self"
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}

function getNextSize(size: string): string {
  const letterMap: Record<string, string> = { PP: 'P', P: 'M', M: 'G', G: 'GG', GG: 'G' };
  const numMap: Record<string, string> = { '34': '36', '36': '38', '38': '40', '40': '42', '42': '44', '44': '42' };

  if (letterMap[size]) return letterMap[size];
  if (numMap[size]) return numMap[size];
  return 'M';
}
