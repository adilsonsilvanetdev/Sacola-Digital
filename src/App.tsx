import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { MalaDrawer } from './components/MalaDrawer';
import { CheckoutAgendamentoModal } from './components/CheckoutAgendamentoModal';
import { ConsultoraDashboard } from './components/ConsultoraDashboard';
import { PromotionsSection } from './components/PromotionsSection';
import { Footer } from './components/Footer';
import { FloatingMalaBar } from './components/FloatingMalaBar';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { SellerAuthModal } from './components/SellerAuthModal';
import { WhatsAppIcon } from './components/WhatsAppIcon';

import { Product, MalaItem, MalaOrder } from './types';
import { SAMPLE_PRODUCTS, MAX_MALA_ITEMS } from './data/products';
import { 
  getStoredProducts, 
  updateStoredProduct, 
  addStoredProduct, 
  deleteStoredProduct, 
  resetStoredProducts 
} from './utils/productStorage';
import { STORE_WHATSAPP_DISPLAY, STORE_WHATSAPP_NUMBER } from './utils/whatsappHelper';
import { EditProductModal } from './components/EditProductModal';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  ShoppingBag, 
  ArrowRight, 
  Search, 
  X, 
  DollarSign, 
  ArrowUpDown, 
  Tag,
  Flame 
} from 'lucide-react';

