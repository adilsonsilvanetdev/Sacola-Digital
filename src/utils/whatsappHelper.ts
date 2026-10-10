import { MalaOrder, Product } from '../types';

export const STORE_WHATSAPP_NUMBER = '5514997224065';
export const STORE_WHATSAPP_DISPLAY = '(14) 99722-4065';

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

  return digits || STORE_WHATSAPP_NUMBER;
}

/**
 * Link para COMPRA DIRETA de uma peça específica pelo WhatsApp da loja (14) 99722-4065
 */
export function buildProductPurchaseWhatsAppLink(product: Product, selectedSize?: string): string {
  const isBagOrWallet =
    product.category.toLowerCase().includes('bolsa') ||
    product.category.toLowerCase().includes('carteira') ||
    Boolean(product.dimensionsCm) ||
    (product.sizes && product.sizes.includes('CM'));

  const sizeText = isBagOrWallet
    ? `Medidas em CM (${product.dimensionsCm || selectedSize || 'CM'})`
    : `Tam. ${selectedSize || product.sizes[0] || 'M'}`;

  const priceFormatted = product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const isPromo = product.isPromotion || (product.originalPrice && product.originalPrice > product.price);
  const promoLine = isPromo && product.originalPrice
    ? `💰 *Valor Promocional:* R$ ${priceFormatted} (De R$ ${product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} - ${product.promotionTag || 'Oferta Especial'})`
    : `💰 *Valor:* R$ ${priceFormatted}`;

  const text = [
    `✨ *JÔ BOLSAS GLAMOUR* ✨`,
    ``,
    `Olá, *Josy*! Gostaria de *comprar* a seguinte peça do catálogo:`,
    ``,
    `🛍️ *Produto:* ${product.name}`,
    promoLine,
    `📏 *Tamanho / Medida:* ${sizeText}`,
    `🎨 *Cor:* ${product.color}`,
    `🧵 *Tecido/Material:* ${product.fabric}`,
    `🏷️ *Referência:* #${product.id}`,
    ``,
    `Por favor, me confirme a disponibilidade para envio/retirada e a forma de pagamento! 🤍`,
  ].join('\n');

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Link para tirar dúvidas ou consultar uma peça específica no WhatsApp da loja
 */
export function buildProductConsultationWhatsAppLink(product: Product): string {
  const priceFormatted = product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const text = [
    `✨ *JÔ BOLSAS GLAMOUR* ✨`,
    ``,
    `Olá, *Josy*! Gostaria de consultar detalhes da peça *${product.name}* (R$ ${priceFormatted} - Ref #${product.id}).`,
    `Gostaria de saber mais sobre caimento, medidas e disponibilidade. 🤍`,
  ].join('\n');

  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Retorna o texto do comprovante quando a CLIENTE solicita no site:
 * A mensagem inicial identifica a vendedora JOSY com dados idênticos de entrega ou retirada!
 */
export function getClientOrderPlainText(order: MalaOrder): string {
  const itemsList = order.items.map((item, idx) => {
    const p = item.product;
    const isBagOrWallet =
      p.category.toLowerCase().includes('bolsa') ||
      p.category.toLowerCase().includes('carteira') ||
      Boolean(p.dimensionsCm) ||
      (p.sizes && p.sizes.includes('CM'));

    const sizeDisplay = isBagOrWallet
      ? `Medida: ${p.dimensionsCm ? `CM (${p.dimensionsCm})` : 'CM'}`
      : `Tam: ${item.requestSecondarySize && item.secondarySize ? `${item.selectedSize} (reserva: ${item.secondarySize})` : item.selectedSize}`;

    return `${idx + 1}. *${p.name}*\n   Cor: ${p.color} · ${sizeDisplay} · R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }).join('\n\n');

  const totalValue = order.items.reduce((acc, it) => acc + it.product.price, 0);

  const isPickup = order.deliveryType === 'pickup' || !order.address || order.address.toLowerCase().includes('retirada');
  const locationLines = isPickup
    ? [`📍 *Modalidade:* Retirada presencial na loja física (Jô Bolsas Glamour - Rua: Dr José Ranieri N 5-28, Bauru - SP)`]
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
  const itemsList = order.items.map((item, idx) => {
    const p = item.product;
    const isBagOrWallet =
      p.category.toLowerCase().includes('bolsa') ||
      p.category.toLowerCase().includes('carteira') ||
      Boolean(p.dimensionsCm) ||
      (p.sizes && p.sizes.includes('CM'));

    const sizeDisplay = isBagOrWallet
      ? `Medida: ${p.dimensionsCm ? `CM (${p.dimensionsCm})` : 'CM'}`
      : `Tam: ${item.requestSecondarySize && item.secondarySize ? `${item.selectedSize} (reserva: ${item.secondarySize})` : item.selectedSize}`;

    return `${idx + 1}. *${p.name}*\n   Cor: ${p.color} · ${sizeDisplay} · R$ ${p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }).join('\n\n');

  const totalValue = order.items.reduce((acc, it) => acc + it.product.price, 0);

  const letterText =
    customLetter ||
    order.stylistNote ||
    'Preparei uma seleção especial de bolsas e peças exclusivas pensando em você para provar com calma em casa!';

  const isPickup = order.deliveryType === 'pickup' || !order.address || order.address.toLowerCase().includes('retirada');
  const locationLines = isPickup
    ? [`📍 *Modalidade:* Retirada presencial na loja física (Jô Bolsas Glamour - Rua: Dr José Ranieri N 5-28, Bauru - SP)`]
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
  const storePhone = STORE_WHATSAPP_NUMBER;
  if (!order) {
    const defaultText = `Olá Josy da Jô Bolsas Glamour! Gostaria de tirar dúvidas sobre produtos, compras e provador em casa.`;
    return `https://wa.me/${storePhone}?text=${encodeURIComponent(defaultText)}`;
  }
  const text = `Olá Josy da Jô Bolsas Glamour! Gostaria de falar sobre a minha Mala N° ${order.id} agendada para ${order.scheduledDate}.`;
  return `https://wa.me/${storePhone}?text=${encodeURIComponent(text)}`;
}
