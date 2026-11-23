import Link from "next/link";
import { obtenerResumenAdmin, formatearFecha } from "@/lib/admin";

/**
 * Portada del panel super admin: tarjetas resumen con enlaces a cada
 * sección. Nada se descarga desde acá (decisión de Mike: sin CSV).
 */
export default async function PortadaAdmin() {
  const resumen = await obtenerResumenAdmin();

  const tarjetas = [
    {
      href: "/admin/estudiantes",
      titulo: "Estudiantes",
      valor: String(resumen.estudiantes),
      detalle:
        resumen.estudiantes === 0
          ? "Todavía no hay estudiantes registrados."
          : resumen.ultimoDiagnostico
            ? `Último diagnóstico: ${formatearFecha(resumen.ultimoDiagnostico)}.`
            : "Sin intentos de diagnóstico todavía.",
    },
    {
      href: "/admin/evaluacion",
      titulo: "Resultados de diagnóstico",
      valor: String(resumen.resultadosDiagnostico),
      detalle: `${resumen.vocacionalCompletados} perfil${
        resumen.vocacionalCompletados === 1 ? "" : "es"
      } vocacional${resumen.vocacionalCompletados === 1 ? "" : "es"} completado${
        resumen.vocacionalCompletados === 1 ? "" : "s"
      }.`,
    },
    {
      href: "/admin/buzon",
      titulo: "Buzón privado",
      valor: String(resumen.mensajesNuevos),
      detalle:
        resumen.mensajesTotal === 0
          ? "Todavía no hay mensajes."
          : `${resumen.mensajesTotal} mensaje${
              resumen.mensajesTotal === 1 ? "" : "s"
            } en total, ${resumen.mensajesNuevos} nuevo${
              resumen.mensajesNuevos === 1 ? "" : "s"
            }.`,
    },
    {
      href: "/admin/mejoras",
      titulo: "Mejoras pendientes",
      valor: String(resumen.marcadores),
      detalle:
        "Datos que faltan o faltan confirmar en la configuración del colegio.",
    },
    {
      href: "/admin/actividad",
      titulo: "Actividad registrada",
      valor: resumen.actividadPendiente ? "—" : String(resumen.actividadTotal),
      detalle: resumen.actividadPendiente
        ? "Falta correr la migración 0003 en el SQL Editor."
        : "Intentos con inicio y fin registrados.",
    },
  ];

  return (
    <div>
      {resumen.actividadPendiente && (
        <div className="rounded-3xl border-2 border-sol/60 bg-sol/10 p-5 dark:border-sol/40">
          <p className="font-display text-lg font-bold text-tierra-oscuro dark:text-sol">
            Falta un paso: migración 0003
          </p>
          <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
            La sección Actividad todavía no tiene su tabla. En el SQL Editor
            de Supabase, corra{" "}
            <code className="rounded bg-white px-1 py-0.5 text-xs dark:bg-noche">
              supabase/migrations/0003_fase_i.sql
            </code>{" "}
            (está en el repositorio). Sin ella, el resto del panel funciona
            igual; solo Actividad queda vacía.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tarjetas.map((tarjeta) => (
          <Link
            key={tarjeta.href}
            href={tarjeta.href}
            className="rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md transition-transform hover:scale-[1.02] dark:border-white/10 dark:bg-noche-claro"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
              {tarjeta.titulo}
            </p>
            <p className="mt-2 font-display text-4xl font-extrabold text-selva dark:text-sol">
              {tarjeta.valor}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
              {tarjeta.detalle}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border-2 border-rio/20 bg-white p-6 shadow-md dark:border-white/10 dark:bg-noche-claro">
        <h2 className="font-display text-xl font-bold text-selva dark:text-sol">
          Qué hace cada sección
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-neutral-700 dark:text-white/85">
          <li>
            <strong>Estudiantes:</strong> lista de alias con su último
            diagnóstico, vocacional y actividad. Al entrar a uno se ven sus
            intentos, sus juegos y su perfil vocacional.
          </li>
          <li>
            <strong>Evaluación:</strong> promedios por área con la cantidad
            de estudiantes (N) en cada uno. Con menos de 3 casos, el panel
            avisa que no es representativo.
          </li>
          <li>
            <strong>Mejoras:</strong> los datos que faltan o faltan
            confirmar, tal como están en la configuración. Solo lectura.
          </li>
          <li>
            <strong>Buzón:</strong> los mensajes privados. Solo la dirección
            cambia el estado de cada mensaje.
          </li>
          <li>
            <strong>Actividad:</strong> cuánto tiempo pasa cada estudiante
            en cada intento. Sin presencia en vivo: solo lo ya registrado.
          </li>
        </ul>
      </div>
    </div>
  );
}
