import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, Link as LinkIcon, Sparkles, Check, 
  Trash2, AlertCircle, RefreshCw, Image as ImageIcon, Flame, Ruler
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

const CLOTHING_SIZES = ['P', 'M', 'G1', 'G2', 'G3'];
const AVAILABLE_CATEGORIES = [
  'Bolsas',
  'Carteiras',
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

  const isCategoryBagOrWallet = (cat: string) =>
    cat.toLowerCase().includes('bolsa') || cat.toLowerCase().includes('carteira');

  const initialIsCm = Boolean(
    product?.dimensionsCm ||
    (product?.category && isCategoryBagOrWallet(product.category)) ||
    (product?.sizes && product.sizes.includes('CM'))
  );

  // Form states
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || 'Bolsas');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState<number | string>(product?.price ?? 0);
  const [originalPrice, setOriginalPrice] = useState<number | string>(product?.originalPrice ?? '');
  const [isPromotion, setIsPromotion] = useState<boolean>(product?.isPromotion || false);
  const [promotionTag, setPromotionTag] = useState<string>(product?.promotionTag || 'Oferta Especial');

  const [description, setDescription] = useState(product?.description || '');
  const [fabric, setFabric] = useState(product?.fabric || '');
  const [fitTip, setFitTip] = useState(product?.fitTip || '');
  const [color, setColor] = useState(product?.color || '');
  const [colorHex, setColorHex] = useState(product?.colorHex || '#181316');
  const [image, setImage] = useState(product?.image || '');
  const [secondaryImage, setSecondaryImage] = useState(product?.secondaryImage || '');

  // Sizing & Measurements
  const [measurementType, setMeasurementType] = useState<'clothing' | 'cm'>(initialIsCm ? 'cm' : 'clothing');
  const [sizes, setSizes] = useState<string[]>(
    product?.sizes && product.sizes.some((s) => CLOTHING_SIZES.includes(s))
      ? product.sizes.filter((s) => CLOTHING_SIZES.includes(s))
      : ['P', 'M', 'G1', 'G2', 'G3']
  );
  const [dimensionsCm, setDimensionsCm] = useState<string>(product?.dimensionsCm || '');

  const [inStock, setInStock] = useState<boolean>(product?.inStock !== false);

  // UI helpers
  const [activeTab, setActiveTab] = useState<'photo' | 'info' | 'price'>('photo');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza o estado do formulário sempre que o produto selecionado mudar
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'Bolsas');
      setCustomCategory('');
      setPrice(product.price ?? 0);
      setOriginalPrice(product.originalPrice ?? '');
      setIsPromotion(Boolean(product.isPromotion));
      setPromotionTag(product.promotionTag || 'Oferta Especial');
      setDescription(product.description || '');
      setFabric(product.fabric || '');
      setFitTip(product.fitTip || '');
      setColor(product.color || '');
      setColorHex(product.colorHex || '#181316');
      setImage(product.image || '');
      setSecondaryImage(product.secondaryImage || '');
      const isBagWallet = isCategoryBagOrWallet(product.category || '');
      const isCm = Boolean(product.dimensionsCm || isBagWallet || product.sizes?.includes('CM'));
      setMeasurementType(isCm ? 'cm' : 'clothing');
      setSizes(
        product.sizes && product.sizes.some((s) => CLOTHING_SIZES.includes(s))
          ? product.sizes.filter((s) => CLOTHING_SIZES.includes(s))
          : ['P', 'M', 'G1', 'G2', 'G3']
      );
      setDimensionsCm(product.dimensionsCm || '');
      setInStock(product.inStock !== false);
    } else {
      setName('');
      setCategory('Bolsas');
      setCustomCategory('');
      setPrice('');
      setOriginalPrice('');
      setIsPromotion(false);
      setPromotionTag('Oferta Especial');
      setDescription('');
      setFabric('');
      setFitTip('');
      setColor('');
      setColorHex('#181316');
      setImage('');
      setSecondaryImage('');
      setMeasurementType('cm');
      setSizes(['P', 'M', 'G1', 'G2', 'G3']);
      setDimensionsCm('38cm x 28cm x 14cm');
      setInStock(true);
    }
  }, [product, isOpen]);

  // Check if original demo product exists for resetting
  const originalDemo = SAMPLE_PRODUCTS.find((p) => p.id === product?.id);

  // Handle category change: auto-select measurement type if switching to bag or wallet
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    if (isCategoryBagOrWallet(newCat)) {
      setMeasurementType('cm');
      if (!dimensionsCm) {
        setDimensionsCm('38cm x 28cm x 14cm');
      }
    } else {
      setMeasurementType('clothing');
    }
  };

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

  // Toggle size chips for clothing
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
      setOriginalPrice(originalDemo.originalPrice || '');
      setIsPromotion(originalDemo.isPromotion || false);
      setPromotionTag(originalDemo.promotionTag || 'Oferta Especial');
      setDescription(originalDemo.description);
      setFabric(originalDemo.fabric);
      setFitTip(originalDemo.fitTip);
      setColor(originalDemo.color);
      setColorHex(originalDemo.colorHex);
      setImage(originalDemo.image);
      setSecondaryImage(originalDemo.secondaryImage || '');
      setSizes(originalDemo.sizes);
      setDimensionsCm(originalDemo.dimensionsCm || '');
      setMeasurementType(originalDemo.dimensionsCm || isCategoryBagOrWallet(originalDemo.category) ? 'cm' : 'clothing');
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
    const numericOriginalPrice = originalPrice ? (typeof originalPrice === 'number' ? originalPrice : parseFloat(originalPrice.toString().replace(',', '.')) || undefined) : undefined;
    const finalCategory = category === 'Outra' ? (customCategory.trim() || 'Bolsas') : category;

    // Medidas: Roupas (P, M, G1, G2, G3) ou Bolsas/Carteiras (CM)
    let finalSizes: string[] = ['M'];
    let finalDimensionsCm: string | undefined = undefined;

    if (measurementType === 'cm') {
      finalSizes = ['CM'];
      finalDimensionsCm = dimensionsCm.trim() || 'Medida sob consulta';
    } else {
      finalSizes = sizes.length > 0 ? sizes : ['P', 'M', 'G1', 'G2', 'G3'];
      finalDimensionsCm = undefined;
    }

    const updatedProduct: Product = {
      id: product?.id || `prod-custom-${Date.now()}`,
      name: name.trim(),
      category: finalCategory,
      price: Math.max(0, numericPrice),
      originalPrice: numericOriginalPrice,
      isPromotion: Boolean(isPromotion),
      promotionTag: isPromotion ? (promotionTag.trim() || 'Oferta Especial') : undefined,
      description: description.trim() || 'Peça exclusiva com acabamento impecável.',
      fabric: fabric.trim() || 'Acabamento Premium',
      fitTip: fitTip.trim() || 'Veste conforme as medidas.',
      sizes: finalSizes,
      dimensionsCm: finalDimensionsCm,
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
                {isNew ? 'Cadastrar Nova Peça / Bolsa' : 'Substituir Foto, Medidas & Valores'}
              </h2>
              <p className="text-xs text-[#EAD5DC]">
                {isNew ? 'Preencha os dados para adicionar ao catálogo' : `Editando: ${product?.name}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'photo'
                ? 'border-[#B84E67] text-[#B84E67] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>1. Foto do Produto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('price')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'price'
                ? 'border-[#B84E67] text-[#B84E67] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-4 h-4 text-[#E11D48]" />
            <span>2. Valores & Promoções</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'info'
                ? 'border-[#B84E67] text-[#B84E67] bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>3. Medidas & Detalhes</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: FOTO DO PRODUTO */}
          {activeTab === 'photo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Photo Preview Box */}
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-sm aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden border-2 border-dashed border-stone-300 relative flex items-center justify-center shadow-inner group">
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt="Prévia do produto"
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-stone-900 text-xs font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-stone-50 cursor-pointer"
                          >
                            Trocar esta foto
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 text-stone-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <span className="text-xs font-medium block">Nenhuma foto selecionada</span>
                        <span className="text-[11px] block mt-1">Carregue do seu aparelho ou cole uma URL</span>
                      </div>
                    )}
                  </div>
                  {image && (
                    <span className="text-[11px] text-green-700 font-medium mt-2 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Foto pronta para exibição
                    </span>
                  )}
                </div>

                {/* Upload & Link Options */}
                <div className="space-y-5">
                  <div className="bg-[#FAF6F7] p-4 rounded-xl border border-[#F2DEE4]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#B84E67] mb-2 flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      Opção A: Carregar Foto do Computador ou Celular
                    </h3>
                    <p className="text-xs text-stone-600 mb-3">
                      Selecione uma foto da sua galeria ou câmera. O sistema otimiza e comprime a foto automaticamente.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="product-photo-upload"
                    />

                    <label
                      htmlFor="product-photo-upload"
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        isUploading
                          ? 'bg-stone-200 text-stone-400 cursor-wait'
                          : 'bg-[#B84E67] hover:bg-[#9E3E54] text-white shadow-xs'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? 'Processando imagem...' : 'Escolher Foto do Aparelho'}</span>
                    </label>

                    {uploadError && (
                      <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
                      </p>
                    )}
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                      <LinkIcon className="w-4 h-4" />
                      Opção B: Ou Cole um Link / URL de Imagem
                    </h3>
                    <input
                      type="url"
                      placeholder="https://exemplo.com/foto-da-bolsa.jpg"
                      value={image.startsWith('data:') ? '' : image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VALORES & PROMOÇÕES */}
          {activeTab === 'price' && (
            <div className="space-y-6 max-w-xl mx-auto py-2">
              {/* Valor de Venda Padrão */}
              <div className="bg-[#FFF8FA] p-6 rounded-2xl border border-[#F8E2E8] text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B84E67] block">
                  Valor Atual de Venda (R$)
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
                <p className="text-xs text-[#7A6B73] mt-2">
                  Valor exibido na vitrine da loja, na mala digital de 48h e nas mensagens do WhatsApp.
                </p>
              </div>

              {/* Seção Promoções & Produtos Especiais */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF1F2] to-[#FFF8FA] border-2 border-[#FDA4AF] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#E11D48] text-white rounded-lg shadow-xs">
                      <Flame className="w-5 h-5 fill-amber-300 text-amber-300" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#9F1239] block">
                        Destacar na Seção "Promoções"
                      </span>
                      <span className="text-xs text-[#881337]">
                        Exibe a peça na área especial de promoções com cor e tags em destaque.
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPromotion}
                      onChange={(e) => setIsPromotion(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E11D48]"></div>
                  </label>
                </div>

                {isPromotion && (
                  <div className="pt-3 border-t border-[#FECDD3] grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-bold text-[#881337] mb-1">
                        Preço Original de Tabela / De (R$):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 589.00"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#FDA4AF] rounded-xl font-semibold text-stone-800 focus:outline-none focus:border-[#E11D48]"
                      />
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        Aparecerá riscado como "De R$ ..." para destacar o desconto.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#881337] mb-1">
                        Texto da Tag de Destaque:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Oferta Especial, Promoção da Semana, -25% OFF"
                        value={promotionTag}
                        onChange={(e) => setPromotionTag(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#FDA4AF] rounded-xl font-semibold text-stone-800 focus:outline-none focus:border-[#E11D48]"
                      />
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        Exibido no badge vermelho sobre a foto.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* In stock toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-sm font-semibold text-stone-900 block">Disponibilidade da Peça</span>
                  <span className="text-xs text-stone-500">Permitir que clientes adicionem na mala e comprem</span>
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

          {/* TAB 3: MEDIDAS & DETALHES */}
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
                    onChange={(e) => handleCategoryChange(e.target.value)}
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
                    Cor Predominante
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-10 h-10 p-0.5 rounded-lg border border-stone-300 cursor-pointer"
                      title="Escolher tom da cor"
                    />
                    <input
                      type="text"
                      placeholder="Ex: Caramelo Cognac, Preto Noir, Areia"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 text-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                    />
                  </div>
                </div>
              </div>

              {/* CONFIGURAÇÃO DE MEDIDAS (ROUPAS P, M, G1, G2, G3 vs BOLSAS/CARTEIRAS CM) */}
              <div className="p-4 rounded-xl bg-[#FAF6F7] border border-[#F0D5DD] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#181316] uppercase tracking-wider flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-[#B84E67]" />
                    Sistema de Medidas do Produto:
                  </span>

                  {/* Toggle entre Roupas e Bolsas/Carteiras */}
                  <div className="inline-flex rounded-lg border border-stone-300 p-0.5 bg-white">
                    <button
                      type="button"
                      onClick={() => setMeasurementType('clothing')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        measurementType === 'clothing'
                          ? 'bg-[#181316] text-[#F5BAC7]'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Roupas (P, M, G1, G2, G3)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMeasurementType('cm');
                        if (!dimensionsCm) setDimensionsCm('38cm x 28cm x 14cm');
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        measurementType === 'cm'
                          ? 'bg-[#B84E67] text-white'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Bolsas & Carteiras (CM)
                    </button>
                  </div>
                </div>

                {measurementType === 'cm' ? (
                  /* Campo de Medida em CM para Bolsas e Carteiras */
                  <div className="pt-2 animate-fadeIn">
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Medida em CM (Onde será incluída a medida da bolsa ou carteira): *
                    </label>
                    <input
                      type="text"
                      required={measurementType === 'cm'}
                      placeholder="Ex: 38cm x 28cm x 14cm (Largura x Altura x Profundidade)"
                      value={dimensionsCm}
                      onChange={(e) => setDimensionsCm(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 bg-white border border-[#D87F95] rounded-lg font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#B84E67]"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Esta medida será apresentada como <strong>CM</strong> em destaque no card do produto e no modal de compra.
                    </p>
                  </div>
                ) : (
                  /* Tamanhos para Roupas: P, M, G1, G2, G3 */
                  <div className="pt-2 animate-fadeIn">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Tamanhos Disponíveis para a Peça (P, M, G1, G2, G3):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CLOTHING_SIZES.map((sz) => {
                        const isSelected = sizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => toggleSize(sz)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#181316] text-[#F5BAC7] border-[#181316] shadow-sm scale-105'
                                : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1.5 block">
                      Clique para ativar ou desativar os tamanhos em estoque.
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descrição Completa da Peça
                </label>
                <textarea
                  rows={3}
                  placeholder="Descreva o caimento, fechamento, divisórias da bolsa ou proposta de look..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                />
              </div>

              {/* Fabric & Fit tip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Composição / Material / Tecido
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 100% Couro Bovino Legítimo, Linho Puro"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dica de Consultoria / Styling
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Espaçosa e elegante para transitar do dia para a noite"
                    value={fitTip}
                    onChange={(e) => setFitTip(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#B84E67]"
                  />
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
              {onDeleteProduct && !isNew && product && (
                <button
                  type="button"
                  onClick={() => {
                    const targetName = product.name || name || 'esta peça';
                    if (window.confirm(`Tem certeza de que deseja excluir permanentemente "${targetName}" do catálogo?\n\nApenas esta peça escolhida será removida e a página será atualizada.`)) {
                      onDeleteProduct(product.id);
                      onClose();
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1.5 cursor-pointer underline mt-1.5 py-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir apenas este produto ({product.name}) do catálogo</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 bg-[#B84E67] hover:bg-[#9E3E54] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Salvo com Sucesso!</span>
                  </>
                ) : (
                  <span>Salvar Alterações no Catálogo</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
