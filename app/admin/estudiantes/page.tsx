import Link from "next/link";
import { listarEstudiantesAdmin, formatearFecha } from "@/lib/admin";

/**
 * Estudiantes: lista de alias (nunca nombres reales) con su último
 * diagnóstico, vocacional y actividad. Sin CSV (decisión de Mike).
 */
export default async function EstudiantesAdmin() {
  const estudiantes = await listarEstudiantesAdmin();

  if (estudiantes.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md dark:border-white/10 dark:bg-noche-claro">
        <h2 className="font-display text-xl font-bold text-selva dark:text-sol">
          Todavía no hay estudiantes
        </h2>
        <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
          Cuando un estudiante se registre en el sitio, su alias aparece acá
          con sus intentos y su progreso.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-selva dark:text-sol">
        Estudiantes ({estudiantes.length})
      </h2>
      <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
        Solo se muestra el alias. Para ver el detalle de uno, tocá su alias.
      </p>

      <div className="mt-6 overflow-x-auto rounded-3xl border-2 border-rio/20 bg-white shadow-md dark:border-white/10 dark:bg-noche-claro">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b-2 border-rio/20 dark:border-white/10">
              <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Alias</th>
              <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Registrado</th>
              <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Diagnóstico</th>
              <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Vocacional</th>
              <th className="px-4 py-3 font-display font-bold text-selva dark:text-sol">Actividad</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((e) => (
              <tr
                key={e.user_id}
                className="border-b border-rio/10 last:border-0 dark:border-white/5"
              >
                <td className="px-4 py-3 font-bold">
                  <Link
                    href={`/admin/estudiantes/${encodeURIComponent(e.alias)}`}
                    className="text-rio-oscuro underline decoration-rio/40 underline-offset-2 dark:text-rio-claro"
                  >
                    {e.alias}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                  {formatearFecha(e.creado)}
                </td>
                <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                  {e.ultimoDiagnostico
                    ? `${e.ultimoDiagnostico.nivelGeneral} (${e.ultimoDiagnostico.porcentajePromedio}%) · ${e.areasCompletadas}/6 áreas`
                    : "Sin resultados"}
                </td>
                <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                  {e.tieneVocacional ? "Completado" : "Pendiente"}
                  {e.intentosActitudes > 0 && ` · ${e.intentosActitudes} actitudes`}
                </td>
                <td className="px-4 py-3 text-neutral-700 dark:text-white/85">
                  {e.intentosActividad > 0
                    ? `${e.intentosActividad} intento${e.intentosActividad === 1 ? "" : "s"}`
                    : "Sin registro"}
                  {e.ultimaActividad && (
                    <span className="block text-xs">
                      Última: {formatearFecha(e.ultimaActividad)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
