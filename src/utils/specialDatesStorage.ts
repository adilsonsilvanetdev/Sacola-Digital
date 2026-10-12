import { SpecialDatePromotion, SpecialDateTheme, SpecialDateAnimation } from '../types';

export const SPECIAL_DATE_STORAGE_KEY = 'jb_special_date_promotion_active';
export const SPECIAL_DATE_CUSTOM_TEMPLATES_KEY = 'jb_special_date_custom_templates';
export const SPECIAL_DATE_DISMISSED_KEY = 'jb_special_date_dismissed_session';

/**
 * 9 Sugestões Prontas para Cadastro e Ativação Imediata pela Josy
 */
export const DEFAULT_SPECIAL_DATE_SUGGESTIONS: SpecialDatePromotion[] = [
  {
    id: 'sug-natal',
    name: 'Natal & Festas de Fim de Ano',
    badge: 'ESPECIAL DE NATAL 🎄',
    icon: '🎄',
    title: 'Celebre com Elegância: Coleção de Natal Jô Bolsas',
    subtitle: 'Peças exclusivas, bolsas estruturadas e looks deslumbrantes para suas festas. Presenteie quem você ama com o puro luxo e sofisticação!',
    couponCode: 'NATALGLAMOUR',
    benefitText: 'Mimo exclusivo nas compras natalinas + Opção Mala Delivery 48h',
    ctaText: 'Ver Coleção & Promoções',
    secondaryCtaText: 'Falar com a Josy no WhatsApp',
    whatsappMessage: 'Olá Josy! Vi o Especial de Natal na loja virtual e gostaria de ver as novidades e bolsas para presentear!',
    themeColor: 'natal',
    animationEffect: 'sparkles',
    isActive: true,
    highlightCategory: 'Promoções',
    targetDateText: 'Válido para as Festas de Dezembro',
    showReopenBadge: true,
  },
  {
    id: 'sug-reveillon',
    name: 'Ano Novo & Réveillon Radiante',
    badge: 'RÉVEILLON & VIRADA ✨',
    icon: '✨',
    title: 'Comece o Novo Ano Brilhando com a Jô Bolsas',
    subtitle: 'Bolsas metalizadas, clutches sofisticadas, peças em tons de branco e dourado para você entrar no novo ciclo com elegância absoluta!',
    couponCode: 'VIRADA2027',
    benefitText: 'Clutches e peças para festa com pronta entrega ou retirada rápida',
    ctaText: 'Ver Peças para a Virada',
    secondaryCtaText: 'Reservar Look no WhatsApp',
    whatsappMessage: 'Olá Josy! Amei a seleção de Réveillon no site e quero garantir minha bolsa e look para a virada!',
    themeColor: 'reveillon',
    animationEffect: 'shimmer',
    isActive: true,
    highlightCategory: 'Bolsas',
    targetDateText: 'Especial Noite da Virada',
    showReopenBadge: true,
  },
  {
    id: 'sug-mulheres',
    name: 'Dia Internacional das Mulheres',
    badge: 'SEMANA DA MULHER 🌸',
    icon: '🌸',
    title: 'Você Merece o Melhor: Especial Dia das Mulheres',
    subtitle: 'Uma celebração à sua autenticidade, estilo e poder feminino. Escolha peças que elevam sua autoestima e marcam presença onde você passar!',
    couponCode: 'MULHERPODER',
    benefitText: '10% OFF especial em qualquer peça + Mimo carinhoso da Josy',
    ctaText: 'Conferir Destaques Femininos',
    secondaryCtaText: 'Atendimento VIP WhatsApp',
    whatsappMessage: 'Olá Josy! Vi o Especial do Dia das Mulheres e quero ver as opções selecionadas para esta semana!',
    themeColor: 'mulheres',
    animationEffect: 'pulse',
    isActive: true,
    highlightCategory: 'Todas',
    targetDateText: 'Semana Especial da Mulher',
    showReopenBadge: true,
  },
  {
    id: 'sug-maes',
    name: 'Dia das Mães Inesquecível',
    badge: 'ESPECIAL DIA DAS MÃES 💝',
    icon: '💝',
    title: 'Amor & Elegância: O Presente Ideal para Sua Mãe',
    subtitle: 'Surpreenda com uma bolsa sofisticada e atemporal que ela vai se apaixonar. Peças com acabamento refinado e embalagem especial cortesia!',
    couponCode: 'MAEGLAMOUR',
    benefitText: 'Embalagem de presente luxuosa com laço cortesia + Cartão com recado',
    ctaText: 'Escolher Presente de Mãe',
    secondaryCtaText: 'Pedir Ajuda da Josy no Zap',
    whatsappMessage: 'Olá Josy! Quero ajuda para escolher uma bolsa ou presente lindo de Dia das Mães!',
    themeColor: 'maes',
    animationEffect: 'gentle',
    isActive: true,
    highlightCategory: 'Bolsas',
    targetDateText: 'Celebre o Amor de Mãe',
    showReopenBadge: true,
  },
  {
    id: 'sug-namorados',
    name: 'Dia dos Namorados Apaixonante',
    badge: 'DIA DOS NAMORADOS ❤️',
    icon: '❤️',
    title: 'Amor em Destaque: Presentes que Encantam',
    subtitle: 'Bolsas elegantes, vestidos sedutores e peças marcantes para comemorar essa data tão especial. Declare seu carinho com alta moda!',
    couponCode: 'AMORGLAMOUR',
    benefitText: 'Frete Cortesia ou Retirada Balcão para pedidos antecipados',
    ctaText: 'Ver Seleção Apaixonante',
    secondaryCtaText: 'Falar com a Josy no WhatsApp',
    whatsappMessage: 'Olá Josy! Vi o Especial do Dia dos Namorados e quero ver dicas de presentes encantadores!',
    themeColor: 'namorados',
    animationEffect: 'pulse',
    isActive: true,
    highlightCategory: 'Todas',
    targetDateText: 'Especial Dia dos Namorados',
    showReopenBadge: true,
  },
  {
    id: 'sug-pais',
    name: 'Dia dos Pais & Família',
    badge: 'ESPECIAL DIA DOS PAIS 👔',
    icon: '👔',
    title: 'Elegância em Família: Comemorações Especiais',
    subtitle: 'Renove seu closet para os almoços e celebrações em família. Peças sofisticadas, confortáveis e atemporais para curtir momentos inesquecíveis!',
    couponCode: 'FAMILIA2026',
    benefitText: 'Condições especiais e atendimento dedicado para suas comemorações',
    ctaText: 'Ver Looks para Almoço & Família',
    secondaryCtaText: 'Tirar Dúvidas com a Josy',
    whatsappMessage: 'Olá Josy! Quero ver looks confortáveis e elegantes para o almoço do Dia dos Pais!',
    themeColor: 'pais',
    animationEffect: 'gentle',
    isActive: true,
    highlightCategory: 'Todas',
    targetDateText: 'Celebre com Estilo',
    showReopenBadge: true,
  },
  {
    id: 'sug-blackfriday',
    name: 'Black Friday & Glam Days',
    badge: 'BLACK FRIDAY GLAM 🖤',
    icon: '🖤',
    title: 'A Maior Seleção de Descontos do Ano!',
    subtitle: 'Peças selecionadas com até 40% OFF por tempo rigorosamente limitado. Garanta suas bolsas e peças favoritas antes que os estoques se esgotem!',
    couponCode: 'BLACKGLAM',
    benefitText: 'Descontos de até 40% OFF em itens selecionados + Pronta Entrega',
    ctaText: 'Aproveitar Queima de Descontos',
    secondaryCtaText: 'Chamar Josy para Garantir Peça',
    whatsappMessage: 'Olá Josy! Quero garantir peças da Black Friday antes que esgotem!',
    themeColor: 'blackfriday',
    animationEffect: 'sparkles',
    isActive: true,
    highlightCategory: 'Promoções',
    targetDateText: 'Apenas Enquanto Durarem os Estoques',
    showReopenBadge: true,
  },
  {
    id: 'sug-aniversario',
    name: 'Aniversário JÔ Bolsas',
    badge: 'ANIVERSÁRIO JÔ BOLSAS 🎁',
    icon: '🎁',
    title: 'A Festa é Nossa, o Mimo é Seu!',
    subtitle: 'Comemoramos mais um ano vestindo mulheres que amam elegância e exclusividade. Venha celebrar conosco com mimos e condições imperdíveis!',
    couponCode: 'NIVERJOBOLSAS',
    benefitText: 'Brinde exclusivo da loja em todos os pedidos da semana',
    ctaText: 'Ver Coleção Comemorativa',
    secondaryCtaText: 'Parabenizar & Comprar no WhatsApp',
    whatsappMessage: 'Olá Josy! Parabéns pelo Aniversário da Jô Bolsas! Quero ver as novidades da semana!',
    themeColor: 'aniversario',
    animationEffect: 'sparkles',
    isActive: true,
    highlightCategory: 'Todas',
    targetDateText: 'Semana de Aniversário',
    showReopenBadge: true,
  },
  {
    id: 'sug-relampago',
    name: 'Promoção Relâmpago / Bazar',
    badge: 'OFERTA RELÂMPAGO ⚡',
    icon: '⚡',
    title: 'Peças Exclusivas com Preço Imperdível',
    subtitle: 'Últimas unidades do mostruário e pronta entrega imediata. Escolha a sua peça preferida antes que outra pessoa reserve!',
    couponCode: 'RELAMPAGO',
    benefitText: 'Valores especiais para pagamento via PIX na entrega ou balcão',
    ctaText: 'Ver Peças com Desconto',
    secondaryCtaText: 'Reservar Agora no WhatsApp',
    whatsappMessage: 'Olá Josy! Vi a promoção relâmpago no site e quero saber quais modelos ainda estão disponíveis!',
    themeColor: 'rose',
    animationEffect: 'pulse',
    isActive: true,
    highlightCategory: 'Promoções',
    targetDateText: 'Poucas Peças Disponíveis',
    showReopenBadge: true,
  },
];

