"use client";

import { useRef, useState } from "react";
import ResultadoPartida from "./ResultadoPartida";
import {
  guardarPartida,
  type JuegoPresupuesto,
  type ResultadoGuardado,
} from "@/lib/juegos";

function formatoBs(monto: number): string {
  return `${monto} Bs`;
}

/**
 * Mi primer presupuesto: cada escenario muestra el ingreso mensual, la
 * meta de ahorro y las categorías sugeridas con su consejo. El jugador
 * elige una decisión; después ve la justificación y cuánto ahorró esa
 * decisión. 10 puntos por decisión recomendada, +5 si acierta todas.
 * La insignia «Presupuesto en orden» se gana al ahorrar igual o más
 * que la meta en al menos un escenario (aunque no sea la opción
 * recomendada).
 */
export default function JuegoPresupuesto({
  datos,
}: {
  datos: JuegoPresupuesto;
}) {
  const escenarios = datos.escenarios;
  const total = escenarios.length;
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [cumpleMeta, setCumpleMeta] = useState(false);
  const [terminado, setTerminado] = useState(false);
  const [resultado, setResultado] = useState<ResultadoGuardado | null>(null);
  const guardando = useRef(false);

  if (total === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p role="alert" className="rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-5 text-sm leading-relaxed">
          Este juego todavía no tiene escenarios. La dirección los está preparando.
        </p>
      </div>
    );
  }

  const escenario = escenarios[Math.min(indice, total - 1)];

  function responder(i: number) {
    if (elegida !== null) return;
    setElegida(i);
  }

  async function siguiente() {
    if (elegida === null) return;
    const correcta = elegida === escenario.respuesta_correcta;
    const nuevosAciertos = aciertos + (correcta ? 1 : 0);
    const ahorroElegido = escenario.opciones[elegida]?.ahorro_bs ?? 0;
    const nuevoCumpleMeta =
      cumpleMeta || ahorroElegido >= escenario.meta_ahorro_bs;
    setAciertos(nuevosAciertos);
    setCumpleMeta(nuevoCumpleMeta);

    if (indice + 1 >= total) {
      setTerminado(true);
      if (!guardando.current) {
        guardando.current = true;
        const r = await guardarPartida({
          juego: "presupuesto",
          aciertos: nuevosAciertos,
          total,
          ahorroCumpleMeta: nuevoCumpleMeta,
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
    setCumpleMeta(false);
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
        juego="presupuesto"
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

  const correcta =
    elegida !== null && elegida === escenario.respuesta_correcta;
  const ahorroElegido =
    elegida !== null ? (escenario.opciones[elegida]?.ahorro_bs ?? 0) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-2xl font-extrabold text-noche dark:text-white">
        {datos.titulo}
      </h1>
      <p className="mt-1 text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Escenario {indice + 1} de {total}
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
          {escenario.titulo}
        </h2>
        <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
          {escenario.descripcion}
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-rio/10 px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-selva dark:text-rio-claro">
              Ingreso mensual
            </dt>
            <dd className="font-display text-xl font-extrabold text-noche dark:text-white">
              {formatoBs(escenario.ingreso_mensual_bs)}
            </dd>
          </div>
          <div className="rounded-xl bg-sol/15 px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-noche dark:text-sol">
              Meta de ahorro
            </dt>
            <dd className="font-display text-xl font-extrabold text-noche dark:text-white">
              {formatoBs(escenario.meta_ahorro_bs)}
            </dd>
          </div>
        </dl>

        <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-selva dark:text-rio-claro">
          Categorías sugeridas
        </h3>
        <ul className="mt-2 flex flex-col gap-2">
          {escenario.categorias.map((cat) => (
            <li
              key={cat.nombre}
              className="rounded-xl border border-rio/20 px-4 py-3"
            >
              <p className="flex flex-wrap justify-between gap-2 font-bold text-noche dark:text-white">
                <span>{cat.nombre}</span>
                <span>{formatoBs(cat.sugerencia_bs)}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-white/75">
                {cat.consejo}
              </p>
            </li>
          ))}
        </ul>
      </article>

      <fieldset className="mt-6">
        <legend className="font-display text-xl font-extrabold leading-snug text-noche dark:text-white">
          {escenario.pregunta}
        </legend>
        <div className="mt-4 flex flex-col gap-3">
          {escenario.opciones.map((opcion, i) => {
            const esCorrecta = i === escenario.respuesta_correcta;
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
                className={`min-h-14 rounded-2xl border-2 px-5 py-3 text-left font-bold text-noche transition-colors dark:text-white ${estilo}`}
              >
                <span className="block">{opcion.texto}</span>
                {elegida !== null && (
                  <span className="mt-1 block text-sm font-bold text-neutral-600 dark:text-white/75">
                    Ahorro con esta decisión: {formatoBs(opcion.ahorro_bs)}
                    {esCorrecta && " ✓"}
                    {esElegida && !esCorrecta && " ✗"}
                  </span>
                )}
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
              ? "¡Buena decisión! +10 puntos"
              : "Esa decisión no era la recomendada."}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            Con tu decisión ahorrás {formatoBs(ahorroElegido)} este mes; tu
            meta era {formatoBs(escenario.meta_ahorro_bs)}.
            {ahorroElegido >= escenario.meta_ahorro_bs
              ? " ¡Llegaste a la meta!"
              : " No llegaste a la meta esta vez."}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
            {escenario.opciones[elegida]?.justificacion}
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">
            Fuente: {escenario.fuente}
          </p>
          <button
            type="button"
            onClick={siguiente}
            autoFocus
            className="mt-4 rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
          >
            {indice + 1 >= total ? "Ver mi resultado" : "Siguiente escenario"}
          </button>
        </div>
      )}
    </div>
  );
}
