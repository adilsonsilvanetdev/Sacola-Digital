import React, { useState, useRef } from 'react';
import { 
  X, Upload, Link as LinkIcon, DollarSign, FileText, Sparkles, Check, 
  Trash2, AlertCircle, RefreshCw, Image as ImageIcon, Tag
} from 'lucide-react';
import { Product } from '../types';
import { compressImageFile } from '../utils/productStorage';
import { SAMPLE_PRODUCTS } from '../data/products';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (updatedProduct: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

const AVAILABLE_SIZES = ['Único', 'PP', 'P', 'M', 'G', 'GG', '36', '38', '40', '42', '44'];
const AVAILABLE_CATEGORIES = [
  'Bolsas',
  'Vestidos',
  'Blazers & Alfaiataria',
  'Camisas & Blusas',
  'Calças & Shorts',
  'Conjuntos & Tricot',
  'Casacos',
];

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveProduct,
  onDeleteProduct,
}) => {
  if (!isOpen) return null;

  const isNew = !product || !product.id;

  // Form states
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || 'Bolsas');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState<number | string>(product?.price || 0);
  const [description, setDescription] = useState(product?.description || '');
  const [fabric, setFabric] = useState(product?.fabric || '');
  const [fitTip, setFitTip] = useState(product?.fitTip || '');
  const [color, setColor] = useState(product?.color || '');
  const [colorHex, setColorHex] = useState(product?.colorHex || '#181316');
  const [image, setImage] = useState(product?.image || '');
  const [secondaryImage, setSecondaryImage] = useState(product?.secondaryImage || '');
  const [sizes, setSizes] = useState<string[]>(product?.sizes || ['Único']);
  const [inStock, setInStock] = useState<boolean>(product?.inStock !== false);

  // UI helpers
  const [activeTab, setActiveTab] = useState<'photo' | 'info' | 'price'>('photo');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if original demo product exists for resetting
  const originalDemo = SAMPLE_PRODUCTS.find((p) => p.id === product?.id);

  // Handle image upload from PC or phone
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecione um arquivo de imagem válido (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      // Compresses to max 1200px JPEG to stay lightweight in browser storage
      const dataUrl = await compressImageFile(file, 1200, 1200, 0.86);
      setImage(dataUrl);
    } catch (err) {
      console.error(err);
      setUploadError('Erro ao processar imagem. Tente uma imagem diferente ou cole o link.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Toggle size chips
  const toggleSize = (sz: string) => {
    if (sizes.includes(sz)) {
      if (sizes.length === 1) return; // Keep at least one
      setSizes(sizes.filter((s) => s !== sz));
    } else {
      setSizes([...sizes, sz]);
    }
  };

  // Restore original factory values for this specific piece
  const handleRestoreOriginal = () => {
    if (!originalDemo) return;
    if (window.confirm(`Deseja restaurar foto, descrição e valores originais de "${originalDemo.name}"?`)) {
      setName(originalDemo.name);
      setCategory(originalDemo.category);
      setPrice(originalDemo.price);
      setDescription(originalDemo.description);
      setFabric(originalDemo.fabric);
      setFitTip(originalDemo.fitTip);
      setColor(originalDemo.color);
      setColorHex(originalDemo.colorHex);
      setImage(originalDemo.image);
      setSecondaryImage(originalDemo.secondaryImage || '');
      setSizes(originalDemo.sizes);
      setInStock(originalDemo.inStock);
    }
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor, informe o nome do produto.');
      return;
    }
    if (!image.trim()) {
      alert('Por favor, adicione uma foto para o produto (via upload ou link).');
      return;
    }

    const numericPrice = typeof price === 'number' ? price : parseFloat(price.toString().replace(',', '.')) || 0;
    const finalCategory = category === 'Outra' ? (customCategory.trim() || 'Bolsas') : category;

    const updatedProduct: Product = {
      id: product?.id || `prod-custom-${Date.now()}`,
      name: name.trim(),
      category: finalCategory,
      price: Math.max(0, numericPrice),
      description: description.trim() || 'Peça exclusiva com acabamento impecável.',
      fabric: fabric.trim() || 'Acabamento Premium',
      fitTip: fitTip.trim() || 'Veste conforme as medidas.',
      sizes: sizes.length > 0 ? (sizes as any) : ['Único'],
      color: color.trim() || 'Padrão',
      colorHex: colorHex.trim() || '#181316',
      image: image.trim(),
      secondaryImage: secondaryImage.trim() || undefined,
      styleKeywords: product?.styleKeywords || ['Sofisticada', 'Casual Elegante'],
      recommendedFor: product?.recommendedFor || ['Trabalho & Reuniões', 'Dia a Dia Prático & Chic'],
      inStock: inStock,
      isCustom: true,
    };

    onSaveProduct(updatedProduct);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-[#F2DEE4] flex flex-col max-h-[92vh] animate-fadeIn">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-[#141113] text-white flex items-center justify-between border-b border-[#2E242B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5BAC7]/15 border border-[#F5BAC7]/30 flex items-center justify-center text-[#F5BAC7]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-sans tracking-wide">
                {isNew ? 'Cadastrar Nova Peça / Bolsa' : 'Substituir Foto, Descrição & Valor'}
              </h2>
              <p className="text-xs text-[#EAD5DC]">
                {isNew ? 'Preencha os dados para adicionar ao catálogo' : `Editando: ${product?.name}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-stone-200 bg-[#FAF9F5] px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'photo'
                ? 'border-[#B84E67] text-[#B84E67]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>1. Foto da Peça</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('price')}
            className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'price'
                ? 'border-[#B84E67] text-[#B84E67]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>2. Valor & Preço</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-[#B84E67] text-[#B84E67]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Descrição & Detalhes</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: FOTO DA PEÇA */}
          {activeTab === 'photo' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Image Preview Card */}
              <div className="md:col-span-5 flex flex-col items-center">
                <span className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wider self-start">
                  Pré-visualização da Foto:
                </span>
                <div className="w-full aspect-[3/4] bg-[#FAF3F5] rounded-xl overflow-hidden border-2 border-dashed border-[#F2DEE4] relative flex items-center justify-center group shadow-inner">
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-cover object-center"
                        onError={() => setUploadError('A imagem não pôde ser carregada. Verifique o link ou envie outro arquivo.')}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white text-[#181316] text-xs font-bold rounded-lg shadow-md hover:bg-[#FDF2F4] hover:text-[#B84E67] cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload className="w-4 h-4" />
                          Trocar Foto
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center p-6 text-stone-400">
                      <ImageIcon className="w-12 h-12 stroke-[1.2] mb-2 text-[#D87F95]" />
                      <span className="text-sm font-medium text-stone-600">Nenhuma foto selecionada</span>
                      <span className="text-xs text-stone-400 mt-1">Envie do seu aparelho ou cole uma URL</span>
                    </div>
                  )}
                </div>

                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer self-start"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Limpar foto atual
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-5">
                <div className="bg-[#FFF8FA] p-4 sm:p-5 rounded-xl border border-[#F8E2E8]">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#B84E67]" />
                    Opção A: Enviar Foto do Celular ou Computador
                  </h3>
                  <p className="text-xs text-[#7A6B73] mt-1">
                    Escolha uma foto da sua galeria ou arquivos. O sistema otimiza a imagem automaticamente para carregar super rápido.
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="product-photo-upload"
                  />

                  <div className="mt-3 flex items-center gap-3">
                    <label
                      htmlFor="product-photo-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 bg-[#B84E67] hover:bg-[#A33D56] text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer ${
                        isUploading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      {isUploading ? 'Processando Foto...' : 'Selecionar Foto do Aparelho'}
                    </label>
                  </div>

                  {uploadError && (
                    <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                <div className="bg-[#FAF9F5] p-4 sm:p-5 rounded-xl border border-stone-200">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-stone-700" />
                    Opção B: Colar Link / URL da Foto
                  </h3>
                  <p className="text-xs text-[#7A6B73] mt-1">
                    Se a foto já estiver na internet (Instagram, catálogo externo, Unsplash ou Google Imagens), cole o endereço direto da imagem:
                  </p>

                  <div className="mt-3">
                    <input
                      type="url"
                      placeholder="https://exemplo.com/fotos/minha-bolsa.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67] text-stone-800"
                    />
                  </div>
                </div>

                {/* Secondary Image (optional) */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Foto Secundária (Verso / Detalhe interno) - Opcional:
                  </label>
                  <input
                    type="url"
                    placeholder="URL opcional para segunda foto"
                    value={secondaryImage}
                    onChange={(e) => setSecondaryImage(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67] text-stone-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VALOR & PREÇO */}
          {activeTab === 'price' && (
            <div className="space-y-6 max-w-xl mx-auto py-4">
              <div className="bg-[#FFF8FA] p-6 rounded-2xl border border-[#F8E2E8] text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B84E67]">
                  Definição de Valor de Venda
                </span>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-stone-700">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="text-3xl sm:text-4xl font-extrabold text-[#181316] w-48 text-center bg-white border-2 border-[#D87F95] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#B84E67]"
                  />
                </div>

                <p className="text-xs text-[#7A6B73] mt-3">
                  Este valor será exibido no card do produto na loja, no cálculo da mala de 48h e na mensagem oficial enviada para a cliente no WhatsApp.
                </p>
              </div>

              {/* In stock toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-sm font-semibold text-stone-900 block">Disponibilidade da Peça</span>
                  <span className="text-xs text-stone-500">Permitir que clientes e vendedora adicionem esta peça na mala de provador</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B84E67]"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: DESCRIÇÃO & DETALHES */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome da Peça ou Bolsa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bolsa Tiracolo Matelassê Noir com Corrente"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                />
              </div>

              {/* Category & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                  >
                    {AVAILABLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Outra">+ Outra categoria personalizada</option>
                  </select>

                  {category === 'Outra' && (
                    <input
                      type="text"
                      placeholder="Nome da nova categoria"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="mt-2 w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cor Principal & Tom
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-10 h-10 rounded border border-stone-300 cursor-pointer p-0.5"
                      title="Escolher cor visual"
                    />
                    <input
                      type="text"
                      placeholder="Ex: Caramelo Cognac"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 text-sm px-3 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                    />
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descrição da Peça (Substituição de Texto) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Descreva a peça: acabamento, textura, detalhes, ferragens, bolsos e benefícios..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm p-3 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                />
              </div>

              {/* Material / Fabric & Fit Tip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Composição / Tecido / Material
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 100% Couro Bovino Legítimo"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dica de Caimento / Tamanho
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Espaçosa e com ótimo caimento"
                    value={fitTip}
                    onChange={(e) => setFitTip(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                  />
                </div>
              </div>

              {/* Available Sizes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Tamanhos Disponíveis (Clique para ativar/desativar):
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((sz) => {
                    const isSelected = sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#181316] text-[#F5BAC7] border-[#181316] shadow-sm'
                            : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              {originalDemo && (
                <button
                  type="button"
                  onClick={handleRestoreOriginal}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 cursor-pointer underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restaurar dados originais de fábrica
                </button>
              )}
              {onDeleteProduct && !isNew && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Tem certeza que deseja excluir "${name}" do catálogo?`)) {
                      onDeleteProduct(product!.id);
                      onClose();
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer mt-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir produto do catálogo
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs sm:text-sm font-medium cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#B84E67] hover:bg-[#A33D56] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Salvo com Sucesso!
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
