import Link from "next/link";

export default function EnConstruccion({
  titulo,
  fase,
  descripcion,
}: {
  titulo: string;
  fase: string;
  descripcion: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-rio">
        Fase {fase} — próximamente
      </p>
      <h1 className="mt-3 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        {titulo}
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-neutral-700 dark:text-white/85">
        {descripcion}
      </p>
      <p className="mx-auto mt-4 max-w-xl rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-4 text-sm leading-relaxed text-neutral-700 dark:text-white/85">
        Esta sección se construye en la fase {fase}. Los datos reales
        (horarios, preguntas, plantel) se cargan desde{" "}
        <code className="rounded bg-white px-1 py-0.5 text-xs dark:bg-noche">
          config/institucion.json
        </code>{" "}
        y la carpeta{" "}
        <code className="rounded bg-white px-1 py-0.5 text-xs dark:bg-noche">data/</code>.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
      >
        ← Volver al inicio
      </Link>
    </section>
  );
}
