import { obtenerMejorasAdmin } from "@/lib/admin";

/**
 * Mejoras pendientes: solo lectura. Los marcadores de
 * config/institucion.json + la frescura de data/despues-del-cole.json
 * (página /futuro). Para resolver uno, se edita el archivo que indica
 * la ruta (ver docs/manual-docente.md).
 */
export default async function MejorasAdmin() {
  const mejoras = await obtenerMejorasAdmin();

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-selva dark:text-sol">
        Mejoras pendientes ({mejoras.marcadores.length})
      </h2>
      <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
        Datos que faltan o faltan confirmar en la configuración del colegio.
        Esta página solo los muestra: para resolver uno hay que completar el
        dato real en el archivo que indica la ruta y volver a desplegar.
      </p>

      {mejoras.marcadores.length === 0 ? (
        <div className="mt-6 rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md dark:border-white/10 dark:bg-noche-claro">
          <p className="leading-relaxed text-neutral-700 dark:text-white/85">
            No hay marcadores pendientes en la configuración.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {mejoras.marcadores.map((m) => (
            <li
              key={m.ruta}
              className="rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md dark:border-white/10 dark:bg-noche-claro"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span
                  className={
                    m.tipo === "COMPLETAR"
                      ? "rounded-full bg-tierra px-3 py-1 font-display font-bold text-white"
                      : "rounded-full bg-sol px-3 py-1 font-display font-bold text-noche"
                  }
                >
                  {m.tipo === "COMPLETAR" ? "Falta el dato" : "Falta confirmar"}
                </span>
                <code className="rounded bg-rio/10 px-2 py-0.5 text-xs dark:bg-white/10">
                  {m.ruta}
                </code>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
                {m.valor}
              </p>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-8 rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md dark:border-white/10 dark:bg-noche-claro">
        <h3 className="font-display text-xl font-bold text-selva dark:text-sol">
          «Tu futuro» (/futuro): ¿qué tan frescos están los datos?
        </h3>
        <ul className="mt-3 space-y-2 leading-relaxed text-neutral-700 dark:text-white/85">
          <li>
            <strong>Última revisión:</strong> {mejoras.futuro.ultimaRevision}
          </li>
          <li>
            <strong>Instituciones:</strong> {mejoras.futuro.instituciones} ·
            <strong> Becas:</strong> {mejoras.futuro.becas} ·
            <strong> Plazos:</strong> {mejoras.futuro.plazos} (
            {mejoras.futuro.plazosPorConfirmar} por confirmar)
          </li>
          <li>
            Las convocatorias 2027 del Ministerio de Educación y de las
            ESFM se publican en diciembre de 2026: hay que revisar
            minedu.gob.bo ese mes y actualizar las fechas (ver
            docs/manual-docente.md, fase h).
          </li>
        </ul>
      </section>
    </div>
  );
}
