-- ==============================================================================
-- JÔ BOLSAS GLAMOUR - SCHEMA COMPLETO DO SUPABASE (POSTGRESQL)
-- Script de Criação de Tabelas, Índices, RLS e Políticas de Sincronização
-- ==============================================================================
-- Instruções de Execução:
-- 1. Acesse o painel do Supabase (https://supabase.com/dashboard)
-- 2. Selecione seu projeto (ou crie um novo gratuitamente)
-- 3. Clique em "SQL Editor" no menu lateral esquerdo
-- 4. Cole este script completo e clique em "RUN" (Executar)
-- ==============================================================================

-- 1. Habilitar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABELA: products (Catálogo de Bolsas, Carteiras e Roupas com Renovação Periódica)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  is_promotion BOOLEAN DEFAULT false,
  promotion_tag TEXT,
  description TEXT DEFAULT '',
  fabric TEXT DEFAULT '',
  fit_tip TEXT DEFAULT '',
  sizes JSONB NOT NULL DEFAULT '["CM"]'::jsonb,
  dimensions_cm TEXT,
  color TEXT DEFAULT '',
  color_hex TEXT DEFAULT '#000000',
  image TEXT NOT NULL,
  secondary_image TEXT,
  style_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_for JSONB NOT NULL DEFAULT '[]'::jsonb,
  in_stock BOOLEAN DEFAULT true,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de performance para busca e filtros rápidos na loja
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products (in_stock);
CREATE INDEX IF NOT EXISTS idx_products_is_promotion ON public.products (is_promotion);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

-- ==============================================================================
-- TABELA: mala_orders (Agendamentos e Pedidos da Mala Delivery 48h)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.mala_orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_type TEXT DEFAULT 'delivery',
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  street TEXT,
  number TEXT,
  complement TEXT,
  delivery_instructions TEXT,
  scheduled_date TEXT NOT NULL,
  scheduled_time_slot TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  curation_mode TEXT DEFAULT 'self',
  stylist_quiz JSONB,
  stylist_note TEXT,
  status TEXT NOT NULL DEFAULT 'solicitada',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  return_deadline TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mala_orders_status ON public.mala_orders (status);
CREATE INDEX IF NOT EXISTS idx_mala_orders_created_at ON public.mala_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mala_orders_customer_phone ON public.mala_orders (customer_phone);

-- ==============================================================================
-- TABELA: special_promotions (Campanhas e Pop-up de Datas Especiais)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.special_promotions (
  id TEXT PRIMARY KEY DEFAULT 'active_campaign',
  name TEXT NOT NULL,
  badge TEXT NOT NULL,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  coupon_code TEXT,
  benefit_text TEXT,
  cta_text TEXT NOT NULL,
  secondary_cta_text TEXT,
  whatsapp_message TEXT,
  theme_color TEXT NOT NULL DEFAULT 'natal',
  animation_effect TEXT NOT NULL DEFAULT 'sparkles',
  is_active BOOLEAN DEFAULT false,
  highlight_category TEXT,
  target_date_text TEXT,
  show_reopen_badge BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TRIGGER AUTOMÁTICO: Atualizar timestamp 'updated_at'
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_mala_orders_updated_at ON public.mala_orders;
CREATE TRIGGER set_mala_orders_updated_at
  BEFORE UPDATE ON public.mala_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_special_promotions_updated_at ON public.special_promotions;
CREATE TRIGGER set_special_promotions_updated_at
  BEFORE UPDATE ON public.special_promotions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- PERMISSÕES EXPLICITAS (GRANT) E ROW LEVEL SECURITY (RLS)
-- Garante que a role anon (pública) e authenticated tenham acesso às tabelas
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mala_orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.special_promotions TO anon, authenticated, service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mala_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_promotions ENABLE ROW LEVEL SECURITY;

-- Políticas para products:
DROP POLICY IF EXISTS "Public can view in-stock products" ON public.products;
CREATE POLICY "Public can view in-stock products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow anon inserts for products" ON public.products;
CREATE POLICY "Allow anon inserts for products"
  ON public.products FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon updates for products" ON public.products;
CREATE POLICY "Allow anon updates for products"
  ON public.products FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon deletes for products" ON public.products;
CREATE POLICY "Allow anon deletes for products"
  ON public.products FOR DELETE
  USING (true);

-- Políticas para mala_orders:
DROP POLICY IF EXISTS "Public can insert orders" ON public.mala_orders;
CREATE POLICY "Public can insert orders"
  ON public.mala_orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view orders" ON public.mala_orders;
CREATE POLICY "Public can view orders"
  ON public.mala_orders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can update orders" ON public.mala_orders;
CREATE POLICY "Public can update orders"
  ON public.mala_orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Políticas para special_promotions:
DROP POLICY IF EXISTS "Public can view promotions" ON public.special_promotions;
CREATE POLICY "Public can view promotions"
  ON public.special_promotions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can modify promotions" ON public.special_promotions;
CREATE POLICY "Public can modify promotions"
  ON public.special_promotions FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- REALTIME: Publicação em tempo real para sincronização instantânea na vitrine
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'special_promotions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.special_promotions;
  END IF;
END $$;

-- ==============================================================================
-- CARGA INICIAL (SEED): Peças de exemplo da loja JÔ Bolsas Glamour
-- ==============================================================================
INSERT INTO public.products (
  id, name, category, price, original_price, is_promotion, promotion_tag,
  description, fabric, fit_tip, sizes, dimensions_cm, color, color_hex,
  image, secondary_image, style_keywords, recommended_for, in_stock, is_custom
) VALUES
(
  'prod-bag-1',
  'Bolsa Tote Glamour em Couro Caramelo',
  'Bolsas',
  489.00,
  589.00,
  true,
  'Oferta Especial',
  'Bolsa tote estruturada confeccionada em couro legítimo textura floater. Detalhes em metal dourado nobre, alças reforçadas e bolso interno com divisória para celular e maquiagem.',
  '100% Couro Bovino Legítimo com Forro Toque Acetinado',
  'Espaçosa e elegante para transitar com perfeição do trabalho ao jantar executivo.',
  '["CM"]'::jsonb,
  '38cm x 28cm x 14cm',
  'Caramelo Cognac',
  '#9C582B',
  '/images/bag_tote_leather_glamour_1791406308576.jpg',
  NULL,
  '["Alfaiataria Sofisticada", "Casual Elegante", "Neutros & Terrosos"]'::jsonb,
  '["Trabalho & Reuniões", "Dia a Dia Prático & Chic", "Jantar Especial"]'::jsonb,
  true,
  false
),
(
  'prod-bag-2',
  'Bolsa Tiracolo Matelassê Noir com Corrente Dourada',
  'Bolsas',
  399.00,
  479.00,
  true,
  'Promoção da Semana',
  'Bolsa clássica acolchoada em padrão matelassê chevron com fecho giratório dourado. Alça de corrente deslizante versátil para uso a tiracolo ou no ombro.',
  'Couro Premium Acolchoado com Ferragens Antialérgicas',
  'Tamanho perfeito para carregar smartphone, carteira compacta, chaves e maquiagem.',
  '["CM"]'::jsonb,
  '24cm x 16cm x 8cm',
  'Preto Noir Ônix',
  '#181716',
  '/images/bag_crossbody_noir_1791406322451.jpg',
  NULL,
  '["Festiva & Noite", "Moderna & Minimalista", "Preto & Branco / Minimal"]'::jsonb,
  '["Jantar Especial", "Festiva & Noite", "Fim de Semana & Lazer"]'::jsonb,
  true,
  false
),
(
  'prod-wallet-1',
  'Carteira Slim Glamour em Couro com Zíper Dourado',
  'Carteiras',
  189.00,
  249.00,
  true,
  'Edição Especial',
  'Carteira feminina compacta em couro legítimo textura caviar. Espaço para 8 cartões, divisória para notas e bolso interno com zíper metálico reforçado.',
  '100% Couro Legítimo Caviar com Forro Antidesmagnetização',
  'Cabe com folga em qualquer bolsa e também pode ser usada como clutch de mão.',
  '["CM"]'::jsonb,
  '19cm x 10cm x 2.5cm',
  'Caramelo & Dourado',
  '#8C5229',
  '/images/wallet_leather_glamour_1791406336336.jpg',
  NULL,
  '["Casual Elegante", "Moderna & Minimalista"]'::jsonb,
  '["Dia a Dia Prático & Chic", "Trabalho & Reuniões"]'::jsonb,
  true,
  false
),
(
  'prod-bag-3',
  'Bolsa Baú Classic Rose com Alça Removível',
  'Bolsas',
  449.00,
  529.00,
  true,
  'Destaque Glamour',
  'Bolsa baú com curvas delicadas e acabamento impecável. Acompanha alça longa transversal ajustável e chaveiro exclusivo.',
  'Couro Estruturado Soft Touch',
  'Peça atemporal que confere romantismo sofisticado a produções do dia a dia.',
  '["CM"]'::jsonb,
  '30cm x 22cm x 15cm',
  'Nude Rosé Suave',
  '#C99A8B',
  '/images/bag_bau_rose_1791406350328.jpg',
  NULL,
  '["Romântica & Fluida", "Casual Elegante", "Tons Suaves & Pastel"]'::jsonb,
  '["Fim de Semana & Lazer", "Dia a Dia Prático & Chic"]'::jsonb,
  true,
  false
),
(
  'prod-wallet-2',
  'Porta-Cartões & Moedas Ônix Compact',
  'Carteiras',
  129.00,
  169.00,
  true,
  'Queridinho da Loja',
  'Porta-cartões minimalista com fecho por botão de pressão e compartimento com zíper para moedas e chaves.',
  'Couro Texturizado Antirrisco',
  'Ideal para bolsas menores de festa ou viagens rápidas.',
  '["CM"]'::jsonb,
  '12cm x 8cm x 1.5cm',
  'Preto Ônix',
  '#201E1D',
  '/images/cardholder_noir_1791406364027.jpg',
  NULL,
  '["Moderna & Minimalista", "Preto & Branco / Minimal"]'::jsonb,
  '["Dia a Dia Prático & Chic", "Festiva & Noite"]'::jsonb,
  true,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  is_promotion = EXCLUDED.is_promotion,
  promotion_tag = EXCLUDED.promotion_tag,
  description = EXCLUDED.description,
  fabric = EXCLUDED.fabric,
  fit_tip = EXCLUDED.fit_tip,
  sizes = EXCLUDED.sizes,
  dimensions_cm = EXCLUDED.dimensions_cm,
  color = EXCLUDED.color,
  color_hex = EXCLUDED.color_hex,
  image = EXCLUDED.image,
  style_keywords = EXCLUDED.style_keywords,
  recommended_for = EXCLUDED.recommended_for,
  in_stock = EXCLUDED.in_stock;

-- ==============================================================================
-- FIM DO SCRIPT DE MIGRAÇÃO
-- Suas tabelas estão prontas para receber atualizações diárias e semanais!
-- ==============================================================================
