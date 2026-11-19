import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { crearClienteServidor, obtenerPerfil, obtenerUsuario } from "@/lib/supabase/server";
import { actualizarEstadoBuzon } from "./acciones";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de administración | CEPO",
  description:
    "Panel administrativo del Centro Educativo Privado Orion: mensajes del buzón privado.",
};

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

type MensajeBuzon = {
  id: string;
  anonimo: boolean;
  alias_visible: string | null;
  tipo: string;
  mensaje: string;
  estado: string;
  created_at: string;
};

/** Formulario de cambio de estado (solo para administradores). */
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

function Aviso({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        {titulo}
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-neutral-700 dark:text-white/85">
        {children}
      </p>
    </div>
  );
}

/**
 * Panel de administración: lista los mensajes del buzón privado.
 * Solo dirección (admin) y docentes pueden verlos; solo el admin
 * cambia el estado de cada mensaje.
 */
export default async function Admin() {
  if (!supabaseConfigurado) {
    return (
      <Aviso titulo="Configuración pendiente">
        El panel todavía no está conectado con la base de datos del colegio.
        La dirección debe completar la configuración siguiendo{" "}
        <code className="rounded bg-white px-1 py-0.5 text-xs dark:bg-noche">
          docs/supabase-setup.md
        </code>
        .
      </Aviso>
    );
  }

  const usuario = await obtenerUsuario();
  if (!usuario) {
    redirect("/login?siguiente=/admin");
  }

  const perfil = await obtenerPerfil();
  if (!perfil || (perfil.rol !== "admin" && perfil.rol !== "docente")) {
    return (
      <Aviso titulo="Sin acceso">
        Esta sección es solo para la dirección y los docentes del colegio. Si
        creés que deberías poder entrar, hablá con la dirección.
      </Aviso>
    );
  }

  const supabase = await crearClienteServidor();
  if (!supabase) {
    return (
      <Aviso titulo="Configuración pendiente">
        El panel todavía no está conectado con la base de datos del colegio.
      </Aviso>
    );
  }

  const { data, error } = await supabase
    .from("buzon")
    .select("id, anonimo, alias_visible, tipo, mensaje, estado, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <Aviso titulo="No se pudieron cargar los mensajes">
        Hubo un problema al leer el buzón. Intentá de nuevo más tarde.
      </Aviso>
    );
  }

  const mensajes = (data ?? []) as MensajeBuzon[];
  const esAdmin = perfil.rol === "admin";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Panel de administración
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Buzón privado
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
        Hola, {perfil.alias}. Estos mensajes solo los ven la dirección y los
        docentes. {esAdmin
          ? "Como administrador, podés cambiar el estado de cada mensaje."
          : "Como docente, podés leerlos; solo la dirección cambia el estado."}
      </p>
      <p className="mt-2 text-sm font-bold text-neutral-600 dark:text-white/70">
        {mensajes.length === 0
          ? "Todavía no hay mensajes."
          : `${mensajes.length} mensaje${mensajes.length === 1 ? "" : "s"} (los más recientes primero).`}
      </p>

      {mensajes.length > 0 && (
        <ul className="mt-8 space-y-5">
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
                  {new Date(mensaje.created_at).toLocaleString("es-BO", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-neutral-800 dark:text-white/90">
                {mensaje.mensaje}
              </p>
              {esAdmin && (
                <CambiarEstado id={mensaje.id} estadoActual={mensaje.estado} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
