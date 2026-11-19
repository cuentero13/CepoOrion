"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { institucion } from "@/lib/institucion";

/** Estrellas fijas del cielo (posiciones deterministas para evitar parpadeos de hidratación). */
const ESTRELLAS = [
  { x: 4, y: 8, s: 2, d: "0s" }, { x: 12, y: 22, s: 1.5, d: "0.7s" },
  { x: 20, y: 6, s: 2.5, d: "1.3s" }, { x: 28, y: 30, s: 1.5, d: "0.2s" },
  { x: 36, y: 12, s: 2, d: "1.8s" }, { x: 44, y: 26, s: 1.5, d: "0.9s" },
  { x: 52, y: 5, s: 2, d: "2.1s" }, { x: 60, y: 18, s: 1.5, d: "0.4s" },
  { x: 68, y: 32, s: 2, d: "1.5s" }, { x: 76, y: 9, s: 2.5, d: "0.1s" },
  { x: 84, y: 24, s: 1.5, d: "1.1s" }, { x: 92, y: 7, s: 2, d: "1.9s" },
  { x: 8, y: 40, s: 1.5, d: "0.5s" }, { x: 96, y: 38, s: 1.5, d: "2.4s" },
  { x: 48, y: 36, s: 1.5, d: "0.8s" }, { x: 18, y: 48, s: 1.5, d: "1.6s" },
  { x: 82, y: 46, s: 2, d: "0.3s" }, { x: 30, y: 55, s: 1.5, d: "2.0s" },
  { x: 70, y: 52, s: 1.5, d: "1.2s" }, { x: 58, y: 58, s: 2, d: "0.6s" },
];

/** Silueta de selva amazónica (diseño propio, dos capas para parallax). */
function Selva({ className, color }: { className?: string; color: string }) {
  return (
    <svg
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M0,160 L0,110 L40,95 L70,115 L110,80 L140,105 L180,70 L210,100 L250,85 L290,120 L330,75 L360,105 L400,60 L440,100 L480,85 L520,115 L560,70 L600,105 L640,80 L680,120 L720,65 L760,100 L800,85 L840,115 L880,70 L920,105 L960,80 L1000,120 L1040,75 L1080,100 L1120,85 L1160,110 L1200,95 L1200,160 Z"
      />
      <circle cx="110" cy="78" r="18" fill={color} />
      <circle cx="400" cy="58" r="20" fill={color} />
      <circle cx="720" cy="63" r="18" fill={color} />
      <circle cx="1040" cy="73" r="16" fill={color} />
    </svg>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [desplazamiento, setDesplazamiento] = useState(0);

  useEffect(() => {
    const alDesplazar = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.bottom > 0) setDesplazamiento(Math.max(0, -rect.top));
    };
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Presentación de CEPO"
      className="relative overflow-hidden bg-gradient-to-b from-noche via-[#12224f] to-[#1a3a2e] text-white"
    >
      {/* Cielo estrellado */}
      <div className="absolute inset-0" aria-hidden="true">
        {ESTRELLAS.map((e, i) => (
          <span
            key={i}
            className="estrella absolute rounded-full bg-white"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              width: e.s * 2,
              height: e.s * 2,
              animationDelay: e.d,
            }}
          />
        ))}
      </div>

      {/* Constelación de Orión grande */}
      <svg
        viewBox="0 0 200 200"
        className="orion-brillo absolute right-4 top-6 h-40 w-40 opacity-90 sm:right-16 sm:top-10 sm:h-56 sm:w-56"
        aria-hidden="true"
      >
        <g stroke="#FFB300" strokeWidth="1.2" opacity="0.8">
          <line x1="55" y1="38" x2="82" y2="102" />
          <line x1="148" y1="38" x2="121" y2="114" />
          <line x1="82" y1="102" x2="101" y2="108" />
          <line x1="101" y1="108" x2="121" y2="114" />
          <line x1="82" y1="102" x2="62" y2="166" />
          <line x1="121" y1="114" x2="142" y2="166" />
        </g>
        {[
          [55, 38, 6], [148, 38, 5], [82, 102, 5], [101, 108, 6], [121, 114, 5],
          [62, 166, 5], [142, 166, 6],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" />
        ))}
        <circle cx="101" cy="108" r="9" fill="none" stroke="#FFB300" strokeWidth="1" />
      </svg>

      {/* Hojas flotantes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="hoja-flotante absolute left-[12%] top-[10%] text-2xl" style={{ animationDelay: "0s" }}>🍃</span>
        <span className="hoja-flotante absolute left-[70%] top-[30%] text-xl" style={{ animationDelay: "3s" }}>🍃</span>
        <span className="hoja-flotante absolute left-[40%] top-[5%] text-xl" style={{ animationDelay: "6s" }}>🍃</span>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-40 pt-16 text-center sm:pt-24">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-rio-claro">
          Ixiamas · Abel Iturralde · La Paz · Bolivia
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Bajo Orión,
          <br />
          <span className="text-sol">aprendemos de la selva</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/90">
          {institucion.nombre}: educación secundaria con orgullo amazónico,
          puerta del norte paceño y del Parque Nacional Madidi.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/diagnostico"
            className="w-full rounded-full bg-sol px-8 py-3 font-display text-lg font-bold text-noche shadow-lg transition-transform hover:scale-105 focus:scale-105 sm:w-auto"
          >
            📝 Hacer el diagnóstico
          </Link>
          <Link
            href="/juegos"
            className="w-full rounded-full border-2 border-rio-claro bg-rio/80 px-8 py-3 font-display text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 focus:scale-105 sm:w-auto"
          >
            🎮 Jugar y aprender
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/75">
          Director: {institucion.director} · Niveles: {institucion.niveles.join(", ")}
        </p>
      </div>

      {/* Parallax de selva: dos capas que se mueven a distinta velocidad */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <Selva
          className="absolute bottom-0 left-0 h-28 w-full opacity-70"
          color="#2E7D32"
        />
        <div style={{ transform: `translateY(${desplazamiento * 0.08}px)` }}>
          <Selva className="relative h-32 w-full" color="#1B5E20" />
        </div>
      </div>
    </section>
  );
}
