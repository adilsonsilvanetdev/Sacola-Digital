import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cloud, 
  CloudOff, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  Key, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Trash2, 
  Eye, 
  EyeOff,
  Server,
  Layers
} from 'lucide-react';
import { Product } from '../types';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection, 
  isSupabaseConfigured 
} from '../services/supabaseClient';
import { 
  bulkUpsertProductsToSupabase, 
  fetchProductsFromSupabase 
} from '../services/supabaseService';

interface SupabaseSyncManagerProps {
  products: Product[];
  onProductsUpdatedFromCloud: (cloudProducts: Product[]) => void;
  onShowToast: (message: string) => void;
}

const SQL_SCHEMA_SCRIPT = `-- ==============================================================================
-- JÔ BOLSAS GLAMOUR - SCHEMA DO SUPABASE (POSTGRESQL)
-- Cole este script no SQL Editor do seu projeto Supabase e clique em RUN
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

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products (in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

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

-- Permissões explícitas de acesso para anon e authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.mala_orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.special_promotions TO anon, authenticated, service_role;

-- Políticas de Acesso Público & Chave Anônima (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mala_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can mutate products" ON public.products;
CREATE POLICY "Public can mutate products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can use orders" ON public.mala_orders;
CREATE POLICY "Public can use orders" ON public.mala_orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can use promotions" ON public.special_promotions;
CREATE POLICY "Public can use promotions" ON public.special_promotions FOR ALL USING (true) WITH CHECK (true);

-- Habilitar Sincronização em Tempo Real (Realtime)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;`;

