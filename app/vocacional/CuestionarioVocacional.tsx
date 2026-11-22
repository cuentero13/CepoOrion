"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AVISO_VOCACIONAL,
  CLAVE_PERFIL_LOCAL,
  calcularPerfilVocacional,
  type PerfilVocacional,
} from "@/lib/vocacional";

export type ItemVocacional = {
  id: string;
  texto: string;
};

export type DimensionVocacional = {
  id: string;
  nombre: string;
  descripcion: string;
  items: ItemVocacional[];
};

export type BandaInterpretacion = {
  min: number;
  max: number;
  titulo: string;
  texto: string;
};

export type DatosVocacional = {
  nota: string;
  instrumentos_referencia: string[];
  aviso: string;
  escala: { valor: number; etiqueta: string }[];
  dimensiones: DimensionVocacional[];
  interpretacion: { bandas: BandaInterpretacion[] };
};

type EstadoGuardado = "pendiente" | "guardado" | "sin_sesion" | "sin_supabase" | "error";

const TEXTO_GUARDADO: Record<EstadoGuardado, string> = {
  pendiente: "Guardando tu resultado…",
  guardado: "Resultado guardado en tu cuenta. Lo vas a ver en Mi progreso.",
  sin_sesion:
    "Tu resultado no quedó guardado: entrá con tu cuenta para guardar tu perfil vocacional en Mi progreso.",
  sin_supabase:
    "La base de datos del colegio todavía no está configurada: tu resultado se muestra solo en pantalla.",
  error: "No se pudo guardar el resultado ahora mismo. Tu resultado igual queda en esta pantalla.",
};

function bandaPara(
  promedio: number,
  bandas: BandaInterpretacion[]
): BandaInterpretacion | null {
  return (
    bandas.find((b) => promedio >= b.min && promedio <= b.max) ?? null
  );
}

/**
 * Cuestionario vocacional (modelo RIASEC de Holland, 18 ítems Likert
 * 1–5). Herramienta ORIENTATIVA: mide intereses, no capacidad, y no es
 * un test psicológico. Las carreras sugeridas aparecen en el resumen del
 * diagnóstico y en Mi progreso, cuando el diagnóstico de las 6 áreas +
 * lógica está completo.
 */
