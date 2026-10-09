import React, { useState, useMemo, useEffect } from 'react';
import { 
  Package, Clock, CheckCircle2, User, MapPin, Sparkles, MessageCircle, 
  FileText, Send, RefreshCw, ArrowLeft, Plus, ExternalLink, Copy, Store, 
  Search, Trash2, Check, ShoppingBag, Eye, Calendar, Phone, Home, AlertCircle,
  Lock, KeyRound, Pencil, Tag, SlidersHorizontal
} from 'lucide-react';
import { MalaOrder, MalaItem, Product } from '../types';
import { SAMPLE_PRODUCTS, MAX_MALA_ITEMS } from '../data/products';
import { 
  buildStylistToClientWhatsAppLink, 
  getStylistOrderPlainText, 
  cleanPhoneNumber 
} from '../utils/whatsappHelper';
import { EditProductModal } from './EditProductModal';

interface ConsultoraDashboardProps {
  orders: MalaOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: MalaOrder['status']) => void;
  onReturnToStore: () => void;
  onCreateOrderByStylist?: (order: MalaOrder) => void;
  onLogout?: () => void;
  currentPin?: string;
  onUpdatePin?: (newPin: string) => void;
  products?: Product[];
  onUpdateProduct?: (product: Product) => void;
  onAddProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onResetProducts?: () => void;
}

