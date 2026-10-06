import { MalaOrder } from '../types';

export function cleanPhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');

  // If already has Brazilian DDI (55) and is 12 or 13 digits
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }

  // If standard Brazilian mobile (10 or 11 digits: DDD + number)
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits || '5511999998888';
}

/**
 * Retorna o texto do comprovante da cliente com formato enxuto:
 * Título do produto, Cor, Tamanho e Valor (sem descrições longas).
 */
export function getClientOrderPlainText(order: MalaOrder): string {
  const itemsList = order.items.map((item, idx) => {
    const p = item.product;
    const sizeInfo = item.requestSecondarySize && item.secondarySize
      ? `${item.selectedSize} (reserva: ${item.secondarySize})`
      : item.selectedSize;

    return `${idx + 1}. *${p.name}*\n   Cor: ${p.color} · Tam: ${sizeInfo} · R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }).join('\n\n');

  const totalValue = order.items.reduce((acc, it) => acc + it.product.price, 0);

  const isPickup = !order.address || order.address.toLowerCase().includes('retirada');
  const locationText = isPickup
    ? `📍 *Modalidade:* Retirada presencial na loja física (Jô Bolsas Glamour)`
    : `📍 *Endereço:* ${order.address}${order.neighborhood ? `, ${order.neighborhood}` : ''}`;

  return [
    `✨ *JÔ BOLSAS GLAMOUR - Mala Digital* ✨`,
    ``,
    `Olá, *${order.customerName}*! Seu agendamento de provador em casa foi confirmado com sucesso.`,
    ``,
    `📋 *Protocolo:* N° ${order.id}`,
    `🗓 *Data Preferencial:* ${order.scheduledDate} (${order.scheduledTimeSlot})`,
    locationText,
    `👜 *Peças & Bolsas na Mala:* ${order.items.length}`,
    ``,
    `*ITENS SELECIONADOS:*`,
    itemsList || 'Nenhum item selecionado.',
    ``,
    `💰 *Total Consignado:* R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `ℹ️ *Lembrete:* 48h para provar com seus looks em casa. Você só paga o que decidir ficar!`,
    ``,
    `Desejamos uma maravilhosa experiência de glamour! 🤍`,
  ].join('\n');
}

/**
 * Link direcionado ao WhatsApp da CLIENTE quando a solicitação é finalizada.
 */
export function buildClientConfirmationWhatsAppLink(order: MalaOrder): string {
  const phone = cleanPhoneNumber(order.customerPhone);
  const text = getClientOrderPlainText(order);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Retorna o texto puro da curadoria enviada pela vendedora (formato conciso).
 */
export function getStylistOrderPlainText(order: MalaOrder, customLetter?: string): string {
  const firstName = order.customerName ? order.customerName.trim().split(' ')[0] : 'querida';

  const itemsList = order.items.map((item, idx) => {
    const p = item.product;
    const sizeInfo = item.requestSecondarySize && item.secondarySize
      ? `${item.selectedSize} (reserva: ${item.secondarySize})`
      : item.selectedSize;

    return `${idx + 1}. *${p.name}*\n   Cor: ${p.color} · Tam: ${sizeInfo} · R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }).join('\n\n');

  const letterText =
    customLetter ||
    order.stylistNote ||
    'Preparei sua mala com muito carinho e glamour! Todas as peças e bolsas foram higienizadas para seu provador em casa.';

  const isPickup = !order.address || order.address.toLowerCase().includes('retirada');
  const locationText = isPickup
    ? `📍 *Modalidade:* Retirada na loja física (Jô Bolsas Glamour)`
    : `📍 *Endereço:* ${order.address}`;

  return [
    `Olá, *${firstName}*! Aqui é sua consultora da *JÔ BOLSAS GLAMOUR* 🤍`,
    ``,
    `Sua *Mala N° ${order.id}* com *${order.items.length} itens* está pronta para você!`,
    ``,
    `💌 *Recado da Consultora:*`,
    `"${letterText}"`,
    ``,
    `*ITENS DA SUA MALA:*`,
    itemsList || 'Nenhum item selecionado.',
    ``,
    `🚚 *Previsão:* ${order.scheduledDate} (${order.scheduledTimeSlot})`,
    locationText,
    ``,
    `Você tem 48 horas para provar e combinar tudo com calma no seu quarto. Qualquer dúvida, pode me chamar por aqui!`,
  ].join('\n');
}

/**
 * Link acionado pela VENDEDORA / CONSULTORA no painel para falar diretamente
 * com a CLIENTE no WhatsApp dela, enviando a curadoria concisa.
 */
export function buildStylistToClientWhatsAppLink(
  order: MalaOrder,
  customLetter?: string
): string {
  const phone = cleanPhoneNumber(order.customerPhone);
  const text = getStylistOrderPlainText(order, customLetter);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Link para a cliente falar com o atendimento/concierge da loja.
 */
export function buildStoreConciergeWhatsAppLink(order?: MalaOrder): string {
  const storePhone = '5511999998888';
  if (!order) {
    const defaultText = `Olá Jô Bolsas Glamour! Gostaria de informações sobre o serviço de Mala Digital em Casa.`;
    return `https://wa.me/${storePhone}?text=${encodeURIComponent(defaultText)}`;
  }
  const text = `Olá Jô Bolsas Glamour! Gostaria de falar sobre a minha solicitação de Mala N° ${order.id} agendada para ${order.scheduledDate}.`;
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}
