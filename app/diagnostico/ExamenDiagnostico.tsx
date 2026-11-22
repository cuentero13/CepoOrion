"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GraficoRadar, { type ValorRadar } from "@/components/GraficoRadar";
import {
  AREA_LOGICA,
  AREAS,
  CONSEJO_POR_NIVEL,
  DIFICULTAD_INICIAL,
  PREGUNTAS_LOGICA,
  PREGUNTAS_POR_AREA,
  RECOMENDACION_LOGICA,
  RECOMENDACIONES_AREA,
  calcularNivelLogica,
  calcularResultadoArea,
  elegirSiguientePregunta,
  nivelGeneral,
  perfilFortalezas,
  siguienteDificultad,
  temasAReforzar,
  type Area,
  type AreaLogica,
  type Pregunta,
  type RespuestaRegistrada,
  type ResultadoArea,
} from "@/lib/diagnostico";
import {
  AVISO_VOCACIONAL,
  CLAVE_PERFIL_LOCAL,
  DIMENSIONES_RIASEC,
  mapearFamilias,
  puntajesYNiveles,
  type PerfilVocacional,
} from "@/lib/vocacional";

type Etapa = "inicio" | "preguntas" | "resultado" | "resumen";

type EstadoGuardado = "pendiente" | "guardado" | "sin_sesion" | "sin_supabase" | "error";

const TEXTO_GUARDADO: Record<EstadoGuardado, string> = {
  pendiente: "Guardando tu resultado…",
  guardado: "Resultado guardado en tu cuenta. Lo vas a ver en Mi progreso.",
  sin_sesion:
    "Tu resultado no quedó guardado: entrá con tu cuenta para guardar tus diagnósticos en Mi progreso.",
  sin_supabase:
    "La base de datos del colegio todavía no está configurada: tu resultado se muestra solo en pantalla.",
  error: "No se pudo guardar el resultado ahora mismo. Tu resultado igual queda en esta pantalla.",
};

/**
 * Examen diagnóstico adaptativo por área.
 * Cada área: 6 preguntas, dificultad inicial 2; sube con cada acierto
 * y baja con cada error. No hace falta cuenta para hacerlo; con sesión
 * y Supabase, el resultado se guarda en la tabla `diagnosticos`.
 */
