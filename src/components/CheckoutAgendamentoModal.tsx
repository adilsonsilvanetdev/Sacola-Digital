import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, MessageCircle, ShieldCheck, ArrowRight, Sparkles, Send, Copy, ExternalLink, Store } from 'lucide-react';
import { MalaItem, MalaOrder } from '../types';
import { buildClientConfirmationWhatsAppLink, buildStoreConciergeWhatsAppLink, cleanPhoneNumber, getClientOrderPlainText } from '../utils/whatsappHelper';

interface CheckoutAgendamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  malaItems: MalaItem[];
  curationMode: 'self' | 'stylist';
  stylistNote?: string;
  onSuccess: (order: MalaOrder) => void;
}

export const CheckoutAgendamentoModal: React.FC<CheckoutAgendamentoModalProps> = ({
  isOpen,
  onClose,
  malaItems,
  curationMode,
  stylistNote,
  onSuccess,
}) => {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'Bauru - SP',
    cep: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: 'Manhã (09h às 13h)' as MalaOrder['scheduledTimeSlot'],
    deliveryInstructions: '',
    wantStylistAssistance: true,
  });

  const [confirmedOrder, setConfirmedOrder] = useState<MalaOrder | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Por favor, informe seu nome e WhatsApp para confirmar a sua mala.');
      return;
    }

    const orderId = `JB-ML-${Math.floor(1000 + Math.random() * 9000)}`;

    const isPickup = deliveryType === 'pickup' || !formData.street.trim();
    const fullAddress = isPickup
      ? 'Retirada na loja física (Rua: Dr José Ranieri N 5-28, Bauru - SP)'
      : `${formData.street}${formData.number ? `, ${formData.number}` : ''}${formData.complement ? ` - ${formData.complement}` : ''}`;

    const neighborhood = isPickup
      ? 'Loja Física'
      : (formData.neighborhood.trim() || 'A combinar');

    const newOrder: MalaOrder = {
      id: orderId,
      customerName: formData.name.trim(),
      customerPhone: formData.phone.trim(),
      deliveryType: isPickup ? 'pickup' : 'delivery',
      address: fullAddress,
      neighborhood: neighborhood,
      city: formData.city,
      street: formData.street.trim(),
      number: formData.number.trim(),
      complement: formData.complement.trim(),
      deliveryInstructions: formData.deliveryInstructions?.trim(),
      scheduledDate: formData.date,
      scheduledTimeSlot: formData.timeSlot,
      items: malaItems,
      curationMode: curationMode,
      stylistNote: stylistNote,
      status: 'solicitada',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      returnDeadline: '48 horas após recebimento',
    };

    setConfirmedOrder(newOrder);
    onSuccess(newOrder);
  };

  const clientWhatsAppLink = confirmedOrder ? buildClientConfirmationWhatsAppLink(confirmedOrder) : '';
  const storeWhatsAppLink = confirmedOrder ? buildStoreConciergeWhatsAppLink(confirmedOrder) : '';

  const handleCopyLink = () => {
    if (clientWhatsAppLink) {
      navigator.clipboard.writeText(clientWhatsAppLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyText = () => {
    if (confirmedOrder) {
      const fullText = getClientOrderPlainText(confirmedOrder);
      navigator.clipboard.writeText(fullText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-[#F2DEE4] animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[#F2DEE4] bg-[#FAF6F7] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#B84E67] font-semibold">
              Provador Particular · Até 15 Peças & Bolsas
            </span>
            <h2 className="font-editorial text-2xl font-medium text-[#181316]">
              {confirmedOrder ? 'Mala Confirmada com Sucesso!' : 'Agendar Mala Jô Bolsas Glamour'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!confirmedOrder ? (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="bg-[#FDF2F4] border border-[#F2DEE4] p-3.5 rounded-xl text-xs text-[#5A4D54] leading-relaxed">
              <span className="font-semibold text-[#9C384E]">Como funciona o provador? </span>
              A mala é preparada sem cobrança prévia das peças e bolsas. Você tem 48 horas para experimentar tudo com tranquilidade no conforto da sua casa. O que não gostar, você devolve, e acerta apenas o que decidir ficar!
            </div>

            {/* Personal Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#181316] uppercase tracking-wider">
                1. Seus Dados de Contato
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#5A4D54] mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mariana de Albuquerque"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67] focus:ring-1 focus:ring-[#B84E67]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#5A4D54] mb-1">Seu WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67] focus:ring-1 focus:ring-[#B84E67]"
                  />
                  <span className="text-[10px] text-[#7A6B73] mt-0.5 block">
                    Enviaremos o resumo e o comprovante direto para o seu WhatsApp.
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Option: Pickup vs Delivery */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#181316] uppercase tracking-wider">
                  2. Como Deseja Receber a Mala?
                </h3>
                <span className="text-[11px] text-[#B84E67] font-medium bg-[#FDF2F4] px-2 py-0.5 rounded border border-[#F2DEE4]">
                  Endereço opcional
                </span>
              </div>

              {/* Selector buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    deliveryType === 'pickup'
                      ? 'bg-[#FDF2F4] border-[#B84E67] text-[#181316] ring-1 ring-[#B84E67] shadow-xs'
                      : 'bg-white border-[#F0D5DD] text-[#5A4D54] hover:bg-[#FAF6F7]'
                  }`}
                >
                  <div className={`p-2 rounded-full shrink-0 ${deliveryType === 'pickup' ? 'bg-[#181316] text-[#F5BAC7]' : 'bg-stone-100 text-stone-600'}`}>
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs block text-[#181316]">Vou retirar na loja</span>
                    <span className="text-[11px] text-[#7A6B73] block mt-0.5 leading-snug">
                      Ideal para quem está de passagem: mala pronta no balcão da Jô Bolsas Glamour
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    deliveryType === 'delivery'
                      ? 'bg-[#FDF2F4] border-[#B84E67] text-[#181316] ring-1 ring-[#B84E67] shadow-xs'
                      : 'bg-white border-[#F0D5DD] text-[#5A4D54] hover:bg-[#FAF6F7]'
                  }`}
                >
                  <div className={`p-2 rounded-full shrink-0 ${deliveryType === 'delivery' ? 'bg-[#181316] text-[#F5BAC7]' : 'bg-stone-100 text-stone-600'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs block text-[#181316]">Entregar no meu endereço</span>
                    <span className="text-[11px] text-[#7A6B73] block mt-0.5 leading-snug">
                      Portador leva até a sua residência e retira após as 48 horas
                    </span>
                  </div>
                </button>
              </div>

              {/* Notice or Optional Address Inputs */}
              {deliveryType === 'pickup' ? (
                <div className="bg-[#FAF6F7] border border-[#F2DEE4] rounded-xl p-3 text-xs text-[#5A4D54] flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#B84E67] shrink-0" />
                  <span>
                    <strong>Ponto de Retirada:</strong> Loja Física Jô Bolsas Glamour (Rua: Dr José Ranieri N 5-28, Bauru - SP). Assim que você confirmar, avisaremos no WhatsApp para você passar e pegar a mala no balcão!
                  </span>
                </div>
              ) : (
                <div className="space-y-3 pt-1 bg-[#FAF6F7] p-3.5 rounded-xl border border-[#F2DEE4]">
                  <span className="text-[11px] text-[#7A6B73] font-medium block">
                    Preencha o endereço abaixo (opcional — caso prefira, combinamos pelo WhatsApp):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-[#5A4D54] mb-1">Rua / Avenida (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ex: Rua Oscar Freire"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full text-sm px-3 py-2 bg-white border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#5A4D54] mb-1">Número (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ex: 1200"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        className="w-full text-sm px-3 py-2 bg-white border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#5A4D54] mb-1">Bairro / Região (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ex: Jardins"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        className="w-full text-sm px-3 py-2 bg-white border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#5A4D54] mb-1">Complemento (Apto/Bloco)</label>
                      <input
                        type="text"
                        placeholder="Ex: Apto 82"
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        className="w-full text-sm px-3 py-2 bg-white border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#181316] uppercase tracking-wider">
                3. {deliveryType === 'pickup' ? 'Quando Deseja Passar para Retirar?' : 'Quando Deseja Receber a Mala?'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#5A4D54] mb-1">Data Preferencial</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#5A4D54] mb-1">Turno Preferencial</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value as MalaOrder['scheduledTimeSlot'] })}
                    className="w-full text-sm px-3 py-2 border border-[#F0D5DD] rounded-lg focus:outline-none focus:border-[#B84E67]"
                  >
                    <option value="Manhã (09h às 13h)">Manhã (09h às 13h)</option>
                    <option value="Tarde (14h às 18h)">Tarde (14h às 18h)</option>
                    <option value="Noite (18h às 20h)">Noite (18h às 20h)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2DEE4] flex items-center justify-between">
              <span className="text-xs text-[#7A6B73]">
                {malaItems.length} peças prontas para separação
              </span>
              <button
                type="submit"
                className="px-6 py-3 bg-[#181316] text-[#FAF6F7] rounded-lg text-xs sm:text-sm font-medium hover:bg-[#2A2025] border border-[#F2BAC7]/30 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Calendar className="w-4 h-4 text-[#F5BAC7]" />
                <span>Confirmar Agendamento da Mala</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State with Direct Links to Client WhatsApp & Concierge */
          <div className="p-6 md:p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-[#FDF2F4] text-[#B84E67] rounded-full flex items-center justify-center mx-auto border border-[#F2DEE4]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#B84E67] font-semibold">
                Protocolo #{confirmedOrder.id}
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#181316] mt-1">
                Sua Mala Jô Bolsas Glamour foi Agendada com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4D54] max-w-md mx-auto mt-2 leading-relaxed">
                Separamos suas {confirmedOrder.items.length} peças. Você pode abrir o comprovante diretamente no seu WhatsApp ou falar com nossa consultora abaixo:
              </p>
            </div>

            {/* Scheduling summary box */}
            <div className="text-left bg-[#FAF6F7] border border-[#F2DEE4] rounded-xl p-4 space-y-2 text-xs text-[#5A4D54]">
              <div className="flex items-center justify-between border-b border-[#F2DEE4] pb-2">
                <span className="text-[#7A6B73]">Cliente:</span>
                <span className="font-medium text-[#181316]">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#F2DEE4] pb-2">
                <span className="text-[#7A6B73]">WhatsApp da Cliente:</span>
                <span className="font-medium text-[#181316]">{confirmedOrder.customerPhone}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#F2DEE4] pb-2">
                <span className="text-[#7A6B73]">Data & Turno:</span>
                <span className="font-medium text-[#181316]">
                  {confirmedOrder.scheduledDate} · {confirmedOrder.scheduledTimeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#F2DEE4] pb-2">
                <span className="text-[#7A6B73]">Modalidade:</span>
                <span className="font-medium text-[#181316] truncate max-w-[280px]">
                  {confirmedOrder.address.toLowerCase().includes('retirada')
                    ? '🛍️ Retirada na loja física (balcão)'
                    : `🚚 Entrega: ${confirmedOrder.address}, ${confirmedOrder.neighborhood}`}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#7A6B73]">Peças na Mala:</span>
                <span className="font-semibold text-[#181316]">
                  {confirmedOrder.items.length} peças (48h de prova)
                </span>
              </div>
            </div>

            {/* Itemized preview showing title, color, size and price */}
            <div className="text-left bg-white border border-[#F2DEE4] rounded-xl p-3 text-xs max-h-48 overflow-y-auto space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-[#B84E67] tracking-wider block mb-1">
                Resumo das peças incluídas no WhatsApp (Título, Cor, Tamanho e Valor):
              </span>
              {confirmedOrder.items.map((item, i) => {
                const sizeInfo = item.requestSecondarySize && item.secondarySize
                  ? `${item.selectedSize} (reserva: ${item.secondarySize})`
                  : item.selectedSize;
                return (
                  <div key={item.product.id} className="border-b border-[#F2DEE4] pb-1.5 last:border-none last:pb-0 text-[11px]">
                    <div className="font-semibold text-[#181316]">
                      {i + 1}. {item.product.name}
                    </div>
                    <div className="text-[#7A6B73] mt-0.5">
                      Cor: {item.product.color} · Tam: {sizeInfo} · R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct WhatsApp Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={clientWhatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#181316] text-[#FAF6F7] hover:bg-[#2A2025] rounded-xl text-sm font-medium border border-[#F2BAC7]/40 transition-colors flex items-center justify-center gap-2 shadow cursor-pointer group"
              >
                <MessageCircle className="w-5 h-5 text-[#F5BAC7] group-hover:scale-110 transition-transform" />
                <span>Abrir Resumo no WhatsApp da Cliente ({confirmedOrder.customerPhone})</span>
                <ExternalLink className="w-4 h-4 text-[#F5BAC7]" />
              </a>

              <a
                href={storeWhatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-white border border-[#F0D5DD] text-[#181316] rounded-xl text-xs font-medium hover:bg-[#FAF6F7] hover:text-[#B84E67] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B84E67]" />
                <span>Falar Diretamente com a Consultora da Loja</span>
              </a>

              {/* Copy WhatsApp text & link */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={handleCopyText}
                  className="text-[11px] text-[#5A4D54] hover:text-[#181316] bg-[#FAF6F7] border border-[#F0D5DD] hover:bg-[#FDF2F4] px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3 h-3 text-[#B84E67]" />
                  <span>{copiedText ? 'Texto copiado com sucesso!' : 'Copiar Texto da Mensagem'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="text-[11px] text-[#7A6B73] hover:text-[#B84E67] underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{copiedLink ? 'Link copiado!' : 'Copiar Link WhatsApp'}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2 text-[#7A6B73] hover:text-[#181316] text-xs font-medium cursor-pointer"
              >
                Concluir e Voltar à Loja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
