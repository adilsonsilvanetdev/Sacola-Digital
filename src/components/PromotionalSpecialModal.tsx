import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Tag, 
  Calendar, 
  Gift, 
  Percent,
  Clock
} from 'lucide-react';
import { SpecialDatePromotion, SpecialDateTheme } from '../types';
import { STORE_WHATSAPP_NUMBER } from '../utils/whatsappHelper';
import { WhatsAppIcon } from './WhatsAppIcon';

interface PromotionalSpecialModalProps {
  campaign: SpecialDatePromotion;
  isOpen: boolean;
  onClose: () => void;
  onExplorePromotions?: (category?: string) => void;
  onOpenWhatsApp?: (customMessage?: string) => void;
  isPreview?: boolean;
}

// Configurações visuais por tema para manter a estética de alta costura da Jô Bolsas
const THEME_STYLES: Record<SpecialDateTheme, {
  modalGradient: string;
  borderColor: string;
  accentColor: string;
  badgeStyle: string;
  primaryBtnStyle: string;
  cardBoxStyle: string;
  glowColor: string;
  floatingParticles: string[];
}> = {
  natal: {
    modalGradient: 'from-[#081e13] via-[#1c0f14] to-[#2b0c15]',
    borderColor: 'border-[#E6B800]/50',
    accentColor: '#F5C724',
    badgeStyle: 'bg-gradient-to-r from-[#1c4b2b] to-[#7f1325] text-[#FFE8A3] border border-[#E6B800]/50 shadow-xs',
    primaryBtnStyle: 'bg-gradient-to-r from-[#F5C724] via-[#ECCB77] to-[#D4AF37] text-[#1a1205] hover:brightness-105 shadow-md shadow-[#D4AF37]/20',
    cardBoxStyle: 'bg-[#150a0f]/80 border border-[#E6B800]/30',
    glowColor: 'rgba(230, 184, 0, 0.25)',
    floatingParticles: ['✨', '🎄', '⭐', '✨'],
  },
  reveillon: {
    modalGradient: 'from-[#0a0d14] via-[#161a28] to-[#0f111a]',
    borderColor: 'border-[#F3E5AB]/60',
    accentColor: '#F7E7B4',
    badgeStyle: 'bg-gradient-to-r from-[#D4AF37]/40 to-[#FFE082]/30 text-[#FFF3CC] border border-[#F3E5AB]/60 shadow-xs',
    primaryBtnStyle: 'bg-gradient-to-r from-[#F7E7B4] via-[#ECCB77] to-[#DFB752] text-[#1A150A] hover:brightness-105 shadow-md shadow-[#F7E7B4]/20',
    cardBoxStyle: 'bg-[#0f1320]/80 border border-[#F3E5AB]/30',
    glowColor: 'rgba(247, 231, 180, 0.3)',
    floatingParticles: ['✨', '🥂', '✦', '⭐'],
  },
  mulheres: {
    modalGradient: 'from-[#280c1b] via-[#1f0b15] to-[#340f23]',
    borderColor: 'border-[#F5BAC7]/60',
    accentColor: '#F5BAC7',
    badgeStyle: 'bg-[#4A142B] text-[#FCD2DC] border border-[#F5BAC7]/50 shadow-xs',
    primaryBtnStyle: 'bg-gradient-to-r from-[#F5BAC7] via-[#EE9BB1] to-[#E58CA3] text-[#1F0811] hover:brightness-105 shadow-md shadow-[#F5BAC7]/20',
    cardBoxStyle: 'bg-[#1c0813]/80 border border-[#F5BAC7]/30',
    glowColor: 'rgba(245, 186, 199, 0.3)',
    floatingParticles: ['🌸', '✨', '💐', '✦'],
  },
  maes: {
    modalGradient: 'from-[#270b17] via-[#200913] to-[#18050e]',
    borderColor: 'border-[#E8B4B8]/60',
    accentColor: '#FCD5CE',
    badgeStyle: 'bg-[#431422] text-[#FFE5EC] border border-[#E8B4B8]/50 shadow-xs',
    primaryBtnStyle: 'bg-gradient-to-r from-[#E8B4B8] via-[#F0C2C5] to-[#DF9DA3] text-[#240A12] hover:brightness-105 shadow-md shadow-[#E8B4B8]/20',
    cardBoxStyle: 'bg-[#1d0711]/80 border border-[#E8B4B8]/30',
    glowColor: 'rgba(232, 180, 184, 0.3)',
    floatingParticles: ['💝', '✨', '🌷', '✦'],
  },
  namorados: {
    modalGradient: 'from-[#330610] via-[#24040a] to-[#190206]',
    borderColor: 'border-[#FF758F]/60',
    accentColor: '#FF4D6D',
    badgeStyle: 'bg-[#550b1a] text-[#FFCCD5] border border-[#FF758F]/50 shadow-xs',
    primaryBtnStyle: 'bg-gradient-to-r from-[#FF4D6D] to-[#C9184A] text-white hover:brightness-110 shadow-md shadow-[#FF4D6D]/30',
    cardBoxStyle: 'bg-[#22040a]/80 border border-[#FF758F]/30',
    glowColor: 'rgba(255, 77, 109, 0.35)',
    floatingParticles: ['❤️', '✨', '🌹', '✦'],
  },
  pais: {
    modalGradient: 'from-[#0a1224] via-[#0f1a32] to-[#181622]',
    borderColor: 'border-[#D4AF37]/60',
    accentColor: '#E6C065',
    badgeStyle: 'bg-[#142343] text-[#E0E7FF] border border-[#D4AF37]/50 shadow-xs',
    primaryBtnStyle: 'bg-gradient-to-r from-[#E6C065] via-[#DFB752] to-[#C9A227] text-[#0A1128] hover:brightness-105 shadow-md shadow-[#E6C065]/20',
    cardBoxStyle: 'bg-[#0d162a]/80 border border-[#D4AF37]/30',
    glowColor: 'rgba(212, 175, 55, 0.25)',
    floatingParticles: ['👔', '✨', '⭐', '✦'],
  },
  blackfriday: {
    modalGradient: 'from-[#08080a] via-[#121214] to-[#040405]',
    borderColor: 'border-[#FFD700]/70',
    accentColor: '#FFD700',
    badgeStyle: 'bg-[#1f1f23] text-[#FFE866] border border-[#FFD700]/60 shadow-xs',
    primaryBtnStyle: 'bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF8C00] text-black font-extrabold hover:brightness-110 shadow-lg shadow-[#FFD700]/30',
    cardBoxStyle: 'bg-[#101013]/90 border border-[#FFD700]/40',
    glowColor: 'rgba(255, 215, 0, 0.35)',
    floatingParticles: ['⚡', '🖤', '🔥', '✦'],
  },
  aniversario: {
    modalGradient: 'from-[#230c25] via-[#1a081c] to-[#120513]',
    borderColor: 'border-[#F3A4C0]/60',
    accentColor: '#F7C5D5',
    badgeStyle: 'bg-[#431547] text-[#FDE2EC] border border-[#F3A4C0]/50 shadow-xs',
    primaryBtnStyle: 'bg-gradient-to-r from-[#F3A4C0] via-[#E88BAE] to-[#DD709B] text-[#1B051D] hover:brightness-105 shadow-md shadow-[#F3A4C0]/25',
    cardBoxStyle: 'bg-[#18071a]/80 border border-[#F3A4C0]/30',
    glowColor: 'rgba(243, 164, 192, 0.3)',
    floatingParticles: ['🎁', '✨', '🥂', '🎉'],
  },
  rose: {
    modalGradient: 'from-[#191014] via-[#22151c] to-[#120a0e]',
    borderColor: 'border-[#F5BAC7]/60',
    accentColor: '#F5BAC7',
    badgeStyle: 'bg-[#351b25] text-[#FCE1E8] border border-[#F5BAC7]/40 shadow-xs',
    primaryBtnStyle: 'bg-[#F5BAC7] hover:bg-[#F2A3B4] text-[#141113] hover:brightness-105 shadow-md shadow-[#F5BAC7]/20',
    cardBoxStyle: 'bg-[#170c12]/80 border border-[#F5BAC7]/30',
    glowColor: 'rgba(245, 186, 199, 0.25)',
    floatingParticles: ['✨', '💎', '🌸', '✦'],
  },
  ouro: {
    modalGradient: 'from-[#1a150b] via-[#221c10] to-[#100d06]',
    borderColor: 'border-[#D4AF37]/70',
    accentColor: '#F4D068',
    badgeStyle: 'bg-[#352d15] text-[#FFF3CD] border border-[#D4AF37]/50 shadow-xs',
    primaryBtnStyle: 'bg-gradient-to-r from-[#D4AF37] via-[#ECCB77] to-[#F3E5AB] text-[#1F1905] hover:brightness-105 shadow-md shadow-[#D4AF37]/25',
    cardBoxStyle: 'bg-[#151108]/80 border border-[#D4AF37]/35',
    glowColor: 'rgba(212, 175, 55, 0.3)',
    floatingParticles: ['✨', '⭐', '✦', '👑'],
  },
};

