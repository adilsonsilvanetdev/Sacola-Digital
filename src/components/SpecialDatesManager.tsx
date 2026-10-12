import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Check, 
  Eye, 
  RotateCcw, 
  Save, 
  SlidersHorizontal, 
  Tag, 
  Gift, 
  Percent, 
  ArrowRight, 
  MessageCircle, 
  CheckCircle2, 
  Power, 
  HelpCircle,
  Pencil,
  Copy,
  Flame,
  Star,
  Heart
} from 'lucide-react';
import { 
  SpecialDatePromotion, 
  SpecialDateTheme, 
  SpecialDateAnimation 
} from '../types';
import { 
  DEFAULT_SPECIAL_DATE_SUGGESTIONS, 
  saveStoredSpecialPromotion 
} from '../utils/specialDatesStorage';
import { PromotionalSpecialModal } from './PromotionalSpecialModal';
import { STORE_WHATSAPP_DISPLAY } from '../utils/whatsappHelper';

interface SpecialDatesManagerProps {
  currentCampaign: SpecialDatePromotion;
  onSaveCampaign: (campaign: SpecialDatePromotion) => void;
  onTestLiveModal: () => void;
}

const THEME_OPTIONS: { id: SpecialDateTheme; label: string; desc: string; previewColor: string }[] = [
  { id: 'natal', label: '🎄 Natal Rubi & Esmeralda', desc: 'Fundo verde e rubi profundo com detalhes em ouro nobre', previewColor: '#801323' },
  { id: 'reveillon', label: '✨ Réveillon & Champanhe', desc: 'Fundo noturno com dourado luminoso e estrelas', previewColor: '#D4AF37' },
  { id: 'mulheres', label: '🌸 Mulheres Rosé & Vinho', desc: 'Tons de quartzo rosa, fúcsia refinado e bordô', previewColor: '#F5BAC7' },
  { id: 'maes', label: '💝 Mães Blush & Carinho', desc: 'Rosé delicado e champanhe afetuoso', previewColor: '#E8B4B8' },
  { id: 'namorados', label: '❤️ Namorados Rubi Intenso', desc: 'Vermelho cereja e veludo apaixonante', previewColor: '#FF4D6D' },
  { id: 'pais', label: '👔 Pais Azul & Caramelo', desc: 'Azul marinho clássico com dourado fosco', previewColor: '#162547' },
  { id: 'blackfriday', label: '🖤 Black Friday Onyx & Ouro', desc: 'Preto luxuoso com amarelo ouro de alto impacto', previewColor: '#FFD700' },
  { id: 'aniversario', label: '🎁 Aniversário & Festa', desc: 'Framboesa com confetes dourados reluzentes', previewColor: '#F3A4C0' },
  { id: 'rose', label: '💎 Jô Bolsas Rosé Glamour', desc: 'A paleta assinatura da loja com blush e ônix', previewColor: '#F5BAC7' },
  { id: 'ouro', label: '👑 Ouro & Champanhe Nobre', desc: 'Dourado clássico e café sofisticado', previewColor: '#D4AF37' },
];

const ANIMATION_OPTIONS: { id: SpecialDateAnimation; label: string; desc: string }[] = [
  { id: 'sparkles', label: '✨ Estrelas & Flocos Cintilantes', desc: 'Partículas piscando suavemente com magia' },
  { id: 'shimmer', label: '💫 Brilho Refletivo (Shimmer)', desc: 'Faixa luminosa que corre pelo fundo' },
  { id: 'pulse', label: '💖 Pulso de Atenção Elegante', desc: 'Suave pulsação com aura reluzente' },
  { id: 'gentle', label: '✦ Flutuação Suave (Float)', desc: 'Movimento gracioso de flutuação' },
];

const QUICK_EMOJIS = ['🎄', '✨', '🌸', '💝', '❤️', '👔', '🖤', '🎁', '⚡', '🛍️', '💎', '🥂', '🌹', '👑', '🎉', '🔥'];

