import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CuratorQuizModal } from './components/CuratorQuizModal';
import { MalaDrawer } from './components/MalaDrawer';
import { CheckoutAgendamentoModal } from './components/CheckoutAgendamentoModal';
import { ConsultoraDashboard } from './components/ConsultoraDashboard';
import { TestimonialsExperience } from './components/TestimonialsExperience';
import { Footer } from './components/Footer';
import { FloatingMalaBar } from './components/FloatingMalaBar';

import { Product, MalaItem, MalaOrder, StylistQuizAnswers } from './types';
import { SAMPLE_PRODUCTS, MAX_MALA_ITEMS } from './data/products';
import { Sparkles, SlidersHorizontal, RotateCcw, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export default function App() {
  // Store or Stylist Dashboard view
  const [activeView, setActiveView] = useState<'store' | 'dashboard'>('store');

  // Mala State
  const [malaItems, setMalaItems] = useState<MalaItem[]>([]);
  const [curationMode, setCurationMode] = useState<'self' | 'stylist'>('self');
  const [stylistNote, setStylistNote] = useState<string | undefined>(undefined);
  const [quizAnswers, setQuizAnswers] = useState<StylistQuizAnswers | undefined>(undefined);

  // Modals & Drawers
  const [isQuizOpen, setIsQuizOpen] = useState(false);
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
      id: 'BELLA-ML-7842',
      customerName: 'Mariana de Albuquerque',
      customerPhone: '(11) 98123-4567',
      address: 'Alameda Lorena, 1420 - Apto 91',
      neighborhood: 'Jardins',
      city: 'São Paulo - SP',
      scheduledDate: '2026-10-04',
      scheduledTimeSlot: 'Manhã (09h às 13h)',
      curationMode: 'stylist',
      stylistNote: 'Mariana solicitou mala para reuniões de diretoria e evento noturno. Selecionei blazer de linho areia, calça pantalona off-white e top ombro só noir.',
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
      id: 'BELLA-ML-6291',
      customerName: 'Beatriz Fontes',
      customerPhone: '(11) 99876-5432',
      address: 'Rua Bela Cintra, 890 - Casa 3',
      neighborhood: 'Consolação',
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

  // Apply Stylist Curation from Quiz
  const handleApplyCuration = (
    items: MalaItem[],
    answers: StylistQuizAnswers,
    note: string
  ) => {
    setMalaItems(items);
    setCurationMode('stylist');
    setStylistNote(note);
    setQuizAnswers(answers);
    setIsMalaOpen(true);
    showToast(`Curadoria da Consultora aplicada com ${items.length} peças!`);
  };

  // Order completed
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
        onOpenQuiz={() => setIsQuizOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        addedToastMessage={addedToastMessage}
      />

      {activeView === 'dashboard' ? (
        /* Seller / Stylist Backoffice View */
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
            onOpenQuiz={() => setIsQuizOpen(true)}
            onExploreCatalog={() => {
              const el = document.getElementById('colecao');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* How it works 4-step Section */}
          <HowItWorks
            onOpenQuiz={() => setIsQuizOpen(true)}
            onExploreCatalog={() => {
              const el = document.getElementById('colecao');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Catalog Section: 15 Fictional Women's Garments */}
          <section id="colecao" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Curated Mode Banner if active */}
            {curationMode === 'stylist' && stylistNote && (
              <div className="mb-10 p-5 rounded-lg bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-amber-200" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-semibold text-amber-900 tracking-wider">
                      Mala com Curadoria da Personal Shopper Ativa
                    </span>
                    <p className="text-xs sm:text-sm text-stone-700 mt-0.5">
                      Você pode manter a curadoria recomendada ou adicionar/substituir peças do catálogo abaixo à vontade (capacidade de até {MAX_MALA_ITEMS} peças).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setIsMalaOpen(true)}
                    className="px-3.5 py-1.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Ver Mala ({malaItems.length})
                  </button>
                  <button
                    onClick={() => {
                      setCurationMode('self');
                      setStylistNote(undefined);
                    }}
                    className="px-3 py-1.5 bg-white border border-stone-300 text-stone-600 rounded text-xs font-medium hover:bg-stone-50 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Trocar para Modo Livre
                  </button>
                </div>
              </div>
            )}

            {/* Catalog Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold block mb-1">
                  Peças Exclusivas para Consignação em Casa
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-stone-900 font-medium">
                  Coleção Cápsula Feminina
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm mt-1">
                  15 peças em tecidos nobres (linho puro europeu, seda mulberry, tricot modal e crepe encorpado). Escolha até {MAX_MALA_ITEMS} peças para seu provador de 48h.
                </p>
              </div>

              {/* Mala Capacity Floating Quick Badge */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMalaOpen(true)}
                  className="px-4 py-2 bg-stone-100 border border-stone-200 rounded text-xs font-medium text-stone-800 hover:bg-stone-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-stone-700" />
                  <span>Sua Mala: <strong>{malaItems.length}/{MAX_MALA_ITEMS}</strong> peças</span>
                </button>
              </div>
            </div>

            {/* Interactive Filters: Categories (Segmented functional controls) */}
            <div className="space-y-4 mb-8 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs text-stone-400 font-medium shrink-0 mr-1">Categoria:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Style Sub-filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs text-stone-400 font-medium shrink-0 mr-1">Estilo:</span>
                {styles.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStyle(st)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap cursor-pointer ${
                      selectedStyle === st
                        ? 'bg-stone-200 text-stone-900 font-semibold'
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
                    className="text-xs text-amber-900 underline hover:text-stone-900 ml-2 whitespace-nowrap cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid: 3-column desktop layout as per ecommerce reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInMala={malaItems.some((item) => item.product.id === product.id)}
                  onAddToMala={handleAddToMala}
                  onRemoveFromMala={handleRemoveFromMala}
                  onOpenQuickView={(prod) => setQuickViewProduct(prod)}
                  isMalaFull={isMalaFull}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded border border-stone-200 p-8">
                <p className="text-stone-600 text-sm">
                  Nenhuma peça encontrada com os filtros selecionados.
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

            {/* Bottom Callout to Schedule Mala */}
            {malaItems.length > 0 && (
              <div className="mt-12 p-6 rounded-lg bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
                    Provador Particular Agendado
                  </span>
                  <h3 className="font-editorial text-2xl font-medium mt-1">
                    Pronta para receber suas {malaItems.length} peças selecionadas em casa?
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-lg">
                    Entregamos na sua porta. Você experimenta no seu próprio espelho por 48 horas e nós retiramos o que não ficar.
                  </p>
                </div>
                <button
                  onClick={() => setIsAgendamentoOpen(true)}
                  className="px-6 py-3 bg-amber-200 text-stone-900 rounded font-medium text-xs sm:text-sm hover:bg-amber-300 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 shadow"
                >
                  <span>Agendar Entrega da Minha Mala</span>
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
      <Footer onOpenQuiz={() => setIsQuizOpen(true)} />

      {/* Modals & Drawers */}
      <CuratorQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onApplyCuration={handleApplyCuration}
      />

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
        onOpenQuiz={() => {
          setIsMalaOpen(false);
          setIsQuizOpen(true);
        }}
        curationMode={curationMode}
        stylistNote={stylistNote}
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
        curationMode={curationMode}
        stylistNote={stylistNote}
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
