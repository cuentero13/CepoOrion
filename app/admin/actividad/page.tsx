import Link from "next/link";
import {
  listarActividadAdmin,
  formatearFecha,
  formatearDuracion,
  etiquetaTipoActividad,
} from "@/lib/admin";

/**
 * Actividad: tiempo por intento (diagnóstico, actitudes, vocacional).
 * Sin presencia en vivo (decisión del plan): solo lo ya registrado.
 * Si la migración 0003 todavía no se corrió, la tabla no existe y la
 * página lo dice en vez de romperse.
 */
export default async function ActividadAdmin() {
  const { filas, pendiente } = await listarActividadAdmin();

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-selva dark:text-sol">
        Actividad
      </h2>
      <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
        Cuánto tiempo pasa cada estudiante en cada intento. La duración se
        mide entre que abre el cuestionario o examen y que lo termina. Si
        cierra la ventana sin terminar, la duración queda sin registrar.
      </p>

      {pendiente && (
        <div className="mt-6 rounded-3xl border-2 border-sol/60 bg-sol/10 p-5 dark:border-sol/40">
          <p className="font-display text-lg font-bold text-tierra-oscuro dark:text-sol">
            Falta correr la migración 0003
          </p>
          <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
            La tabla de actividad todavía no existe en la base de datos. En
            el SQL Editor de Supabase, corra{" "}
            <code className="rounded bg-white px-1 py-0.5 text-xs dark:bg-noche">
              supabase/migrations/0003_fase_i.sql
            </code>{" "}
            (está en el repositorio). A partir de ahí, cada intento nuevo
            queda registrado con su inicio y su fin.
          </p>
        </div>
      )}

      {!pendiente && filas.length === 0 && (
        <div className="mt-6 rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md dark:border-white/10 dark:bg-noche-claro">
          <p className="leading-relaxed text-neutral-700 dark:text-white/85">
            Todavía no hay actividad registrada. Los intentos que se hagan a
            partir de ahora quedan acá con su duración.
          </p>
        </div>
      )}

      {filas.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-3xl border-2 border-rio/20 bg-white shadow-md dark:border-white/10 dark:bg-noche-claro">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-rio/20 dark:border-white/10">
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Estudiante</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Qué</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Inicio</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Fin</th>
                <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Duración</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.id} className="border-b border-rio/10 last:border-0 dark:border-white/5">
                  <td className="px-4 py-3 font-bold">
                    <Link
                      href={`/admin/estudiantes/${encodeURIComponent(f.alias)}`}
                      className="text-rio-oscuro underline decoration-rio/40 underline-offset-2 dark:text-rio-claro"
                    >
                      {f.alias}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                    {etiquetaTipoActividad(f.tipo)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-700 dark:text-white/85">
                    {formatearFecha(f.inicio)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-700 dark:text-white/85">
                    {f.fin ? formatearFecha(f.fin) : "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                    {formatearDuracion(f.duracion_segundos)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