export const SpecialDatesManager: React.FC<SpecialDatesManagerProps> = ({
  currentCampaign,
  onSaveCampaign,
  onTestLiveModal,
}) => {
  // Form draft state
  const [formData, setFormData] = useState<SpecialDatePromotion>({ ...currentCampaign });
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(currentCampaign.id);

  // Sync if parent updates
  React.useEffect(() => {
    setFormData({ ...currentCampaign });
  }, [currentCampaign]);

  const handleApplyPreset = (preset: SpecialDatePromotion) => {
    setFormData({
      ...preset,
      isActive: true, // Auto ativa ao escolher sugestão
    });
    setActivePresetId(preset.id);
    setSaveSuccessMessage(`Sugestão "${preset.name}" carregada no formulário! Clique em "Salvar e Publicar na Loja" para aplicar.`);
    setTimeout(() => setSaveSuccessMessage(null), 4500);
  };

  const handleToggleActive = () => {
    const updated = { ...formData, isActive: !formData.isActive };
    setFormData(updated);
    onSaveCampaign(updated);
    setSaveSuccessMessage(
      updated.isActive 
        ? 'Janela Promocional ATIVADA com sucesso na loja!' 
        : 'Janela Promocional DESATIVADA da loja.'
    );
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCampaign(formData);
    setSaveSuccessMessage('Campanha e Janela Promocional salvas com sucesso! Já está no ar na loja virtual.');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Top Banner & Main Toggle */}
      <div className="bg-gradient-to-r from-[#1E1419] to-[#2B1B24] text-white p-6 sm:p-8 rounded-3xl border border-[#402937] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#F5BAC7]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#F5BAC7] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Marketing & Datas Comemorativas
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                formData.isActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-zinc-700/50 text-zinc-300 border border-zinc-600/40'
              }`}>
                {formData.isActive ? '● Ativa na Loja' : '○ Janela Desativada'}
              </span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-white">
              Janela Promocional Flutuante & Datas Especiais
            </h2>
            <p className="text-[#DACCD4] text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Destaque o <strong>Natal</strong>, <strong>Ano Novo</strong>, <strong>Dia das Mães</strong>, <strong>Dia das Mulheres</strong> ou qualquer data comemorativa assim que a cliente abrir a loja. Inclui efeitos em movimento, cupons e direcionamento direto para o seu WhatsApp!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleToggleActive}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                formData.isActive
                  ? 'bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-700/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-emerald-900/30'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{formData.isActive ? 'Desativar da Loja' : 'Ativar Janela na Loja'}</span>
            </button>

            <button
              type="button"
              onClick={onTestLiveModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer border border-white/20"
              title="Abrir a janela na tela exatamente como o cliente vê"
            >
              <Eye className="w-4 h-4 text-[#F5BAC7]" />
              <span>Testar como Cliente</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{saveSuccessMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEÇÃO 1: SUGESTÕES PRONTAS PARA CADASTRO RÁPIDO (1 CLIQUE)                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2DEE4] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F7EBEF] pb-4">
          <div>
            <span className="text-[11px] font-bold text-[#B84E67] uppercase tracking-wider block">
              Sugestões Pré-Cadastradas Prontas para Uso
            </span>
            <h3 className="font-editorial text-xl sm:text-2xl text-[#181316] font-medium">
              Escolha uma Data Especial com 1 Clique
            </h3>
            <p className="text-xs text-[#5A4D54]">
              Clique em qualquer uma das opções abaixo para preencher o banner com títulos, textos, cores e mensagens pré-configuradas pela Josy.
            </p>
          </div>
          <span className="text-[11px] font-medium bg-[#FAF6F7] text-[#B84E67] px-3 py-1 rounded-full border border-[#F2DEE4] shrink-0 self-start sm:self-auto">
            {DEFAULT_SPECIAL_DATE_SUGGESTIONS.length} datas prontas
          </span>
        </div>

        {/* Grid de Sugestões */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {DEFAULT_SPECIAL_DATE_SUGGESTIONS.map((preset) => {
            const isCurrent = formData.id === preset.id || activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 text-left ${
                  isCurrent
                    ? 'border-[#B84E67] bg-[#FAF2F5] shadow-xs ring-1 ring-[#B84E67]/30'
                    : 'border-[#F2DEE4] hover:border-[#D6A5B3] bg-white hover:bg-[#FAF8F9]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl">{preset.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#141113] text-[#F5BAC7]">
                      {preset.badge.split(' ')[0]}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-[#181316]">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-[#5A4D54] line-clamp-2 mt-1 leading-relaxed">
                    {preset.title}
                  </p>
                  {preset.benefitText && (
                    <div className="mt-2 text-[10px] text-[#B84E67] bg-white px-2 py-1 rounded-lg border border-[#F2DEE4] font-medium line-clamp-1">
                      🎁 {preset.benefitText}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F2DEE4]/60">
                  <span className="text-[10px] text-[#7A6B73]">
                    Cupom: <strong>{preset.couponCode || 'Sem cupom'}</strong>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#B84E67] text-white shadow-xs'
                        : 'bg-[#FAF2F5] hover:bg-[#F2DEE4] text-[#B84E67]'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Carregado</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Usar Esta Data</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO 2: FORMULÁRIO DE PERSONALIZAÇÃO E PRÉ-VISUALIZAÇÃO AO VIVO          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo: Formulário de Configuração (7 colunas) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2DEE4] shadow-xs space-y-6">
            
            <div className="border-b border-[#F7EBEF] pb-4">
              <span className="text-[11px] font-bold text-[#B84E67] uppercase tracking-wider block">
                Editor da Janela Promocional
              </span>
              <h3 className="font-editorial text-xl sm:text-2xl text-[#181316] font-medium">
                Personalizar Textos, Cores e Ofertas
              </h3>
              <p className="text-xs text-[#5A4D54]">
                Ajuste os detalhes como desejar. Todas as mudanças aparecem imediatamente na pré-visualização ao lado!
              </p>
            </div>

            {/* Linha 1: Nome da Campanha & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#181316] mb-1">
                  Nome da Data / Campanha
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Natal & Festas de Fim de Ano"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181316] mb-1">
                  Selo / Badge Superior
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Ex: ESPECIAL DE NATAL 🎄"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
                  required
                />
              </div>
            </div>

            {/* Linha 2: Ícone / Emoji em Movimento */}
            <div>
              <label className="block text-xs font-bold text-[#181316] mb-1">
                Ícone / Emoji em Movimento
              </label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                      formData.icon === emoji
                        ? 'bg-[#141113] text-white scale-110 shadow-xs ring-2 ring-[#B84E67]'
                        : 'bg-[#FAF6F7] hover:bg-[#F2DEE4] text-[#181316]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Ou digite o emoji desejado..."
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
              />
            </div>

            {/* Linha 3: Título de Destaque */}
            <div>
              <label className="block text-xs font-bold text-[#181316] mb-1">
                Título Principal da Janela
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Celebre com Elegância: Coleção de Natal Jô Bolsas"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
                required
              />
            </div>

            {/* Linha 4: Subtítulo / Descrição */}
            <div>
              <label className="block text-xs font-bold text-[#181316] mb-1">
                Mensagem / Descrição Afetuosa
              </label>
              <textarea
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                rows={3}
                placeholder="Ex: Peças exclusivas, bolsas estruturadas e looks deslumbrantes para suas comemorações..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40 leading-relaxed"
                required
              />
            </div>

            {/* Linha 5: Benefício e Cupom de Desconto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#181316] mb-1">
                  Benefício / Oferta Destacada (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.benefitText || ''}
                  onChange={(e) => setFormData({ ...formData, benefitText: e.target.value })}
                  placeholder="Ex: Mimo exclusivo nas compras + Mala Delivery 48h"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181316] mb-1">
                  Cupom Promocional (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.couponCode || ''}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                  placeholder="Ex: NATALGLAMOUR"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40 uppercase font-mono"
                />
              </div>
            </div>

            {/* Linha 6: Data Limite ou Prazo */}
            <div>
              <label className="block text-xs font-bold text-[#181316] mb-1">
                Texto de Prazo / Validade
              </label>
              <input
                type="text"
                value={formData.targetDateText || ''}
                onChange={(e) => setFormData({ ...formData, targetDateText: e.target.value })}
                placeholder="Ex: Válido para as Festas de Dezembro ou enquanto durar o estoque"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
              />
            </div>

            {/* Linha 7: Paleta de Cores e Estilo do Tema */}
            <div>
              <label className="block text-xs font-bold text-[#181316] mb-2">
                Tema Visual de Cores (Estilo da Janela)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {THEME_OPTIONS.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, themeColor: th.id })}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      formData.themeColor === th.id
                        ? 'border-[#B84E67] bg-[#FAF2F5] ring-2 ring-[#B84E67]/30 shadow-xs'
                        : 'border-[#E8CDD5] hover:bg-[#FAF8F9]'
                    }`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full mt-0.5 shrink-0 border border-black/20"
                      style={{ backgroundColor: th.previewColor }}
                    />
                    <div>
                      <span className="text-xs font-bold text-[#181316] block">
                        {th.label}
                      </span>
                      <span className="text-[10px] text-[#5A4D54] block mt-0.5">
                        {th.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Linha 8: Efeito de Movimento Animado */}
            <div>
              <label className="block text-xs font-bold text-[#181316] mb-2">
                Efeito de Movimento Animado
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ANIMATION_OPTIONS.map((anim) => (
                  <button
                    key={anim.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, animationEffect: anim.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.animationEffect === anim.id
                        ? 'border-[#B84E67] bg-[#FAF2F5] ring-2 ring-[#B84E67]/30'
                        : 'border-[#E8CDD5] hover:bg-[#FAF8F9]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#181316] block">
                      {anim.label}
                    </span>
                    <span className="text-[10px] text-[#5A4D54] block">
                      {anim.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Linha 9: Botões de Ação & Redirecionamento */}
            <div className="space-y-4 pt-2 border-t border-[#F7EBEF]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#181316] mb-1">
                    Texto do Botão Principal
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Ex: Ver Coleção & Promoções"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#181316] mb-1">
                    Ao Clicar, Filtrar Catálogo Por:
                  </label>
                  <select
                    value={formData.highlightCategory || 'Promoções'}
                    onChange={(e) => setFormData({ ...formData, highlightCategory: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
                  >
                    <option value="Promoções">🔥 Peças em Promoção</option>
                    <option value="Bolsas">👜 Bolsas</option>
                    <option value="Carteiras">👛 Carteiras</option>
                    <option value="Vestidos">👗 Vestidos</option>
                    <option value="Blazers & Alfaiataria">🧥 Blazers & Alfaiataria</option>
                    <option value="Todas">✨ Coleção Completa (Todas as peças)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181316] mb-1">
                  Texto do Botão do WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.secondaryCtaText || 'Falar com a Josy no WhatsApp'}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                  placeholder="Ex: Falar com a Josy no WhatsApp"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181316] mb-1">
                  Mensagem Automática para o WhatsApp da Josy ({STORE_WHATSAPP_DISPLAY})
                </label>
                <textarea
                  value={formData.whatsappMessage || ''}
                  onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                  rows={2}
                  placeholder="Ex: Olá Josy! Vi o especial de Natal na loja virtual e gostaria de garantir minhas peças!"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8CDD5] bg-[#FAF8F9] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B84E67]/40"
                />
              </div>
            </div>

            {/* Botões de Ação do Formulário */}
            <div className="pt-4 border-t border-[#F7EBEF] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData(DEFAULT_SPECIAL_DATE_SUGGESTIONS[0]);
                  setActivePresetId(DEFAULT_SPECIAL_DATE_SUGGESTIONS[0].id);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs text-[#5A4D54] hover:bg-[#FAF6F7] border border-[#E8CDD5] flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Padrão Natal</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#141113] hover:bg-black active:bg-zinc-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-black/20"
              >
                <Save className="w-4 h-4 text-[#F5BAC7]" />
                <span>Salvar e Publicar na Loja</span>
              </button>
            </div>

          </div>
        </form>

        {/* Lado Direito: Pré-Visualização em Tempo Real (5 colunas) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FAF8F9] rounded-3xl p-5 sm:p-6 border border-[#F2DEE4] sticky top-20 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-[#F2DEE4] pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#B84E67]" />
                <span className="text-xs font-bold text-[#181316]">
                  Simulador / Pré-visualização ao Vivo
                </span>
              </div>
              <span className="text-[10px] text-[#7A6B73] font-medium bg-white px-2 py-0.5 rounded-full border border-[#F2DEE4]">
                Como o cliente verá
              </span>
            </div>

            {/* Simulador Renderizado do Modal */}
            <div className="bg-zinc-950 p-2 sm:p-4 rounded-2xl border border-zinc-800 shadow-inner flex items-center justify-center">
              <PromotionalSpecialModal
                campaign={formData}
                isOpen={true}
                onClose={() => {}}
                isPreview={true}
              />
            </div>

            <div className="mt-4 pt-3 border-t border-[#F2DEE4] space-y-2 text-center">
              <p className="text-[11px] text-[#5A4D54]">
                Esta janela abre suavemente para a cliente assim que ela acessa a loja. Ela pode fechar no &quot;X&quot; a qualquer momento ou aproveitar a oferta.
              </p>
              <button
                type="button"
                onClick={onTestLiveModal}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF4F6] text-[#B84E67] font-bold text-xs border border-[#F2DEE4] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Experimentar em Tela Cheia na Loja</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
