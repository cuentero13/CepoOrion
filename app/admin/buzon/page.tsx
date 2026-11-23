import { listarMensajesBuzonAdmin, formatearFecha } from "@/lib/admin";
import { actualizarEstadoBuzon } from "../acciones";

const ESTADOS = ["nuevo", "en_revision", "resuelto"] as const;
type EstadoBuzon = (typeof ESTADOS)[number];

const ETIQUETAS_ESTADO: Record<EstadoBuzon, string> = {
  nuevo: "Nuevo",
  en_revision: "En revisión",
  resuelto: "Resuelto",
};

const ETIQUETAS_TIPO: Record<string, string> = {
  comentario: "Comentario",
  sugerencia: "Sugerencia",
  consulta: "Consulta",
};

/** Cambio de estado (solo admin: la guarda del layout ya lo garantiza). */
function CambiarEstado({
  id,
  estadoActual,
}: {
  id: string;
  estadoActual: string;
}) {
  return (
    <form
      action={async (datos: FormData) => {
        "use server";
        const estado = String(datos.get("estado") ?? "");
        await actualizarEstadoBuzon(id, estado);
      }}
      className="mt-3 flex flex-wrap items-center gap-2"
    >
      <label htmlFor={`estado-${id}`} className="text-sm font-bold">
        Estado:
      </label>
      <select
        id={`estado-${id}`}
        name="estado"
        defaultValue={estadoActual}
        className="rounded-full border-2 border-rio/30 bg-white px-3 py-1.5 text-sm font-bold dark:border-white/20 dark:bg-noche"
      >
        {ESTADOS.map((estado) => (
          <option key={estado} value={estado}>
            {ETIQUETAS_ESTADO[estado]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-full bg-selva px-4 py-1.5 text-sm font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
      >
        Guardar
      </button>
    </form>
  );
}

/**
 * Buzón privado (antes en /admin; ahora en /admin/buzon).
 * Solo la dirección lo ve y solo ella cambia el estado de cada mensaje
 * (decisión de Mike, 22-nov-2026). Los mensajes anónimos se muestran
 * sin remitente.
 */
export default async function BuzonAdmin() {
  const mensajes = await listarMensajesBuzonAdmin();
  const nuevos = mensajes.filter((m) => m.estado === "nuevo").length;

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-selva dark:text-sol">
        Buzón privado
      </h2>
      <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
        Estos mensajes solo los ve la dirección. Como administrador, podés
        cambiar el estado de cada mensaje.
      </p>
      <p className="mt-2 text-sm font-bold text-neutral-600 dark:text-white/70">
        {mensajes.length === 0
          ? "Todavía no hay mensajes."
          : `${mensajes.length} mensaje${mensajes.length === 1 ? "" : "s"} (${nuevos} nuevo${nuevos === 1 ? "" : "s"}). Los más recientes primero.`}
      </p>

      {mensajes.length > 0 && (
        <ul className="mt-6 space-y-5">
          {mensajes.map((mensaje) => (
            <li
              key={mensaje.id}
              className="rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md dark:border-white/10 dark:bg-noche-claro"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-selva px-3 py-1 font-display font-bold text-white dark:bg-sol dark:text-noche">
                  {ETIQUETAS_TIPO[mensaje.tipo] ?? mensaje.tipo}
                </span>
                <span className="rounded-full bg-rio/15 px-3 py-1 font-bold text-rio-oscuro dark:text-rio-claro">
                  {ETIQUETAS_ESTADO[mensaje.estado as EstadoBuzon] ?? mensaje.estado}
                </span>
                <span className="font-bold">
                  {mensaje.anonimo || !mensaje.alias_visible
                    ? "Anónimo"
                    : mensaje.alias_visible}
                </span>
                <time
                  dateTime={mensaje.created_at}
                  className="text-neutral-600 dark:text-white/70"
                >
                  {formatearFecha(mensaje.created_at)}
                </time>
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-neutral-800 dark:text-white/90">
                {mensaje.mensaje}
              </p>
              <CambiarEstado id={mensaje.id} estadoActual={mensaje.estado} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