export default function ExamenDiagnostico({
  banco,
  supabaseConfigurado,
}: {
  banco: Pregunta[];
  supabaseConfigurado: boolean;
}) {
  const [etapa, setEtapa] = useState<Etapa>("inicio");
  const [areaActual, setAreaActual] = useState<Area | AreaLogica | null>(null);
  // Fase h: el módulo de lógica es un flujo aparte (6 preguntas fijas).
  const [modoLogica, setModoLogica] = useState(false);
  const [resultadoLogica, setResultadoLogica] =
    useState<ResultadoArea | null>(null);
  const [resultados, setResultados] = useState<
    Partial<Record<Area, ResultadoArea>>
  >({});
  const [resultadoActual, setResultadoActual] = useState<ResultadoArea | null>(
    null
  );
  // Fase h: el perfil vocacional (si se hizo en /vocacional) queda en el
  // navegador y alimenta el bloque «Tus posibles carreras» del resumen.
  const [perfilVocacional, setPerfilVocacional] =
    useState<PerfilVocacional | null>(null);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_PERFIL_LOCAL);
      if (!guardado) return;
      const datos = JSON.parse(guardado) as {
        dimensiones?: Record<string, number>;
        top2?: string[];
      };
      if (
        datos.dimensiones &&
        Array.isArray(datos.top2) &&
        datos.top2.length === 2
      ) {
        setPerfilVocacional({
          dimensiones: datos.dimensiones,
          top2: datos.top2 as PerfilVocacional["top2"],
        });
      }
    } catch {
      // Sin perfil guardado, el resumen muestra lo que falta.
    }
  }, []);

  // Estado del área en curso.
  const [pregunta, setPregunta] = useState<Pregunta | null>(null);
  const [usadas, setUsadas] = useState<ReadonlySet<string>>(new Set());
  const [dificultad, setDificultad] = useState(DIFICULTAD_INICIAL);
  const [respuestas, setRespuestas] = useState<RespuestaRegistrada[]>([]);
  const [elegida, setElegida] = useState<number | null>(null);
  const [guardado, setGuardado] = useState<EstadoGuardado>("pendiente");

  const bancoPorArea = useMemo(() => {
    const mapa = new Map<Area, Pregunta[]>();
    for (const area of AREAS) {
      mapa.set(
        area,
        banco.filter((p) => p.area === area)
      );
    }
    return mapa;
  }, [banco]);

  // Fase h: las 6 preguntas de lógica, en orden fijo (de fácil a difícil).
  const preguntasLogica = useMemo(
    () =>
      banco
        .filter((p) => p.area === AREA_LOGICA)
        .sort((a, b) => a.nivel - b.nivel || a.id.localeCompare(b.id)),
    [banco]
  );

  function empezarArea(area: Area) {
    const preguntasArea = bancoPorArea.get(area) ?? [];
    // Fase h: en Matemática la primera pregunta es siempre de Aritmética
    // de nivel 1 (así la división aparece seguro) y al menos 2 de las 6
    // son de Aritmética de nivel 1–2 (cuota en `siguiente`).
    const primera = elegirSiguientePregunta(
      preguntasArea,
      new Set(),
      DIFICULTAD_INICIAL,
      area === "Matemática"
        ? { tema: "Aritmética", niveles: [1] }
        : undefined
    );
    if (!primera) return;
    setAreaActual(area);
    setModoLogica(false);
    setPregunta(primera);
    setUsadas(new Set([primera.id]));
    setDificultad(DIFICULTAD_INICIAL);
    setRespuestas([]);
    setElegida(null);
    setResultadoActual(null);
    setGuardado("pendiente");
    setEtapa("preguntas");
  }

  /** Fase h: empieza el reto de lógica (6 preguntas fijas, en orden). */
  function empezarLogica() {
    const primera = preguntasLogica[0];
    if (!primera) return;
    setAreaActual(AREA_LOGICA);
    setModoLogica(true);
    setPregunta(primera);
    setUsadas(new Set([primera.id]));
    setDificultad(DIFICULTAD_INICIAL);
    setRespuestas([]);
    setElegida(null);
    setResultadoActual(null);
    setGuardado("pendiente");
    setEtapa("preguntas");
  }

  async function guardarResultado(resultado: ResultadoArea) {
    if (!supabaseConfigurado) {
      setGuardado("sin_supabase");
      return;
    }
    try {
      const respuesta = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: resultado.area,
          nivel: resultado.nivel,
          puntaje: resultado.puntaje,
          respuestas: resultado.respuestas,
        }),
      });
      const datos = (await respuesta.json()) as {
        ok?: boolean;
        guardado?: boolean;
        motivo?: string;
      };
      if (!respuesta.ok || !datos.ok) {
        setGuardado("error");
        return;
      }
      if (datos.guardado) setGuardado("guardado");
      else if (datos.motivo === "sin_sesion") setGuardado("sin_sesion");
      else if (datos.motivo === "sin_supabase") setGuardado("sin_supabase");
      else setGuardado("error");
    } catch {
      setGuardado("error");
    }
  }

  function responder(indice: number) {
    if (elegida !== null || !pregunta) return;
    setElegida(indice);
  }

  function terminar(resultado: ResultadoArea) {
    if (modoLogica) {
      setResultadoLogica(resultado);
    } else if (areaActual && areaActual !== AREA_LOGICA) {
      setResultados((prev) => ({
        ...prev,
        [areaActual as Area]: resultado,
      }));
    }
    setResultadoActual(resultado);
    setEtapa("resultado");
    void guardarResultado(resultado);
  }

  function siguiente() {
    if (elegida === null || !pregunta || !areaActual) return;
    const correcta = elegida === pregunta.respuesta_correcta;
    const registro: RespuestaRegistrada = {
      preguntaId: pregunta.id,
      elegida,
      correcta,
      dificultad: pregunta.nivel,
    };
    const nuevasRespuestas = [...respuestas, registro];
    setRespuestas(nuevasRespuestas);

    const total = modoLogica ? PREGUNTAS_LOGICA : PREGUNTAS_POR_AREA;
    if (nuevasRespuestas.length >= total) {
      const resultado = modoLogica
        ? calcularNivelLogica(nuevasRespuestas)
        : calcularResultadoArea(areaActual as Area, nuevasRespuestas);
      terminar(resultado);
      return;
    }

    // Fase h (lógica): la siguiente pregunta es la siguiente de la lista
    // fija, en orden. Sin adaptativo.
    if (modoLogica) {
      const siguientePregunta = preguntasLogica[nuevasRespuestas.length];
      if (!siguientePregunta) {
        terminar(calcularNivelLogica(nuevasRespuestas));
        return;
      }
      const nuevasUsadas = new Set(usadas);
      nuevasUsadas.add(siguientePregunta.id);
      setUsadas(nuevasUsadas);
      setPregunta(siguientePregunta);
      setElegida(null);
      return;
    }

    const nuevaDificultad = siguienteDificultad(dificultad, correcta);
    const preguntasArea = bancoPorArea.get(areaActual as Area) ?? [];
    const nuevasUsadas = new Set(usadas);
    // Fase h (Matemática): cuota mínima de Aritmética. Si con las
    // preguntas que quedan ya no se llega a 2 de Aritmética, se fuerza
    // una de Aritmética de nivel 1–2.
    let siguientePregunta: Pregunta | null = null;
    if (areaActual === "Matemática") {
      const porId = new Map(preguntasArea.map((p) => [p.id, p]));
      const aritmeticaServidas = nuevasRespuestas.filter(
        (r) => porId.get(r.preguntaId)?.tema === "Aritmética"
      ).length;
      const restantes = PREGUNTAS_POR_AREA - nuevasRespuestas.length;
      if (aritmeticaServidas < 2 && restantes <= 2 - aritmeticaServidas) {
        siguientePregunta = elegirSiguientePregunta(
          preguntasArea,
          nuevasUsadas,
          nuevaDificultad,
          { tema: "Aritmética", niveles: [1, 2] }
        );
      }
    }
    if (!siguientePregunta) {
      siguientePregunta = elegirSiguientePregunta(
        preguntasArea,
        nuevasUsadas,
        nuevaDificultad
      );
    }
    if (!siguientePregunta) {
      terminar(calcularResultadoArea(areaActual as Area, nuevasRespuestas));
      return;
    }
    nuevasUsadas.add(siguientePregunta.id);
    setUsadas(nuevasUsadas);
    setDificultad(nuevaDificultad);
    setPregunta(siguientePregunta);
    setElegida(null);
  }

  const areasHechas = AREAS.filter((a) => resultados[a]);
  const puntajesHechos = areasHechas.map((a) => resultados[a]!.puntaje);

  // ---------- Resumen general ----------
  if (etapa === "resumen") {
    const valores: ValorRadar[] = AREAS.map((area) => {
      const r = resultados[area];
      return r
        ? { area, valor: r.puntaje, etiqueta: r.nivel }
        : { area, valor: 0, pendiente: true };
    });
    // Fase h: perfil, lógica y carreras.
    const perfil = perfilFortalezas(resultados);
    const faltanAreas = AREAS.length - areasHechas.length;
    const { puntajes, niveles } = puntajesYNiveles(resultados);
    const carrerasCompletas =
      areasHechas.length === AREAS.length &&
      resultadoLogica !== null &&
      perfilVocacional !== null;
    const familias = carrerasCompletas
      ? mapearFamilias(
          perfilVocacional!,
          puntajes,
          niveles,
          resultadoLogica!.nivel
        )
      : [];
    const faltaParaCarreras: string[] = [];
    if (faltanAreas > 0)
      faltaParaCarreras.push(
        `${faltanAreas} área${faltanAreas === 1 ? "" : "s"} del diagnóstico`
      );
    if (!resultadoLogica) faltaParaCarreras.push("el reto de lógica");
    if (!perfilVocacional) faltaParaCarreras.push("el cuestionario vocacional");
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
          Tu resultado general
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
          Así vas en tu diagnóstico
        </h1>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
          Nivel general:{" "}
          <strong className="text-selva dark:text-sol">
            {nivelGeneral(puntajesHechos)}
          </strong>{" "}
          ({areasHechas.length} de {AREAS.length} áreas completadas). Las áreas
          pendientes no bajan tu puntaje: aparecen en cero hasta que las
          hagas.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-white/75">
          Este diagnóstico mide lo que sabés hoy en 6 áreas del colegio. No
          es un examen de admisión ni una prueba oficial: las universidades
          tienen sus propios exámenes (PSA, curso preuniversitario).
        </p>

        <div className="mt-8">
          <GraficoRadar valores={valores} titulo="Nivel por área" />
        </div>

        {/* Fase h: Tu perfil */}
        <section
          aria-label="Tu perfil"
          className="mt-8 rounded-2xl border-2 border-rio/20 bg-white p-5 dark:border-white/10 dark:bg-noche-claro"
        >
          <h2 className="font-display text-xl font-bold text-noche dark:text-white">
            Tu perfil
          </h2>
          {faltanAreas > 0 ? (
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
              Te faltan {faltanAreas} área{faltanAreas === 1 ? "" : "s"} para
              ver tu perfil completo (llevás {areasHechas.length} de{" "}
              {AREAS.length}). Completá las áreas que faltan y acá vas a ver
              tus fortalezas y lo que hay que reforzar.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                <strong className="text-selva dark:text-sol">
                  Tus fortalezas:
                </strong>{" "}
                {perfil.fuertes
                  .map((a) => `${a} (${resultados[a]!.puntaje} de 100)`)
                  .join(" · ")}
                .
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                <strong className="text-selva dark:text-sol">
                  A reforzar:
                </strong>{" "}
                {perfil.aReforzar
                  .map((a) => `${a} (${resultados[a]!.puntaje} de 100)`)
                  .join(" · ")}
                .
              </p>
            </>
          )}
        </section>

        {/* Fase h: Lógica matemática */}
        <section
          aria-label="Tu nivel de lógica matemática"
          className="mt-8 rounded-2xl border-2 border-rio/20 bg-white p-5 dark:border-white/10 dark:bg-noche-claro"
        >
          <h2 className="font-display text-xl font-bold text-noche dark:text-white">
            Lógica matemática
          </h2>
          {resultadoLogica ? (
            <>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                Nivel{" "}
                <strong className="text-selva dark:text-sol">
                  {resultadoLogica.nivel}
                </strong>{" "}
                ({resultadoLogica.correctas} de {resultadoLogica.total}{" "}
                correctas, {resultadoLogica.puntaje} de 100). Estas preguntas
                son parecidas a las de razonamiento lógico-matemático del
                examen de las Escuelas de Maestros.
              </p>
              <div
                className="mt-3 h-3 overflow-hidden rounded-full bg-rio/20"
                role="progressbar"
                aria-valuenow={resultadoLogica.puntaje}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Lógica matemática: ${resultadoLogica.puntaje} de 100`}
              >
                <div
                  className="h-full rounded-full bg-rio"
                  style={{ width: `${resultadoLogica.puntaje}%` }}
                />
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
              Todavía no hiciste el reto de lógica: 6 preguntas cortas de
              razonamiento (series, orden, edades).{" "}
              <button
                type="button"
                onClick={empezarLogica}
                className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
              >
                Hacer el reto de lógica →
              </button>
            </p>
          )}
        </section>

        {/* Fase h: Tus posibles carreras */}
        <section
          aria-label="Tus posibles carreras"
          className="mt-8 rounded-2xl border-2 border-rio/20 bg-white p-5 dark:border-white/10 dark:bg-noche-claro"
        >
          <h2 className="font-display text-xl font-bold text-noche dark:text-white">
            Tus posibles carreras
          </h2>
          {carrerasCompletas ? (
            familias.length > 0 ? (
              <>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                  Según lo que sabés hoy y lo que te interesa hoy, estas
                  familias de carreras combinan con vos. No es una decisión:
                  es un punto de partida para averiguar más.
                </p>
                <ul className="mt-4 flex flex-col gap-4">
                  {familias.map((f) => (
                    <li
                      key={f.id}
                      className="rounded-xl border border-rio/20 p-4"
                    >
                      <p className="font-display text-lg font-bold text-noche dark:text-white">
                        {f.nombre}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                        {f.descripcion}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                        <strong className="text-selva dark:text-sol">
                          Carreras:
                        </strong>{" "}
                        {f.carreras.join(", ")}.
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                        <strong className="text-selva dark:text-sol">
                          Dónde:
                        </strong>{" "}
                        {f.vias.join(" · ")}.
                      </p>
                      {f.advertencia && (
                        <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                          {f.advertencia}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                  ¿No te podés mudar de Ixiamas? Mirá las carreras 100%
                  virtuales en{" "}
                  <Link
                    href="/futuro"
                    className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
                  >
                    Tu futuro →
                  </Link>
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                Tu perfil todavía está en construcción: reforzá tus áreas más
                bajas y repetí el diagnóstico. Tus intereses vocacionales
                solos son:{" "}
                {perfilVocacional!.top2
                  .map(
                    (id) =>
                      DIMENSIONES_RIASEC.find((d) => d.id === id)?.nombre ?? id
                  )
                  .join(" y ")}
                .
              </p>
            )
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
              Para ver qué carreras combinan con vos te falta:{" "}
              {faltaParaCarreras.join(", ")}.{" "}
              {faltaParaCarreras.includes("el cuestionario vocacional") && (
                <Link
                  href="/vocacional"
                  className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
                >
                  Hacer el cuestionario vocacional →
                </Link>
              )}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            {AVISO_VOCACIONAL}
          </p>
        </section>

        <div className="mt-8 flex flex-col gap-5">
          {areasHechas.map((area) => {
            const r = resultados[area]!;
            const rec = RECOMENDACIONES_AREA[area];
            return (
              <section
                key={area}
                aria-label={`Recomendaciones de ${area}`}
                className="rounded-2xl border-2 border-rio/20 bg-white p-5 dark:border-white/10 dark:bg-noche-claro"
              >
                <h2 className="font-display text-xl font-bold text-noche dark:text-white">
                  {area} — Nivel {r.nivel}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                  {rec.descripcion}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                  {rec.consejos.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                  {CONSEJO_POR_NIVEL[r.nivel]}
                </p>
              </section>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setEtapa("inicio")}
            className="rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
          >
            Seguir con otra área
          </button>
          <Link
            href="/progreso"
            className="rounded-full border-2 border-selva px-6 py-3 text-center font-display font-bold text-selva transition-transform hover:scale-105 dark:border-sol dark:text-sol"
          >
            Ver Mi progreso
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Resultado de un área ----------
  if (etapa === "resultado" && resultadoActual) {
    const r = resultadoActual;
    // Fase h: la revisión de lógica usa su lista fija, no el banco por área.
    const preguntasArea =
      r.area === AREA_LOGICA
        ? preguntasLogica
        : (bancoPorArea.get(r.area as Area) ?? []);
    const porId = new Map(preguntasArea.map((p) => [p.id, p]));
    const rec =
      r.area === AREA_LOGICA
        ? RECOMENDACION_LOGICA
        : RECOMENDACIONES_AREA[r.area as Area];
    // Fase h: temas con 0 aciertos (en Matemática incluye «División» si
    // falló una pregunta de división).
    const temas = temasAReforzar(banco, r.respuestas);
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
          Resultado — {r.area}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
          Nivel {r.nivel}
        </h1>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
          Respondiste bien {r.correctas} de {r.total} preguntas ({r.puntaje}{" "}
          de 100). {CONSEJO_POR_NIVEL[r.nivel]}
        </p>
        <p
          role="status"
          className="mt-4 rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-4 text-sm leading-relaxed text-neutral-700 dark:text-white/85"
        >
          {TEXTO_GUARDADO[guardado]}
        </p>

        <section
          aria-label="Recomendaciones de estudio"
          className="mt-6 rounded-2xl border-2 border-rio/20 bg-white p-5 dark:border-white/10 dark:bg-noche-claro"
        >
          <h2 className="font-display text-xl font-bold text-noche dark:text-white">
            Para seguir aprendiendo {r.area}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            {rec.descripcion}
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            {rec.consejos.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>

        {temas.length > 0 && (
          <section
            aria-label="Temas a reforzar"
            className="mt-6 rounded-2xl border-2 border-achiote/40 bg-achiote/5 p-5 dark:border-achiote/60"
          >
            <h2 className="font-display text-xl font-bold text-noche dark:text-white">
              Temas a reforzar
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
              En estas preguntas no acertaste ninguna:{" "}
              <strong className="text-achiote dark:text-achiote-claro">
                {temas.join(" · ")}
              </strong>
              . Empezá por ahí cuando repases.
            </p>
          </section>
        )}

        <section aria-label="Revisión de tus respuestas" className="mt-8">
          <h2 className="font-display text-xl font-bold text-noche dark:text-white">
            Revisá tus respuestas
          </h2>
          <ol className="mt-4 flex flex-col gap-4">
            {r.respuestas.map((resp, i) => {
              const p = porId.get(resp.preguntaId);
              if (!p) return null;
              return (
                <li
                  key={resp.preguntaId}
                  className="rounded-2xl border-2 border-rio/20 bg-white p-4 dark:border-white/10 dark:bg-noche-claro"
                >
                  <p className="font-bold text-noche dark:text-white">
                    {i + 1}. {p.pregunta}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    <span
                      className={
                        resp.correcta
                          ? "font-bold text-selva dark:text-sol"
                          : "font-bold text-achiote dark:text-achiote-claro"
                      }
                    >
                      {resp.correcta ? "Correcta. " : "No fue correcta. "}
                    </span>
                    <span className="text-neutral-700 dark:text-white/85">
                      Tu respuesta: {p.opciones[resp.elegida]} · Respuesta
                      correcta: {p.opciones[p.respuesta_correcta]}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                    {p.justificacion}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">
                    Fuente: {p.fuente}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setEtapa("inicio")}
            className="rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
          >
            Hacer otra área
          </button>
          <button
            type="button"
            onClick={() => setEtapa("resumen")}
            className="rounded-full border-2 border-selva px-6 py-3 font-display font-bold text-selva transition-transform hover:scale-105 dark:border-sol dark:text-sol"
          >
            Ver resumen general
          </button>
        </div>
      </div>
    );
  }

  // ---------- Preguntas de un área ----------
  if (etapa === "preguntas" && pregunta && areaActual) {
    const correcta = elegida !== null && elegida === pregunta.respuesta_correcta;
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
          {areaActual} — Pregunta {respuestas.length + 1} de{" "}
          {PREGUNTAS_POR_AREA}
        </p>
        <div
          className="mt-3 h-3 overflow-hidden rounded-full bg-rio/20"
          role="progressbar"
          aria-valuenow={respuestas.length}
          aria-valuemin={0}
          aria-valuemax={PREGUNTAS_POR_AREA}
          aria-label="Avance del área"
        >
          <div
            className="h-full rounded-full bg-rio transition-all"
            style={{
              width: `${(respuestas.length / PREGUNTAS_POR_AREA) * 100}%`,
            }}
          />
        </div>

        <fieldset className="mt-8">
          <legend className="font-display text-2xl font-extrabold leading-snug text-noche dark:text-white">
            {pregunta.pregunta}
          </legend>
          <div className="mt-5 flex flex-col gap-3">
            {pregunta.opciones.map((opcion, i) => {
              const esCorrecta = i === pregunta.respuesta_correcta;
              const esElegida = i === elegida;
              let estilo =
                "border-rio/30 bg-white hover:border-selva dark:border-white/20 dark:bg-noche-claro dark:hover:border-sol";
              if (elegida !== null) {
                if (esCorrecta)
                  estilo =
                    "border-selva bg-selva/10 dark:border-sol dark:bg-sol/10";
                else if (esElegida)
                  estilo =
                    "border-achiote bg-achiote/10 dark:border-achiote";
                else estilo = "border-rio/20 opacity-60 dark:border-white/10";
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => responder(i)}
                  disabled={elegida !== null}
                  aria-pressed={esElegida}
                  className={`rounded-2xl border-2 px-5 py-3 text-left font-bold text-noche transition-colors dark:text-white ${estilo}`}
                >
                  {opcion}
                  {elegida !== null && esCorrecta && " ✓"}
                  {elegida !== null && esElegida && !esCorrecta && " ✗"}
                </button>
              );
            })}
          </div>
        </fieldset>

        {elegida !== null && (
          <div
            role="status"
            className="mt-6 rounded-2xl border-2 border-rio/30 bg-rio/10 p-4 dark:border-white/10"
          >
            <p className="font-display text-lg font-bold text-noche dark:text-white">
              {correcta ? "¡Correcto!" : "No fue correcta, y está bien."}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
              {pregunta.justificacion}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">
              Fuente: {pregunta.fuente}
            </p>
            <button
              type="button"
              onClick={siguiente}
              className="mt-4 rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
            >
              {respuestas.length + 1 >= PREGUNTAS_POR_AREA
                ? "Ver mi resultado"
                : "Siguiente pregunta"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ---------- Inicio: elegir área ----------
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Examen diagnóstico
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Descubrí tu nivel, área por área
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
        Son 6 áreas con 6 preguntas cada una. Las preguntas se adaptan a
        vos: si acertás, la siguiente es un poco más difícil; si no, un
        poco más fácil. Al final de cada área vas a ver tu nivel (Inicial,
        Básico, Intermedio o Avanzado) y recomendaciones para seguir
        aprendiendo. También hay un reto aparte de lógica matemática: 6
        preguntas cortas de razonamiento. No es un examen con nota: es
        para saber por dónde empezar.
      </p>
      <div
        role="note"
        className="mt-6 rounded-2xl border-2 border-sol/60 bg-sol/10 p-4 dark:border-sol/60"
      >
        <p className="font-display text-lg font-bold text-noche dark:text-white">
          ⚠️ Este examen es privado
        </p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
          Solo usted sabrá el resultado. No use herramientas como internet
          para responder las preguntas. La idea es evaluar su conocimiento.
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
        No necesitás cuenta para hacerlo. Si entrás con tu cuenta, tus
        resultados se guardan y los ves en{" "}
        <Link
          href="/progreso"
          className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
        >
          Mi progreso
        </Link>
        .
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {AREAS.map((area) => {
          const hecho = resultados[area];
          return (
            <button
              key={area}
              type="button"
              onClick={() => empezarArea(area)}
              className="rounded-3xl border-2 border-rio/20 bg-white p-5 text-left shadow-md transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-noche-claro"
            >
              <span className="font-display text-xl font-bold text-noche dark:text-white">
                {area}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-neutral-600 dark:text-white/75">
                {hecho
                  ? `Ya la hiciste — Nivel ${hecho.nivel} (${hecho.puntaje} de 100). Podés repetirla.`
                  : "6 preguntas adaptativas · unos 5 minutos"}
              </span>
            </button>
          );
        })}
        {/* Fase h: 7.ª tarjeta — reto de lógica matemática */}
        <button
          type="button"
          onClick={empezarLogica}
          className="rounded-3xl border-2 border-sol/60 bg-sol/10 p-5 text-left shadow-md transition-transform hover:-translate-y-1 dark:border-sol/60"
        >
          <span className="font-display text-xl font-bold text-noche dark:text-white">
            Lógica matemática
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-neutral-600 dark:text-white/75">
            {resultadoLogica
              ? `Ya lo hiciste — Nivel ${resultadoLogica.nivel} (${resultadoLogica.puntaje} de 100). Podés repetirlo.`
              : "6 preguntas fijas de razonamiento · unos 5 minutos · práctica para el examen de las Escuelas de Maestros"}
          </span>
        </button>
      </div>

      {areasHechas.length > 0 && (
        <button
          type="button"
          onClick={() => setEtapa("resumen")}
          className="mt-8 w-full rounded-full bg-selva px-6 py-3 font-display text-lg font-bold text-white transition-transform hover:scale-[1.02] dark:bg-sol dark:text-noche"
        >
          Ver mi resumen general ({areasHechas.length} de {AREAS.length}{" "}
          áreas)
        </button>
      )}

      <p className="mt-6 text-center text-sm leading-relaxed text-neutral-600 dark:text-white/75">
        ¿Querés conocer también tus hábitos de estudio? Hacé el{" "}
        <Link
          href="/actitudes"
          className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
        >
          cuestionario de actitudes y hábitos
        </Link>
        .
      </p>
      <p className="mt-3 text-center text-sm leading-relaxed text-neutral-600 dark:text-white/75">
        ¿Querés saber qué carreras combinan con vos? Hacé el{" "}
        <Link
          href="/vocacional"
          className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
        >
          cuestionario vocacional
        </Link>{" "}
        (18 frases, unos 5 minutos).
      </p>
    </div>
  );
}