export default function App() {
  // Store or Stylist Dashboard view
  const [activeView, setActiveView] = useState<'store' | 'dashboard'>('store');

  // Dynamic Products Catalog (Stored in localStorage to persist photo/description/price edits)
  const [products, setProducts] = useState<Product[]>(() => {
    return getStoredProducts();
  });
  const [storeEditProduct, setStoreEditProduct] = useState<Product | null>(null);
  const [isStoreEditModalOpen, setIsStoreEditModalOpen] = useState(false);

  // Seller Authentication & Security (PIN/Senha)
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('jb_seller_auth') === 'true';
  });
  const [sellerPin, setSellerPin] = useState<string>(() => {
    return localStorage.getItem('jb_seller_pin') || 'josy2026';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Mala State
  const [malaItems, setMalaItems] = useState<MalaItem[]>([]);

  // Modals & Drawers
  const [isMalaOpen, setIsMalaOpen] = useState(false);
  const [isAgendamentoOpen, setIsAgendamentoOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Advanced Store Filters & Search (Consulta de Produtos e Valores)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedStyle, setSelectedStyle] = useState<string>('Todos');
  const [priceRange, setPriceRange] = useState<'all' | 'under250' | '250to450' | 'above450'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');

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
      neighborhood: 'Altos da Cidade',
      city: 'Bauru - SP',
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
      customerPhone: '(14) 99876-5432',
      deliveryType: 'pickup',
      address: 'Retirada na loja física (Rua: Dr José Ranieri N 5-28, Bauru - SP)',
      neighborhood: 'Loja Física',
      city: 'Bauru - SP',
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

  // Handle Opening Seller Area (Protected by Password/PIN)
  const handleOpenSellerArea = () => {
    if (isSellerAuthenticated) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setActiveView('dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleSellerAuthenticated = () => {
    setIsSellerAuthenticated(true);
    sessionStorage.setItem('jb_seller_auth', 'true');
    setIsAuthModalOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setActiveView('dashboard');
  };

  // Ao alternar para a área da vendedora, garante que a página esteja no topo absoluto
  useEffect(() => {
    if (activeView === 'dashboard') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [activeView]);

  const handleLogoutSeller = () => {
    setIsSellerAuthenticated(false);
    sessionStorage.removeItem('jb_seller_auth');
    setActiveView('store');
  };

  const handleUpdatePin = (newPin: string) => {
    setSellerPin(newPin);
    localStorage.setItem('jb_seller_pin', newPin);
  };

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

  // Handlers for updating photos, descriptions, and values across the store
  const handleUpdateProduct = (updated: Product) => {
    const next = updateStoredProduct(updated);
    setProducts(next);
    // Also update malaItems if the modified item is in the user's bag
    setMalaItems((prev) =>
      prev.map((item) => (item.product.id === updated.id ? { ...item, product: updated } : item))
    );
    showToast(`"${updated.name}" foi atualizado com sucesso!`);
  };

  const handleAddProduct = (newProd: Product) => {
    const next = addStoredProduct(newProd);
    setProducts(next);
    showToast(`"${newProd.name}" foi adicionado ao catálogo!`);
  };

  const handleDeleteProduct = (productId: string) => {
    const next = deleteStoredProduct(productId);
    setProducts(next);
    setMalaItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Produto removido do catálogo.');
  };

  const handleResetProducts = () => {
    const next = resetStoredProducts();
    setProducts(next);
    showToast('Catálogo restaurado para o padrão original de fábrica.');
  };

  const handleOpenStoreEdit = (product: Product) => {
    setStoreEditProduct(product);
    setIsStoreEditModalOpen(true);
  };

  // Ao abrir a página, foca/rola automaticamente para 'Acesse a Loja' exibindo os produtos à venda (apenas na loja)
  useEffect(() => {
    if (activeView !== 'store') return;
    const scrollToStore = () => {
      if (activeView !== 'store') return;
      const el = document.getElementById('colecao');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const timer = setTimeout(scrollToStore, 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter products
  const categories = ['Todas', 'Promoções', 'Bolsas', 'Carteiras', 'Vestidos', 'Blazers & Alfaiataria', 'Camisas & Blusas', 'Calças & Shorts', 'Conjuntos & Tricot', 'Casacos'];
  const styles = ['Todos', 'Alfaiataria Sofisticada', 'Casual Elegante', 'Romântica & Fluida', 'Moderna & Minimalista', 'Festiva & Noite'];

  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => {
      // Search query filter (Nome, Descrição, Tecido, Cor, Categoria)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchFabric = product.fabric.toLowerCase().includes(q);
        const matchColor = product.color.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchFabric && !matchColor && !matchCat) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'Todas') {
        if (selectedCategory === 'Promoções') {
          const isPromo = product.isPromotion || (product.originalPrice && product.originalPrice > product.price);
          if (!isPromo) return false;
        } else if (selectedCategory === 'Bolsas') {
          const isBag = product.category.toLowerCase().includes('bolsa') || product.name.toLowerCase().includes('bolsa');
          if (!isBag) return false;
        } else if (selectedCategory === 'Carteiras') {
          const isWallet = product.category.toLowerCase().includes('carteira') || product.name.toLowerCase().includes('carteira');
          if (!isWallet) return false;
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }

      // Style filter
      if (selectedStyle !== 'Todos') {
        if (!product.styleKeywords?.includes(selectedStyle)) {
          return false;
        }
      }

      // Price filter
      if (priceRange === 'under250' && product.price > 250) return false;
      if (priceRange === '250to450' && (product.price <= 250 || product.price > 450)) return false;
      if (priceRange === 'above450' && product.price <= 450) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, searchQuery, selectedCategory, selectedStyle, priceRange, sortBy]);

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedCategory !== 'Todas' || 
    selectedStyle !== 'Todos' || 
    priceRange !== 'all' || 
    sortBy !== 'featured';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setSelectedStyle('Todos');
    setPriceRange('all');
    setSortBy('featured');
  };

  const isMalaFull = malaItems.length >= MAX_MALA_ITEMS;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        malaItems={malaItems}
        onOpenMala={() => setIsMalaOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSellerAuth={handleOpenSellerArea}
        isSellerAuthenticated={isSellerAuthenticated}
        addedToastMessage={addedToastMessage}
      />

      {activeView === 'dashboard' ? (
        /* Área da Vendedora Josy (Protegida por Senha / PIN) */
        <ConsultoraDashboard
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onReturnToStore={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            setActiveView('store');
          }}
          onCreateOrderByStylist={(newOrder) => setOrders((prev) => [newOrder, ...prev])}
          onLogout={handleLogoutSeller}
          currentPin={sellerPin}
          onUpdatePin={handleUpdatePin}
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetProducts={handleResetProducts}
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
          />

          {/* How it works 4-step Section */}
          <HowItWorks
            onExploreCatalog={() => {
              const el = document.getElementById('colecao');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Catalog Section: 15 Fictional Women's Garments */}
          <section id="colecao" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
            
            {/* Catalog Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B84E67] font-semibold block mb-1">
                  Bolsas & Peças Exclusivas · Pronta Entrega ou Provador 48h
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-[#181316] font-medium">
                  Coleção Jô Bolsas Glamour
                </h2>
                <p className="text-[#5A4D54] text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Consulte nosso catálogo completo com fotos, descrições detalhadas e valores transparentes. Compre diretamente pelo WhatsApp com a Josy ou selecione até {MAX_MALA_ITEMS} peças para provar em casa por 48 horas!
                </p>
              </div>

              {/* Counter Pill */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsMalaOpen(true)}
                  className="bg-[#FAF6F7] hover:bg-[#FCEEF2] border border-[#F2DEE4] px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#B84E67]" />
                  <span className="text-xs text-[#5A4D54]">Sua Mala:</span>
                  <span className="text-xs font-semibold text-[#181316]">
                    {malaItems.length} de {MAX_MALA_ITEMS} peças
                  </span>
                </button>
              </div>
            </div>

            {/* 2 Opções de Experiência: 1) Venda Direta WhatsApp & 2) Mala Provador Digital */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {/* Opção 1: Venda Direta WhatsApp */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#F5FBF6] to-white border border-[#CDEED5] flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#0d6832] flex items-center gap-1.5">
                      <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                      Venda Direta · Envio ou Balcão
                    </span>
                    <span className="text-[11px] font-bold text-[#0d6832] bg-[#E3F9E9] px-2.5 py-0.5 rounded-full border border-[#B7F0C7]">
                      {STORE_WHATSAPP_DISPLAY}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#181316]">
                    Compre na hora direto no WhatsApp
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5D50] mt-1.5 leading-relaxed">
                    Cada produto possui o botão <strong className="text-[#0d6832]">"Comprar no WhatsApp"</strong> com link que preenche a peça, cor e tamanho. Atendimento direto com a Josy para entrega rápida ou retirada no balcão!
                  </p>
                </div>
                <div className="pt-3.5 mt-3.5 border-t border-[#DDF4E4] flex items-center justify-between text-xs text-[#2F523B]">
                  <span>Parcelamento em até 3x sem juros ou à vista</span>
                  <a
                    href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá Josy! Gostaria de consultar os produtos da loja.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#0d6832] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Falar no WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Opção 2: Mala Provador em Casa 48h */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#FFF8FA] to-white border border-[#F2DEE4] flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-[#B84E67] flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-[#B84E67]" />
                      Provador em Casa · Mala 48 Horas
                    </span>
                    <span className="text-[11px] font-bold text-[#B84E67] bg-[#FDF2F4] px-2.5 py-0.5 rounded-full border border-[#F2DEE4]">
                      Até {MAX_MALA_ITEMS} peças
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#181316]">
                    Experimente no conforto do seu closet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A4D54] mt-1.5 leading-relaxed">
                    Escolha suas bolsas e roupas prediletas com <strong className="text-[#B84E67]">"Experimentar na Mala"</strong>. Enviamos tamanhos reservas, você prova por 48 horas com seus sapatos e só paga o que amar!
                  </p>
                </div>
                <div className="pt-3.5 mt-3.5 border-t border-[#F8E2E8] flex items-center justify-between text-xs text-[#7A5B66]">
                  <span>{malaItems.length} de {MAX_MALA_ITEMS} peças na sua mala atual</span>
                  <button
                    onClick={() => setIsMalaOpen(true)}
                    className="font-semibold text-[#B84E67] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver Minha Mala</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Barra de Pesquisa, Filtros de Categoria, Faixa de Preço e Ordenação */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F0D5DD] shadow-2xs space-y-4 mb-8">
              {/* Linha 1: Input de Busca + Faixa de Preço + Ordenação */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar bolsas, blazers, vestidos, sedas, cores ou tecidos..."
                    className="w-full pl-9 pr-9 py-2.5 bg-[#FAF6F7] border border-[#F0D5DD] rounded-xl text-xs sm:text-sm text-[#181316] placeholder:text-[#8C7A82] focus:outline-none focus:border-[#B84E67] focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                      aria-label="Limpar busca"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filtro de Faixa de Preço */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7A6B73] font-medium shrink-0 hidden lg:inline">Faixa de Preço:</span>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="px-3 py-2.5 bg-[#FAF6F7] border border-[#F0D5DD] rounded-xl text-xs text-[#181316] font-medium focus:outline-none focus:border-[#B84E67] cursor-pointer"
                  >
                    <option value="all">Todos os Preços</option>
                    <option value="under250">Até R$ 250,00</option>
                    <option value="250to450">R$ 250 a R$ 450,00</option>
                    <option value="above450">Acima de R$ 450,00</option>
                  </select>
                </div>

                {/* Ordenação */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7A6B73] font-medium shrink-0 hidden lg:inline">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2.5 bg-[#FAF6F7] border border-[#F0D5DD] rounded-xl text-xs text-[#181316] font-medium focus:outline-none focus:border-[#B84E67] cursor-pointer"
                  >
                    <option value="featured">Destaques & Curadoria</option>
                    <option value="price-asc">Menor Preço (R$)</option>
                    <option value="price-desc">Maior Preço (R$)</option>
                    <option value="name-asc">Nome (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Linha 2: Categorias */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#F7E8EC]">
                <span className="text-xs font-semibold text-stone-500 mr-1 shrink-0 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#B84E67]" />
                  Categorias:
                </span>
                {categories.map((cat) => {
                  const isPromoCat = cat === 'Promoções';
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isPromoCat
                          ? isSelected
                            ? 'bg-gradient-to-r from-[#E11D48] to-[#9F1239] text-white font-black shadow-sm ring-2 ring-[#FFE4E6]'
                            : 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] hover:bg-[#FFE4E6] font-bold'
                          : isSelected
                            ? 'bg-[#181316] text-[#F5BAC7] font-semibold shadow-2xs'
                            : 'bg-white text-[#5A4D54] border border-[#F0D5DD] hover:bg-[#FAF6F7]'
                      }`}
                    >
                      {isPromoCat && <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Linha 3: Estilos + Contador de Resultados + Botão Limpar */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs pt-1">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs text-stone-400 mr-1 shrink-0">Estilos:</span>
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
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <span className="text-xs text-[#7A6B73]">
                    <strong className="text-[#181316]">{filteredProducts.length}</strong> de {products.length} peças encontradas
                  </span>

                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-[#B84E67] hover:text-[#9C384E] flex items-center gap-1 font-semibold underline cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Limpar Filtros</span>
                    </button>
                  )}
                </div>
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
                    onEditProduct={isSellerAuthenticated ? handleOpenStoreEdit : undefined}
                  />
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#F0D5DD] p-8 shadow-2xs">
                <p className="text-sm text-stone-700 font-medium">
                  Nenhuma peça ou bolsa encontrada para os filtros selecionados.
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Tente alterar os termos de busca, categoria ou faixa de preço.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2.5 bg-[#181316] text-[#FAF6F7] rounded-xl text-xs font-semibold hover:bg-[#2A2025] transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#F5BAC7]" />
                  <span>Restaurar todas as peças da coleção</span>
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

          {/* Seção Promoções & Produtos Especiais (Cor em destaque) */}
          <PromotionsSection
            products={products}
            onOpenQuickView={(prod) => setQuickViewProduct(prod)}
            onAddToMala={(prod, size) => handleAddToMala(prod, size || 'M')}
            isInMala={(id) => malaItems.some((it) => it.product.id === id)}
          />
        </main>
      )}

      {/* Floating Mala Action Bar (Agendamento Flutuante) */}
      {activeView === 'store' && (
        <>
          <FloatingMalaBar
            malaItems={malaItems}
            onOpenMala={() => setIsMalaOpen(true)}
            onOpenAgendamento={() => setIsAgendamentoOpen(true)}
          />
          <FloatingWhatsAppButton hasActiveMalaItems={malaItems.length > 0} />
        </>
      )}

      {/* Footer */}
      <Footer onOpenSellerArea={handleOpenSellerArea} />

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
        onEditProduct={isSellerAuthenticated ? handleOpenStoreEdit : undefined}
      />

      <CheckoutAgendamentoModal
        isOpen={isAgendamentoOpen}
        onClose={() => setIsAgendamentoOpen(false)}
        malaItems={malaItems}
        curationMode="self"
        onSuccess={handleOrderSuccess}
      />

      {/* Modal de Autenticação / Senha da Vendedora Josy */}
      <SellerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleSellerAuthenticated}
        currentPin={sellerPin}
      />

      {/* Modal de Edição de Produto direto da Loja (quando logada como Josy) */}
      <EditProductModal
        product={storeEditProduct}
        isOpen={isStoreEditModalOpen}
        onClose={() => setIsStoreEditModalOpen(false)}
        onSaveProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
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
