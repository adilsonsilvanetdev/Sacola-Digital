import { Product } from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';

export const PRODUCTS_STORAGE_KEY = 'jb_products_catalog';
export const PRODUCTS_STORAGE_VERSION_KEY = 'jb_products_version';
export const DELETED_PRODUCTS_STORAGE_KEY = 'jb_deleted_product_ids';
export const CURRENT_PRODUCTS_VERSION = 'v3_pmg_cm_promos';

/**
 * Obtém a lista de IDs de produtos explicitamente excluídos pelo usuário.
 * Impede que produtos excluídos voltem ao atualizar a página.
 */
export function getDeletedProductIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.map((id) => String(id).trim()));
    }
  } catch (err) {
    console.error('Erro ao ler IDs excluídos:', err);
  }
  return new Set();
}

/**
 * Registra um ID como permanentemente excluído no localStorage.
 */
export function addDeletedProductId(productId: string): void {
  try {
    const set = getDeletedProductIds();
    set.add(String(productId).trim());
    localStorage.setItem(DELETED_PRODUCTS_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.error('Erro ao salvar ID excluído:', err);
  }
}

/**
 * Desduplica uma lista de produtos por ID garantindo unicidade absoluta.
 */
function deduplicateProducts(list: Product[], deletedIds: Set<string>): Product[] {
  const seen = new Set<string>();
  const result: Product[] = [];
  for (const item of list) {
    if (!item || !item.id) continue;
    const cleanId = String(item.id).trim();
    if (deletedIds.has(cleanId)) continue;
    if (seen.has(cleanId)) continue;
    seen.add(cleanId);
    result.push(item);
  }
  return result;
}

/**
 * Carrega a lista atualizada de produtos do localStorage.
 * Garante que produtos excluídos NÃO voltem e que não haja IDs duplicados.
 */
export function getStoredProducts(): Product[] {
  try {
    const deletedIds = getDeletedProductIds();
    const version = localStorage.getItem(PRODUCTS_STORAGE_VERSION_KEY);
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);

    if (!raw || version !== CURRENT_PRODUCTS_VERSION) {
      // Migração suave: preserva produtos customizados salvos pelo usuário
      let customProducts: Product[] = [];
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            customProducts = parsed.filter((p: Product) => p && p.isCustom);
          }
        } catch {
          // ignore
        }
      }
      const initialCombined = [...SAMPLE_PRODUCTS, ...customProducts];
      const initialList = deduplicateProducts(initialCombined, deletedIds);
      saveStoredProducts(initialList);
      localStorage.setItem(PRODUCTS_STORAGE_VERSION_KEY, CURRENT_PRODUCTS_VERSION);
      return initialList;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cleanList = deduplicateProducts(parsed, deletedIds);
      return cleanList;
    }

    return deduplicateProducts(SAMPLE_PRODUCTS, deletedIds);
  } catch (err) {
    console.error('Erro ao ler produtos do localStorage:', err);
    return SAMPLE_PRODUCTS;
  }
}

/**
 * Salva a lista de produtos no localStorage e emite evento customizado.
 */
export function saveStoredProducts(products: Product[]): void {
  try {
    const deletedIds = getDeletedProductIds();
    const clean = deduplicateProducts(products, deletedIds);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(clean));
    localStorage.setItem(PRODUCTS_STORAGE_VERSION_KEY, CURRENT_PRODUCTS_VERSION);
    window.dispatchEvent(new CustomEvent('jb_products_updated', { detail: clean }));
  } catch (err) {
    console.error('Erro ao salvar produtos no localStorage:', err);
  }
}

/**
 * Atualiza um produto específico (substituindo fotos, valores, descrições, tamanhos, medidas CM, etc.).
 */
export function updateStoredProduct(updatedProduct: Product): Product[] {
  const current = getStoredProducts();
  const exists = current.some((p) => p.id === updatedProduct.id);
  const nextList = exists
    ? current.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    : [updatedProduct, ...current];
  saveStoredProducts(nextList);
  return nextList;
}

/**
 * Adiciona um novo produto ao catálogo.
 */
export function addStoredProduct(newProduct: Product): Product[] {
  // Se o ID estava na lista de excluídos, remove-o de lá
  try {
    const deleted = getDeletedProductIds();
    if (deleted.has(newProduct.id)) {
      deleted.delete(newProduct.id);
      localStorage.setItem(DELETED_PRODUCTS_STORAGE_KEY, JSON.stringify(Array.from(deleted)));
    }
  } catch {
    // ignore
  }

  const current = getStoredProducts();
  const filtered = current.filter((p) => p.id !== newProduct.id);
  const nextList = [newProduct, ...filtered];
  saveStoredProducts(nextList);
  return nextList;
}

/**
 * Remove com precisão cirúrgica APENAS o produto selecionado do catálogo.
 * O ID é registrado permanentemente para não retornar ao atualizar a página.
 */
export function deleteStoredProduct(productId: string): Product[] {
  if (!productId) return getStoredProducts();
  const cleanId = String(productId).trim();

  // 1. Marca permanentemente o ID nos excluídos
  addDeletedProductId(cleanId);

  // 2. Filtra estritamente APENAS o produto correspondente
  const current = getStoredProducts();
  const nextList = current.filter((p) => String(p.id).trim() !== cleanId);

  // 3. Salva a nova lista sem a peça excluída
  saveStoredProducts(nextList);
  return nextList;
}

/**
 * Restaura o catálogo para os produtos originais de fábrica.
 */
export function resetStoredProducts(): Product[] {
  try {
    localStorage.removeItem(DELETED_PRODUCTS_STORAGE_KEY);
  } catch {
    // ignore
  }
  saveStoredProducts(SAMPLE_PRODUCTS);
  return SAMPLE_PRODUCTS;
}

/**
 * Comprime e converte arquivo de imagem (do computador ou câmera/galeria do celular)
 * para DataURL JPEG de alta resolução otimizado (evita estourar limite do localStorage).
 */
export function compressImageFile(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Fundo suave branco para transparências PNG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
