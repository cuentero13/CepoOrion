"use client";

import { useRef, useState } from "react";
import ResultadoPartida from "./ResultadoPartida";
import {
  guardarPartida,
  type JuegoDetective,
  type ResultadoGuardado,
} from "@/lib/juegos";

/**
 * Detective de noticias: el jugador lee cada caso y elige «Verdadera»
 * o «Falsa». Después de elegir ve la explicación, las pistas y la
 * fuente. 10 puntos por acierto, +5 si no falla ningún caso.
 */
export default function JuegoDetective({
  datos,
}: {
  datos: JuegoDetective;
}) {
  const casos = datos.casos;
  const total = casos.length;
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<boolean | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [resultado, setResultado] = useState<ResultadoGuardado | null>(null);
  const guardando = useRef(false);

  if (total === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p role="alert" className="rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-5 text-sm leading-relaxed">
          Este juego todavía no tiene casos. La dirección los está preparando.
        </p>
      </div>
    );
  }

  const caso = casos[Math.min(indice, total - 1)];

  function responder(valor: boolean) {
    if (elegida !== null) return;
    setElegida(valor);
  }

  async function siguiente() {
    if (elegida === null) return;
    const correcta = elegida === caso.es_verdadera;
    const nuevosAciertos = aciertos + (correcta ? 1 : 0);
    setAciertos(nuevosAciertos);

    if (indice + 1 >= total) {
      setTerminado(true);
      if (!guardando.current) {
        guardando.current = true;
        const r = await guardarPartida({
          juego: "detective",
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
        juego="detective"
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

  const correcta = elegida !== null && elegida === caso.es_verdadera;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-2xl font-extrabold text-noche dark:text-white">
        {datos.titulo}
      </h1>
      <p className="mt-1 text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Caso {indice + 1} de {total}
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

      <article className="mt-6 rounded-2xl border-2 border-rio/20 bg-white p-5 dark:border-white/10 dark:bg-noche-claro">
        <h2 className="font-display text-2xl font-extrabold leading-snug text-noche dark:text-white">
          {caso.titular}
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
          {caso.texto}
        </p>
      </article>

      <fieldset className="mt-6">
        <legend className="font-display text-lg font-bold text-noche dark:text-white">
          ¿Esta noticia es verdadera o falsa?
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              { valor: true, etiqueta: "Verdadera" },
              { valor: false, etiqueta: "Falsa" },
            ] as const
          ).map(({ valor, etiqueta }) => {
            const esElegida = elegida === valor;
            const esLaCorrecta = valor === caso.es_verdadera;
            let estilo =
              "border-rio/30 bg-white hover:border-selva dark:border-white/20 dark:bg-noche-claro dark:hover:border-sol";
            if (elegida !== null) {
              if (esLaCorrecta)
                estilo =
                  "border-selva bg-selva/10 dark:border-sol dark:bg-sol/10";
              else if (esElegida)
                estilo = "border-achiote bg-achiote/10 dark:border-achiote";
              else estilo = "border-rio/20 opacity-60 dark:border-white/10";
            }
            return (
              <button
                key={etiqueta}
                type="button"
                onClick={() => responder(valor)}
                disabled={elegida !== null}
                aria-pressed={esElegida}
                className={`min-h-16 rounded-2xl border-2 px-5 py-4 text-center text-lg font-extrabold text-noche transition-colors dark:text-white ${estilo}`}
              >
                {etiqueta}
                {elegida !== null && esLaCorrecta && " ✓"}
                {elegida !== null && esElegida && !esLaCorrecta && " ✗"}
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
            {correcta
              ? "¡Correcto! +10 puntos"
              : "No fue correcta, y está bien."}{" "}
            La noticia era {caso.es_verdadera ? "verdadera" : "falsa"}.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            {caso.explicacion}
          </p>
          <div className="mt-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-selva dark:text-rio-claro">
              Pistas para la próxima
            </h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
              {caso.pistas.map((pista, i) => (
                <li key={i}>{pista}</li>
              ))}
            </ul>
          </div>
          <p className="mt-2 text-xs text-neutral-500 dark:text-white/60">
            Fuente: {caso.fuente}
          </p>
          <button
            type="button"
            onClick={siguiente}
            autoFocus
            className="mt-4 rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
          >
            {indice + 1 >= total ? "Ver mi resultado" : "Siguiente caso"}
          </button>
        </div>
      )}
    </div>
  );
}
