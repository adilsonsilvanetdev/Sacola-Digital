import { Product, StylistQuizAnswers, MalaItem } from '../types';
import { SAMPLE_PRODUCTS, MAX_MALA_ITEMS } from '../data/products';

export interface CurationResult {
  items: MalaItem[];
  stylistNote: string;
  capsuleConcept: string;
}

export function generateStylistCuration(quiz: StylistQuizAnswers): CurationResult {
  const scoredProducts = SAMPLE_PRODUCTS.map((product) => {
    let score = 0;

    // Check style match
    if (product.styleKeywords.includes(quiz.primaryStyle)) {
      score += 4;
    }

    // Check occasion match
    if (product.recommendedFor.includes(quiz.occasion)) {
      score += 3;
    }

    // Check palette match
    if (product.styleKeywords.includes(quiz.palettePreference)) {
      score += 2;
    }

    // Top vs bottom size compatibility
    const isBottom = product.category === 'Calças & Shorts';
    const chosenSize = isBottom ? (quiz.bottomSize || '38') : (quiz.topSize || 'M');

    return {
      product,
      score,
      isBottom,
      recommendedSize: chosenSize,
    };
  });

  // Sort by relevance score
  scoredProducts.sort((a, b) => b.score - a.score);

  // Curate a balanced 6 to 8 item capsule for fitting at home
  const selected: { product: Product; size: string }[] = [];
  const targetCount = Math.min(MAX_MALA_ITEMS - 2, 7); // 7 key pieces curated by stylist, plenty of room up to 15

  // 1. Ensure at least one third-piece / outer layer (blazer, trench, or cardigan)
  const outerPiece = scoredProducts.find(
    (p) => p.product.category === 'Blazers & Alfaiataria' || p.product.category === 'Casacos'
  );
  if (outerPiece) {
    selected.push({ product: outerPiece.product, size: outerPiece.recommendedSize });
  }

  // 2. Ensure tops or blouses (up to 2)
  const topPieces = scoredProducts.filter(
    (p) => p.product.category === 'Camisas & Blusas' && !selected.some((s) => s.product.id === p.product.id)
  );
  topPieces.slice(0, 2).forEach((p) => {
    selected.push({ product: p.product, size: p.recommendedSize });
  });

  // 3. Ensure bottoms (pants, shorts, skirts)
  const bottomPieces = scoredProducts.filter(
    (p) => p.product.category === 'Calças & Shorts' && !selected.some((s) => s.product.id === p.product.id)
  );
  bottomPieces.slice(0, 2).forEach((p) => {
    selected.push({ product: p.product, size: p.recommendedSize });
  });

  // 4. Ensure dresses or jumpsuits
  const dressPieces = scoredProducts.filter(
    (p) => (p.product.category === 'Vestidos' || p.product.category === 'Conjuntos & Tricot') &&
      !selected.some((s) => s.product.id === p.product.id)
  );
  dressPieces.slice(0, 2).forEach((p) => {
    selected.push({ product: p.product, size: p.recommendedSize });
  });

  // Fill up to targetCount with remaining highest scoring pieces
  for (const item of scoredProducts) {
    if (selected.length >= targetCount) break;
    if (!selected.some((s) => s.product.id === item.product.id)) {
      selected.push({ product: item.product, size: item.recommendedSize });
    }
  }

  const malaItems: MalaItem[] = selected.map((s) => ({
    product: s.product,
    selectedSize: s.size,
    requestSecondarySize: true, // Proactively offer backup size for fitting comfort
    secondarySize: getNextSize(s.size),
  }));

  // Create warm, personalized stylist message
  const clientFirstName = quiz.clientName ? quiz.clientName.trim().split(' ')[0] : 'querida';

  const stylistNote = `Olá, ${clientFirstName}! Com base nas suas preferências (${quiz.occasion}) e estilo ${quiz.primaryStyle.toLowerCase()} com cartela de ${quiz.palettePreference.toLowerCase()}, montei uma mala cápsula especial com ${selected.length} peças exclusivas. Todas conversam entre si para você criar pelo menos 8 looks completos no conforto do seu closet. Sua mala suporta até ${MAX_MALA_ITEMS} peças, então você ainda pode adicionar suas favoritas antes da entrega!`;

  const capsuleConcept = `Cápsula ${quiz.primaryStyle} · Focada em ${quiz.occasion}`;

  return {
    items: malaItems,
    stylistNote,
    capsuleConcept,
  };
}

function getNextSize(size: string): string {
  const letterMap: Record<string, string> = { PP: 'P', P: 'M', M: 'G', G: 'GG', GG: 'G' };
  const numMap: Record<string, string> = { '34': '36', '36': '38', '38': '40', '40': '42', '42': '44', '44': '42' };

  if (letterMap[size]) return letterMap[size];
  if (numMap[size]) return numMap[size];
  return 'M';
}
