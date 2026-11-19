type JaguarProps = {
  className?: string;
};

/**
 * Jaguar (Panthera onca) — ilustración vectorial plana original,
 * estilo geométrico juvenil. Paleta CEPO: verde selva, amarillo sol,
 * naranja tierra, azul noche y blanco.
 */
export default function Jaguar({ className }: JaguarProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <title>Jaguar de la Amazonía</title>
      {/* Fondo circular: selva */}
      <circle cx="100" cy="100" r="90" fill="#1B5E20" />
      {/* Sombra del suelo */}
      <ellipse cx="102" cy="168" rx="66" ry="9" fill="#0D1B3E" opacity="0.35" />
      {/* Cola curvada hacia arriba */}
      <path
        d="M150 128 C 178 122, 184 96, 172 78"
        fill="none"
        stroke="#E65100"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <circle cx="172" cy="76" r="7" fill="#E65100" />
      {/* Patas traseras y delanteras */}
      <rect x="128" y="128" width="15" height="38" rx="7" fill="#FFB300" />
      <rect x="146" y="130" width="13" height="36" rx="6" fill="#E65100" />
      <rect x="74" y="130" width="15" height="38" rx="7" fill="#FFB300" />
      <rect x="58" y="132" width="13" height="34" rx="6" fill="#E65100" />
      {/* Cuerpo */}
      <ellipse cx="108" cy="118" rx="54" ry="34" fill="#FFB300" />
      {/* Panza clara */}
      <ellipse cx="108" cy="132" rx="40" ry="18" fill="#FFFFFF" />
      {/* Manchas (rosetas simplificadas) */}
      <circle cx="96" cy="102" r="5" fill="#212121" />
      <circle cx="118" cy="98" r="5" fill="#212121" />
      <circle cx="138" cy="108" r="5" fill="#212121" />
      <circle cx="108" cy="118" r="4" fill="#212121" />
      <circle cx="128" cy="124" r="4" fill="#212121" />
      <circle cx="90" cy="122" r="4" fill="#212121" />
      {/* Orejas */}
      <path d="M44 74 L50 56 L62 70 Z" fill="#E65100" />
      <path d="M68 70 L76 54 L84 72 Z" fill="#E65100" />
      <circle cx="52" cy="66" r="3" fill="#C62828" />
      <circle cx="76" cy="64" r="3" fill="#C62828" />
      {/* Cabeza */}
      <circle cx="62" cy="96" r="27" fill="#FFB300" />
      {/* Hocico */}
      <ellipse cx="44" cy="106" rx="15" ry="11" fill="#FFFFFF" />
      <path d="M30 100 L38 100 L34 107 Z" fill="#212121" />
      {/* Ojo */}
      <circle cx="56" cy="90" r="5" fill="#0D1B3E" />
      <circle cx="58" cy="88" r="1.8" fill="#FFFFFF" />
      {/* Mancha en la mejilla */}
      <circle cx="74" cy="108" r="4" fill="#212121" />
      <circle cx="84" cy="100" r="3" fill="#212121" />
    </svg>
  );
}
