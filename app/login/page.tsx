import type { Metadata } from "next";
import { Suspense } from "react";
import FormularioLogin from "./FormularioLogin";

export const metadata: Metadata = { title: "Entrar | CEPO" };

export default function PaginaLogin() {
  return (
    <section className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Centro Educativo Privado Orion
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Entrar a Mi progreso
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
        Entra con tu alias y tu contraseña para ver tus diagnósticos,
        tu evolución y tus insignias.
      </p>
      <Suspense>
        <FormularioLogin />
      </Suspense>
    </section>
  );
}
