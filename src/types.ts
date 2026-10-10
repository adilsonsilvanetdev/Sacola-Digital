export interface Product {
  id: string;
  name: string;
  category: 'Bolsas' | 'Carteiras' | 'Vestidos' | 'Blazers & Alfaiataria' | 'Camisas & Blusas' | 'Calças & Shorts' | 'Conjuntos & Tricot' | 'Casacos' | string;
  price: number;
  originalPrice?: number; // Preço original para promoções especiais (ex: De R$ 589 por R$ 489)
  isPromotion?: boolean; // Marca se a peça está na seção de Promoções com cor em destaque
  promotionTag?: string; // Tag em destaque: ex "Oferta Especial", "-25% OFF", "Edição Limitada"
  description: string;
  fabric: string;
  fitTip: string;
  sizes: ('P' | 'M' | 'G1' | 'G2' | 'G3' | 'CM' | string)[]; // Roupas: P, M, G1, G2, G3. Bolsas/Carteiras: CM
  dimensionsCm?: string; // Onde será incluída a medida em CM para bolsas, carteiras, etc. (ex: "38cm x 28cm x 14cm")
  color: string;
  colorHex: string;
  image: string;
  secondaryImage?: string;
  styleKeywords: string[];
  recommendedFor: string[];
  inStock: boolean;
  isCustom?: boolean;
}

export interface MalaItem {
  product: Product;
  selectedSize: string;
  requestSecondarySize?: boolean; // Levar tamanho reserva para comparar
  secondarySize?: string;
  notes?: string;
}

export interface StylistQuizAnswers {
  clientName: string;
  whatsapp: string;
  primaryStyle: 'Alfaiataria Sofisticada' | 'Casual Elegante' | 'Romântica & Fluida' | 'Moderna & Minimalista' | 'Festiva & Noite';
  occasion: 'Trabalho & Reuniões' | 'Fim de Semana & Lazer' | 'Jantar Especial' | 'Dia a Dia Prático & Chic' | 'Viagem & Resort';
  topSize: 'P' | 'M' | 'G1' | 'G2' | 'G3';
  bottomSize: 'P' | 'M' | 'G1' | 'G2' | 'G3';
  palettePreference: 'Neutros & Terrosos' | 'Preto & Branco / Minimal' | 'Tons Suaves & Pastel' | 'Cores Marcantes';
  fitPreference: 'Modelagem Soltinha e Fluida' | 'Acinturada e Estruturada' | 'Oversized & Contemporânea';
  specificNotes: string;
}

export interface MalaOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryType?: 'pickup' | 'delivery';
  address: string;
  neighborhood: string;
  city: string;
  street?: string;
  number?: string;
  complement?: string;
  deliveryInstructions?: string;
  scheduledDate: string;
  scheduledTimeSlot: 'Manhã (09h às 13h)' | 'Tarde (14h às 18h)' | 'Noite (18h às 20h)';
  items: MalaItem[];
  curationMode?: 'self' | 'stylist';
  stylistQuiz?: StylistQuizAnswers;
  stylistNote?: string;
  status: 'solicitada' | 'em_separacao' | 'em_rota' | 'em_provador_48h' | 'concluida';
  createdAt: string;
  returnDeadline?: string;
}