export const SupabaseSyncManager: React.FC<SupabaseSyncManagerProps> = ({
  products,
  onProductsUpdatedFromCloud,
  onShowToast,
}) => {
  const [config, setConfig] = useState(getSupabaseConfig());
  const [urlInput, setUrlInput] = useState(config.url);
  const [keyInput, setKeyInput] = useState(config.anonKey);
  const [showKey, setShowKey] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const [isSyncingUp, setIsSyncingUp] = useState(false);
  const [isSyncingDown, setIsSyncingDown] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    const current = getSupabaseConfig();
    setConfig(current);
    setUrlInput(current.url);
    setKeyInput(current.anonKey);
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Salva temporariamente para teste caso o usuário tenha digitado novas credenciais
    if (urlInput !== config.url || keyInput !== config.anonKey) {
      try {
        saveSupabaseConfig(urlInput, keyInput);
        setConfig(getSupabaseConfig());
      } catch (err: any) {
        setIsTesting(false);
        setTestResult({
          success: false,
          message: err.message || 'Credenciais inválidas.',
        });
        return;
      }
    }

    const res = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      onShowToast('Conexão com o Supabase estabelecida com sucesso!');
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      saveSupabaseConfig(urlInput, keyInput);
      const updated = getSupabaseConfig();
      setConfig(updated);
      setTestResult(null);
      onShowToast('Credenciais do Supabase salvas!');
      handleTestConnection();
    } catch (err: any) {
      onShowToast(err.message || 'Erro ao salvar credenciais.');
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Deseja desconectar do Supabase e retornar ao armazenamento local?')) {
      clearSupabaseConfig();
      setConfig(getSupabaseConfig());
      setUrlInput('');
      setKeyInput('');
      setTestResult(null);
      onShowToast('Desconectado do Supabase. Operando no modo local.');
    }
  };

  const handleUploadAllToCloud = async () => {
    if (!isSupabaseConfigured()) {
      onShowToast('Configure e teste o Supabase antes de sincronizar.');
      return;
    }

    setIsSyncingUp(true);
    const res = await bulkUpsertProductsToSupabase(products);
    setIsSyncingUp(false);

    if (res.success) {
      onShowToast(`Sucesso! ${res.count} peças salvas na nuvem Supabase.`);
      handleTestConnection();
    } else {
      onShowToast(res.message);
    }
  };

  const handleDownloadFromCloud = async () => {
    if (!isSupabaseConfigured()) {
      onShowToast('Configure o Supabase primeiro.');
      return;
    }

    setIsSyncingDown(true);
    const cloudList = await fetchProductsFromSupabase();
    setIsSyncingDown(false);

    if (cloudList && cloudList.length > 0) {
      onProductsUpdatedFromCloud(cloudList);
      onShowToast(`${cloudList.length} peças sincronizadas da nuvem com sucesso!`);
    } else if (cloudList && cloudList.length === 0) {
      onShowToast('Nenhuma peça encontrada no Supabase. Experimente subir as peças locais!');
    } else {
      onShowToast('Falha ao baixar dados do Supabase. Verifique a tabela e credenciais.');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopiedSql(true);
    onShowToast('Script SQL copiado para a área de transferência!');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const isConnected = isSupabaseConfigured();

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner de Status da Integração */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isConnected
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          : 'bg-stone-900 border-stone-800 text-stone-300'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-xl ${
              isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-stone-800 text-stone-400'
            }`}>
              {isConnected ? <Cloud className="w-7 h-7" /> : <CloudOff className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Integração com Supabase (PostgreSQL na Nuvem)
                </h3>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  isConnected 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isConnected ? 'Ativo na Nuvem' : 'Modo Offline / Local'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {isConnected
                  ? `Conectado ao projeto ${config.url}. Suas renovações diárias e semanais de peças ficarão salvas e seguras.`
                  : 'Seus dados estão sendo guardados no navegador. Conecte o Supabase para que novas bolsas e roupas fiquem salvas na nuvem em tempo real.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700/60 text-stone-300 font-mono">
              {products.length} peças cadastradas
            </span>
          </div>
        </div>

        {testResult && (
          <div className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-3 border ${
            testResult.success 
              ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Grid: Formulário de Credenciais + Ações Rápidas de Sincronização */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card de Configuração de Credenciais */}
        <div className="lg:col-span-7 bg-stone-900 rounded-2xl border border-stone-800 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Credenciais da API do Supabase
              </h4>
            </div>
            {config.source !== 'none' && (
              <span className="text-[11px] text-stone-400">
                Origem: <strong className="text-stone-200">{config.source === 'env' ? 'Variáveis (.env)' : 'Painel Local'}</strong>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                URL do Projeto (Project URL)
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  placeholder="https://seu-projeto.supabase.co"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Encontrada em Supabase &gt; Project Settings &gt; API &gt; Project URL
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Chave Pública / Anon Key (anon public)
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-850 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors p-1"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Encontrada em Supabase &gt; Project Settings &gt; API &gt; Project API keys (anon public)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-amber-900/20 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Salvar Credenciais
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !urlInput || !keyInput}
                className="px-4 py-2.5 bg-stone-800 hover:bg-stone-750 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-stone-700/60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                {isTesting ? 'Testando Conexão...' : 'Testar Conexão'}
              </button>

              {config.source !== 'none' && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-2.5 text-stone-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ml-auto cursor-pointer"
                  title="Limpar credenciais e voltar ao modo local"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Desconectar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Card de Ações de Sincronização em Massa */}
        <div className="lg:col-span-5 bg-stone-900 rounded-2xl border border-stone-800 p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-stone-800">
              <Layers className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Sincronização do Catálogo
              </h4>
            </div>

            <p className="text-xs text-stone-400 mt-4 leading-relaxed">
              Use estes botões para migrar ou sincronizar as bolsas, carteiras e roupas entre o navegador da vendedora e o banco de dados Supabase na nuvem.
            </p>

            <div className="space-y-3 mt-6">
              <button
                onClick={handleUploadAllToCloud}
                disabled={isSyncingUp || !isConnected}
                className="w-full p-3.5 bg-stone-850 hover:bg-stone-800 border border-stone-750 rounded-xl flex items-center justify-between text-left text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Subir Peças Atuais para a Nuvem</div>
                    <div className="text-[11px] text-stone-400">
                      Envia todas as {products.length} peças locais para a tabela do Supabase
                    </div>
                  </div>
                </div>
                {isSyncingUp && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />}
              </button>

              <button
                onClick={handleDownloadFromCloud}
                disabled={isSyncingDown || !isConnected}
                className="w-full p-3.5 bg-stone-850 hover:bg-stone-800 border border-stone-750 rounded-xl flex items-center justify-between text-left text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
                    <DownloadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Puxar Peças da Nuvem</div>
                    <div className="text-[11px] text-stone-400">
                      Recarrega o catálogo atualizado a partir do banco de dados
                    </div>
                  </div>
                </div>
                {isSyncingDown && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Ao adicionar, editar ou excluir peças na aba <strong>&quot;Gerenciar Peças&quot;</strong>, a sincronização é <strong>automática e em tempo real</strong> quando conectado!
            </span>
          </div>
        </div>
      </div>

      {/* Caixa do Script SQL para Criação das Tabelas */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Script SQL de Criação de Tabelas (Supabase SQL Editor)
              </h4>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Cria as tabelas <code className="text-amber-300">products</code>, <code className="text-amber-300">mala_orders</code> e <code className="text-amber-300">special_promotions</code> com índices, políticas de segurança e suporte a Realtime.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border border-stone-700/60"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir Supabase
            </a>

            <button
              onClick={handleCopySql}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSql ? 'Copiado!' : 'Copiar Script SQL'}
            </button>
          </div>
        </div>

        {/* Visualização de Código Formatado */}
        <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <div className="px-4 py-2 bg-stone-900/90 border-b border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <span className="font-mono text-stone-300 ml-2">supabase/schema.sql</span>
            </div>
            <span>PostgreSQL DDL</span>
          </div>
          <pre className="p-4 text-[11px] text-stone-300 font-mono overflow-x-auto max-h-72 leading-relaxed selection:bg-amber-500/30">
            {SQL_SCHEMA_SCRIPT}
          </pre>
        </div>
      </div>

      {/* Passo a Passo Ilustrado */}
      <div className="bg-stone-900/60 rounded-2xl border border-stone-850 p-6 space-y-4">
        <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-amber-400" />
          Passo a Passo Rápido para Ativação Completa
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 text-xs space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <div className="font-semibold text-white">Criar Projeto Gratuito</div>
            <p className="text-[11px] text-stone-400 leading-normal">
              Acesse supabase.com, crie uma conta gratuita e inicie um novo projeto.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 text-xs space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <div className="font-semibold text-white">Executar o Script SQL</div>
            <p className="text-[11px] text-stone-400 leading-normal">
              No menu lateral esquerdo, clique em <strong>SQL Editor</strong>, cole o script acima e clique em <strong>RUN</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 text-xs space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <div className="font-semibold text-white">Copiar as Chaves API</div>
            <p className="text-[11px] text-stone-400 leading-normal">
              Vá em <strong>Project Settings &gt; API</strong> e copie a <strong>Project URL</strong> e a <strong>anon public key</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 text-xs space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <div className="font-semibold text-white">Salvar e Sincronizar</div>
            <p className="text-[11px] text-stone-400 leading-normal">
              Cole as credenciais nesta aba, clique em <strong>Salvar Credenciais</strong> e depois em <strong>Subir Peças Atuais</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
