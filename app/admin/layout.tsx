import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { obtenerPerfilAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de administración | CEPO",
  description:
    "Panel super admin del Centro Educativo Privado Orion: estudiantes, evaluación, mejoras pendientes, buzón y actividad.",
  // El panel nunca se indexa (decisión del plan, §5.1).
  robots: { index: false, follow: false },
};

const ENLACES = [
  { href: "/admin", etiqueta: "Portada" },
  { href: "/admin/estudiantes", etiqueta: "Estudiantes" },
  { href: "/admin/evaluacion", etiqueta: "Evaluación" },
  { href: "/admin/mejoras", etiqueta: "Mejoras" },
  { href: "/admin/buzon", etiqueta: "Buzón" },
  { href: "/admin/actividad", etiqueta: "Actividad" },
];

/**
 * Guarda del panel (plan §5.1): sin sesión o sin rol 'admin' se
 * redirige a la portada. Los docentes NO entran (decisión de Mike,
 * 22-nov-2026). El panel no aparece en el menú público.
 */
export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await obtenerPerfilAdmin();
  if (!perfil) redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Panel de administración
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Panel super admin
      </h1>
      <p className="mt-2 leading-relaxed text-neutral-700 dark:text-white/85">
        Hola, {perfil.alias}. Solo la dirección ve este panel. Acá se ven
        los alias de los estudiantes — nunca sus nombres reales, fotos,
        teléfonos ni correos.
      </p>
      <nav
        aria-label="Secciones del panel"
        className="mt-6 flex flex-wrap gap-2 border-b-2 border-rio/20 pb-4 dark:border-white/10"
      >
        {ENLACES.map((enlace) => (
          <Link
            key={enlace.href}
            href={enlace.href}
            className="rounded-full border-2 border-rio/30 px-4 py-1.5 text-sm font-bold text-rio-oscuro transition-colors hover:bg-rio/10 dark:border-white/20 dark:text-rio-claro"
          >
            {enlace.etiqueta}
          </Link>
        ))}
        <Link
          href="/"
          className="rounded-full bg-selva px-4 py-1.5 text-sm font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
        >
          ← Volver al sitio
        </Link>
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
