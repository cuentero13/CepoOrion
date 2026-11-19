"use client";

/**
 * Logo de CEPO: constelación de Orión (Las Tres Marías) dibujada como SVG
 * original y animado. Las estrellas parpadean con retardos distintos y las
 * líneas unen Betelgeuse, Bellatrix, el cinturón (Alnitak, Alnilam, Mintaka),
 * Saiph y Rigel. Diseño propio, sin copiar logos existentes.
 */

const ESTRELLAS = [
  { nombre: "Betelgeuse", x: 55, y: 38, r: 7, retraso: "0s", color: "#FFB300" },
  { nombre: "Bellatrix", x: 148, y: 38, r: 6, retraso: "0.6s", color: "#ffffff" },
  { nombre: "Alnitak", x: 82, y: 102, r: 6, retraso: "1.1s", color: "#ffffff" },
  { nombre: "Alnilam", x: 101, y: 108, r: 7, retraso: "0.3s", color: "#FFB300" },
  { nombre: "Mintaka", x: 121, y: 114, r: 6, retraso: "1.6s", color: "#ffffff" },
  { nombre: "Saiph", x: 62, y: 166, r: 6, retraso: "0.9s", color: "#ffffff" },
  { nombre: "Rigel", x: 142, y: 166, r: 7, retraso: "1.9s", color: "#26A69A" },
];

const LINEAS: Array<[number, number, number, number]> = [
  [55, 38, 82, 102], // Betelgeuse – Alnitak
  [148, 38, 121, 114], // Bellatrix – Mintaka
  [82, 102, 101, 108], // Alnitak – Alnilam
  [101, 108, 121, 114], // Alnilam – Mintaka
  [82, 102, 62, 166], // Alnitak – Saiph
  [121, 114, 142, 166], // Mintaka – Rigel
  [101, 108, 101, 128], // Espada de Orión
];

export default function OrionLogo({
  className = "",
  mostrarNombre = true,
}: {
  className?: string;
  mostrarNombre?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      role="img"
      aria-label="Logo de CEPO: constelación de Orión, Las Tres Marías"
    >
      <svg
        viewBox="0 0 200 200"
        className="h-10 w-10 shrink-0"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="96" fill="#0D1B3E" />
        <circle cx="100" cy="100" r="96" fill="none" stroke="#26A69A" strokeWidth="3" />
        <g stroke="#FFB300" strokeWidth="1.5" opacity="0.85">
          {LINEAS.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        {ESTRELLAS.map((e) => (
          <g key={e.nombre} className="estrella" style={{ animationDelay: e.retraso }}>
            <circle cx={e.x} cy={e.y} r={e.r} fill={e.color} />
            <circle cx={e.x} cy={e.y} r={e.r + 4} fill={e.color} opacity="0.25" />
          </g>
        ))}
        <circle cx="101" cy="128" r="3" fill="#ffffff" className="estrella" style={{ animationDelay: "2.2s" }} />
        <circle cx="101" cy="140" r="2.5" fill="#ffffff" className="estrella" style={{ animationDelay: "0.2s" }} />
      </svg>
      {mostrarNombre && (
        <span className="leading-tight">
          <span className="block font-display text-xl font-bold tracking-wide text-selva dark:text-sol">
            CEPO
          </span>
          <span className="block text-[0.65rem] font-semibold uppercase tracking-widest text-rio dark:text-rio-claro">
            Centro Educativo Privado Orion
          </span>
        </span>
      )}
    </span>
  );
}
