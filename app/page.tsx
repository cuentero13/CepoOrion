import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import { Jaguar, Paraba, Tapir, DelfinRio } from "@/components/fauna";
import { institucion } from "@/lib/institucion";

const TARJETAS = [
  {
    href: "/diagnostico",
    icono: "📝",
    titulo: "Examen diagnóstico",
    texto:
      "Descubrí tu nivel en Matemática, Lenguaje, Ciencias Naturales, Ciencias Sociales e Inglés, con recomendaciones de estudio.",
    color: "bg-rio text-white",
    boton: "Empezar diagnóstico",
  },
  {
    href: "/juegos",
    icono: "🎮",
    titulo: "Juegos de conocimiento",
    texto:
      "Aventura Madidi, Mi primer presupuesto, Detective de noticias, Primeros auxilios, Mapa de Bolivia y Constelaciones.",
    color: "bg-sol text-noche",
    boton: "Jugar y aprender",
  },
  {
    href: "/nosotros",
    icono: "🌿",
    titulo: "Nosotros",
    texto:
      "Conocé la historia, misión y visión de CEPO y qué significa aprender bajo el cielo de Orión en Ixiamas.",
    color: "bg-selva text-white",
    boton: "Conocer CEPO",
  },
  {
    href: "/horarios",
    icono: "🗓️",
    titulo: "Horarios",
    texto:
      "La tabla de horarios por nivel, turno y materia. Vista semanal y vista de hoy.",
    color: "bg-tierra text-white",
    boton: "Ver horarios",
  },
];

const FAUNA = [
  { Componente: Jaguar, nombre: "Jaguar", dato: "El felino más grande de América vive en Madidi." },
  { Componente: Paraba, nombre: "Paraba roja", dato: "Guacamayo de colores vivos de la jungla amazónica." },
  { Componente: Tapir, nombre: "Tapir", dato: "El mamífero terrestre más grande de Sudamérica." },
  { Componente: DelfinRio, nombre: "Bufeo", dato: "El delfín rosado de río, habitante de los ríos amazónicos." },
];

export default function Inicio() {
  return (
    <>
      <Hero />

      {/* Accesos rápidos */}
      <Reveal>
      <section aria-labelledby="accesos" className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="accesos" className="text-center font-display text-3xl font-extrabold text-selva dark:text-sol">
          ¿Qué querés hacer hoy?
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TARJETAS.map((t) => (
            <article
              key={t.href}
              className="flex flex-col rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-noche-claro"
            >
              <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${t.color}`} aria-hidden="true">
                {t.icono}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-noche dark:text-white">{t.titulo}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-700 dark:text-white/85">{t.texto}</p>
              <Link
                href={t.href}
                className="mt-4 inline-block rounded-full bg-noche px-5 py-2 text-center font-bold text-white transition-colors hover:bg-selva dark:bg-sol dark:text-noche dark:hover:bg-sol/80"
              >
                {t.boton} →
              </Link>
            </article>
          ))}
        </div>
      </section>
      </Reveal>

      {/* Franja de fauna de Madidi */}
      <Reveal>
      <section aria-labelledby="fauna" className="patron-cesteria bg-rio/10 py-12 dark:bg-rio/20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 id="fauna" className="text-center font-display text-3xl font-extrabold text-selva dark:text-sol">
            Vecinos del monte
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-neutral-700 dark:text-white/85">
            Ixiamas es puerta del Parque Nacional Madidi. Estas son algunas de
            las especies que viven en nuestra región.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {FAUNA.map(({ Componente, nombre, dato }) => (
              <figure
                key={nombre}
                className="rounded-3xl bg-white p-4 text-center shadow-md dark:bg-noche"
              >
                <Componente className="mx-auto h-36 w-36" />
                <figcaption className="mt-2 font-display text-lg font-bold text-noche dark:text-white">
                  {nombre}
                </figcaption>
                <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-white/75">{dato}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      {/* Datos de la institución */}
      <Reveal>
      <section aria-labelledby="cepo-datos" className="mx-auto max-w-6xl px-4 py-12">
        <h2 id="cepo-datos" className="text-center font-display text-3xl font-extrabold text-selva dark:text-sol">
          CEPO en Ixiamas
        </h2>
        <dl className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-sol/60 bg-white p-4 dark:bg-noche-claro">
            <dt className="font-bold text-tierra-oscuro dark:text-sol">Director</dt>
            <dd className="mt-1 text-lg font-display font-bold">{institucion.director}</dd>
          </div>
          <div className="rounded-2xl border-2 border-sol/60 bg-white p-4 dark:bg-noche-claro">
            <dt className="font-bold text-tierra-oscuro dark:text-sol">Niveles</dt>
            <dd className="mt-1 text-lg font-display font-bold">
              {institucion.niveles.join(", ")}
            </dd>
            <dd className="text-sm text-neutral-600 dark:text-white/75">{institucion.niveles_nota}</dd>
          </div>
          <div className="rounded-2xl border-2 border-sol/60 bg-white p-4 dark:bg-noche-claro">
            <dt className="font-bold text-tierra-oscuro dark:text-sol">Ubicación</dt>
            <dd className="mt-1 text-lg font-display font-bold">
              {institucion.ubicacion.municipio}, {institucion.ubicacion.provincia}
            </dd>
            <dd className="text-sm text-neutral-600 dark:text-white/75">
              {institucion.ubicacion.departamento}, {institucion.ubicacion.pais}
            </dd>
          </div>
          <div className="rounded-2xl border-2 border-sol/60 bg-white p-4 dark:bg-noche-claro">
            <dt className="font-bold text-tierra-oscuro dark:text-sol">Contacto</dt>
            <dd className="mt-1 text-lg font-display font-bold">{institucion.contacto.telefono}</dd>
            <dd className="text-sm text-neutral-600 dark:text-white/75">
              {institucion.contacto.whatsapp}
            </dd>
          </div>
        </dl>
      </section>
      </Reveal>
    </>
  );
}
