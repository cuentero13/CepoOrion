import type { Metadata } from "next";
import Link from "next/link";
import { institucion, esMarcador } from "@/lib/institucion";
import Marcador from "@/components/Marcador";
import OrionLogo from "@/components/OrionLogo";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Nosotros | CEPO",
  description:
    "Historia, misión, visión y valores del Centro Educativo Privado Orion (CEPO) en Ixiamas, Abel Iturralde, La Paz, Bolivia.",
};

function TarjetaTexto({
  titulo,
  texto,
  color,
}: {
  titulo: string;
  texto: string;
  color: string;
}) {
  return (
    <article className="rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md dark:border-white/10 dark:bg-noche-claro">
      <h2 className={`font-display text-2xl font-extrabold ${color}`}>{titulo}</h2>
      <div className="mt-3">
        {esMarcador(texto) ? (
          <Marcador texto={texto} />
        ) : (
          <p className="leading-relaxed text-neutral-700 dark:text-white/85">{texto}</p>
        )}
      </div>
    </article>
  );
}

export default function Nosotros() {
  const { ubicacion } = institucion;
  const mapa_centro = ubicacion.mapa_centro;
  const bbox = `${(mapa_centro.longitud - 0.06).toFixed(5)}%2C${(mapa_centro.latitud - 0.04).toFixed(5)}%2C${(mapa_centro.longitud + 0.06).toFixed(5)}%2C${(mapa_centro.latitud + 0.04).toFixed(5)}`;
  const mapaEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${mapa_centro.latitud}%2C${mapa_centro.longitud}`;
  const mapaEnlace = `https://www.openstreetmap.org/?mlat=${mapa_centro.latitud}&mlon=${mapa_centro.longitud}#map=14/${mapa_centro.latitud}/${mapa_centro.longitud}`;

  return (
    <>
      {/* Encabezado */}
      <section className="patron-cesteria bg-rio/10 py-12 dark:bg-rio/20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
            Nosotros
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
            Centro Educativo Privado Orion
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-neutral-700 dark:text-white/85">
            CEPO es un colegio privado de bachillerato en Ixiamas, puerta del
            norte amazónico paceño y zona de influencia del Parque Nacional
            Madidi.
          </p>
          <p className="mt-4 inline-block rounded-full bg-noche px-4 py-2 font-display font-bold text-white dark:bg-sol dark:text-noche">
            «{institucion.lema}»
          </p>
          <p className="mt-2 text-xs text-neutral-600 dark:text-white/70">
            {institucion.lema_estado}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
        {/* Qué significa CEPO */}
        <Reveal>
        <section aria-labelledby="que-significa">
          <h2
            id="que-significa"
            className="font-display text-2xl font-extrabold text-selva dark:text-sol"
          >
            ¿Qué significa CEPO?
          </h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border-2 border-sol/60 bg-white p-5 shadow-md dark:bg-noche-claro">
              <dl className="space-y-2">
                <div>
                  <dt className="font-bold text-tierra-oscuro dark:text-sol">CEPO</dt>
                  <dd className="font-display text-xl font-bold">
                    Centro Educativo Privado Orion
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-tierra-oscuro dark:text-sol">Director</dt>
                  <dd>{institucion.director}</dd>
                </div>
                <div>
                  <dt className="font-bold text-tierra-oscuro dark:text-sol">Niveles</dt>
                  <dd>
                    {institucion.niveles.join(", ")}.{" "}
                    {institucion.niveles_nota}
                  </dd>
                </div>
              </dl>
            </article>
            <article className="flex flex-col items-start rounded-3xl bg-noche p-5 text-white shadow-md dark:bg-noche-claro">
              <OrionLogo sobreOscuro />
              <h3 className="mt-4 font-display text-xl font-bold text-sol">
                Por qué Orión
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                Orión es la constelación de Las Tres Marías, visible en el
                cielo nocturno de Ixiamas. Nuestro nombre y nuestro logo la
                usan como símbolo de orientación: como las estrellas guían en
                la noche, la educación guía a nuestros estudiantes.
              </p>
            </article>
          </div>
        </section>
        </Reveal>

        {/* Historia */}
        <Reveal>
        <section aria-labelledby="historia">
          <h2
            id="historia"
            className="font-display text-2xl font-extrabold text-selva dark:text-sol"
          >
            Nuestra historia
          </h2>
          <div className="mt-4">
            {esMarcador(institucion.historia) ? (
              <Marcador texto={institucion.historia} />
            ) : (
              <p className="leading-relaxed text-neutral-700 dark:text-white/85">
                {institucion.historia}
              </p>
            )}
          </div>
        </section>
        </Reveal>

        {/* Misión, visión y valores */}
        <Reveal>
        <section aria-labelledby="mision-vision">
          <h2
            id="mision-vision"
            className="font-display text-2xl font-extrabold text-selva dark:text-sol"
          >
            Misión, visión y valores
          </h2>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            <TarjetaTexto
              titulo="Misión"
              texto={institucion.mision}
              color="text-selva dark:text-sol"
            />
            <TarjetaTexto
              titulo="Visión"
              texto={institucion.vision}
              color="text-rio-oscuro dark:text-rio-claro"
            />
            <TarjetaTexto
              titulo="Valores"
              texto={institucion.valores}
              color="text-tierra-oscuro dark:text-sol"
            />
          </div>
        </section>
        </Reveal>

        {/* Plantel docente */}
        <Reveal>
        <section aria-labelledby="plantel">
          <h2
            id="plantel"
            className="font-display text-2xl font-extrabold text-selva dark:text-sol"
          >
            Plantel docente
          </h2>
          <div className="mt-4 max-w-2xl">
            <p className="leading-relaxed text-neutral-700 dark:text-white/85">
              Publicamos los nombres y materias del plantel solo con los datos
              reales que proporcione la dirección, para no exponer información
              incorrecta.
            </p>
            <div className="mt-3">
              <Marcador texto={institucion.plantel_docente} />
            </div>
          </div>
        </section>
        </Reveal>

        {/* Ubicación */}
        <Reveal>
        <section aria-labelledby="ubicacion">
          <h2
            id="ubicacion"
            className="font-display text-2xl font-extrabold text-selva dark:text-sol"
          >
            Dónde estamos
          </h2>
          <div className="mt-4 grid gap-5 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <dl className="space-y-3 rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md dark:border-white/10 dark:bg-noche-claro">
                <div>
                  <dt className="font-bold text-tierra-oscuro dark:text-sol">Municipio</dt>
                  <dd>
                    {ubicacion.municipio}, provincia {ubicacion.provincia}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-tierra-oscuro dark:text-sol">Departamento</dt>
                  <dd>
                    {ubicacion.departamento}, {ubicacion.pais}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold text-tierra-oscuro dark:text-sol">Dirección exacta</dt>
                  <dd>{ubicacion.direccion_exacta}</dd>
                </div>
                <div>
                  <dt className="font-bold text-tierra-oscuro dark:text-sol">Contacto</dt>
                  <dd>
                    Director: {institucion.director}
                    <br />
                    Teléfono:{" "}
                    <a
                      className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
                      href={`tel:${institucion.contacto.telefono.replace(/\s/g, "")}`}
                    >
                      {institucion.contacto.telefono}
                    </a>
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-sm text-neutral-600 dark:text-white/75">
                {mapa_centro.nota}
              </p>
              <Link
                href="/contacto"
                className="mt-4 inline-block rounded-full bg-selva px-5 py-2 font-bold text-white transition-colors hover:bg-rio-oscuro dark:bg-sol dark:text-noche"
              >
                Ver datos de contacto →
              </Link>
            </div>
            <div className="lg:col-span-3">
              <iframe
                title="Mapa de Ixiamas, Bolivia (OpenStreetMap)"
                src={mapaEmbed}
                className="h-80 w-full rounded-3xl border-2 border-rio/30 shadow-md"
                loading="lazy"
              />
              <p className="mt-2 text-sm">
                <a
                  href={mapaEnlace}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
                >
                  Abrir el mapa de Ixiamas en OpenStreetMap ↗
                </a>
              </p>
            </div>
          </div>
        </section>
        </Reveal>
      </div>
    </>
  );
}
