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
 * Retorna o texto do comprovante quando a CLIENTE solicita no site:
 * A mensagem inicial identifica a vendedora JOSY com dados idênticos de entrega ou retirada!
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

  const isPickup = order.deliveryType === 'pickup' || !order.address || order.address.toLowerCase().includes('retirada');
  const locationLines = isPickup
    ? [`📍 *Modalidade:* Retirada presencial na loja física (Jô Bolsas Glamour - Balcão)`]
    : [
        `📍 *Modalidade:* Entrega em domicílio`,
        `📍 *Endereço de Entrega:* ${order.address}${order.neighborhood ? `, ${order.neighborhood}` : ''}${order.city ? ` - ${order.city}` : ''}`,
        ...(order.deliveryInstructions ? [`📍 *Ponto de Referência:* ${order.deliveryInstructions}`] : [])
      ];

  return [
    `✨ *JÔ BOLSAS GLAMOUR - Mala Digital* ✨`,
    ``,
    `Olá, *${order.customerName}*! Aqui é a *Josy* da *JÔ BOLSAS GLAMOUR* 🤍`,
    `Recebi seu pedido de mala para provar em casa e já estou separando suas peças e bolsas com todo carinho!`,
    ``,
    `📋 *Protocolo da Mala:* N° ${order.id}`,
    `🗓 *Data Agendada:* ${order.scheduledDate} (${order.scheduledTimeSlot})`,
    ...locationLines,
    `👜 *Quantidade:* ${order.items.length} itens na mala`,
    ``,
    `*ITENS SELECIONADOS:*`,
    itemsList || 'Nenhum item selecionado.',
    ``,
    `💰 *Total Consignado:* R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `ℹ️ *Lembrete:* Você tem 48h para provar no seu espelho com tranquilidade e só acerta o que decidir ficar!`,
    ``,
    `Qualquer dúvida estou à sua disposição por aqui! Um beijo, Josy 🤍`,
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
 * Retorna o texto quando a VENDEDORA JOSY monta a mala e envia para a cliente:
 * A mensagem inicial identifica a vendedora JOSY com dados idênticos de entrega ou retirada!
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

  const totalValue = order.items.reduce((acc, it) => acc + it.product.price, 0);

  const letterText =
    customLetter ||
    order.stylistNote ||
    'Preparei uma seleção especial de bolsas e peças exclusivas pensando em você para provar com calma em casa!';

  const isPickup = order.deliveryType === 'pickup' || !order.address || order.address.toLowerCase().includes('retirada');
  const locationLines = isPickup
    ? [`📍 *Modalidade:* Retirada presencial na loja física (Jô Bolsas Glamour - Balcão)`]
    : [
        `📍 *Modalidade:* Entrega em domicílio`,
        `📍 *Endereço de Entrega:* ${order.address}${order.neighborhood ? `, ${order.neighborhood}` : ''}${order.city ? ` - ${order.city}` : ''}`,
        ...(order.deliveryInstructions ? [`📍 *Ponto de Referência:* ${order.deliveryInstructions}`] : [])
      ];

  return [
    `✨ *JÔ BOLSAS GLAMOUR - Mala Digital* ✨`,
    ``,
    `Olá, *${order.customerName}*! Aqui é a *Josy* da *JÔ BOLSAS GLAMOUR* 🤍`,
    `Preparei sua *Mala N° ${order.id}* com *${order.items.length} itens* exclusivos para seu provador de 48 horas!`,
    ``,
    `💌 *Recadinho da Josy:*`,
    `"${letterText}"`,
    ``,
    `📋 *Protocolo da Mala:* N° ${order.id}`,
    `🗓 *Data Agendada:* ${order.scheduledDate} (${order.scheduledTimeSlot})`,
    ...locationLines,
    `👜 *Quantidade:* ${order.items.length} itens na mala`,
    ``,
    `*ITENS DA SUA MALA:*`,
    itemsList || 'Nenhum item selecionado.',
    ``,
    `💰 *Total Consignado:* R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `ℹ️ *Lembrete:* Você tem 48 horas para provar com seus sapatos e espelho com total calma. Você só paga o que amar!`,
    ``,
    `Me confirme se está tudo certinho por aqui! Um beijo, Josy 🤍`,
  ].join('\n');
}

/**
 * Link acionado pela VENDEDORA JOSY no painel para falar diretamente
 * com a CLIENTE no WhatsApp dela, enviando a seleção completa.
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
 * Link para a cliente falar com o atendimento da loja.
 */
export function buildStoreConciergeWhatsAppLink(order?: MalaOrder): string {
  const storePhone = '5511999998888';
  if (!order) {
    const defaultText = `Olá Josy da Jô Bolsas Glamour! Gostaria de informações sobre o serviço de Mala em Casa.`;
    return `https://wa.me/${storePhone}?text=${encodeURIComponent(defaultText)}`;
  }
  const text = `Olá Josy da Jô Bolsas Glamour! Gostaria de falar sobre a minha Mala N° ${order.id} agendada para ${order.scheduledDate}.`;
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}