export const ConsultoraDashboard: React.FC<ConsultoraDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onReturnToStore,
  onCreateOrderByStylist,
  onLogout,
  currentPin = 'josy2026',
  onUpdatePin,
  products = SAMPLE_PRODUCTS,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetProducts,
}) => {
  // Navigation tabs: 'create' (Montar Mala), 'products' (Gerenciar Catálogo) or 'orders' (Gerenciar Malas)
  const [activeTab, setActiveTab] = useState<'create' | 'products' | 'orders'>('create');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinValue, setNewPinValue] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Ao abrir a área da vendedora ou alternar abas, garante que inicie sempre no topo superior
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  // Edit / Add product modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productManagerSearch, setProductManagerSearch] = useState('');
  const [productManagerCategory, setProductManagerCategory] = useState('Todas');

  // Selected order for inspection in 'orders' tab
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');

  // --- STATE FOR "MONTAR MALA PARA CLIENTE" (VENDEDORA JOSY) ---
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  
  // Delivery address fields (identical to customer checkout)
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('Bauru - SP');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Date and Time slot
  const tomorrowDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);
  const [scheduledDate, setScheduledDate] = useState(tomorrowDate);
  const [timeSlot, setTimeSlot] = useState<MalaOrder['scheduledTimeSlot']>('Tarde (14h às 18h)');

  // Stylist personalized note from Josy
  const [stylistLetter, setStylistLetter] = useState(
    'Preparei esta seleção de bolsas e peças exclusivas pensando em você! Você tem 48 horas para provar com seus sapatos e espelho no conforto de casa. Qualquer dúvida estou à disposição no WhatsApp!'
  );

  // Selected items in Josy's bag
  const [selectedItems, setSelectedItems] = useState<MalaItem[]>([
    {
      product: SAMPLE_PRODUCTS[0],
      selectedSize: SAMPLE_PRODUCTS[0].sizes[0] || 'M',
      requestSecondarySize: true,
      secondarySize: SAMPLE_PRODUCTS[0].sizes[1] || 'G',
    },
    {
      product: SAMPLE_PRODUCTS[1],
      selectedSize: SAMPLE_PRODUCTS[1].sizes[0] || 'P',
      requestSecondarySize: false,
    },
    {
      product: SAMPLE_PRODUCTS[8], // Bolsa/Saia
      selectedSize: SAMPLE_PRODUCTS[8].sizes[0] || '38',
      requestSecondarySize: false,
    },
  ]);

  // Catalog filtering inside seller's product picker
  const [catalogCategory, setCatalogCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI feedback states
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [createdSuccessOrder, setCreatedSuccessOrder] = useState<MalaOrder | null>(null);

  // Filtered products for Josy to browse
  const categories = ['Todas', 'Bolsas', 'Vestidos', 'Blazers & Alfaiataria', 'Camisas & Blusas', 'Calças & Shorts', 'Conjuntos & Tricot', 'Casacos'];

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        catalogCategory === 'Todas' ||
        (catalogCategory === 'Bolsas' && (prod.category.toLowerCase().includes('bolsa') || prod.name.toLowerCase().includes('bolsa'))) ||
        prod.category.toLowerCase().includes(catalogCategory.toLowerCase());

      const matchesSearch =
        searchQuery === '' ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, catalogCategory, searchQuery]);

  // Filtered products for the Product Manager tab (Substituição de Fotos, Descrições e Valores)
  const managedProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        productManagerCategory === 'Todas' ||
        (productManagerCategory === 'Bolsas' && (prod.category.toLowerCase().includes('bolsa') || prod.name.toLowerCase().includes('bolsa'))) ||
        prod.category.toLowerCase().includes(productManagerCategory.toLowerCase());

      const matchesSearch =
        productManagerSearch === '' ||
        prod.name.toLowerCase().includes(productManagerSearch.toLowerCase()) ||
        prod.description.toLowerCase().includes(productManagerSearch.toLowerCase()) ||
        prod.fabric.toLowerCase().includes(productManagerSearch.toLowerCase()) ||
        prod.color.toLowerCase().includes(productManagerSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, productManagerCategory, productManagerSearch]);

  // Product selection helpers
  const handleToggleProduct = (product: Product) => {
    const existsIndex = selectedItems.findIndex((it) => it.product.id === product.id);
    if (existsIndex >= 0) {
      setSelectedItems((prev) => prev.filter((it) => it.product.id !== product.id));
    } else {
      if (selectedItems.length >= MAX_MALA_ITEMS) {
        alert(`A mala atingiu o limite de ${MAX_MALA_ITEMS} peças.`);
        return;
      }
      setSelectedItems((prev) => [
        ...prev,
        {
          product,
          selectedSize: product.sizes[0] || 'M',
          requestSecondarySize: false,
          secondarySize: product.sizes[1] || undefined,
        },
      ]);
    }
  };

  const handleUpdateItemSize = (productId: string, newSize: string) => {
    setSelectedItems((prev) =>
      prev.map((it) =>
        it.product.id === productId ? { ...it, selectedSize: newSize } : it
      )
    );
  };

  const handleToggleSecondarySize = (productId: string) => {
    setSelectedItems((prev) =>
      prev.map((it) => {
        if (it.product.id !== productId) return it;
        const willRequest = !it.requestSecondarySize;
        const pSizes = it.product.sizes;
        const curIdx = pSizes.indexOf(it.selectedSize as any);
        const nextSize = curIdx >= 0 && curIdx < pSizes.length - 1 ? pSizes[curIdx + 1] : pSizes[0];
        return {
          ...it,
          requestSecondarySize: willRequest,
          secondarySize: willRequest ? nextSize : undefined,
        };
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  // Consigned total
  const totalConsigned = useMemo(() => {
    return selectedItems.reduce((acc, it) => acc + it.product.price, 0);
  }, [selectedItems]);

  // Build a draft order object for live preview and link generation
  const draftOrder: MalaOrder = useMemo(() => {
    const isPickup = deliveryType === 'pickup' || !street.trim();
    const fullAddress = isPickup
      ? 'Retirada na loja física (balcão)'
      : `${street.trim()}${number.trim() ? `, ${number.trim()}` : ''}${complement.trim() ? ` - ${complement.trim()}` : ''}`;

    return {
      id: createdSuccessOrder?.id || `JB-ML-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: clientName.trim() || 'Cliente Especial',
      customerPhone: clientPhone.trim() || '(11) 99999-8888',
      deliveryType,
      address: fullAddress,
      neighborhood: isPickup ? 'Loja Física' : (neighborhood.trim() || 'A combinar'),
      city,
      street: street.trim(),
      number: number.trim(),
      complement: complement.trim(),
      deliveryInstructions: deliveryInstructions.trim(),
      scheduledDate,
      scheduledTimeSlot: timeSlot,
      items: selectedItems,
      curationMode: 'stylist',
      stylistNote: stylistLetter,
      status: 'em_separacao',
      createdAt: 'Criada pela Vendedora Josy',
    };
  }, [
    createdSuccessOrder,
    clientName,
    clientPhone,
    deliveryType,
    street,
    number,
    complement,
    neighborhood,
    city,
    deliveryInstructions,
    scheduledDate,
    timeSlot,
    selectedItems,
    stylistLetter,
  ]);

  const liveWhatsAppText = useMemo(() => {
    return getStylistOrderPlainText(draftOrder, stylistLetter);
  }, [draftOrder, stylistLetter]);

  const liveWhatsAppLink = useMemo(() => {
    return buildStylistToClientWhatsAppLink(draftOrder, stylistLetter);
  }, [draftOrder, stylistLetter]);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(liveWhatsAppText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveWhatsAppLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveAndCreateBag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor, informe o Nome da Cliente e o WhatsApp.');
      return;
    }
    if (selectedItems.length === 0) {
      alert('Selecione pelo menos 1 peça para a mala da cliente.');
      return;
    }

    const newOrder: MalaOrder = {
      ...draftOrder,
      id: `JB-ML-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    if (onCreateOrderByStylist) {
      onCreateOrderByStylist(newOrder);
    }
    setCreatedSuccessOrder(newOrder);
    setSelectedOrderId(newOrder.id);
  };

  const handleResetForm = () => {
    setCreatedSuccessOrder(null);
    setClientName('');
    setClientPhone('');
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setDeliveryInstructions('');
    setSelectedItems([]);
  };

  // Status labels for the orders tracking view
  const statusLabels: Record<MalaOrder['status'], { label: string; color: string }> = {
    solicitada: { label: 'Solicitada pelo Site', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    em_separacao: { label: 'Em Separação (Josy)', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    em_rota: { label: 'Em Rota / Pronta p/ Retirada', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    em_provador_48h: { label: 'Em Provador 48h (Com Cliente)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    concluida: { label: 'Finalizada / Faturada', color: 'bg-stone-100 text-stone-700 border-stone-200' },
  };

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  return (
    <div className="min-h-screen bg-[#FAF6F7] pb-24">
      {/* Top Header Banner */}
      <div className="bg-[#141113] text-white py-6 border-b border-[#2A2025]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#F5BAC7] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F5BAC7]" />
                Área da Vendedora Josy · Jô Bolsas Glamour
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-medium mt-1 text-white">
              Montar Mala para Cliente & Gestão de Provadores
            </h1>
            <p className="text-xs text-[#D9C4CC] mt-1 max-w-2xl">
              Escolha os produtos para a cliente, preencha os dados de entrega ou retirada e envie com mensagem personalizada assinada por Josy direto para o WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsChangingPin(true)}
              className="px-3 py-2 bg-[#251E22] text-[#F0D5DD] hover:text-white hover:bg-[#32282E] border border-[#F2BAC7]/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Alterar o PIN / Senha de acesso da vendedora"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#F5BAC7]" />
              <span>Alterar Senha</span>
            </button>

            <button
              onClick={onReturnToStore}
              className="px-3 py-2 bg-[#251E22] text-[#F0D5DD] hover:text-white hover:bg-[#32282E] border border-[#F2BAC7]/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver Loja</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-2 bg-red-950/60 hover:bg-red-900 text-red-200 hover:text-white border border-red-700/50 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Sair e bloquear acesso à área da vendedora"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear / Sair</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="bg-white border-b border-[#F2DEE4] sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 py-2.5">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-[#141113] text-white shadow-xs'
                : 'text-[#5A4D54] hover:bg-[#FAF6F7] hover:text-[#141113]'
            }`}
          >
            <Plus className="w-4 h-4 text-[#F5BAC7]" />
            <span>Montar Mala para Cliente</span>
            <span className="bg-[#B84E67] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {selectedItems.length}/{MAX_MALA_ITEMS}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#141113] text-white shadow-xs'
                : 'text-[#5A4D54] hover:bg-[#FAF6F7] hover:text-[#141113]'
            }`}
          >
            <Tag className="w-4 h-4 text-[#F5BAC7]" />
            <span>Gerenciar Produtos (Fotos, Preços & Descrições)</span>
            <span className="bg-[#FAF0F3] text-[#B84E67] border border-[#F2BAC7]/40 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {products.length} peças
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#141113] text-white shadow-xs'
                : 'text-[#5A4D54] hover:bg-[#FAF6F7] hover:text-[#141113]'
            }`}
          >
            <Package className="w-4 h-4 text-[#F5BAC7]" />
            <span>Malas Ativas & Pedidos ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* CONTENT ZONE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* =============================================================== */}
        {/* TAB 1: MONTAR MALA PARA CLIENTE (VENDEDORA JOSY)                */}
        {/* =============================================================== */}
        {activeTab === 'create' && (
          <div className="space-y-8">
            
            {/* Success Banner if Order Just Created */}
            {createdSuccessOrder && (
              <div className="p-5 rounded-2xl bg-[#EBF7F0] border border-[#C3E8D1] shadow-sm animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950">
                        Mala N° {createdSuccessOrder.id} montada com sucesso por Josy!
                      </h3>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Destinatária: <strong>{createdSuccessOrder.customerName}</strong> ({createdSuccessOrder.customerPhone}) · {createdSuccessOrder.items.length} peças
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={liveWhatsAppLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Abrir WhatsApp da Cliente</span>
                    </a>

                    <button
                      onClick={handleCopyMessage}
                      className="px-3 py-2 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-medium hover:bg-emerald-50 cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedText ? 'Copiado!' : 'Copiar Texto'}</span>
                    </button>

                    <button
                      onClick={handleResetForm}
                      className="px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 cursor-pointer"
                    >
                      Montar Nova Mala
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT 7 COLS: STEP 1 - PRODUCT SELECTION */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Section Header */}
                <div className="bg-white rounded-2xl p-6 border border-[#F2DEE4] shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2DEE4] pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#B84E67]">
                        Passo 1 · Seleção de Peças por Josy
                      </span>
                      <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#181316]">
                        Escolher Produtos para a Mala ({selectedItems.length} de {MAX_MALA_ITEMS})
                      </h2>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#7A6B73] block">Consignação Total</span>
                      <span className="text-base font-bold text-[#181316] tabular-nums">
                        R$ {totalConsigned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar bolsa ou peça por nome, tecido, cor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAF6F7] border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                      />
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCatalogCategory(cat)}
                          className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                            catalogCategory === cat
                              ? 'bg-[#181316] text-[#F5BAC7]'
                              : 'bg-white border border-[#F0D5DD] text-[#5A4D54] hover:bg-[#FAF6F7]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Items Summary Drawer / Tray */}
                {selectedItems.length > 0 && (
                  <div className="bg-[#FAF6F7] rounded-2xl p-4 sm:p-5 border border-[#F2DEE4] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#181316] flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-[#B84E67]" />
                        <span>Peças Adicionadas na Mala ({selectedItems.length}/{MAX_MALA_ITEMS})</span>
                      </span>
                      <button
                        onClick={() => setSelectedItems([])}
                        className="text-[11px] text-[#B84E67] hover:underline cursor-pointer"
                      >
                        Limpar seleção
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                      {selectedItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="p-3 bg-white rounded-xl border border-[#F0D5DD] flex items-start gap-3 shadow-2xs"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-14 object-cover rounded-lg bg-stone-100 shrink-0"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs font-semibold text-[#181316] truncate">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => handleRemoveItem(item.product.id)}
                                className="text-stone-400 hover:text-red-600 p-0.5 cursor-pointer"
                                title="Remover da mala"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-[#7A6B73]">Cor: {item.product.color}</span>
                              <span className="font-semibold text-[#181316]">
                                R$ {item.product.price}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 pt-0.5">
                              <label className="text-[10px] text-[#5A4D54]">Tam:</label>
                              <select
                                value={item.selectedSize}
                                onChange={(e) => handleUpdateItemSize(item.product.id, e.target.value)}
                                className="text-[11px] py-0.5 px-1.5 bg-[#FAF6F7] border border-[#F0D5DD] rounded text-[#181316] font-medium cursor-pointer"
                              >
                                {item.product.sizes.map((sz) => (
                                  <option key={sz} value={sz}>{sz}</option>
                                ))}
                              </select>

                              <label className="flex items-center gap-1 text-[10px] text-[#5A4D54] cursor-pointer ml-auto">
                                <input
                                  type="checkbox"
                                  checked={item.requestSecondarySize || false}
                                  onChange={() => handleToggleSecondarySize(item.product.id)}
                                  className="rounded text-[#B84E67]"
                                />
                                <span>+ Reserva</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredProducts.map((prod) => {
                    const isSelected = selectedItems.some((it) => it.product.id === prod.id);

                    return (
                      <div
                        key={prod.id}
                        className={`p-3.5 rounded-2xl border transition-all bg-white flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#B84E67] ring-2 ring-[#B84E67]/20 shadow-sm'
                            : 'border-[#F2DEE4] hover:border-[#D87F95]'
                        }`}
                      >
                        <div className="flex gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-16 h-20 object-cover rounded-xl bg-stone-100 shrink-0 border border-[#F0D5DD]"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-[#B84E67] block">
                              {prod.category}
                            </span>
                            <h3 className="text-xs font-semibold text-[#181316] line-clamp-2 mt-0.5">
                              {prod.name}
                            </h3>
                            <div className="text-[11px] text-[#7A6B73] mt-0.5">
                              Cor: {prod.color}
                            </div>
                            <div className="text-xs font-bold text-[#181316] mt-1">
                              R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#F0D5DD] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProduct(prod);
                                setIsEditModalOpen(true);
                              }}
                              title="Substituir foto, descrição ou valor desta peça"
                              className="p-1 text-[#B84E67] hover:bg-[#FAF0F3] rounded-md transition-colors cursor-pointer border border-[#F2BAC7]/40"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <span className="text-[11px] text-[#5A4D54]">
                              {prod.sizes.join(', ')}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleProduct(prod)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#181316] text-[#F5BAC7]'
                                : 'bg-[#FAF6F7] text-[#181316] border border-[#F0D5DD] hover:bg-[#FDF2F4] hover:text-[#B84E67]'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Na Mala</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Adicionar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* RIGHT 5 COLS: STEP 2 - CLIENT DETAILS & WHATSAPP GENERATION */}
              {/* DADOS IGUAIS QUANDO O CLIENTE SOLICITA PRA RETIRADA OU ENTREGA */}
              <div className="lg:col-span-5 space-y-6">
                
                <form onSubmit={handleSaveAndCreateBag} className="bg-white rounded-2xl p-6 border border-[#F2DEE4] shadow-xs space-y-5">
                  <div className="border-b border-[#F2DEE4] pb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B84E67]">
                      Passo 2 · Dados do Pedido da Cliente
                    </span>
                    <h2 className="font-editorial text-xl sm:text-2xl font-medium text-[#181316]">
                      Destinatária & Entrega / Retirada
                    </h2>
                    <p className="text-xs text-[#7A6B73] mt-0.5">
                      Mesmos dados de agendamento que o cliente preenche no site.
                    </p>
                  </div>

                  {/* 1. Contact Info */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[#181316] uppercase tracking-wider block">
                      1. Contato da Cliente
                    </label>

                    <div>
                      <label className="block text-xs text-[#5A4D54] mb-1">Nome Completo da Cliente *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Mariana de Albuquerque"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#5A4D54] mb-1">WhatsApp da Cliente *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: (11) 98123-4567"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                      />
                      <span className="text-[10px] text-[#7A6B73] mt-0.5 block">
                        Usado para disparar o link direto e a mensagem personalizada.
                      </span>
                    </div>
                  </div>

                  {/* 2. Modalidade: Retirada ou Entrega */}
                  <div className="space-y-3 pt-2 border-t border-[#F2DEE4]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#181316] uppercase tracking-wider block">
                        2. Modalidade de Atendimento
                      </label>
                      <span className="text-[10px] text-[#B84E67] font-semibold bg-[#FDF2F4] px-2 py-0.5 rounded">
                        Retirada ou Entrega
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          deliveryType === 'pickup'
                            ? 'bg-[#FDF2F4] border-[#B84E67] text-[#181316] ring-1 ring-[#B84E67]'
                            : 'bg-white border-[#F0D5DD] text-[#5A4D54] hover:bg-[#FAF6F7]'
                        }`}
                      >
                        <Store className="w-4 h-4 text-[#B84E67] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-xs block text-[#181316]">Retirada na Loja</span>
                          <span className="text-[10px] text-[#7A6B73] block mt-0.5">Balcão físico</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          deliveryType === 'delivery'
                            ? 'bg-[#FDF2F4] border-[#B84E67] text-[#181316] ring-1 ring-[#B84E67]'
                            : 'bg-white border-[#F0D5DD] text-[#5A4D54] hover:bg-[#FAF6F7]'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-[#B84E67] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-xs block text-[#181316]">Entrega em Casa</span>
                          <span className="text-[10px] text-[#7A6B73] block mt-0.5">Portador leva</span>
                        </div>
                      </button>
                    </div>

                    {/* Address details if delivery */}
                    {deliveryType === 'delivery' ? (
                      <div className="bg-[#FAF6F7] p-3.5 rounded-xl border border-[#F2DEE4] space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <label className="block text-[11px] text-[#5A4D54] mb-1">Rua / Avenida</label>
                            <input
                              type="text"
                              placeholder="Alameda Lorena"
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#F0D5DD] rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#5A4D54] mb-1">Número</label>
                            <input
                              type="text"
                              placeholder="1420"
                              value={number}
                              onChange={(e) => setNumber(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#F0D5DD] rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] text-[#5A4D54] mb-1">Bairro</label>
                            <input
                              type="text"
                              placeholder="Jardins"
                              value={neighborhood}
                              onChange={(e) => setNeighborhood(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#F0D5DD] rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#5A4D54] mb-1">Complemento</label>
                            <input
                              type="text"
                              placeholder="Apto 91"
                              value={complement}
                              onChange={(e) => setComplement(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#F0D5DD] rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#5A4D54] mb-1">Ponto de Referência / Instrução</label>
                          <input
                            type="text"
                            placeholder="Interfone 91 ou deixar na portaria"
                            value={deliveryInstructions}
                            onChange={(e) => setDeliveryInstructions(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#F0D5DD] rounded-lg"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#FAF6F7] border border-[#F2DEE4] rounded-xl p-3 text-xs text-[#5A4D54] flex items-center gap-2">
                        <Store className="w-4 h-4 text-[#B84E67] shrink-0" />
                        <span>
                          <strong>Retirada na loja física (Jô Bolsas Glamour):</strong> A mala será separada e aguardará a cliente no balcão da loja.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 3. Schedule Date and Shift */}
                  <div className="space-y-3 pt-2 border-t border-[#F2DEE4]">
                    <label className="text-xs font-bold text-[#181316] uppercase tracking-wider block">
                      3. Data & Turno
                    </label>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-[#5A4D54] mb-1">Data Agendada</label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 border border-[#F0D5DD] rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#5A4D54] mb-1">Turno</label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value as MalaOrder['scheduledTimeSlot'])}
                          className="w-full text-xs px-2.5 py-2 border border-[#F0D5DD] rounded-lg bg-white"
                        >
                          <option value="Manhã (09h às 13h)">Manhã (09h às 13h)</option>
                          <option value="Tarde (14h às 18h)">Tarde (14h às 18h)</option>
                          <option value="Noite (18h às 20h)">Noite (18h às 20h)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 4. Recadinho da Josy */}
                  <div className="space-y-2 pt-2 border-t border-[#F2DEE4]">
                    <label className="text-xs font-bold text-[#181316] uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#B84E67]" />
                      <span>4. Recadinho da Vendedora Josy (Vai no WhatsApp)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={stylistLetter}
                      onChange={(e) => setStylistLetter(e.target.value)}
                      className="w-full text-xs p-3 border border-[#F0D5DD] rounded-xl bg-[#FAF6F7] text-[#181316] focus:outline-none focus:border-[#B84E67]"
                    />
                  </div>

                  {/* Live WhatsApp Preview Box */}
                  <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-emerald-950 font-bold">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Mensagem Inicial no WhatsApp:</span>
                      </span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                        Assinado por Josy
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-[11px] text-emerald-950 max-h-36 overflow-y-auto whitespace-pre-line font-mono">
                      {liveWhatsAppText}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCopyMessage}
                        className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded text-[11px] font-medium hover:bg-emerald-50 cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedText ? 'Copiado!' : 'Copiar Texto da Mensagem'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="pt-3 border-t border-[#F2DEE4] space-y-2.5">
                    <button
                      type="submit"
                      disabled={selectedItems.length === 0}
                      className="w-full py-3.5 bg-[#181316] text-[#FAF6F7] hover:bg-[#2A2025] rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-[#F5BAC7]" />
                      <span>Salvar Mala e Gerar Pedido</span>
                    </button>

                    <a
                      href={liveWhatsAppLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow cursor-pointer text-center"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Enviar Seleção Direto para WhatsApp da Cliente</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </form>

              </div>

            </div>

          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 2: GERENCIAMENTO DE PRODUTOS (FOTOS, DESCRIÇÕES E VALORES) */}
        {/* =============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header Toolbar */}
            <div className="bg-white rounded-2xl p-6 border border-[#F2DEE4] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B84E67] block">
                  Edição & Catálogo Oficial
                </span>
                <h2 className="font-editorial text-2xl font-medium text-[#181316]">
                  Substituir Fotos, Descrições e Valores
                </h2>
                <p className="text-xs text-[#7A6B73] mt-1 max-w-2xl">
                  Clique em qualquer peça para substituir a foto (upload do celular/computador ou link), atualizar valores de venda e editar textos descritivos. As alterações ficam salvas no navegador e aparecem em toda a loja.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {onResetProducts && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Deseja restaurar todo o catálogo para os produtos originais de fábrica?')) {
                        onResetProducts();
                      }
                    }}
                    className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Restaurar catálogo inicial"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                    <span>Restaurar Catálogo Padrão</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsEditModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#B84E67] hover:bg-[#A33D56] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Nova Bolsa / Peça</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#F2DEE4] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, tecido, cor ou descrição..."
                  value={productManagerSearch}
                  onChange={(e) => setProductManagerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF6F7] border border-[#F0D5DD] rounded-xl focus:outline-none focus:border-[#B84E67] text-[#181316]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['Todas', 'Bolsas', 'Vestidos', 'Blazers & Alfaiataria', 'Camisas & Blusas', 'Calças & Shorts', 'Conjuntos & Tricot', 'Casacos'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProductManagerCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      productManagerCategory === cat
                        ? 'bg-[#181316] text-[#F5BAC7]'
                        : 'bg-[#FAF6F7] text-stone-600 hover:bg-[#F2DEE4]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {managedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-[#F2DEE4] overflow-hidden hover:border-[#D87F95] hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image with overlay action */}
                    <div className="relative aspect-[3/4] bg-[#FAF3F5] overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsEditModalOpen(true);
                        }}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white text-xs font-bold p-3 cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-white text-[#B84E67] flex items-center justify-center shadow-lg">
                          <Pencil className="w-5 h-5" />
                        </div>
                        <span>Substituir Foto & Dados</span>
                      </button>

                      {/* Stock badge */}
                      <div className="absolute top-2.5 right-2.5">
                        {prod.inStock !== false ? (
                          <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                            Ativo
                          </span>
                        ) : (
                          <span className="bg-stone-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                            Esgotado
                          </span>
                        )}
                      </div>

                      {/* Category tag */}
                      <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#B84E67] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-[#F2DEE4]">
                        {prod.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-base font-extrabold text-[#181316]">
                          R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[11px] text-[#7A6B73]">
                          {prod.color}
                        </span>
                      </div>

                      <h3 className="font-semibold text-xs text-[#181316] line-clamp-1" title={prod.name}>
                        {prod.name}
                      </h3>

                      <p className="text-[11px] text-[#5A4D54] line-clamp-2 leading-relaxed" title={prod.description}>
                        {prod.description}
                      </p>

                      <div className="pt-1 text-[10px] text-[#7A6B73] flex items-center gap-1">
                        <span className="font-semibold text-stone-700">Tamanhos:</span>
                        <span>{prod.sizes.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="p-3 border-t border-[#F2DEE4] bg-[#FAF9F5] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(prod);
                        setIsEditModalOpen(true);
                      }}
                      className="flex-1 py-2 px-3 bg-white hover:bg-[#FFF5F8] text-[#B84E67] border border-[#F0D5DD] hover:border-[#B84E67] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Substituir Foto, Descrição & Valor</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {managedProducts.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#F2DEE4] text-stone-500">
                <Search className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-medium">Nenhum produto encontrado com os filtros atuais.</p>
                <button
                  type="button"
                  onClick={() => {
                    setProductManagerSearch('');
                    setProductManagerCategory('Todas');
                  }}
                  className="mt-3 text-xs text-[#B84E67] font-semibold underline cursor-pointer"
                >
                  Limpar busca e filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* TAB 3: GERENCIAMENTO DE MALAS ATIVAS (PAINEL DA JOSY)           */}
        {/* =============================================================== */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Orders list */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Malas em Andamento ({orders.length})
                </h2>
                <button
                  onClick={() => setActiveTab('create')}
                  className="text-xs font-semibold text-[#B84E67] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Mala</span>
                </button>
              </div>

              <div className="space-y-3">
                {orders.map((order) => {
                  const isSelected = order.id === selectedOrderId;
                  const statusMeta = statusLabels[order.status] || { label: order.status, color: 'bg-stone-100 text-stone-700' };
                  const directLink = buildStylistToClientWhatsAppLink(order);

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                        isSelected
                          ? 'border-[#B84E67] ring-2 ring-[#B84E67]/15 shadow-md'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 tracking-wider">
                          #{order.id}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-stone-900">
                            {order.customerName}
                          </div>
                          <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            {order.deliveryType === 'pickup' || order.address.toLowerCase().includes('retirada') ? (
                              <Store className="w-3 h-3 text-[#B84E67]" />
                            ) : (
                              <MapPin className="w-3 h-3 text-stone-400" />
                            )}
                            <span>{order.neighborhood || 'Loja Física'}</span>
                          </div>
                        </div>

                        {/* WhatsApp icon */}
                        <a
                          href={directLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`Conversar com ${order.customerName} no WhatsApp`}
                          className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full border border-emerald-200 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                        <span>{order.items.length}/{MAX_MALA_ITEMS} peças</span>
                        <span className="font-semibold text-stone-800">
                          {order.createdAt || 'Ativa'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detailed Order Inspection & Josy Actions */}
            {selectedOrder && (
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
                  
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-editorial text-2xl font-medium text-stone-900">
                          Mala #{selectedOrder.id}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusLabels[selectedOrder.status]?.color}`}>
                          {statusLabels[selectedOrder.status]?.label}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Cliente: <strong>{selectedOrder.customerName}</strong> · WhatsApp: {selectedOrder.customerPhone}
                      </p>
                    </div>

                    {/* Status transition dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-600 font-medium">Status:</span>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => onUpdateOrderStatus(selectedOrder.id, e.target.value as MalaOrder['status'])}
                        className="text-xs bg-stone-100 border border-stone-300 rounded px-2.5 py-1.5 font-medium text-stone-900 cursor-pointer focus:outline-none focus:border-stone-900"
                      >
                        <option value="solicitada">Solicitada pelo Site</option>
                        <option value="em_separacao">Em Separação no Atelier</option>
                        <option value="em_rota">Em Rota / Pronta p/ Retirada</option>
                        <option value="em_provador_48h">Em Provador 48h (Com Cliente)</option>
                        <option value="concluida">Finalizada / Faturada</option>
                      </select>
                    </div>
                  </div>

                  {/* Direct WhatsApp Action for Selected Customer */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                        <MessageCircle className="w-4 h-4 text-emerald-700" />
                        <span>Falar com {selectedOrder.customerName} no WhatsApp</span>
                      </div>
                      <p className="text-xs text-emerald-800">
                        Mensagem com saudação da Josy, protocolo #{selectedOrder.id}, itens e modalidade de entrega/retirada.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={buildStylistToClientWhatsAppLink(selectedOrder)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Customer Details Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 text-xs">
                    <div>
                      <span className="text-stone-500 block mb-0.5">Destinatária:</span>
                      <strong className="text-stone-900 text-sm">{selectedOrder.customerName}</strong>
                      <div className="text-stone-600 mt-0.5">{selectedOrder.customerPhone}</div>
                    </div>
                    <div>
                      <span className="text-stone-500 block mb-0.5">Modalidade & Endereço:</span>
                      <div className="text-stone-900 font-medium">{selectedOrder.address}</div>
                      <div className="text-stone-600">{selectedOrder.neighborhood}, {selectedOrder.city}</div>
                    </div>
                    <div>
                      <span className="text-stone-500 block mb-0.5">Data & Turno:</span>
                      <div className="text-stone-900 font-medium">{selectedOrder.scheduledDate}</div>
                      <div className="text-emerald-800 font-medium">{selectedOrder.scheduledTimeSlot}</div>
                    </div>
                  </div>

                  {/* Items in the Bag */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                        Peças na Mala ({selectedOrder.items.length} de {MAX_MALA_ITEMS})
                      </h3>
                      <span className="text-xs text-stone-600 font-medium">
                        Total consignado: R$ {selectedOrder.items.reduce((acc, it) => acc + it.product.price, 0).toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/50"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-18 object-cover rounded-lg bg-stone-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-stone-900 truncate">
                              {item.product.name}
                            </h4>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              Cor: {item.product.color}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs">
                              <span className="bg-stone-900 text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                                Tam. {item.selectedSize}
                              </span>
                              {item.requestSecondarySize && item.secondarySize && (
                                <span className="bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded text-[10px]">
                                  + Reserva {item.secondarySize}
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-medium text-stone-900 mt-1 tabular-nums">
                              R$ {item.product.price.toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Modal para Alterar Senha / PIN da Josy */}
      {isChangingPin && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#F2DEE4] space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#F2DEE4] pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#B84E67]" />
                <h3 className="font-editorial text-lg font-medium text-[#181316]">
                  Alterar Senha de Acesso
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsChangingPin(false);
                  setPinChangeSuccess(false);
                }}
                className="text-stone-400 hover:text-stone-700 text-xs font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5A4D54]">
              Defina uma nova senha para proteger a Área da Vendedora Josy contra acessos públicos.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPinValue.trim().length < 3) {
                  alert('A senha deve ter pelo menos 3 caracteres.');
                  return;
                }
                if (onUpdatePin) {
                  onUpdatePin(newPinValue.trim());
                }
                setPinChangeSuccess(true);
                setTimeout(() => {
                  setPinChangeSuccess(false);
                  setIsChangingPin(false);
                  setNewPinValue('');
                }, 1800);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-[#181316] mb-1">
                  Nova Senha / PIN
                </label>
                <input
                  type="password"
                  required
                  placeholder="Digite a nova senha segura"
                  value={newPinValue}
                  onChange={(e) => setNewPinValue(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 border border-[#F0D5DD] rounded-xl focus:outline-none focus:border-[#B84E67]"
                />
              </div>

              {pinChangeSuccess && (
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-center font-medium">
                  Senha alterada com sucesso!
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(false)}
                  className="flex-1 py-2 text-xs text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-[#181316] text-[#FAF6F7] rounded-lg hover:bg-[#2A2025] cursor-pointer"
                >
                  Salvar Nova Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Substituir Foto, Descrição e Valores */}
      <EditProductModal
        product={editingProduct}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaveProduct={(savedProd) => {
          if (editingProduct && onUpdateProduct) {
            onUpdateProduct(savedProd);
          } else if (onAddProduct) {
            onAddProduct(savedProd);
          }
        }}
        onDeleteProduct={(id) => {
          if (onDeleteProduct) {
            onDeleteProduct(id);
          }
        }}
      />

    </div>
  );
};