export default function CuestionarioVocacional({
  datos,
  supabaseConfigurado,
}: {
  datos: DatosVocacional;
  supabaseConfigurado: boolean;
}) {
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [enviado, setEnviado] = useState(false);
  const [guardado, setGuardado] = useState<EstadoGuardado>("pendiente");
  const [error, setError] = useState("");

  const todosLosItems = useMemo(
    () => datos.dimensiones.flatMap((d) => d.items),
    [datos]
  );
  const respondidos = Object.keys(respuestas).length;
  const total = todosLosItems.length;
  const completo = respondidos === total;

  const perfil: PerfilVocacional | null = useMemo(() => {
    if (!enviado) return null;
    const promedios: Record<string, number> = {};
    for (const dim of datos.dimensiones) {
      const valores = dim.items.map((item) => respuestas[item.id] ?? 3);
      promedios[dim.id] =
        Math.round(
          (valores.reduce((s, v) => s + v, 0) / valores.length) * 100
        ) / 100;
    }
    return calcularPerfilVocacional(promedios);
  }, [enviado, respuestas, datos]);

  async function guardar(perfilVocacional: PerfilVocacional) {
    // El perfil también queda en el navegador: el resumen del
    // diagnóstico lo lee para mostrar tus posibles carreras.
    try {
      localStorage.setItem(
        CLAVE_PERFIL_LOCAL,
        JSON.stringify({
          dimensiones: perfilVocacional.dimensiones,
          top2: perfilVocacional.top2,
          fecha: new Date().toISOString(),
        })
      );
    } catch {
      // Sin almacenamiento local, el resultado igual se muestra.
    }
    if (!supabaseConfigurado) {
      setGuardado("sin_supabase");
      return;
    }
    try {
      const respuesta = await fetch("/api/vocacional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dimensiones: perfilVocacional.dimensiones,
          perfil_top2: perfilVocacional.top2,
        }),
      });
      const datosResp = (await respuesta.json()) as {
        ok?: boolean;
        guardado?: boolean;
        motivo?: string;
      };
      if (!respuesta.ok || !datosResp.ok) {
        setGuardado("error");
        return;
      }
      if (datosResp.guardado) setGuardado("guardado");
      else if (datosResp.motivo === "sin_sesion") setGuardado("sin_sesion");
      else if (datosResp.motivo === "sin_supabase")
        setGuardado("sin_supabase");
      else setGuardado("error");
    } catch {
      setGuardado("error");
    }
  }

  function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!completo) {
      setError(
        `Respondé todas las frases para ver tu resultado (llevás ${respondidos} de ${total}).`
      );
      return;
    }
    setError("");
    const promedios: Record<string, number> = {};
    for (const dim of datos.dimensiones) {
      const valores = dim.items.map((item) => respuestas[item.id] ?? 3);
      promedios[dim.id] =
        Math.round(
          (valores.reduce((s, v) => s + v, 0) / valores.length) * 100
        ) / 100;
    }
    const perfilVocacional = calcularPerfilVocacional(promedios);
    setEnviado(true);
    void guardar(perfilVocacional);
  }

  function reiniciar() {
    setRespuestas({});
    setEnviado(false);
    setGuardado("pendiente");
    setError("");
    try {
      localStorage.removeItem(CLAVE_PERFIL_LOCAL);
    } catch {
      // Sin almacenamiento local, no hay nada que borrar.
    }
  }

  // ---------- Resultados ----------
  if (enviado && perfil) {
    const top2 = perfil.top2;
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
          Tu cuestionario vocacional
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
          Esto es lo que te interesa hoy
        </h1>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
          Tus dos intereses más fuertes son{" "}
          <strong className="text-selva dark:text-sol">
            {datos.dimensiones.find((d) => d.id === top2[0])?.nombre ??
              top2[0]}
          </strong>{" "}
          y{" "}
          <strong className="text-selva dark:text-sol">
            {datos.dimensiones.find((d) => d.id === top2[1])?.nombre ??
              top2[1]}
          </strong>
          . Esto muestra qué te gusta hacer, no qué carrera tenés que
          estudiar: es un punto de partida para averiguar más.
        </p>
        <p
          role="status"
          className="mt-4 rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-4 text-sm leading-relaxed text-neutral-700 dark:text-white/85"
        >
          {TEXTO_GUARDADO[guardado]}
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {datos.dimensiones.map((dim) => {
            const promedio = perfil.dimensiones[dim.id] ?? 0;
            const banda = bandaPara(promedio, datos.interpretacion.bandas);
            const esTop = top2.some((t) => t === dim.id);
            return (
              <section
                key={dim.id}
                aria-label={dim.nombre}
                className="rounded-2xl border-2 border-rio/20 bg-white p-5 dark:border-white/10 dark:bg-noche-claro"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-bold text-noche dark:text-white">
                    {dim.nombre}
                    {esTop && (
                      <span className="ml-2 rounded-full bg-sol/25 px-2 py-0.5 text-xs font-bold text-tierra-oscuro dark:text-sol">
                        Uno de tus intereses más fuertes
                      </span>
                    )}
                  </h2>
                  <span className="rounded-full bg-rio/15 px-3 py-1 text-sm font-bold text-rio-oscuro dark:text-rio-claro">
                    {promedio.toFixed(1)} de 5
                    {banda ? ` · ${banda.titulo}` : ""}
                  </span>
                </div>
                <div
                  className="mt-3 h-3 overflow-hidden rounded-full bg-rio/20"
                  role="progressbar"
                  aria-valuenow={Math.round((promedio / 5) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${dim.nombre}: ${promedio.toFixed(1)} de 5`}
                >
                  <div
                    className="h-full rounded-full bg-rio"
                    style={{ width: `${(promedio / 5) * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                  {dim.descripcion}
                </p>
                {banda && (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                    <strong className="text-selva dark:text-sol">
                      {banda.titulo}:
                    </strong>{" "}
                    {banda.texto}
                  </p>
                )}
              </section>
            );
          })}
        </div>

        <section
          aria-label="Qué sigue"
          className="mt-8 rounded-2xl border-2 border-sol/60 bg-sol/10 p-5"
        >
          <h2 className="font-display text-xl font-bold text-noche dark:text-white">
            ¿Y qué carreras combinan con esto?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            Completá el diagnóstico de las 6 áreas y el reto de lógica
            matemática, y en el resumen vas a ver qué familias de carreras
            combinan con tus intereses y tus fortalezas. También podés
            explorar las opciones en{" "}
            <Link
              href="/futuro"
              className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
            >
              Tu futuro
            </Link>
            .
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            {AVISO_VOCACIONAL}
          </p>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reiniciar}
            className="rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
          >
            Hacerlo de nuevo
          </button>
          <Link
            href="/diagnostico"
            className="rounded-full border-2 border-selva px-6 py-3 text-center font-display font-bold text-selva transition-transform hover:scale-105 dark:border-sol dark:text-sol"
          >
            Hacer el diagnóstico
          </Link>
          <Link
            href="/futuro"
            className="rounded-full border-2 border-selva px-6 py-3 text-center font-display font-bold text-selva transition-transform hover:scale-105 dark:border-sol dark:text-sol"
          >
            Ver Tu futuro
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Cuestionario ----------
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Cuestionario vocacional
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        ¿Qué te gusta hacer?
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
        Son {total} frases sobre lo que te gusta hacer. Respondé con
        sinceridad: no hay respuestas correctas ni incorrectas. Al final vas
        a ver tus intereses más fuertes, y si completás el diagnóstico, qué
        carreras combinan con vos.
      </p>
      <p
        role="note"
        className="mt-4 rounded-2xl border-2 border-sol bg-sol/10 p-4 text-sm leading-relaxed text-neutral-700 dark:text-white/85"
      >
        <strong>{datos.aviso}</strong>
      </p>
      <p className="mt-4 text-sm font-bold text-neutral-700 dark:text-white/85">
        Respondiste {respondidos} de {total}
      </p>
      <div
        className="mt-2 h-3 overflow-hidden rounded-full bg-rio/20"
        role="progressbar"
        aria-valuenow={respondidos}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Avance del cuestionario"
      >
        <div
          className="h-full rounded-full bg-rio transition-all"
          style={{ width: `${total > 0 ? (respondidos / total) * 100 : 0}%` }}
        />
      </div>

      <form onSubmit={enviar} className="mt-8 space-y-8">
        {datos.dimensiones.map((dim) => (
          <fieldset
            key={dim.id}
            className="rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-noche-claro"
          >
            <legend className="font-display text-xl font-bold text-tierra-oscuro dark:text-sol">
              {dim.nombre}
            </legend>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-white/75">
              {dim.descripcion}
            </p>
            <div className="mt-4 flex flex-col gap-5">
              {dim.items.map((item) => (
                <div key={item.id}>
                  <p
                    id={`etiqueta-${item.id}`}
                    className="font-bold leading-relaxed text-noche dark:text-white"
                  >
                    {item.texto}
                  </p>
                  <div
                    role="radiogroup"
                    aria-labelledby={`etiqueta-${item.id}`}
                    className="mt-2 flex flex-wrap gap-2"
                  >
                    {datos.escala.map((op) => {
                      const activo = respuestas[item.id] === op.valor;
                      return (
                        <label
                          key={op.valor}
                          className={`cursor-pointer rounded-full border-2 px-3 py-1.5 text-sm font-bold transition-colors ${
                            activo
                              ? "border-selva bg-selva text-white dark:border-sol dark:bg-sol dark:text-noche"
                              : "border-rio/30 text-noche hover:border-selva dark:border-white/20 dark:text-white dark:hover:border-sol"
                          }`}
                        >
                          <input
                            type="radio"
                            name={item.id}
                            value={op.valor}
                            checked={activo}
                            onChange={() =>
                              setRespuestas((prev) => ({
                                ...prev,
                                [item.id]: op.valor,
                              }))
                            }
                            className="sr-only"
                          />
                          {op.valor} · {op.etiqueta}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        ))}

        {error && (
          <p
            role="alert"
            className="rounded-2xl border-2 border-achiote/50 bg-achiote/10 p-3 text-sm font-bold text-achiote dark:text-achiote-claro"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!completo}
          className="w-full rounded-full bg-selva px-6 py-3 font-display text-lg font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sol dark:text-noche"
        >
          {completo
            ? "Ver mi resultado"
            : `Respondé las ${total - respondidos} frases que faltan`}
        </button>
      </form>

      <p className="mt-6 text-center text-sm leading-relaxed text-neutral-600 dark:text-white/75">
        Basado en el modelo RIASEC de Holland:{" "}
        {datos.instrumentos_referencia.join("; ")} (ítems adaptados al
        contexto de Ixiamas por el equipo CEPO).
      </p>
    </div>
  );
}