/**
 * Obtém a campanha configurada atualmente. Se não existir, retorna a sugestão de Natal por padrão.
 */
export function getStoredSpecialPromotion(): SpecialDatePromotion {
  try {
    const raw = localStorage.getItem(SPECIAL_DATE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.title) {
        return parsed as SpecialDatePromotion;
      }
    }
  } catch (err) {
    console.error('Erro ao ler campanha de data especial do localStorage:', err);
  }
  return DEFAULT_SPECIAL_DATE_SUGGESTIONS[0]; // Padrão Natal
}

/**
 * Salva a campanha configurada no localStorage.
 */
export function saveStoredSpecialPromotion(campaign: SpecialDatePromotion): void {
  try {
    localStorage.setItem(SPECIAL_DATE_STORAGE_KEY, JSON.stringify(campaign));
    window.dispatchEvent(new CustomEvent('jb_special_promotion_updated', { detail: campaign }));
  } catch (err) {
    console.error('Erro ao salvar campanha de data especial:', err);
  }
}

/**
 * Verifica se o cliente já fechou a janela nesta sessão de navegação.
 */
export function isSpecialPromotionDismissedInSession(): boolean {
  try {
    return sessionStorage.getItem(SPECIAL_DATE_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Marca que o cliente fechou a janela nesta sessão.
 */
export function setSpecialPromotionDismissedInSession(): void {
  try {
    sessionStorage.setItem(SPECIAL_DATE_DISMISSED_KEY, 'true');
  } catch {
    // ignore
  }
}

/**
 * Limpa o status de fechado para reabrir nos testes.
 */
export function clearSpecialPromotionDismissedInSession(): void {
  try {
    sessionStorage.removeItem(SPECIAL_DATE_DISMISSED_KEY);
  } catch {
    // ignore
  }
}
