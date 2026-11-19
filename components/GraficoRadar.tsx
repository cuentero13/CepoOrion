/**
 * Gráfico radar (SVG, sin librerías) para mostrar el nivel por área.
 * Los valores van de 0 a 100. Debajo del gráfico se muestra la lista
 * con los valores, para que la información también esté disponible sin
 * el dibujo (accesibilidad y pantallas pequeñas).
 */

import { AREAS, type Area } from "@/lib/diagnostico";

export type ValorRadar = {
  area: Area;
  /** 0–100. */
  valor: number;
  /** Texto que se muestra junto al valor (por ejemplo el nivel). */
  etiqueta?: string;
  /** true cuando el área todavía no se midió. */
  pendiente?: boolean;
};

const TAMANO = 320;
const CENTRO = TAMANO / 2;
const RADIO = 112;

function punto(indice: number, total: number, radio: number) {
  // -90° para que el primer eje quede arriba.
  const angulo = (Math.PI * 2 * indice) / total - Math.PI / 2;
  return {
    x: CENTRO + radio * Math.cos(angulo),
    y: CENTRO + radio * Math.sin(angulo),
  };
}

export default function GraficoRadar({
  valores,
  titulo = "Nivel por área",
}: {
  valores: ValorRadar[];
  titulo?: string;
}) {
  const total = valores.length;
  const anillos = [0.25, 0.5, 0.75, 1];

  const poligono = valores
    .map((v, i) => {
      const p = punto(i, total, (RADIO * Math.min(100, Math.max(0, v.valor))) / 100);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  const descripcion = valores
    .map(
      (v) =>
        `${v.area}: ${v.pendiente ? "pendiente" : `${v.valor} de 100${v.etiqueta ? ` (${v.etiqueta})` : ""}`}`
    )
    .join("; ");

  return (
    <figure className="mx-auto max-w-md">
      <svg
        viewBox={`0 0 ${TAMANO} ${TAMANO}`}
        role="img"
        aria-label={`${titulo}. ${descripcion}`}
        className="h-auto w-full"
      >
        {/* Anillos de referencia */}
        {anillos.map((f) => {
          const pts = AREAS.map((_, i) => {
            const p = punto(i, total, RADIO * f);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          }).join(" ");
          return (
            <polygon
              key={f}
              points={pts}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
          );
        })}
        {/* Ejes */}
        {valores.map((_, i) => {
          const p = punto(i, total, RADIO);
          return (
            <line
              key={i}
              x1={CENTRO}
              y1={CENTRO}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
          );
        })}
        {/* Polígono de resultados */}
        <polygon
          points={poligono}
          fill="#00897b"
          fillOpacity="0.35"
          stroke="#1b5e20"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Puntos por área */}
        {valores.map((v, i) => {
          const p = punto(
            i,
            total,
            (RADIO * Math.min(100, Math.max(0, v.valor))) / 100
          );
          return (
            <circle
              key={v.area}
              cx={p.x}
              cy={p.y}
              r="5"
              fill="#e65100"
              stroke="#fff"
              strokeWidth="1.5"
            />
          );
        })}
        {/* Etiquetas de las áreas */}
        {valores.map((v, i) => {
          const p = punto(i, total, RADIO + 26);
          return (
            <text
              key={v.area}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fontWeight="700"
              fill="currentColor"
            >
              {v.area}
            </text>
          );
        })}
      </svg>
      <figcaption className="sr-only">{descripcion}</figcaption>
      <ul className="mt-2 flex flex-col gap-1">
        {valores.map((v) => (
          <li
            key={v.area}
            className="flex items-center justify-between gap-2 rounded-lg border border-rio/20 px-3 py-1.5 text-sm"
          >
            <span className="font-bold text-noche dark:text-white">
              {v.area}
            </span>
            <span className="text-neutral-600 dark:text-white/75">
              {v.pendiente
                ? "Pendiente"
                : `${v.valor} / 100${v.etiqueta ? ` · ${v.etiqueta}` : ""}`}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
