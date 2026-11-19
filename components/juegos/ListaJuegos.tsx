"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import IconoJuego from "./IconoJuego";
import {
  JUEGOS,
  leerProgresoLocal,
  nivelDesdePuntos,
  puntosTotalesLocal,
  type ProgresoLocal,
} from "@/lib/juegos";

/**
 * Tarjetas de los 6 juegos con mejor puntaje local y nivel global.
 * El progreso local se lee solo en el cliente (localStorage no existe
 * en el servidor); en el primer render se muestra sin puntajes.
 */
export default function ListaJuegos() {
  const [progreso, setProgreso] = useState<ProgresoLocal | null>(null);

  useEffect(() => {
    setProgreso(leerProgresoLocal());
  }, []);

  const puntosTotales = progreso ? puntosTotalesLocal(progreso) : 0;
  const nivel = nivelDesdePuntos(puntosTotales);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-rio">
        Juegos de conocimiento útil
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Aprendé jugando
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-neutral-700 dark:text-white/85">
        Seis juegos sobre el Madidi, el dinero, las noticias, los primeros
        auxilios, el mapa de Bolivia y las estrellas. Cada acierto suma 10
        puntos y una partida perfecta suma 5 de bonus. Tus puntos y tus
        insignias son solo tuyos: no hay ranking público.
      </p>

      <p
        role="status"
        className="mt-6 inline-block rounded-full bg-selva px-5 py-2 font-display font-bold text-white dark:bg-sol dark:text-noche"
      >
        Nivel {nivel} · {puntosTotales} puntos en total
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {JUEGOS.map((juego) => {
          const local = progreso?.juegos[juego.id];
          return (
            <li
              key={juego.id}
              className="flex flex-col rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-noche-claro"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rio/15 text-rio dark:bg-rio-claro/20 dark:text-rio-claro">
                <IconoJuego icono={juego.icono} className="h-8 w-8" />
              </span>
              <h2 className="mt-4 font-display text-xl font-extrabold text-noche dark:text-white">
                {juego.titulo}
              </h2>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-white/75">
                {juego.descripcion}
              </p>
              <p className="mt-3 text-sm font-bold text-neutral-700 dark:text-white/85">
                {local
                  ? `Mejor puntaje: ${local.mejorPuntaje} puntos · ${local.partidas} ${local.partidas === 1 ? "partida jugada" : "partidas jugadas"}`
                  : "Todavía no lo jugaste"}
              </p>
              <Link
                href={juego.ruta}
                aria-label={`Jugar ${juego.titulo}`}
                className="mt-4 rounded-full bg-selva px-6 py-3 text-center font-display font-bold text-white transition-transform hover:scale-[1.02] dark:bg-sol dark:text-noche"
              >
                {local ? "Jugar de nuevo" : "Jugar"}
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-center text-sm leading-relaxed text-neutral-600 dark:text-white/75">
        ¿Querés ver tus puntos, tu nivel y tus insignias?{" "}
        <Link
          href="/progreso"
          className="font-bold text-rio underline-offset-2 hover:underline dark:text-rio-claro"
        >
          Mirá Mi progreso
        </Link>
        .
      </p>
    </div>
  );
}
