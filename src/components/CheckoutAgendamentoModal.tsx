import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, MessageCircle, ShieldCheck, ArrowRight, Sparkles, Send, Copy, ExternalLink } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo - SP',
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
    if (!formData.name || !formData.phone || !formData.street) {
      alert('Por favor, preencha seu nome, WhatsApp e endereço para a entrega da mala.');
      return;
    }

    const orderId = `BELLA-ML-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullAddress = `${formData.street}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ''}`;

    const newOrder: MalaOrder = {
      id: orderId,
      customerName: formData.name,
      customerPhone: formData.phone,
      address: fullAddress,
      neighborhood: formData.neighborhood || 'Jardins',
      city: formData.city,
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
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden border border-stone-200 animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-900 font-semibold">
              Provador em Casa · Capacidade de até 15 Peças
            </span>
            <h2 className="font-editorial text-2xl font-medium text-stone-900">
              {confirmedOrder ? 'Mala Solicitada com Sucesso!' : 'Agendar Entrega da Mala'}
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
            <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded text-xs text-stone-700 leading-relaxed">
              <span className="font-semibold text-amber-900">Como funciona o pagamento? </span>
              A mala é entregue sem cobrança prévia das peças. Você terá 48 horas para experimentar as {malaItems.length} peças no conforto da sua casa. O portador buscará o que você não quiser, e apenas as peças selecionadas serão faturadas via Pix ou Cartão.
            </div>

            {/* Personal Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                1. Seus Dados de Contato (Para Envio da Mala e WhatsApp)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mariana de Albuquerque"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Seu WhatsApp (Receberá o link com o comprovante) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98765-4321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Enviaremos a confirmação e o protocolo diretamente para o seu WhatsApp.
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                2. Endereço de Entrega da Mala
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-stone-600 mb-1">Rua / Avenida *</label>
                  <input
                    type="text"
                    required
                    placeholder="Rua Oscar Freire"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    placeholder="1200"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Complemento / Apto</label>
                  <input
                    type="text"
                    placeholder="Apto 82 Bloco B"
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    placeholder="Cerqueira César"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">CEP</label>
                  <input
                    type="text"
                    placeholder="01426-001"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                3. Quando Deseja Receber a Mala?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Data Preferencial</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Turno de Entrega</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value as MalaOrder['scheduledTimeSlot'] })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  >
                    <option value="Manhã (09h às 13h)">Manhã (09h às 13h)</option>
                    <option value="Tarde (14h às 18h)">Tarde (14h às 18h)</option>
                    <option value="Noite (18h às 20h)">Noite (18h às 20h)</option>
                  </select>
                </div>
              </div>

              {/* Concierge checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.wantStylistAssistance}
                    onChange={(e) => setFormData({ ...formData, wantStylistAssistance: e.target.checked })}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0 mt-0.5"
                  />
                  <span>
                    Desejo consultoria personalizada via WhatsApp durante o meu momento de prova (a consultora pode dar dicas de sapatos e combinações com o seu próprio armário).
                  </span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                {malaItems.length} peças prontas para separação
              </span>
              <button
                type="submit"
                className="px-6 py-3 bg-stone-900 text-white rounded text-xs sm:text-sm font-medium hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer shadow"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Confirmar Solicitação da Mala</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State with Direct Links to Client WhatsApp & Concierge */
          <div className="p-6 md:p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold">
                Protocolo #{confirmedOrder.id}
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900 mt-1">
                Sua Mala Bella Roupas & Acessórios foi Agendada com Sucesso!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
                Separamos {confirmedOrder.items.length} peças exclusivas para entrega em seu endereço. Você pode enviar a confirmação completa direto para o seu WhatsApp abaixo:
              </p>
            </div>

            {/* Scheduling summary box */}
            <div className="text-left bg-stone-50 border border-stone-200 rounded p-4 space-y-2 text-xs text-stone-700">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Cliente:</span>
                <span className="font-medium text-stone-900">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">WhatsApp da Cliente:</span>
                <span className="font-medium text-stone-900">{confirmedOrder.customerPhone}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Previsão de Entrega:</span>
                <span className="font-medium text-stone-900">
                  {confirmedOrder.scheduledDate} · {confirmedOrder.scheduledTimeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Endereço:</span>
                <span className="font-medium text-stone-900 truncate max-w-[240px]">
                  {confirmedOrder.address}, {confirmedOrder.neighborhood}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-stone-500">Peças na Mala:</span>
                <span className="font-semibold text-stone-900">
                  {confirmedOrder.items.length} peças (48h para provar)
                </span>
              </div>
            </div>

            {/* Itemized preview showing title, color, size and price */}
            <div className="text-left bg-stone-50 border border-stone-200 rounded p-3 text-xs max-h-48 overflow-y-auto space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-stone-600 tracking-wider block mb-1">
                Resumo das peças incluídas na mensagem (Título, Cor, Tamanho e Valor):
              </span>
              {confirmedOrder.items.map((item, i) => {
                const sizeInfo = item.requestSecondarySize && item.secondarySize
                  ? `${item.selectedSize} (reserva: ${item.secondarySize})`
                  : item.selectedSize;
                return (
                  <div key={item.product.id} className="border-b border-stone-200 pb-1.5 last:border-none last:pb-0 text-[11px]">
                    <div className="font-semibold text-stone-900">
                      {i + 1}. {item.product.name}
                    </div>
                    <div className="text-stone-600 mt-0.5">
                      Cor: {item.product.color} · Tam: {sizeInfo} · R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prominent Direct WhatsApp Buttons */}
            <div className="space-y-3 pt-2">
              {/* Button 1: Send directly to the CLIENT's WhatsApp */}
              <a
                href={clientWhatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-700 text-white rounded text-sm font-medium hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow cursor-pointer group"
              >
                <MessageCircle className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
                <span>Abrir Resumo no WhatsApp da Cliente ({confirmedOrder.customerPhone})</span>
                <ExternalLink className="w-4 h-4 text-emerald-200" />
              </a>

              {/* Button 2: Chat directly with Atelier Stylist Concierge */}
              <a
                href={storeWhatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-white border border-stone-300 text-stone-800 rounded text-xs font-medium hover:bg-stone-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Falar Diretamente com a Consultora do Atelier</span>
              </a>

              {/* Copy WhatsApp text & link */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  onClick={handleCopyText}
                  className="text-[11px] text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedText ? 'Texto copiado com sucesso!' : 'Copiar Texto da Mensagem'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="text-[11px] text-stone-500 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{copiedLink ? 'Link copiado!' : 'Copiar Link WhatsApp'}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
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
