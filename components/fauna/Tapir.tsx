type TapirProps = {
  className?: string;
};

/**
 * Tapir amazónico — ilustración vectorial plana original,
 * estilo geométrico juvenil. Paleta CEPO: azul noche, negro suave,
 * verde selva, amarillo sol y blanco.
 */
export default function Tapir({ className }: TapirProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <title>Tapir amazónico</title>
      {/* Fondo circular: selva */}
      <circle cx="100" cy="100" r="90" fill="#1B5E20" />
      {/* Sombra del suelo */}
      <ellipse cx="102" cy="168" rx="64" ry="9" fill="#0D1B3E" opacity="0.35" />
      {/* Cola corta */}
      <circle cx="158" cy="112" r="7" fill="#212121" />
      {/* Patas */}
      <rect x="70" y="128" width="15" height="38" rx="7" fill="#212121" />
      <rect x="90" y="130" width="14" height="36" rx="7" fill="#212121" />
      <rect x="124" y="130" width="14" height="36" rx="7" fill="#212121" />
      <rect x="142" y="128" width="14" height="38" rx="7" fill="#212121" />
      {/* Pezuñas claras */}
      <rect x="70" y="158" width="15" height="8" rx="3" fill="#FFFFFF" />
      <rect x="90" y="158" width="14" height="8" rx="3" fill="#FFFFFF" />
      <rect x="124" y="158" width="14" height="8" rx="3" fill="#FFFFFF" />
      <rect x="142" y="158" width="14" height="8" rx="3" fill="#FFFFFF" />
      {/* Cuerpo voluminoso */}
      <ellipse cx="106" cy="116" rx="56" ry="36" fill="#212121" />
      {/* Lomo con franja clara */}
      <path
        d="M56 100 C 80 82, 130 82, 154 100"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Mancha clara del cuello y pecho */}
      <ellipse cx="70" cy="132" rx="16" ry="14" fill="#FFFFFF" opacity="0.9" />
      {/* Orejas con borde blanco */}
      <path d="M48 66 L54 48 L66 62 Z" fill="#212121" stroke="#FFFFFF" strokeWidth="3" strokeLinejoin="round" />
      <path d="M70 60 L80 46 L88 62 Z" fill="#212121" stroke="#FFFFFF" strokeWidth="3" strokeLinejoin="round" />
      {/* Cabeza */}
      <circle cx="58" cy="92" r="26" fill="#212121" />
      {/* Trompa corta hacia abajo */}
      <path
        d="M38 100 C 30 112, 30 124, 38 130 C 46 134, 52 128, 50 118 L 52 104 Z"
        fill="#212121"
      />
      <ellipse cx="38" cy="130" rx="7" ry="5" fill="#0D1B3E" />
      {/* Ojo */}
      <circle cx="52" cy="86" r="5" fill="#FFFFFF" />
      <circle cx="52" cy="86" r="2.8" fill="#FFB300" />
      {/* Hoja de selva decorativa */}
      <path d="M168 158 C 178 146, 186 146, 188 158 C 180 166, 172 166, 168 158 Z" fill="#00897B" />
    </svg>
  );
}
