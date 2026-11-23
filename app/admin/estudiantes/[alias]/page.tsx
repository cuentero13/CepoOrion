import Link from "next/link";
import { notFound } from "next/navigation";
import {
  obtenerDetalleEstudiante,
  formatearFecha,
  formatearDuracion,
  etiquetaTipoActividad,
  tituloJuego,
  avisoN,
} from "@/lib/admin";
import { AREAS, AREA_LOGICA, nivelGeneral } from "@/lib/diagnostico";
import { DIMENSIONES_RIASEC } from "@/lib/vocacional";
import datosActitudes from "@/data/actitudes.json";

const NOMBRES_RIASEC: Record<string, string> = Object.fromEntries(
  DIMENSIONES_RIASEC.map((d) => [d.id, d.nombre])
);
const NOMBRES_ACTITUDES: Record<string, string> = Object.fromEntries(
  (
    datosActitudes as unknown as {
      dimensiones: { id: string; nombre: string }[];
    }
  ).dimensiones.map((d) => [d.id, d.nombre])
);

/**
 * Ficha de un estudiante (por alias). Solo alias: nunca nombres reales,
 * fotos, teléfonos ni correos.
 */
export default async function DetalleEstudiante({
  params,
}: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await params;
  const detalle = await obtenerDetalleEstudiante(decodeURIComponent(alias));
  if (!detalle) notFound();

  const porArea = detalle.ultimoPorArea;
  const puntajes = AREAS.map((a) => porArea[a]?.puntaje).filter(
    (v): v is number => typeof v === "number"
  );
  const nivelGral = puntajes.length > 0 ? nivelGeneral(puntajes) : null;
  const promedio =
    puntajes.length > 0
      ? Math.round(puntajes.reduce((s, v) => s + v, 0) / puntajes.length)
      : null;
  const logicaFila = porArea[AREA_LOGICA] ?? null;
  const ultimasActitudes = detalle.actitudes[0] ?? null;

  return (
    <div>
      <p className="text-sm">
        <Link
          href="/admin/estudiantes"
          className="font-bold text-rio-oscuro underline decoration-rio/40 underline-offset-2 dark:text-rio-claro"
        >
          ← Estudiantes
        </Link>
      </p>
      <h2 className="mt-3 font-display text-2xl font-extrabold text-selva dark:text-sol">
        {detalle.perfil.alias}
      </h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-white/70">
        Registrado: {formatearFecha(detalle.perfil.creado)}
      </p>

      {/* Resumen */}
      <section className="mt-6 rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md dark:border-white/10 dark:bg-noche-claro">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          Resumen
        </h3>
        <ul className="mt-3 space-y-2 leading-relaxed text-neutral-700 dark:text-white/85">
          <li>
            <strong>Diagnóstico:</strong>{" "}
            {puntajes.length > 0
              ? `nivel general ${nivelGral} (${promedio}%) · ${puntajes.length}/6 áreas con resultado. ${detalle.diagnostico.length} resultado${detalle.diagnostico.length === 1 ? "" : "s"} guardado${detalle.diagnostico.length === 1 ? "" : "s"} en total.`
              : "Sin resultados todavía."}
          </li>
          <li>
            <strong>Lógica matemática:</strong>{" "}
            {logicaFila
              ? `${logicaFila.puntaje}% (${logicaFila.nivel})` +
                (logicaFila.aciertos !== null
                  ? ` · ${logicaFila.aciertos} de ${logicaFila.total} aciertos.`
                  : ".")
              : "Sin registro."}
          </li>
          <li>
            <strong>Vocacional:</strong>{" "}
            {detalle.vocacional
              ? `${detalle.vocacional.top2
                  .map((d) => NOMBRES_RIASEC[d] ?? d)
                  .join(" y ")} — familias: ${
                  detalle.vocacional.familias.length > 0
                    ? detalle.vocacional.familias.map((f) => f.nombre).join(", ")
                    : "ninguna todavía (falta el diagnóstico completo)"
                }.`
              : "Sin completar."}
          </li>
          <li>
            <strong>Juegos:</strong>{" "}
            {detalle.juegos.length > 0
              ? detalle.juegos
                  .map(
                    (j) =>
                      `${tituloJuego(j.juego)}: ${j.puntos} puntos, nivel ${j.nivel}${
                        j.insignias.length > 0 ? `, ${j.insignias.length} insignia${j.insignias.length === 1 ? "" : "s"}` : ""
                      }`
                  )
                  .join(" · ")
              : "Sin partidas guardadas."}
          </li>
        </ul>
      </section>

      {/* Resultados de diagnóstico */}
      <section className="mt-6">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          Resultados de diagnóstico ({detalle.diagnostico.length})
        </h3>
        {detalle.diagnostico.length === 0 ? (
          <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
            Todavía no hizo el diagnóstico.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-3xl border-2 border-rio/20 bg-white shadow-md dark:border-white/10 dark:bg-noche-claro">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-rio/20 dark:border-white/10">
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Fecha</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Área</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Nivel</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Puntaje</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Aciertos</th>
                </tr>
              </thead>
              <tbody>
                {detalle.diagnostico.map((d) => (
                  <tr key={d.id} className="border-b border-rio/10 last:border-0 dark:border-white/5">
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-700 dark:text-white/85">
                      {formatearFecha(d.created_at)}
                    </td>
                    <td className="px-4 py-3 font-bold">{d.area}</td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-white/85">{d.nivel}</td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                      {d.puntaje === null ? "—" : `${d.puntaje}%`}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                      {d.aciertos !== null ? `${d.aciertos}/${d.total}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
          Cada área se guarda por separado: si el estudiante repite un área,
          quedan los dos resultados y el último es el que cuenta para el
          nivel general.
        </p>
      </section>

      {/* Actitudes */}
      <section className="mt-6">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          Actitudes y hábitos
        </h3>
        {!ultimasActitudes ? (
          <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
            Todavía no completó el cuestionario de actitudes.
          </p>
        ) : (
          <div className="mt-3 rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md dark:border-white/10 dark:bg-noche-claro">
            <p className="text-sm text-neutral-600 dark:text-white/70">
              Último cuestionario: {formatearFecha(ultimasActitudes.created_at)} ·
              promedio por dimensión (escala 1–5).
            </p>
            <ul className="mt-3 space-y-2 leading-relaxed text-neutral-700 dark:text-white/85">
              {Object.entries(ultimasActitudes.dimensiones).map(([id, valor]) => (
                <li key={id}>
                  <strong>{NOMBRES_ACTITUDES[id] ?? id}:</strong> {valor.toFixed(1)} / 5
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Actividad */}
      <section className="mt-6">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          Actividad ({detalle.actividad.length})
        </h3>
        {detalle.actividad.length === 0 ? (
          <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
            Sin tiempo registrado. Si la migración 0003 todavía no se corrió
            en el SQL Editor, esta sección queda vacía.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-3xl border-2 border-rio/20 bg-white shadow-md dark:border-white/10 dark:bg-noche-claro">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-rio/20 dark:border-white/10">
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Qué</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Inicio</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Fin</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Duración</th>
                </tr>
              </thead>
              <tbody>
                {detalle.actividad.map((a) => (
                  <tr key={a.id} className="border-b border-rio/10 last:border-0 dark:border-white/5">
                    <td className="px-4 py-3 font-bold">{etiquetaTipoActividad(a.tipo)}</td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-white/85">{formatearFecha(a.inicio)}</td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                      {a.fin ? formatearFecha(a.fin) : "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                      {formatearDuracion(a.duracion_segundos)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {avisoN(detalle.actividad.length) && detalle.actividad.length > 0 && (
          <p className="mt-2 text-sm font-bold text-tierra-oscuro dark:text-sol">
            {avisoN(detalle.actividad.length)}
          </p>
        )}
      </section>
    </div>
  );
}
