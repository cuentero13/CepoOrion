"use client";

import { useEffect, useState } from "react";
import type { NivelHorario } from "@/lib/horarios";
import { DIAS_SEMANA, esBloqueReal } from "@/lib/horarios";

type Vista = "hoy" | "semana";

const NOMBRES_DIA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function HorariosTabla({
  niveles,
  esEjemplo,
  aviso,
}: {
  niveles: NivelHorario[];
  esEjemplo: boolean;
  aviso?: string;
}) {
  const [vista, setVista] = useState<Vista>("semana");
  const [nivelIdx, setNivelIdx] = useState(0);
  // El día actual se calcula solo en el cliente para evitar
  // diferencias de hidratación entre servidor y navegador.
  const [diaHoy, setDiaHoy] = useState<number | null>(null);

  useEffect(() => {
    setDiaHoy(new Date().getDay());
  }, []);

  const nivel = niveles[Math.min(nivelIdx, niveles.length - 1)];
  const dias = nivel.dias.filter((d) =>
    (DIAS_SEMANA as readonly string[]).includes(d.dia),
  );

  const nombreHoy =
    diaHoy !== null ? NOMBRES_DIA[diaHoy] : null;
  const esFinDeSemana = diaHoy === 0 || diaHoy === 6;
  const diaDeHoy = dias.find((d) => d.dia === nombreHoy);

  const mostrarDocente = dias.some((d) =>
    d.bloques.some((b) => b.docente && esBloqueReal({ ...b, materia: b.docente })),
  );

  const tablaDia = (dia: (typeof dias)[number], key: string) => {
    const bloquesReales = dia.bloques.filter((b) => esBloqueReal(b));
    return (
      <article
        key={key}
        className="min-w-0 rounded-3xl border-2 border-rio/20 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-noche-claro"
      >
        <h2 className="font-display text-xl font-bold text-noche dark:text-white">
          {dia.dia}
        </h2>
        {bloquesReales.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/75">
            Sin bloques publicados para este día.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="mt-3 w-full min-w-80 border-collapse text-sm">
            <caption className="sr-only">
              Horario del {dia.dia}
              {esEjemplo ? " (ejemplo, no es el horario real)" : ""}
            </caption>
            <thead>
              <tr className="border-b-2 border-rio/30 text-left">
                <th scope="col" className="py-2 pr-2 font-bold text-selva dark:text-sol">
                  Hora
                </th>
                <th scope="col" className="py-2 font-bold text-selva dark:text-sol">
                  Materia
                </th>
                {mostrarDocente && (
                  <th scope="col" className="py-2 pl-2 font-bold text-selva dark:text-sol">
                    Docente
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {bloquesReales.map((b, i) => (
                <tr
                  key={`${b.hora}-${b.materia}-${i}`}
                  className="border-b border-rio/10 last:border-0"
                >
                  <td className="py-2 pr-2 font-bold whitespace-nowrap">
                    {b.hora}
                  </td>
                  <td className="py-2">{b.materia}</td>
                  {mostrarDocente && (
                    <td className="py-2 pl-2">{b.docente ?? "—"}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </article>
    );
  };

  return (
    <div>
      {aviso && (
        <p
          role="note"
          className="rounded-2xl border-2 border-dashed border-tierra bg-tierra/10 p-4 text-sm leading-relaxed font-bold text-neutral-800 dark:text-white/90"
        >
          ⚠️ {aviso}
        </p>
      )}

      {/* Selector de nivel */}
      {niveles.length > 1 && (
        <div
          className="mt-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Elegir nivel"
        >
          {niveles.map((n, i) => (
            <button
              key={n.nivel}
              type="button"
              onClick={() => setNivelIdx(i)}
              aria-pressed={i === nivelIdx}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                i === nivelIdx
                  ? "bg-selva text-white dark:bg-sol dark:text-noche"
                  : "border-2 border-selva text-selva hover:bg-selva/10 dark:border-sol dark:text-sol"
              }`}
            >
              {n.nivel}
            </button>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-neutral-600 dark:text-white/75">
        Nivel: <strong className="text-noche dark:text-white">{nivel.nivel}</strong>
        {" · "}Turno:{" "}
        <strong className="text-noche dark:text-white">{nivel.turno}</strong>
      </p>

      {/* Selector de vista */}
      <div
        className="mt-4 inline-flex rounded-full border-2 border-rio p-1"
        role="group"
        aria-label="Vista de horarios"
      >
        <button
          type="button"
          onClick={() => setVista("hoy")}
          aria-pressed={vista === "hoy"}
          className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
            vista === "hoy"
              ? "bg-rio-oscuro text-white dark:bg-rio-claro dark:text-noche"
              : "text-rio-oscuro hover:bg-rio/10 dark:text-rio-claro"
          }`}
        >
          Hoy
        </button>
        <button
          type="button"
          onClick={() => setVista("semana")}
          aria-pressed={vista === "semana"}
          className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
            vista === "semana"
              ? "bg-rio-oscuro text-white dark:bg-rio-claro dark:text-noche"
              : "text-rio-oscuro hover:bg-rio/10 dark:text-rio-claro"
          }`}
        >
          Semana
        </button>
      </div>

      {vista === "hoy" ? (
        <div className="mt-6">
          {diaHoy === null ? (
            <p className="text-sm text-neutral-600 dark:text-white/75">
              Cargando el día de hoy…
            </p>
          ) : esFinDeSemana ? (
            <p className="rounded-2xl border-2 border-sol/60 bg-white p-4 text-sm leading-relaxed dark:bg-noche-claro">
              Hoy es <strong>{nombreHoy}</strong>: fin de semana, sin clases
              programadas.
            </p>
          ) : diaDeHoy ? (
            tablaDia(diaDeHoy, "hoy")
          ) : (
            <p className="text-sm text-neutral-600 dark:text-white/75">
              No hay horario publicado para hoy ({nombreHoy}).
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dias.map((d) => tablaDia(d, d.dia))}
        </div>
      )}
    </div>
  );
}
