"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type ItemActitud = {
  id: string;
  texto: string;
  invertida: boolean;
};

export type DimensionActitud = {
  id: string;
  nombre: string;
  descripcion: string;
  items: ItemActitud[];
};

export type BandaInterpretacion = {
  min: number;
  max: number;
  titulo: string;
  texto: string;
};

export type DatosActitudes = {
  nota: string;
  instrumentos_referencia: string[];
  aviso: string;
  escala: { valor: number; etiqueta: string }[];
  dimensiones: DimensionActitud[];
  interpretacion: { bandas: BandaInterpretacion[] };
  sugerencias: Record<string, string[]>;
};

type EstadoGuardado = "pendiente" | "guardado" | "sin_sesion" | "sin_supabase" | "error";

const TEXTO_GUARDADO: Record<EstadoGuardado, string> = {
  pendiente: "Guardando tu resultado…",
  guardado: "Resultado guardado en tu cuenta. Lo vas a ver en Mi progreso.",
  sin_sesion:
    "Tu resultado no quedó guardado: entrá con tu cuenta para guardar tus cuestionarios en Mi progreso.",
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
 * Cuestionario de actitudes y hábitos de estudio (escala Likert 1–5).
 * Herramienta ORIENTATIVA: no es un diagnóstico psicológico. Los
 * resultados se expresan en lenguaje positivo, sin etiquetas negativas.
 */
export default function CuestionarioActitudes({
  datos,
  supabaseConfigurado,
}: {
  datos: DatosActitudes;
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

  const promedios = useMemo(() => {
    if (!enviado) return null;
    const mapa: Record<string, number> = {};
    for (const dim of datos.dimensiones) {
      const valores = dim.items.map((item) => {
        const v = respuestas[item.id] ?? 3;
        return item.invertida ? 6 - v : v;
      });
      mapa[dim.id] =
        Math.round(
          (valores.reduce((s, v) => s + v, 0) / valores.length) * 100
        ) / 100;
    }
    return mapa;
  }, [enviado, respuestas, datos]);

  async function guardar(dimensiones: Record<string, number>) {
    if (!supabaseConfigurado) {
      setGuardado("sin_supabase");
      return;
    }
    try {
      const respuesta = await fetch("/api/actitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dimensiones }),
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
        `Respondé todas las preguntas para ver tu resultado (llevás ${respondidos} de ${total}).`
      );
      return;
    }
    setError("");
    const mapa: Record<string, number> = {};
    for (const dim of datos.dimensiones) {
      const valores = dim.items.map((item) => {
        const v = respuestas[item.id] ?? 3;
        return item.invertida ? 6 - v : v;
      });
      mapa[dim.id] =
        Math.round(
          (valores.reduce((s, v) => s + v, 0) / valores.length) * 100
        ) / 100;
    }
    setEnviado(true);
    void guardar(mapa);
  }

  function reiniciar() {
    setRespuestas({});
    setEnviado(false);
    setGuardado("pendiente");
    setError("");
  }

  // ---------- Resultados ----------
  if (enviado && promedios) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-rio">
          Tu cuestionario de actitudes y hábitos
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
          Así están tus hábitos hoy
        </h1>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
          Esto es una foto de cómo estudiás hoy, no una etiqueta: los
          hábitos se entrenan y cambian con la práctica. Leé cada dimensión
          y elegí una sugerencia para probar esta semana.
        </p>
        <p
          role="status"
          className="mt-4 rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-4 text-sm leading-relaxed text-neutral-700 dark:text-white/85"
        >
          {TEXTO_GUARDADO[guardado]}
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {datos.dimensiones.map((dim) => {
            const promedio = promedios[dim.id] ?? 0;
            const banda = bandaPara(promedio, datos.interpretacion.bandas);
            const sugerencias = datos.sugerencias[dim.id] ?? [];
            return (
              <section
                key={dim.id}
                aria-label={dim.nombre}
                className="rounded-2xl border-2 border-rio/20 bg-white p-5 dark:border-white/10 dark:bg-noche-claro"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-bold text-noche dark:text-white">
                    {dim.nombre}
                  </h2>
                  <span className="rounded-full bg-rio/15 px-3 py-1 text-sm font-bold text-rio dark:text-rio-claro">
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
                {sugerencias.length > 0 && (
                  <>
                    <h3 className="mt-4 font-display text-base font-bold text-tierra dark:text-sol">
                      Para probar esta semana
                    </h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                      {sugerencias.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reiniciar}
            className="rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
          >
            Hacerlo de nuevo
          </button>
          <Link
            href="/progreso"
            className="rounded-full border-2 border-selva px-6 py-3 text-center font-display font-bold text-selva transition-transform hover:scale-105 dark:border-sol dark:text-sol"
          >
            Ver Mi progreso
          </Link>
          <Link
            href="/diagnostico"
            className="rounded-full border-2 border-selva px-6 py-3 text-center font-display font-bold text-selva transition-transform hover:scale-105 dark:border-sol dark:text-sol"
          >
            Hacer el diagnóstico
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Cuestionario ----------
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-rio">
        Actitudes y hábitos de estudio
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        ¿Cómo estudiás?
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
        Son {total} frases sobre cómo estudiás, te organizás y pensás tu
        futuro. Respondé con sinceridad: no hay respuestas correctas ni
        incorrectas. Al final vas a ver en qué estás fuerte y qué podés
        entrenar, con sugerencias prácticas para tu vida en Ixiamas.
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
            <legend className="font-display text-xl font-bold text-tierra dark:text-sol">
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
            className="rounded-2xl border-2 border-achiote/50 bg-achiote/10 p-3 text-sm font-bold text-achiote"
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
        Basado en instrumentos reconocidos:{" "}
        {datos.instrumentos_referencia.join("; ")} (ítems adaptados al
        contexto de Ixiamas por el equipo CEPO).
      </p>
    </div>
  );
}
