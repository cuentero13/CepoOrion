/**
 * Iconos de los juegos: SVG inline, sin emojis (la interfaz no usa
 * emojis). Cada icono es decorativo: aria-hidden y sin texto propio.
 */

import type { JuegoCatalogo } from "@/lib/juegos";

export default function IconoJuego({
  icono,
  className = "h-10 w-10",
}: {
  icono: JuegoCatalogo["icono"];
  className?: string;
}) {
  const comun = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (icono) {
    case "selva":
      return (
        <svg {...comun}>
          <path d="M12 3 7 10h3l-4 6h12l-4-6h3L12 3Z" />
          <path d="M12 16v5" />
          <path d="M5 21h14" />
        </svg>
      );
    case "monedas":
      return (
        <svg {...comun}>
          <circle cx="9" cy="9" r="6" />
          <path d="M14.5 14.5a6 6 0 1 0 4 4" />
          <path d="M9 6.5v5M7 8h4" />
        </svg>
      );
    case "lupa":
      return (
        <svg {...comun}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
          <path d="M10.5 8v5M8 10.5h5" />
        </svg>
      );
    case "cruz":
      return (
        <svg {...comun}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "mapa":
      return (
        <svg {...comun}>
          <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    case "estrella":
      return (
        <svg {...comun}>
          <path d="m12 2 2.6 5.9 6.4.7-4.7 4.3 1.3 6.3L12 16.2 6.4 19.2l1.3-6.3L3 8.6l6.4-.7L12 2Z" />
        </svg>
      );
  }
}
