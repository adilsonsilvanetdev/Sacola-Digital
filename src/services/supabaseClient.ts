import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_STORAGE_CREDENTIALS_KEY = 'jb_supabase_credentials';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  source: 'env' | 'storage' | 'none';
}

let cachedClient: SupabaseClient | null = null;
let currentClientKey = '';

/**
 * Obtém a configuração atual do Supabase a partir de variáveis de ambiente
 * ou de credenciais inseridas pela Josy diretamente no painel administrativo.
 */
export function getSupabaseConfig(): SupabaseConfig {
  // 1. Verificar variáveis de ambiente Vite (.env central do projeto para acesso público global)
  const envUrl = ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || '').trim().replace(/\/+$/, '');
  const envKey = ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || '').trim();

  if (envUrl.startsWith('https://') && envKey.length > 20 && !envUrl.includes('seu-projeto')) {
    return {
      url: envUrl,
      anonKey: envKey,
      source: 'env'
    };
  }

  // 2. Sincronização automática via link compartilhado (Ex: celular para computador)
  try {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get('sb_url');
      const keyParam = params.get('sb_key');
      if (urlParam && keyParam) {
        const cleanUrl = decodeURIComponent(urlParam).trim().replace(/\/+$/, '');
        const cleanKey = decodeURIComponent(keyParam).trim();
        if (cleanUrl.startsWith('https://') && cleanKey.length > 20) {
          localStorage.setItem(
            SUPABASE_STORAGE_CREDENTIALS_KEY,
            JSON.stringify({ url: cleanUrl, anonKey: cleanKey })
          );
          // Limpa os parâmetros da URL para discrição
          const cleanPath = window.location.pathname;
          window.history.replaceState({}, '', cleanPath);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('jb_supabase_config_updated'));
          }, 50);
          return {
            url: cleanUrl,
            anonKey: cleanKey,
            source: 'storage',
          };
        }
      }
    }
  } catch {
    // ignore
  }

  // 3. Verificar credenciais salvas no armazenamento local da vendedora
  try {
    const raw = localStorage.getItem(SUPABASE_STORAGE_CREDENTIALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.url && parsed.anonKey) {
        const cleanUrl = String(parsed.url).trim().replace(/\/+$/, '');
        const cleanKey = String(parsed.anonKey).trim();
        if (cleanUrl.startsWith('https://') && cleanKey.length > 20) {
          return {
            url: cleanUrl,
            anonKey: cleanKey,
            source: 'storage'
          };
        }
      }
    }
  } catch {
    // ignore
  }

  return {
    url: '',
    anonKey: '',
    source: 'none'
  };
}

/**
 * Verifica se o Supabase está devidamente configurado e pronto para uso.
 */
export function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey && cfg.source !== 'none');
}

/**
 * Retorna uma instância singleton do cliente Supabase ou null se não configurado.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    cachedClient = null;
    currentClientKey = '';
    return null;
  }

  const clientKey = `${config.url}::${config.anonKey}`;
  if (cachedClient && currentClientKey === clientKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    currentClientKey = clientKey;
    return cachedClient;
  } catch (err) {
    console.error('Erro ao inicializar cliente Supabase:', err);
    cachedClient = null;
    currentClientKey = '';
    return null;
  }
}

/**
 * Salva credenciais do Supabase no armazenamento do painel
 */
export function saveSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    const cleanKey = anonKey.trim();

    if (!cleanUrl.startsWith('https://')) {
      throw new Error('A URL do Supabase precisa começar com https://');
    }
    if (cleanKey.length < 20) {
      throw new Error('A Anon Key fornecida parece inválida ou muito curta.');
    }

    localStorage.setItem(
      SUPABASE_STORAGE_CREDENTIALS_KEY,
      JSON.stringify({ url: cleanUrl, anonKey: cleanKey, savedAt: new Date().toISOString() })
    );

    // Reseta cliente em cache para forçar nova conexão
    cachedClient = null;
    currentClientKey = '';
    window.dispatchEvent(new CustomEvent('jb_supabase_config_updated'));
    return true;
  } catch (err) {
    console.error('Erro ao salvar credenciais do Supabase:', err);
    throw err;
  }
}

/**
 * Remove credenciais salvas do Supabase retornando ao modo local
 */
export function clearSupabaseConfig(): void {
  try {
    localStorage.removeItem(SUPABASE_STORAGE_CREDENTIALS_KEY);
    cachedClient = null;
    currentClientKey = '';
    window.dispatchEvent(new CustomEvent('jb_supabase_config_updated'));
  } catch {
    // ignore
  }
}

/**
 * Testa a conexão com o Supabase e verifica se a tabela 'products' existe
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  count?: number;
  tablesFound?: boolean;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase não configurado. Forneça a URL do Projeto e a Anon Key.',
    };
  }

  try {
    // Tenta uma consulta simples na tabela products
    const { data, error, count } = await client
      .from('products')
      .select('id', { count: 'exact', head: false })
      .limit(5);

    if (error) {
      if (error.code === '42P01') {
        // Tabela não existe ainda
        return {
          success: false,
          tablesFound: false,
          message: 'Conectado com sucesso ao Supabase, mas a tabela "products" ainda não foi criada. Copie o script SQL abaixo, abra o "SQL Editor" no Supabase e clique em "Run".',
        };
      }
      if (error.code === '42501' || error.message?.toLowerCase().includes('permission denied')) {
        return {
          success: false,
          tablesFound: false,
          message: 'Permissão negada (42501): O PostgreSQL no Supabase requer que você execute o Script SQL com as permissões de acesso (GRANT & RLS). Copie o Script SQL abaixo, cole no "SQL Editor" do Supabase e clique em "Run".',
        };
      }
      return {
        success: false,
        message: `Falha na consulta ao Supabase: ${error.message} (Código: ${error.code})`,
      };
    }

    const totalCount = count !== null && count !== undefined ? count : (data?.length || 0);

    return {
      success: true,
      tablesFound: true,
      count: totalCount,
      message: `Conexão bem-sucedida! Tabela "products" ativa com ${totalCount} peça(s) cadastradas.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao conectar com o Supabase: ${err.message || 'Verifique sua conexão ou URL.'}`,
    };
  }
}
