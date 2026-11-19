"use client";

import Link from "next/link";
import Confeti from "./Confeti";
import {
  INSIGNIAS,
  juegoPorId,
  type InsigniaId,
  type JuegoId,
} from "@/lib/juegos";

const TEXTO_GUARDADO = {
  supabase:
    "Tu resultado quedó guardado en tu cuenta. Lo vas a ver en Mi progreso.",
  local:
    "Tu resultado quedó guardado en este dispositivo. Si entrás con tu cuenta, también se guarda ahí.",
  ninguno:
    "Tu resultado se muestra solo en pantalla: no se pudo guardar en este dispositivo.",
} as const;

/**
 * Pantalla final de una partida: puntaje, insignias ganadas, confeti
 * (solo CSS, sin animación si se prefiere movimiento reducido) y
 * dónde quedó guardado el resultado.
 */
export default function ResultadoPartida({
  juego,
  aciertos,
  total,
  puntos,
  nivel,
  insigniasNuevas,
  guardado,
  onRepetir,
}: {
  juego: JuegoId;
  aciertos: number;
  total: number;
  puntos: number;
  nivel: number;
  insigniasNuevas: InsigniaId[];
  guardado: "supabase" | "local" | "ninguno";
  onRepetir: () => void;
}) {
  const info = juegoPorId(juego);
  const perfecta = total > 0 && aciertos >= total;
  const nuevas = INSIGNIAS.filter((i) => insigniasNuevas.includes(i.id));

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center">
      {perfecta && <Confeti />}
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Resultado — {info.titulo}
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        {perfecta
          ? "¡Partida perfecta!"
          : aciertos > 0
            ? "¡Buen trabajo!"
            : "Partida terminada"}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-neutral-700 dark:text-white/85">
        Acertaste <strong>{aciertos}</strong> de <strong>{total}</strong> y
        sumaste <strong>{puntos} puntos</strong>
        {perfecta ? " (incluye +5 de bonus por partida perfecta)" : ""}.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
        Tu nivel actual es <strong>Nivel {nivel}</strong>. Cada 100 puntos
        subís un nivel.
      </p>

      <p
        role="status"
        className="mx-auto mt-5 max-w-xl rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-4 text-sm leading-relaxed text-neutral-700 dark:text-white/85"
      >
        {TEXTO_GUARDADO[guardado]}
      </p>

      <section
        aria-label="Insignias ganadas en esta partida"
        className="mt-8 rounded-2xl border-2 border-rio/20 bg-white p-5 text-left dark:border-white/10 dark:bg-noche-claro"
      >
        <h2 className="font-display text-xl font-bold text-noche dark:text-white">
          Insignias
        </h2>
        {nuevas.length === 0 ? (
          <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            En esta partida no ganaste una insignia nueva. Seguí jugando:
            con al menos el 80% de aciertos en un juego, o con 100 puntos
            en total, se desbloquean.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {nuevas.map((ins) => (
              <li
                key={ins.id}
                className="rounded-xl bg-sol/15 px-4 py-3 dark:bg-sol/10"
              >
                <p className="font-display font-bold text-noche dark:text-sol">
                  {ins.nombre}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                  {ins.descripcion}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRepetir}
          className="rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
        >
          Jugar de nuevo
        </button>
        <Link
          href="/juegos"
          className="rounded-full border-2 border-selva px-6 py-3 text-center font-display font-bold text-selva transition-transform hover:scale-105 dark:border-sol dark:text-sol"
        >
          Ver todos los juegos
        </Link>
        <Link
          href="/progreso"
          className="rounded-full border-2 border-rio px-6 py-3 text-center font-display font-bold text-rio-oscuro transition-transform hover:scale-105 dark:border-rio-claro dark:text-rio-claro"
        >
          Ver Mi progreso
        </Link>
      </div>
    </div>
  );
}