export const PromotionalSpecialModal: React.FC<PromotionalSpecialModalProps> = ({
  campaign,
  isOpen,
  onClose,
  onExplorePromotions,
  onOpenWhatsApp,
  isPreview = false,
}) => {
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  if (!isOpen) return null;

  const theme = THEME_STYLES[campaign.themeColor] || THEME_STYLES.natal;

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!campaign.couponCode) return;
    navigator.clipboard.writeText(campaign.couponCode);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2200);
  };

  const handlePrimaryClick = () => {
    if (onExplorePromotions) {
      onExplorePromotions(campaign.highlightCategory || 'Promoções');
    }
    if (!isPreview) {
      onClose();
    }
  };

  const handleWhatsAppClick = () => {
    if (onOpenWhatsApp) {
      onOpenWhatsApp(campaign.whatsappMessage);
    } else {
      const msg = campaign.whatsappMessage || `Olá Josy! Vi o especial de ${campaign.name} no site da Jô Bolsas e quero garantir minha reserva!`;
      const couponPart = campaign.couponCode ? `\n🏷️ Cupom: *${campaign.couponCode}*` : '';
      const text = `✨ *JÔ BOLSAS GLAMOUR* ✨\n🌟 *${campaign.badge}*\n\n${msg}${couponPart}`;
      window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    }
    if (!isPreview) {
      onClose();
    }
  };

  // Animação de movimento selecionada
  const getAnimationClass = () => {
    switch (campaign.animationEffect) {
      case 'shimmer':
        return 'animate-jb-shimmer';
      case 'pulse':
        return 'animate-jb-pulse-subtle';
      case 'sparkles':
        return 'animate-jb-sparkle';
      default:
        return 'animate-jb-float';
    }
  };

  return (
    <div 
      className={`${
        isPreview ? 'relative w-full' : 'fixed inset-0 z-50 overflow-y-auto'
      } flex items-center justify-center p-3 sm:p-4`}
      style={{ isolation: 'isolate' }}
    >
      {/* Backdrop com desfoque refinado quando exibido como modal real */}
      {!isPreview && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Conteúdo da Janela Flutuante */}
      <div 
        className={`relative w-full max-w-lg rounded-3xl overflow-hidden border ${theme.borderColor} bg-gradient-to-b ${theme.modalGradient} text-white shadow-2xl z-10 transition-all duration-300 transform scale-100 animate-fadeIn`}
        style={{
          boxShadow: `0 20px 50px -10px ${theme.glowColor}, 0 0 25px 2px ${theme.glowColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luz decorativa superior */}
        <div 
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-44 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ backgroundColor: theme.accentColor }}
        />

        {/* Efeitos de partículas e elementos em movimento ao redor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <span className="absolute top-4 left-6 text-xl opacity-60 animate-jb-float">
            {theme.floatingParticles[0] || '✨'}
          </span>
          <span className="absolute top-12 right-14 text-sm opacity-50 animate-jb-sparkle" style={{ animationDelay: '0.8s' }}>
            {theme.floatingParticles[1] || '⭐'}
          </span>
          <span className="absolute bottom-20 left-4 text-base opacity-40 animate-jb-sparkle" style={{ animationDelay: '1.4s' }}>
            {theme.floatingParticles[2] || '✦'}
          </span>
          <span className="absolute bottom-8 right-6 text-xl opacity-60 animate-jb-float" style={{ animationDelay: '1.8s' }}>
            {theme.floatingParticles[3] || '✨'}
          </span>
        </div>

        {/* Botão Fechar no Canto Superior Direito */}
        {!isPreview && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
            title="Fechar janela promocional"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Corpo Interno da Janela */}
        <div className="p-6 sm:p-8 relative z-10 text-center">
          
          {/* Badge & Ícone Temático em Movimento */}
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <div 
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg border border-white/20 bg-white/10 backdrop-blur-sm ${getAnimationClass()}`}
              style={{
                boxShadow: `0 8px 24px ${theme.glowColor}`,
              }}
            >
              <span>{campaign.icon || '✨'}</span>
            </div>

            <div className={`mt-1 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wider uppercase ${theme.badgeStyle}`}>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{campaign.badge || 'PROMOÇÃO ESPECIAL'}</span>
            </div>
          </div>

          {/* Título de Impacto (Editorial / Serif Luxuoso) */}
          <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-white tracking-tight leading-snug mb-3">
            {campaign.title}
          </h2>

          {/* Subtítulo / Descrição Afetuosa */}
          <p className="text-white/85 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-5 font-light">
            {campaign.subtitle}
          </p>

          {/* Card de Benefício ou Oferta Destacada */}
          {campaign.benefitText && (
            <div className={`p-3.5 rounded-2xl mb-4 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium ${theme.cardBoxStyle}`}>
              <Gift className="w-4 h-4 shrink-0" style={{ color: theme.accentColor }} />
              <span className="text-white/95">{campaign.benefitText}</span>
            </div>
          )}

          {/* Card com Cupom de Desconto com 1 Clique para Copiar */}
          {campaign.couponCode && (
            <div className={`p-3 rounded-2xl mb-5 flex items-center justify-between gap-3 ${theme.cardBoxStyle}`}>
              <div className="flex items-center gap-2 text-left pl-1">
                <Tag className="w-4 h-4 text-white/70 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/60 block font-medium">
                    Cupom Promocional
                  </span>
                  <span className="font-mono font-bold text-sm tracking-wider text-white">
                    {campaign.couponCode}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCoupon}
                className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/35 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/20 shrink-0"
              >
                {copiedCoupon ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Data Limite ou Prazo */}
          {campaign.targetDateText && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/70 mb-5">
              <Clock className="w-3.5 h-3.5" />
              <span>{campaign.targetDateText}</span>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handlePrimaryClick}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.primaryBtnStyle}`}
            >
              <span>{campaign.ctaText || 'Ver Peças em Destaque'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="w-full py-3 px-6 rounded-xl font-medium text-xs sm:text-sm bg-[#25D366]/20 hover:bg-[#25D366]/30 active:bg-[#25D366]/40 text-emerald-100 border border-[#25D366]/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>{campaign.secondaryCtaText || 'Falar com a Josy no WhatsApp'}</span>
            </button>
          </div>

          {/* Rodapé discreto */}
          {!isPreview && (
            <div className="mt-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] text-white/50 hover:text-white/80 transition-colors cursor-pointer underline underline-offset-2"
              >
                Continuar navegando na loja
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Selo / Botão Flutuante Discreto que fica no canto inferior da tela
 * Permite que a cliente reabra a janela promocional a qualquer momento se desejar!
 */
export const PromotionalSpecialBadge: React.FC<{
  campaign: SpecialDatePromotion;
  onOpen: () => void;
  hasActiveMalaItems?: boolean;
}> = ({ campaign, onOpen, hasActiveMalaItems = false }) => {
  const theme = THEME_STYLES[campaign.themeColor] || THEME_STYLES.natal;

  return (
    <button
      onClick={onOpen}
      className={`fixed left-4 sm:left-6 ${
        hasActiveMalaItems ? 'bottom-24 sm:bottom-28' : 'bottom-6'
      } z-40 group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-xl border ${theme.borderColor} bg-gradient-to-r ${theme.modalGradient} text-white cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 animate-fadeIn`}
      style={{
        boxShadow: `0 6px 20px ${theme.glowColor}`,
      }}
      title={`Abrir ${campaign.name}`}
      aria-label={`Ver promoção de ${campaign.name}`}
    >
      <span className="text-lg animate-jb-float">{campaign.icon || '✨'}</span>
      <div className="text-left hidden sm:block">
        <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 block leading-tight">
          {campaign.badge.split(' ')[0] || 'Destaque'}
        </span>
        <span className="text-xs font-semibold text-white group-hover:underline">
          {campaign.name}
        </span>
      </div>
      <span className="sm:hidden text-xs font-semibold text-white">
        {campaign.badge.split(' ')[0] || 'Especial'}
      </span>
      <Sparkles className="w-3.5 h-3.5 text-white/80 animate-jb-sparkle" />
    </button>
  );
};
