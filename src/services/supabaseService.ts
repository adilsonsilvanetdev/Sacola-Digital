import { Product, MalaOrder, SpecialDatePromotion } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';

/**
 * Converte um registro do banco de dados (snake_case) para a interface Product
 */
export function mapRowToProduct(row: any): Product {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    category: row.category || 'Bolsas',
    price: Number(row.price) || 0,
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    isPromotion: Boolean(row.is_promotion),
    promotionTag: row.promotion_tag || undefined,
    description: row.description || '',
    fabric: row.fabric || '',
    fitTip: row.fit_tip || '',
    sizes: Array.isArray(row.sizes) ? row.sizes : ['CM'],
    dimensionsCm: row.dimensions_cm || undefined,
    color: row.color || '',
    colorHex: row.color_hex || '#000000',
    image: row.image || '',
    secondaryImage: row.secondary_image || undefined,
    styleKeywords: Array.isArray(row.style_keywords) ? row.style_keywords : [],
    recommendedFor: Array.isArray(row.recommended_for) ? row.recommended_for : [],
    inStock: row.in_stock !== false,
    isCustom: Boolean(row.is_custom),
  };
}

/**
 * Converte a interface Product para o registro do banco de dados (snake_case)
 */
export function mapProductToRow(product: Product): Record<string, any> {
  return {
    id: String(product.id).trim(),
    name: product.name,
    category: product.category,
    price: product.price,
    original_price: product.originalPrice ?? null,
    is_promotion: Boolean(product.isPromotion),
    promotion_tag: product.promotionTag ?? null,
    description: product.description || '',
    fabric: product.fabric || '',
    fit_tip: product.fitTip || '',
    sizes: product.sizes || ['CM'],
    dimensions_cm: product.dimensionsCm ?? null,
    color: product.color || '',
    color_hex: product.colorHex || '#000000',
    image: product.image,
    secondary_image: product.secondaryImage ?? null,
    style_keywords: product.styleKeywords || [],
    recommended_for: product.recommendedFor || [],
    in_stock: product.inStock !== false,
    is_custom: Boolean(product.isCustom),
  };
}

/**
 * Busca todas as peças cadastradas no Supabase ordenadas pela data de criação
 */
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Erro ao buscar produtos no Supabase:', error.message);
      return null;
    }

    if (!data || !Array.isArray(data)) return [];
    return data.map(mapRowToProduct);
  } catch (err) {
    console.warn('Exceção ao buscar produtos no Supabase:', err);
    return null;
  }
}

/**
 * Salva ou atualiza uma peça no Supabase (Upsert por ID)
 */
export async function upsertProductInSupabase(product: Product): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = mapProductToRow(product);
    const { error } = await client
      .from('products')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Erro ao salvar produto no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exceção ao salvar produto no Supabase:', err);
    return false;
  }
}

/**
 * Exclui uma peça no Supabase pelo ID
 */
export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('products')
      .delete()
      .eq('id', String(productId).trim());

    if (error) {
      console.error('Erro ao excluir produto no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exceção ao excluir produto no Supabase:', err);
    return false;
  }
}

/**
 * Envia todas as peças locais em lote para o Supabase (Sincronização / Carga Inicial)
 */
export async function bulkUpsertProductsToSupabase(products: Product[]): Promise<{
  success: boolean;
  count: number;
  message: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      count: 0,
      message: 'Supabase não conectado. Configure a URL e Anon Key primeiro.',
    };
  }

  try {
    const rows = products.map(mapProductToRow);
    const { error } = await client
      .from('products')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      return {
        success: false,
        count: 0,
        message: `Erro ao subir peças para o Supabase: ${error.message}`,
      };
    }

    return {
      success: true,
      count: products.length,
      message: `${products.length} peças sincronizadas com sucesso no Supabase!`,
    };
  } catch (err: any) {
    return {
      success: false,
      count: 0,
      message: `Falha na sincronização em lote: ${err.message || 'Erro inesperado'}`,
    };
  }
}

/**
 * Busca a campanha promocional ativa no Supabase
 */
export async function fetchSpecialPromotionFromSupabase(): Promise<SpecialDatePromotion | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('special_promotions')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id || 'active_campaign',
      name: data.name,
      badge: data.badge,
      icon: data.icon,
      title: data.title,
      subtitle: data.subtitle,
      couponCode: data.coupon_code || undefined,
      benefitText: data.benefit_text || undefined,
      ctaText: data.cta_text,
      secondaryCtaText: data.secondary_cta_text || undefined,
      whatsappMessage: data.whatsapp_message || undefined,
      themeColor: data.theme_color || 'natal',
      animationEffect: data.animation_effect || 'sparkles',
      isActive: Boolean(data.is_active),
      highlightCategory: data.highlight_category || undefined,
      targetDateText: data.target_date_text || undefined,
      showReopenBadge: data.show_reopen_badge !== false,
    };
  } catch {
    return null;
  }
}

/**
 * Salva a campanha promocional no Supabase
 */
export async function upsertSpecialPromotionInSupabase(
  campaign: SpecialDatePromotion
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = {
      id: campaign.id || 'active_campaign',
      name: campaign.name,
      badge: campaign.badge,
      icon: campaign.icon,
      title: campaign.title,
      subtitle: campaign.subtitle,
      coupon_code: campaign.couponCode ?? null,
      benefit_text: campaign.benefitText ?? null,
      cta_text: campaign.ctaText,
      secondary_cta_text: campaign.secondaryCtaText ?? null,
      whatsapp_message: campaign.whatsappMessage ?? null,
      theme_color: campaign.themeColor,
      animation_effect: campaign.animationEffect,
      is_active: campaign.isActive,
      highlight_category: campaign.highlightCategory ?? null,
      target_date_text: campaign.targetDateText ?? null,
      show_reopen_badge: campaign.showReopenBadge !== false,
    };

    const { error } = await client
      .from('special_promotions')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Erro ao salvar promoção no Supabase:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Salva um pedido de Mala Delivery no Supabase
 */
export async function saveMalaOrderInSupabase(order: MalaOrder): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = {
      id: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      delivery_type: order.deliveryType || 'delivery',
      address: order.address,
      neighborhood: order.neighborhood,
      city: order.city,
      street: order.street ?? null,
      number: order.number ?? null,
      complement: order.complement ?? null,
      delivery_instructions: order.deliveryInstructions ?? null,
      scheduled_date: order.scheduledDate,
      scheduled_time_slot: order.scheduledTimeSlot,
      items: order.items,
      curation_mode: order.curationMode || 'self',
      stylist_quiz: order.stylistQuiz ?? null,
      stylist_note: order.stylistNote ?? null,
      status: order.status || 'solicitada',
      return_deadline: order.returnDeadline ?? null,
    };

    const { error } = await client
      .from('mala_orders')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Erro ao registrar pedido no Supabase:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Inscreve-se nas atualizações em tempo real (Supabase Realtime) da tabela 'products'
 */
export function subscribeToProductsRealtime(onProductsChange: () => void): () => void {
  const client = getSupabaseClient();
  if (!client) return () => {};

  try {
    const channel = client
      .channel('public:products:changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          onProductsChange();
        }
      )
      .subscribe();

    return () => {
      try {
        client.removeChannel(channel);
      } catch {
        // ignore
      }
    };
  } catch {
    return () => {};
  }
}
