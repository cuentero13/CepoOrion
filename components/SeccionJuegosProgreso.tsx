"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  INSIGNIAS,
  JUEGOS,
  insigniaPorId,
  leerProgresoLocal,
  nivelDesdePuntos,
  puntosTotalesLocal,
  type ProgresoLocal,
} from "@/lib/juegos";

export type JuegoServidor = {
  juego: string;
  puntos: number;
  insignias: unknown;
  nivel: number;
};

type FilaJuego = {
  id: string;
  titulo: string;
  puntos: number;
  nivel: number;
};

/**
 * Sección de juegos de Mi progreso: puntos totales, nivel global,
 * insignias (con nombre y descripción) y puntos por juego.
 *
 * Fuente de datos: las filas de `progreso_juegos` que el servidor
 * leyó de Supabase (cuando hay sesión) y, en caso contrario, el
 * progreso guardado en localStorage. La lectura local ocurre solo en
 * el cliente: en el primer render (servidor) se muestra el estado
 * vacío sin romper el render.
 */
export default function SeccionJuegosProgreso({
  juegosServidor,
}: {
  juegosServidor?: JuegoServidor[];
}) {
  const [local, setLocal] = useState<ProgresoLocal | null>(null);

  useEffect(() => {
    setLocal(leerProgresoLocal());
  }, []);

  const usaServidor = (juegosServidor?.length ?? 0) > 0;

  let filas: FilaJuego[];
  let puntosTotales = 0;
  let insigniasIds: string[] = [];

  if (usaServidor) {
    filas = JUEGOS.map((j) => {
      const fila = juegosServidor!.find((s) => s.juego === j.id);
      return {
        id: j.id,
        titulo: j.titulo,
        puntos: fila?.puntos ?? 0,
        nivel: fila?.nivel ?? 1,
      };
    });
    puntosTotales = juegosServidor!.reduce((s, f) => s + (f.puntos ?? 0), 0);
    for (const f of juegosServidor!) {
      if (Array.isArray(f.insignias)) {
        for (const ins of f.insignias) {
          if (typeof ins === "string" && !insigniasIds.includes(ins)) {
            insigniasIds.push(ins);
          }
        }
      }
    }
  } else if (local) {
    filas = JUEGOS.map((j) => {
      const p = local.juegos[j.id];
      return {
        id: j.id,
        titulo: j.titulo,
        puntos: p?.puntos ?? 0,
        nivel: nivelDesdePuntos(p?.puntos ?? 0),
      };
    });
    puntosTotales = puntosTotalesLocal(local);
    for (const j of JUEGOS) {
      for (const ins of local.juegos[j.id]?.insignias ?? []) {
        if (!insigniasIds.includes(ins)) insigniasIds.push(ins);
      }
    }
  } else {
    filas = JUEGOS.map((j) => ({
      id: j.id,
      titulo: j.titulo,
      puntos: 0,
      nivel: 1,
    }));
  }

  const nivelGlobal = nivelDesdePuntos(puntosTotales);
  const insignias = insigniasIds
    .map((id) => insigniaPorId(id))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));
  const jugados = filas.filter((f) => f.puntos > 0).length;

  return (
    <section
      aria-label="Mis juegos"
      className="rounded-2xl border border-rio/30 bg-white p-5 shadow-sm sm:p-6 dark:border-rio-claro/30 dark:bg-noche-claro"
    >
      <h2 className="font-display text-xl font-extrabold text-selva dark:text-sol">
        Mis juegos
      </h2>
      <div className="mt-3">
        {jugados === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-sol bg-sol/10 px-4 py-3 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            Aún no jugaste. Empezá por{" "}
            <Link
              href="/juegos"
              className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
            >
              los juegos
            </Link>{" "}
            y acá vas a ver tus puntos, tu nivel y tus insignias.
          </p>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-white/85">
              <strong className="text-noche dark:text-white">
                Nivel {nivelGlobal} · {puntosTotales} puntos en total
              </strong>{" "}
              ({jugados} de {JUEGOS.length} juegos jugados). Cada 100 puntos
              subís un nivel. Tus puntos son solo tuyos: no hay ranking
              público.
            </p>

            <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-selva dark:text-rio-claro">
              Puntos por juego
            </h3>
            <ul className="mt-2 flex flex-col gap-2">
              {filas.map((f) => (
                <li
                  key={f.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rio/20 px-4 py-3"
                >
                  <span className="font-bold text-noche dark:text-white">
                    {f.titulo}
                  </span>
                  <span className="text-sm text-neutral-600 dark:text-white/75">
                    {f.puntos > 0
                      ? `Nivel ${f.nivel} · ${f.puntos} puntos`
                      : "Sin jugar todavía"}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-selva dark:text-rio-claro">
              Insignias ({insignias.length} de {INSIGNIAS.length})
            </h3>
            {insignias.length === 0 ? (
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/75">
                Todavía no ganaste insignias. Con al menos el 80% de
                aciertos en un juego, o con 100 puntos en total, se
                desbloquean.
              </p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {insignias.map((ins) => (
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
          </>
        )}
      </div>
    </section>
  );
}
