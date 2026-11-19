import type { Metadata } from "next";
import FormularioRegistro from "./FormularioRegistro";

export const metadata: Metadata = { title: "Crear cuenta | CEPO" };

export default function PaginaRegistro() {
  return (
    <section className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Centro Educativo Privado Orion
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Crear tu cuenta
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
        Con tu cuenta verás tus diagnósticos, tu evolución y tus insignias.
        Solo tú ves tus resultados.
      </p>
      <FormularioRegistro />
    </section>
  );
}
