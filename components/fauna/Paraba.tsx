type ParabaProps = {
  className?: string;
};

/**
 * Paraba roja (guacamayo) — ilustración vectorial plana original,
 * estilo geométrico juvenil, posada en una rama. Paleta CEPO:
 * rojo achiote, azul noche, amarillo sol y naranja tierra.
 */
export default function Paraba({ className }: ParabaProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <title>Paraba roja posada en una rama</title>
      {/* Fondo circular: cielo de río */}
      <circle cx="100" cy="100" r="90" fill="#00897B" />
      {/* Rama */}
      <path
        d="M28 152 C 70 144, 130 144, 176 150"
        fill="none"
        stroke="#E65100"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="40" cy="150" r="4" fill="#1B5E20" />
      <circle cx="168" cy="148" r="4" fill="#1B5E20" />
      {/* Cola larga: tres plumas */}
      <path d="M96 138 L84 182 L96 184 L104 140 Z" fill="#0D1B3E" />
      <path d="M106 140 L104 186 L114 186 L116 140 Z" fill="#C62828" />
      <path d="M116 138 L124 180 L132 176 L126 136 Z" fill="#FFB300" />
      {/* Cuerpo */}
      <ellipse cx="100" cy="106" rx="31" ry="44" fill="#C62828" />
      {/* Ala azul con borde amarillo */}
      <ellipse cx="114" cy="112" rx="17" ry="32" fill="#0D1B3E" />
      <ellipse cx="114" cy="112" rx="17" ry="32" fill="none" stroke="#FFB300" strokeWidth="3" />
      <path d="M104 96 L120 96 L116 122 L106 122 Z" fill="#FFB300" />
      {/* Patas sobre la rama */}
      <rect x="90" y="142" width="7" height="12" rx="3" fill="#FFB300" />
      <rect x="104" y="142" width="7" height="12" rx="3" fill="#FFB300" />
      {/* Cabeza */}
      <circle cx="94" cy="56" r="25" fill="#C62828" />
      {/* Parche facial blanco */}
      <ellipse cx="82" cy="58" rx="11" ry="9" fill="#FFFFFF" />
      {/* Ojo */}
      <circle cx="82" cy="56" r="4.5" fill="#0D1B3E" />
      <circle cx="83.5" cy="54.5" r="1.6" fill="#FFFFFF" />
      {/* Pico: superior amarillo, punta oscura */}
      <path d="M70 52 C 58 54, 50 62, 50 70 C 58 74, 68 72, 72 64 Z" fill="#FFB300" />
      <path d="M50 70 C 54 76, 62 76, 66 70 C 60 68, 54 68, 50 70 Z" fill="#212121" />
      {/* Cresta de plumas */}
      <path d="M88 32 L94 20 L100 32 Z" fill="#FFB300" />
      <path d="M100 32 L108 22 L112 34 Z" fill="#E65100" />
    </svg>
  );
}
