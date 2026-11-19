"use client";

import { useEffect, useState } from "react";

/**
 * Confeti solo con CSS (sin librerías). Si el usuario prefiere
 * movimiento reducido (prefers-reduced-motion), no se muestra nada.
 */
export default function Confeti() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const reducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setMostrar(!reducido);
  }, []);

  if (!mostrar) return null;

  const piezas = [
    { left: "5%", delay: "0s", color: "#ffb300" },
    { left: "15%", delay: "0.4s", color: "#00897b" },
    { left: "25%", delay: "0.2s", color: "#2e7d32" },
    { left: "35%", delay: "0.7s", color: "#e65100" },
    { left: "45%", delay: "0.1s", color: "#ffb300" },
    { left: "55%", delay: "0.5s", color: "#00897b" },
    { left: "65%", delay: "0.3s", color: "#c62828" },
    { left: "75%", delay: "0.6s", color: "#2e7d32" },
    { left: "85%", delay: "0.15s", color: "#ffb300" },
    { left: "95%", delay: "0.45s", color: "#00897b" },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-0 overflow-visible"
    >
      {piezas.map((p, i) => (
        <span
          key={i}
          className="confeti-pieza"
          style={{
            left: p.left,
            animationDelay: p.delay,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
