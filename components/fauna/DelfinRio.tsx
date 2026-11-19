type DelfinRioProps = {
  className?: string;
};

/**
 * Delfín rosado de río (bufeo) — ilustración vectorial plana original,
 * estilo geométrico juvenil, saltando sobre el agua. Paleta CEPO:
 * rojo achiote (rosa del bufeo), turquesa río, azul noche y blanco.
 */
export default function DelfinRio({ className }: DelfinRioProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <title>Delfín rosado de río saltando sobre el agua</title>
      {/* Fondo circular: río */}
      <circle cx="100" cy="100" r="90" fill="#00897B" />
      {/* Sol */}
      <circle cx="150" cy="48" r="16" fill="#FFB300" />
      {/* Aleta caudal (cola) */}
      <path d="M52 96 L28 82 L40 100 L30 116 Z" fill="#C62828" />
      {/* Aleta dorsal */}
      <path d="M104 62 L118 40 L126 64 Z" fill="#C62828" />
      {/* Cuerpo arqueado en salto */}
      <path
        d="M48 100 C 70 66, 118 58, 148 78 C 162 88, 164 100, 152 106 C 122 120, 76 122, 52 112 Z"
        fill="#C62828"
      />
      {/* Panza clara */}
      <path
        d="M60 108 C 84 118, 122 118, 146 104 C 132 116, 84 122, 60 108 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />
      {/* Hocico largo y fino (pico del bufeo) */}
      <path d="M148 78 C 164 74, 176 78, 180 84 C 172 90, 160 90, 150 88 Z" fill="#C62828" />
      <circle cx="178" cy="84" r="3" fill="#0D1B3E" />
      {/* Ojo */}
      <circle cx="138" cy="80" r="5" fill="#0D1B3E" />
      <circle cx="140" cy="78" r="1.8" fill="#FFFFFF" />
      {/* Aleta pectoral */}
      <path d="M104 108 L96 128 L112 124 Z" fill="#C62828" />
      {/* Olas del río */}
      <path
        d="M28 150 C 44 142, 56 158, 72 150 C 88 142, 100 158, 116 150"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M84 168 C 100 160, 112 176, 128 168 C 144 160, 156 176, 172 168"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Gotas de agua del salto */}
      <circle cx="52" cy="128" r="4" fill="#FFFFFF" />
      <circle cx="38" cy="138" r="3" fill="#FFFFFF" />
      <circle cx="66" cy="136" r="3" fill="#FFFFFF" />
    </svg>
  );
}
