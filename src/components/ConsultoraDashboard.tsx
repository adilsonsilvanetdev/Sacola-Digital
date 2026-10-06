import React, { useState } from 'react';
import { Package, Clock, CheckCircle2, User, MapPin, Sparkles, MessageCircle, FileText, Send, RefreshCw, ArrowLeft, Plus, ExternalLink, Copy } from 'lucide-react';
import { MalaOrder, MalaItem, Product } from '../types';
import { SAMPLE_PRODUCTS, MAX_MALA_ITEMS } from '../data/products';
import { buildStylistToClientWhatsAppLink, cleanPhoneNumber } from '../utils/whatsappHelper';

interface ConsultoraDashboardProps {
  orders: MalaOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: MalaOrder['status']) => void;
  onReturnToStore: () => void;
  onCreateOrderByStylist?: (order: MalaOrder) => void;
}

export const ConsultoraDashboard: React.FC<ConsultoraDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onReturnToStore,
  onCreateOrderByStylist,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [stylistLetter, setStylistLetter] = useState<string>(
    'Olá querida! Preparei cada peça com muito carinho, passei a ferro a vapor e borrifei nossa fragrância assinatura de flor de figo. Teste o blazer tanto com a calça pantalona quanto sobre o vestido terracota. Me chame no WhatsApp se quiser ajuda com combinações!'
  );
  const [letterSaved, setLetterSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Bag Modal for Stylist
  const [isCreatingBag, setIsCreatingBag] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientNeighborhood, setNewClientNeighborhood] = useState('Jardins');
  const [newSelectedProductIds, setNewSelectedProductIds] = useState<string[]>([
    SAMPLE_PRODUCTS[0].id,
    SAMPLE_PRODUCTS[1].id,
    SAMPLE_PRODUCTS[2].id,
    SAMPLE_PRODUCTS[3].id,
  ]);
  const [newDeliveryShift, setNewDeliveryShift] = useState<MalaOrder['scheduledTimeSlot']>('Tarde (14h às 18h)');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const statusLabels: Record<MalaOrder['status'], { label: string; color: string }> = {
    solicitada: { label: 'Solicitada', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    em_separacao: { label: 'Em Separação no Atelier', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    em_rota: { label: 'Em Rota com Portador', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    em_provador_48h: { label: 'Em Provador 48h com Cliente', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    concluida: { label: 'Finalizada / Faturada', color: 'bg-stone-100 text-stone-700 border-stone-200' },
  };

  const handleSaveCard = () => {
    setLetterSaved(true);
    setTimeout(() => setLetterSaved(false), 2500);
  };

  const currentWhatsAppLink = selectedOrder
    ? buildStylistToClientWhatsAppLink(selectedOrder, stylistLetter)
    : '';

  const handleCopyWhatsAppLink = () => {
    if (currentWhatsAppLink) {
      navigator.clipboard.writeText(currentWhatsAppLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCreateBagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone || newSelectedProductIds.length === 0) {
      alert('Por favor, informe o nome, WhatsApp e selecione pelo menos 1 peça.');
      return;
    }

    const items: MalaItem[] = newSelectedProductIds.map((id) => {
      const prod = SAMPLE_PRODUCTS.find((p) => p.id === id) || SAMPLE_PRODUCTS[0];
      return {
        product: prod,
        selectedSize: prod.sizes[1] || prod.sizes[0],
        requestSecondarySize: true,
        secondarySize: prod.sizes[2] || prod.sizes[0],
      };
    });

    const newOrder: MalaOrder = {
      id: `JB-ML-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newClientName,
      customerPhone: newClientPhone,
      address: newClientAddress.trim() || 'Retirada na loja física (balcão)',
      neighborhood: newClientAddress.trim() ? newClientNeighborhood : 'Loja Física',
      city: 'São Paulo - SP',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: newDeliveryShift,
      items,
      curationMode: 'stylist',
      stylistNote: `Curadoria exclusiva preparada pessoalmente pela vendedora para ${newClientName}.`,
      status: 'em_separacao',
      createdAt: 'Criada pela Consultora',
    };

    if (onCreateOrderByStylist) {
      onCreateOrderByStylist(newOrder);
    }
    setSelectedOrderId(newOrder.id);
    setIsCreatingBag(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F7] pb-24">
      {/* Top Banner */}
      <div className="bg-[#141113] text-white py-6 border-b border-[#2A2025]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#F5BAC7] font-semibold">
                Painel da Consultora · Jô Bolsas Glamour
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-medium mt-1">
              Gestão de Malas & Provadores em Casa
            </h1>
            <p className="text-xs text-[#BFA8B1] mt-1">
              Capacidade de até 15 peças e bolsas por mala. Envie curadorias e confirmações diretamente para o WhatsApp de cada cliente.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingBag(true)}
              className="px-4 py-2 bg-[#F5BAC7] text-[#141113] rounded-lg text-xs font-semibold hover:bg-[#F2A3B4] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Montar Mala para Cliente</span>
            </button>

            <button
              onClick={onReturnToStore}
              className="px-4 py-2 bg-[#251E22] text-[#F0D5DD] hover:text-white hover:bg-[#32282E] border border-[#F2BAC7]/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar à Loja</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Orders list */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
                Malas Ativas ({orders.length})
              </h2>
              <span className="text-xs text-stone-500">
                Até 15 peças / mala
              </span>
            </div>

            <div className="space-y-3">
              {orders.map((order) => {
                const isSelected = order.id === selectedOrderId;
                const statusMeta = statusLabels[order.status];
                const directLink = buildStylistToClientWhatsAppLink(order);

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-stone-900 ring-2 ring-stone-900/10 shadow-md'
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
                          <MapPin className="w-3 h-3" />
                          <span>{order.neighborhood}</span>
                        </div>
                      </div>

                      {/* Quick WhatsApp action icon for this specific client */}
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
                        {order.curationMode === 'stylist' ? 'Curadoria Consultora' : 'Escolha da Cliente'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Order Inspection & Stylist Tools */}
          {selectedOrder && (
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-lg border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-editorial text-2xl font-medium text-stone-900">
                        Mala #{selectedOrder.id}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusLabels[selectedOrder.status].color}`}>
                        {statusLabels[selectedOrder.status].label}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Cliente: {selectedOrder.customerName} · Telefone: {selectedOrder.customerPhone} · Modo: {selectedOrder.curationMode === 'stylist' ? 'Curadoria da Vendedora' : 'Escolha da Cliente'}
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
                      <option value="solicitada">Solicitada</option>
                      <option value="em_separacao">Em Separação no Atelier</option>
                      <option value="em_rota">Em Rota com Portador</option>
                      <option value="em_provador_48h">Em Provador 48h (Com a cliente)</option>
                      <option value="concluida">Finalizada / Faturada</option>
                    </select>
                  </div>
                </div>

                {/* Direct WhatsApp Callout for this specific customer */}
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                      <MessageCircle className="w-4 h-4 text-emerald-700" />
                      <span>WhatsApp Direto da Cliente: {selectedOrder.customerPhone}</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Envie com 1 clique a lista completa com descrição da roupa, cor e tamanho de cada uma das {selectedOrder.items.length} peças, além da data e do recado da consultora.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={currentWhatsAppLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir WhatsApp da Cliente</span>
                    </a>

                    <button
                      onClick={handleCopyWhatsAppLink}
                      className="p-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded text-xs cursor-pointer"
                      title="Copiar texto do WhatsApp"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {copiedLink && (
                  <div className="text-xs text-emerald-700 font-medium text-center bg-emerald-100/60 py-1.5 rounded">
                    Link com a mensagem completa copiado com sucesso!
                  </div>
                )}

                {/* Customer Details Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded bg-[#FAF9F5] border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-500 block mb-0.5">Destinatária:</span>
                    <strong className="text-stone-900 text-sm">{selectedOrder.customerName}</strong>
                    <div className="text-stone-600 mt-0.5">{selectedOrder.customerPhone}</div>
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5">Endereço de Entrega:</span>
                    <div className="text-stone-900 font-medium">{selectedOrder.address}</div>
                    <div className="text-stone-600">{selectedOrder.neighborhood}, {selectedOrder.city}</div>
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5">Previsão de Entrega:</span>
                    <div className="text-stone-900 font-medium">{selectedOrder.scheduledDate}</div>
                    <div className="text-emerald-800 font-medium">{selectedOrder.scheduledTimeSlot}</div>
                  </div>
                </div>

                {/* Items in the Mala */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                      Peças Selecionadas na Mala ({selectedOrder.items.length} de {MAX_MALA_ITEMS} permitidas)
                    </h3>
                    <span className="text-xs text-stone-500">
                      Total consignado: R$ {selectedOrder.items.reduce((acc, it) => acc + it.product.price, 0).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 p-3 rounded border border-stone-200 bg-stone-50/50"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-18 object-cover rounded bg-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-stone-900 truncate">
                            {item.product.name}
                          </h4>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            {item.product.fabric}
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

                {/* Handwritten stylist card editor */}
                <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 uppercase tracking-wider">
                      <FileText className="w-4 h-4" />
                      <span>Bilhete de Estilo da Vendedora (Enviado no WhatsApp e Impresso na Mala)</span>
                    </div>
                    {letterSaved && (
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Salvo no pacote!
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    value={stylistLetter}
                    onChange={(e) => setStylistLetter(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 border border-amber-200 rounded bg-white text-stone-800 focus:outline-none focus:border-stone-900 font-editorial"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      Este texto é incluído automaticamente no link do WhatsApp da cliente.
                    </span>
                    <button
                      onClick={handleSaveCard}
                      className="px-3.5 py-1.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Salvar Bilhete
                    </button>
                  </div>
                </div>

                {/* Final dispatch actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={currentWhatsAppLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-2 shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Curação para WhatsApp de {selectedOrder.customerName.split(' ')[0]}</span>
                  </a>

                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.id, 'em_rota')}
                    className="px-4 py-3 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Despachar com o Portador</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal: Vendedora Criando Nova Mala para Cliente */}
      {isCreatingBag && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden border border-stone-200 animate-fadeIn">
            <div className="p-6 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-amber-900 font-semibold">
                  Atendimento Personalizado da Vendedora
                </span>
                <h3 className="font-editorial text-2xl font-medium text-stone-900">
                  Montar Nova Mala para Cliente (Até 15 Peças)
                </h3>
              </div>
              <button
                onClick={() => setIsCreatingBag(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBagSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nome da Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fernanda Paes"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp da Cliente *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 97654-3210"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Bairro / Endereço
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Moema - Rua Gaivota, 420"
                    value={newClientAddress}
                    onChange={(e) => setNewClientAddress(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Turno Previsto de Entrega
                  </label>
                  <select
                    value={newDeliveryShift}
                    onChange={(e) => setNewDeliveryShift(e.target.value as MalaOrder['scheduledTimeSlot'])}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  >
                    <option value="Manhã (09h às 13h)">Manhã (09h às 13h)</option>
                    <option value="Tarde (14h às 18h)">Tarde (14h às 18h)</option>
                    <option value="Noite (18h às 20h)">Noite (18h às 20h)</option>
                  </select>
                </div>
              </div>

              {/* Product selection grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wider">
                    Selecione as Peças da Curadoria ({newSelectedProductIds.length}/{MAX_MALA_ITEMS})
                  </label>
                  <span className="text-xs text-stone-500">
                    Clique nas peças para adicionar/remover
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 border border-stone-200 rounded">
                  {SAMPLE_PRODUCTS.map((prod) => {
                    const isChecked = newSelectedProductIds.includes(prod.id);
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setNewSelectedProductIds(newSelectedProductIds.filter((id) => id !== prod.id));
                          } else {
                            if (newSelectedProductIds.length >= MAX_MALA_ITEMS) {
                              alert(`Capacidade máxima da mala é de ${MAX_MALA_ITEMS} peças.`);
                              return;
                            }
                            setNewSelectedProductIds([...newSelectedProductIds, prod.id]);
                          }
                        }}
                        className={`p-2 rounded border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-stone-900 bg-stone-100 ring-1 ring-stone-900'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-12 object-cover rounded shrink-0 bg-stone-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-medium text-stone-900 truncate">
                            {prod.name}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            R$ {prod.price}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsCreatingBag(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded text-xs font-medium hover:bg-stone-50 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 text-white rounded text-xs font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-2 cursor-pointer shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Criar e Gerar Link do WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
