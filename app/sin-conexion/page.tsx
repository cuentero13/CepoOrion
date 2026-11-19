import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Sin conexión | CEPO" };

export default function SinConexion() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-extrabold text-selva dark:text-sol">
        Sin conexión a internet
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-neutral-700 dark:text-white/85">
        Parece que no tenés conexión ahora mismo. En Ixiamas la señal puede
        fallar: cuando vuelva, el sitio se actualiza solo. Las páginas que ya
        visitaste quedan guardadas para leerlas sin internet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-selva px-6 py-3 font-display font-bold text-white dark:bg-sol dark:text-noche"
      >
        ← Volver al inicio
      </Link>
    </section>
  );
}
