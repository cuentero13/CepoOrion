"use client";

import { useRef, useState } from "react";
import ResultadoPartida from "./ResultadoPartida";
import {
  guardarPartida,
  type JuegoId,
  type JuegoPreguntas,
  type JuegoPrimerosAuxilios,
  type ResultadoGuardado,
} from "@/lib/juegos";

type PreguntaVista = {
  id: string;
  situacion?: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number;
  justificacion: string;
  fuente: string;
};

function normalizar(
  datos: JuegoPreguntas | JuegoPrimerosAuxilios
): PreguntaVista[] {
  return datos.preguntas.map((p) => ({
    id: p.id,
    situacion: "situacion" in p ? p.situacion : undefined,
    pregunta: p.pregunta,
    opciones: p.opciones,
    respuesta_correcta: p.respuesta_correcta,
    justificacion: p.justificacion,
    fuente: p.fuente,
  }));
}

/**
 * Jugador genérico de preguntas con 4 opciones (Aventura Madidi, Mapa
 * de Bolivia, Constelaciones y Primeros auxilios — este último muestra
 * además la situación antes de la pregunta). Una pregunta por vez,
 * retroalimentación inmediata con justificación y fuente.
 */
export default function JuegoPreguntas({
  juego,
  datos,
}: {
  juego: JuegoId;
  datos: JuegoPreguntas | JuegoPrimerosAuxilios;
}) {
  const preguntas = normalizar(datos);
  const total = preguntas.length;
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [resultado, setResultado] = useState<ResultadoGuardado | null>(null);
  const guardando = useRef(false);

  if (total === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p role="alert" className="rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-5 text-sm leading-relaxed">
          Este juego todavía no tiene preguntas. La dirección las está preparando.
        </p>
      </div>
    );
  }

  const pregunta = preguntas[Math.min(indice, total - 1)];

  function responder(i: number) {
    if (elegida !== null) return;
    setElegida(i);
  }

  async function siguiente() {
    if (elegida === null) return;
    const correcta = elegida === pregunta.respuesta_correcta;
    const nuevosAciertos = aciertos + (correcta ? 1 : 0);
    setAciertos(nuevosAciertos);

    if (indice + 1 >= total) {
      setTerminado(true);
      if (!guardando.current) {
        guardando.current = true;
        const r = await guardarPartida({
          juego,
          aciertos: nuevosAciertos,
          total,
        });
        setResultado(r);
      }
      return;
    }
    setIndice(indice + 1);
    setElegida(null);
  }

  function repetir() {
    setIndice(0);
    setElegida(null);
    setAciertos(0);
    setTerminado(false);
    setResultado(null);
    guardando.current = false;
  }

  if (terminado) {
    if (!resultado) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <p role="status" className="text-neutral-700 dark:text-white/85">
            Guardando tu resultado…
          </p>
        </div>
      );
    }
    return (
      <ResultadoPartida
        juego={juego}
        aciertos={aciertos}
        total={total}
        puntos={resultado.puntosPartida}
        nivel={resultado.nivel}
        insigniasNuevas={resultado.insigniasNuevas}
        guardado={resultado.guardado}
        onRepetir={repetir}
      />
    );
  }

  const correcta = elegida !== null && elegida === pregunta.respuesta_correcta;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-rio">
        {datos.titulo} — Pregunta {indice + 1} de {total}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-white/75">
        {datos.descripcion}
      </p>
      <div
        className="mt-4 h-3 overflow-hidden rounded-full bg-rio/20"
        role="progressbar"
        aria-valuenow={indice}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Avance de la partida"
      >
        <div
          className="h-full rounded-full bg-rio transition-all"
          style={{ width: `${(indice / total) * 100}%` }}
        />
      </div>

      {pregunta.situacion && (
        <p className="mt-6 rounded-2xl border-2 border-sol/60 bg-sol/10 px-5 py-4 leading-relaxed text-neutral-800 dark:text-white/90">
          <span className="font-display font-bold text-noche dark:text-sol">
            Situación:{" "}
          </span>
          {pregunta.situacion}
        </p>
      )}

      <fieldset className="mt-6">
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
                estilo = "border-achiote bg-achiote/10 dark:border-achiote";
              else estilo = "border-rio/20 opacity-60 dark:border-white/10";
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => responder(i)}
                disabled={elegida !== null}
                aria-pressed={esElegida}
                className={`min-h-14 rounded-2xl border-2 px-5 py-3 text-left text-base font-bold text-noche transition-colors dark:text-white ${estilo}`}
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
          aria-live="polite"
          className="mt-6 rounded-2xl border-2 border-rio/30 bg-rio/10 p-4 dark:border-white/10"
        >
          <p className="font-display text-lg font-bold text-noche dark:text-white">
            {correcta ? "¡Correcto! +10 puntos" : "No fue correcta, y está bien."}
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
            autoFocus
            className="mt-4 rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
          >
            {indice + 1 >= total ? "Ver mi resultado" : "Siguiente pregunta"}
          </button>
        </div>
      )}
    </div>
  );
}
