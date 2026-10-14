import React from 'react';

interface JoBolsasLogoProps {
  variant?: 'full' | 'plaque-only' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  theme?: 'dark' | 'light';
  showPhrase?: boolean;
}

/**
 * Logotipo oficial Jo Bolsas Glamour:
 * 1. Placa circular idêntica à imagem oficial:
 *    - Fundo preto ônix com contorno rose gold
 *    - Monograma 'JB' entrelaçado no topo
 *    - Texto centralizado 'JÔ BOLSAS'
 *    - Linha com coração delicado '—— ♥ ——'
 *    - Escrita cursiva 'Glamour'
 * 2. Frase embaixo / adjacente: "JÔ BOLSAS - glamour" na mesma fonte!
 */
export const JoBolsasLogo: React.FC<JoBolsasLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  theme = 'light',
  showPhrase = true,
}) => {
  // Dimension of the circular plaque (sm: 48px, md: 108px, lg: 136px)
  // Responsive dimension of the plaque: compact on mobile, full on desktop
  const plaqueSizeClass =
    size === 'sm'
      ? 'w-9 h-9 sm:w-11 sm:h-11'
      : size === 'lg'
      ? 'w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32'
      : 'w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24';

  const PlaqueSVG = (
    <div
      className={`relative shrink-0 rounded-full shadow-md group-hover:scale-105 transition-transform select-none ${plaqueSizeClass}`}
      title="Jô Bolsas Glamour"
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="jbPlaqueRoseGold" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#FFF0F3" />
            <stop offset="25%" stopColor="#F9D4DC" />
            <stop offset="55%" stopColor="#EAB3BF" />
            <stop offset="85%" stopColor="#D98E9F" />
            <stop offset="100%" stopColor="#C97587" />
          </linearGradient>
          <linearGradient id="jbScriptShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FDE4EA" />
            <stop offset="70%" stopColor="#EBB3C0" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        {/* Circular Solid Black Onyx Disc */}
        <circle cx="250" cy="250" r="250" fill="#000000" />

        {/* Monograma JB Centralizado e Entrelaçado: 'J' 100% NÍTIDO E LEGÍVEL */}
        <g>
          {/* Topo / Serifa da Letra 'J' */}
          <path
            d="M 194 82 L 254 82 C 255.5 82 256.5 83 256.5 84.5 C 256.5 86 255.5 87 254 87 L 246 87 L 246 90 L 202 90 L 202 87 L 194 87 C 192.5 87 191.5 86 191.5 84.5 C 191.5 83 192.5 82 194 82 Z"
            fill="url(#jbPlaqueRoseGold)"
          />

          {/* Haste Vertical e Gancho Curvo da Letra 'J' */}
          <path
            d="M 238 87 L 246 87 L 246 256 C 246 270 242 282 232 291 C 221 300 206 303 191 299 C 174 294 163 279 163 260 C 163 244 174 233 188 233 C 199 233 207 241 207 252 C 207 262 199 270 188 270 C 185 270 181 269 178 267 C 180 277 189 285 200 288 C 210 290 221 288 228 281 C 235 274 238 264 238 253 Z"
            fill="url(#jbPlaqueRoseGold)"
          />

          {/* Base Horizontal do B */}
          <path
            d="M 228 290 L 272 290 C 273.5 290 274.5 291 274.5 292.5 C 274.5 294 273.5 295 272 295 L 228 295 C 226.5 295 225.5 294 225.5 292.5 C 225.5 291 226.5 290 228 290 Z"
            fill="url(#jbPlaqueRoseGold)"
          />

          {/* Bojo Superior do B */}
          <path
            d="M 246 114 C 274 114 308 120 322 143 C 333 162 327 183 310 195 C 298 203 280 206 246 206 L 246 198 C 276 198 291 195 302 188 C 314 179 319 163 310 148 C 298 129 271 122 246 122 Z"
            fill="url(#jbPlaqueRoseGold)"
          />

          {/* Bojo Inferior do B */}
          <path
            d="M 246 202 C 280 202 320 207 337 232 C 351 254 345 282 320 297 C 297 310 266 310 236 310 L 236 302 C 263 302 292 302 312 290 C 332 277 336 254 324 237 C 310 216 277 210 246 210 Z"
            fill="url(#jbPlaqueRoseGold)"
          />
        </g>

        {/* Tipografia 'J Ô  B O L S A S' */}
        <text
          x="250"
          y="346"
          textAnchor="middle"
          fill="url(#jbPlaqueRoseGold)"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontSize="33"
          fontWeight="500"
          letterSpacing="14"
        >
          JÔ BOLSAS
        </text>

        {/* Divisória Fina com Coração Central '—— ♥ ——' */}
        <line x1="168" y1="368" x2="236" y2="368" stroke="url(#jbPlaqueRoseGold)" strokeWidth="1.6" strokeLinecap="round" />
        
        {/* Mini Coração Central */}
        <path
          d="M 250 374.8 C 250 374.8 243.5 369 241.5 365.2 C 239.5 361.5 242 359 245.2 359 C 248 359 249.5 361.2 250 362.2 C 250.5 361.2 252 359 254.8 359 C 258 359 260.5 361.5 258.5 365.2 C 256.5 369 250 374.8 250 374.8 Z"
          fill="url(#jbPlaqueRoseGold)"
        />

        <line x1="264" y1="368" x2="332" y2="368" stroke="url(#jbPlaqueRoseGold)" strokeWidth="1.6" strokeLinecap="round" />

        {/* Escrita Cursiva 'Glamour' */}
        <text
          x="250"
          y="426"
          textAnchor="middle"
          fill="url(#jbScriptShine)"
          fontFamily="'Great Vibes', 'Cormorant Garamond', cursive"
          fontSize="64"
          fontWeight="400"
          fontStyle="italic"
        >
          Glamour
        </text>
      </svg>
    </div>
  );

  if (variant === 'plaque-only') {
    return <div className={`inline-flex items-center ${className}`}>{PlaqueSVG}</div>;
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-[#181316]';
  const accentColor = theme === 'dark' ? 'text-[#F5BAC7]' : 'text-[#B84E67]';

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  // Variant: Stacked (plaque on top, phrase underneath)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        {PlaqueSVG}
        {showPhrase && (
          <div className={`flex flex-col items-center text-center ${isSmall ? 'mt-2' : 'mt-3'}`}>
            <span
              className={`font-sans font-bold uppercase ${
                isSmall ? 'tracking-[0.16em] text-xs sm:text-sm' : isLarge ? 'tracking-[0.24em] text-xl sm:text-2xl' : 'tracking-[0.22em] text-base sm:text-lg'
              } ${textColor} text-center leading-tight`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              JÔ BOLSAS
            </span>
            <span
              className={`${accentColor} ${
                isSmall ? 'text-base sm:text-lg' : isLarge ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl'
              } italic leading-none mt-0.5 text-center`}
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              glamour
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default: Full variant (plaque on the left, typography lockup with JÔ BOLSAS and underneath centralized glamour)
  return (
    <div className={`flex items-center ${isSmall ? "gap-2 sm:gap-3" : "gap-2 sm:gap-4"} select-none min-w-0 ${className}`}>
      {/* 1. Logo Plaque Oficial (igual à foto sem alteração) */}
      {PlaqueSVG}

      {/* 2. Textos: após o logo a palavra JÔ BOLSAS, embaixo centralizada a palavra glamour */}
      <div className="flex flex-col items-center justify-center text-center min-w-0">
        <span
          className={`font-sans ${
            isSmall
              ? "tracking-[0.10em] sm:tracking-[0.14em] text-[11px] sm:text-xs"
              : isLarge
              ? "tracking-[0.16em] sm:tracking-[0.24em] text-xl sm:text-3xl md:text-4xl"
              : "tracking-[0.08em] sm:tracking-[0.18em] text-xs sm:text-xl md:text-2xl"
          } font-bold uppercase ${textColor} leading-tight text-center`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          JÔ BOLSAS
        </span>
        <span
          className={`${accentColor} ${
            isSmall
              ? "text-xs sm:text-base"
              : isLarge
              ? "text-2xl sm:text-4xl md:text-5xl"
              : "text-base sm:text-2xl md:text-3xl"
          } italic font-normal leading-none mt-0.5 text-center`}
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          glamour
        </span>
      </div>
    </div>
  );
};
