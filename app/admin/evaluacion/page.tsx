import {
  obtenerEvaluacionAdmin,
  avisoN,
  tituloJuego,
} from "@/lib/admin";
import { NIVELES } from "@/lib/diagnostico";

/**
 * Evaluación: promedios por área con N visible en cada agregado.
 * Con N < 3 el panel avisa que no es representativo (plan §5.4.1).
 */
export default async function EvaluacionAdmin() {
  const ev = await obtenerEvaluacionAdmin();

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-selva dark:text-sol">
        Evaluación
      </h2>
      <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
        Promedios de todos los intentos guardados. Cada cifra muestra
        cuántos estudiantes la respaldan (N): con menos de 3, no se pueden
        sacar conclusiones del grupo.
      </p>

      {/* Diagnóstico por área */}
      <section className="mt-6">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          Diagnóstico por área
        </h3>
        <div className="mt-3 overflow-x-auto rounded-3xl border-2 border-rio/20 bg-white shadow-md dark:border-white/10 dark:bg-noche-claro">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-rio/20 dark:border-white/10">
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Área</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Estudiantes (N)</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Intentos</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Promedio</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Niveles</th>
              </tr>
            </thead>
            <tbody>
              {ev.diagnostico.map((a) => (
                <tr key={a.area} className="border-b border-rio/10 last:border-0 dark:border-white/5">
                  <td className="px-4 py-3 font-bold">{a.area}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                    {a.estudiantes}
                    {avisoN(a.estudiantes) && (
                      <span className="block text-xs font-bold text-tierra-oscuro dark:text-sol">
                        {avisoN(a.estudiantes)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-white/85">{a.intentos}</td>
                  <td className="px-4 py-3 font-bold">
                    {a.promedio === null ? "—" : `${a.promedio}%`}
                  </td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                    {NIVELES.map((n) => `${n}: ${a.niveles[n]}`).join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lógica */}
      <section className="mt-6 rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md dark:border-white/10 dark:bg-noche-claro">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          Lógica matemática (6 preguntas)
        </h3>
        <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
          {ev.logica.intentos === 0
            ? "Sin intentos todavía."
            : `${ev.logica.estudiantes} estudiante${ev.logica.estudiantes === 1 ? "" : "s"} (N=${ev.logica.estudiantes}), ${ev.logica.intentos} intento${ev.logica.intentos === 1 ? "" : "s"} — promedio ${ev.logica.promedioPuntaje}% (${ev.logica.promedioAciertos} aciertos de 6).`}
        </p>
        {avisoN(ev.logica.estudiantes) && ev.logica.estudiantes > 0 && (
          <p className="mt-2 text-sm font-bold text-tierra-oscuro dark:text-sol">
            {avisoN(ev.logica.estudiantes)}
          </p>
        )}
      </section>

      {/* Actitudes */}
      <section className="mt-6">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          Actitudes y hábitos (escala 1–5)
        </h3>
        <div className="mt-3 overflow-x-auto rounded-3xl border-2 border-rio/20 bg-white shadow-md dark:border-white/10 dark:bg-noche-claro">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-rio/20 dark:border-white/10">
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Dimensión</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Estudiantes (N)</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {ev.actitudes.map((d) => (
                <tr key={d.dimension} className="border-b border-rio/10 last:border-0 dark:border-white/5">
                  <td className="px-4 py-3 font-bold">{d.nombre}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                    {d.estudiantes}
                    {avisoN(d.estudiantes) && (
                      <span className="block text-xs font-bold text-tierra-oscuro dark:text-sol">
                        {avisoN(d.estudiantes)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {d.promedio === null ? "—" : `${d.promedio} / 5`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Vocacional */}
      <section className="mt-6 rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md dark:border-white/10 dark:bg-noche-claro">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          Vocacional
        </h3>
        <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
          {ev.vocacional.completados === 0
            ? "Ningún estudiante completó el cuestionario vocacional todavía."
            : `${ev.vocacional.completados} perfil${ev.vocacional.completados === 1 ? "" : "es"} completado${ev.vocacional.completados === 1 ? "" : "s"}. Intereses más frecuentes (top 2 de cada estudiante):`}
        </p>
        {ev.vocacional.top2.filter((t) => t.cantidad > 0).length > 0 && (
          <ul className="mt-3 space-y-1 leading-relaxed text-neutral-700 dark:text-white/85">
            {ev.vocacional.top2
              .filter((t) => t.cantidad > 0)
              .map((t) => (
                <li key={t.dimension}>
                  <strong>{t.nombre}:</strong> {t.cantidad} estudiante{t.cantidad === 1 ? "" : "s"}
                </li>
              ))}
          </ul>
        )}
        {avisoN(ev.vocacional.completados) && ev.vocacional.completados > 0 && (
          <p className="mt-3 text-sm font-bold text-tierra-oscuro dark:text-sol">
            {avisoN(ev.vocacional.completados)}
          </p>
        )}
      </section>

      {/* Juegos */}
      <section className="mt-6">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          Juegos
        </h3>
        {ev.juegos.length === 0 ? (
          <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
            Sin partidas guardadas todavía.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-3xl border-2 border-rio/20 bg-white shadow-md dark:border-white/10 dark:bg-noche-claro">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-rio/20 dark:border-white/10">
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Juego</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Jugadores (N)</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Puntos promedio</th>
                  <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Insignias</th>
                </tr>
              </thead>
              <tbody>
                {ev.juegos.map((j) => (
                  <tr key={j.juego} className="border-b border-rio/10 last:border-0 dark:border-white/5">
                    <td className="px-4 py-3 font-bold">{tituloJuego(j.juego)}</td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                      {j.jugadores}
                      {avisoN(j.jugadores) && (
                        <span className="block text-xs font-bold text-tierra-oscuro dark:text-sol">
                          {avisoN(j.jugadores)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                      {j.puntosPromedio === null ? "—" : `${j.puntosPromedio} puntos`}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-white/85">{j.insignias}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
