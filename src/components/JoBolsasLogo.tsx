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
  // Dimension of the circular plaque (2x do tamanho anterior: 54px -> 108px)
  const dim = size === 'sm' ? 88 : size === 'lg' ? 136 : 108;

  const PlaqueSVG = (
    <div
      style={{ width: dim, height: dim }}
      className="relative shrink-0 rounded-full shadow-md group-hover:scale-102 transition-transform select-none"
      title="Jô Bolsas Glamour"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="plaqueGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#251F23" />
            <stop offset="70%" stopColor="#141113" />
            <stop offset="100%" stopColor="#0D0B0D" />
          </radialGradient>
          <linearGradient id="roseMetallic" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FDDFE5" />
            <stop offset="45%" stopColor="#F5B8C7" />
            <stop offset="100%" stopColor="#E28EA2" />
          </linearGradient>
          <filter id="roseGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#F5B8C7" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Circular Black Plaque Base */}
        <circle
          cx="100"
          cy="100"
          r="97"
          fill="url(#plaqueGrad)"
          stroke="#F5B8C7"
          strokeWidth="2.5"
          strokeOpacity="0.45"
        />

        {/* Monogram 'JB' Entwined */}
        <g filter="url(#roseGlow)">
          {/* Serif Top & Loop of J */}
          <path
            d="M 68 34 L 95 34 L 95 38 L 88 38 L 88 68 C 88 77 82 83 73 83 C 65 83 60 78 60 73 C 60 67 66 64 70 66.5 C 72 68 73 70 73 72.5 C 73 75.5 70 77 68 77 C 71 79 76 79 79 76 C 82 73 83 68 83 63 L 83 38 L 68 38 Z"
            fill="url(#roseMetallic)"
          />

          {/* Loops of B */}
          <path
            d="M 92 38 C 98 38 116 38 122 43.5 C 127 48.5 127 55.5 122 59.5 C 119 62 113 63 108 63 C 116 63 126 64.5 130 70.5 C 134 76.5 133 84.5 125 89 C 118 93 104 93 92 93 L 92 87.5 C 100 87.5 113 87.5 117 84 C 121 80.5 121 74.5 117 71.5 C 113 67.5 103 67.5 95 67.5 L 95 63 C 101 63 110 63 113 59 C 116 55 115 50 112 47 C 108 43 99 43 92 43 Z"
            fill="url(#roseMetallic)"
          />
        </g>

        {/* Brand Text 'JÔ BOLSAS' without alteration */}
        <text
          x="100"
          y="122"
          textAnchor="middle"
          fill="#F7C8D3"
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="16.5"
          letterSpacing="4"
        >
          JÔ BOLSAS
        </text>

        {/* Hairline Divider with Center Heart */}
        <line
          x1="44"
          y1="135"
          x2="91"
          y2="135"
          stroke="#F5BAC7"
          strokeWidth="1.2"
          strokeOpacity="0.75"
        />
        <path
          d="M 100 139.5 C 100 139.5 95.8 135.5 94.2 133 C 92.5 130.3 94.5 128.3 96.8 128.3 C 98.8 128.3 99.6 130 100 130.8 C 100.4 130 101.2 128.3 103.2 128.3 C 105.5 128.3 107.5 130.3 105.8 133 C 104.2 135.5 100 139.5 100 139.5 Z"
          fill="#F5BAC7"
        />
        <line
          x1="109"
          y1="135"
          x2="156"
          y2="135"
          stroke="#F5BAC7"
          strokeWidth="1.2"
          strokeOpacity="0.75"
        />

        {/* Cursive Subtitle 'Glamour' without alteration */}
        <text
          x="100"
          y="170"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="'Great Vibes', 'Cormorant Garamond', cursive"
          fontSize="33"
          fontWeight="400"
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

  // Variant: Stacked (plaque on top, phrase underneath)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        {PlaqueSVG}
        {showPhrase && (
          <div className="flex flex-col items-center mt-3 text-center">
            <span
              className={`font-sans font-bold uppercase tracking-[0.22em] text-lg sm:text-xl ${textColor} text-center leading-tight`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              JÔ BOLSAS
            </span>
            <span
              className={`${accentColor} text-xl sm:text-2xl md:text-3xl italic leading-none mt-1 text-center`}
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
    <div className={`flex items-center gap-4 sm:gap-5 select-none ${className}`}>
      {/* 1. Logo Plaque Oficial (igual à foto sem alteração) */}
      {PlaqueSVG}

      {/* 2. Textos: após o logo a palavra JÔ BOLSAS, embaixo centralizada a palavra glamour */}
      <div className="flex flex-col items-center justify-center text-center">
        <span
          className={`font-sans tracking-[0.24em] text-xl sm:text-2xl md:text-3xl font-bold uppercase ${textColor} leading-tight text-center`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          JÔ BOLSAS
        </span>
        <span
          className={`${accentColor} text-2xl sm:text-3xl md:text-4xl italic font-normal leading-none mt-1 text-center`}
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          glamour
        </span>
      </div>
    </div>
  );
};
