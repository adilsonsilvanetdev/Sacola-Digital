import { Product } from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';

export const PRODUCTS_STORAGE_KEY = 'jb_products_catalog';
export const PRODUCTS_STORAGE_VERSION_KEY = 'jb_products_version';
export const CURRENT_PRODUCTS_VERSION = 'v3_pmg_cm_promos';

/**
 * Carrega a lista atualizada de produtos do localStorage.
 * Garante que a migração para tamanhos P, M, G1, G2, G3, CM e Promoções ocorra suavemente.
 */
export function getStoredProducts(): Product[] {
  try {
    const version = localStorage.getItem(PRODUCTS_STORAGE_VERSION_KEY);
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);

    if (!raw || version !== CURRENT_PRODUCTS_VERSION) {
      // Migração suave: se houver produtos customizados salvos pelo usuário, preserva-os
      let customProducts: Product[] = [];
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            customProducts = parsed.filter((p: Product) => p.isCustom);
          }
        } catch {
          // ignore
        }
      }
      const initialList = [...SAMPLE_PRODUCTS, ...customProducts];
      saveStoredProducts(initialList);
      localStorage.setItem(PRODUCTS_STORAGE_VERSION_KEY, CURRENT_PRODUCTS_VERSION);
      return initialList;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_PRODUCTS;
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
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem(PRODUCTS_STORAGE_VERSION_KEY, CURRENT_PRODUCTS_VERSION);
    window.dispatchEvent(new CustomEvent('jb_products_updated', { detail: products }));
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
  const current = getStoredProducts();
  const nextList = [newProduct, ...current];
  saveStoredProducts(nextList);
  return nextList;
}

/**
 * Remove um produto do catálogo.
 */
export function deleteStoredProduct(productId: string): Product[] {
  const current = getStoredProducts();
  const nextList = current.filter((p) => p.id !== productId);
  saveStoredProducts(nextList);
  return nextList;
}

/**
 * Restaura o catálogo para os produtos originais de fábrica.
 */
export function resetStoredProducts(): Product[] {
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
