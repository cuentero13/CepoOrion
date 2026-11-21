import type { Metadata } from "next";
import Link from "next/link";
import { institucion } from "@/lib/institucion";

export const metadata: Metadata = {
  title: "Política de Privacidad | CEPO",
  description:
    "Política de privacidad del Centro Educativo Privado Orion (CEPO) en lenguaje sencillo: qué datos mínimos se recogen, para qué se usan, quién los ve y cómo pedir que se borren.",
};

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md sm:p-6 dark:border-white/10 dark:bg-noche-claro">
      <h2 className="font-display text-xl font-extrabold text-selva dark:text-sol">
        {titulo}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed text-neutral-700 dark:text-white/85">
        {children}
      </div>
    </section>
  );
}

export default function Privacidad() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        {institucion.nombre} — Ixiamas, Bolivia
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Política de Privacidad
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
        Esta página explica, en palabras simples, qué datos recoge este
        sitio, para qué los usa y quién los puede ver. Si algo no se
        entiende, preguntanos: estamos para ayudar.
      </p>

      <Seccion titulo="1. Qué datos recogemos (lo mínimo)">
        <p>
          Solo pedimos lo necesario para que el colegio funcione. Según lo
          que uses en el sitio, podemos recoger:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Alias:</strong> el nombre que elegís para entrar al sitio.
            No hace falta usar tu nombre real.
          </li>
          <li>
            <strong>Curso:</strong> el curso o nivel al que pertenecés, para
            organizar los horarios y el seguimiento.
          </li>
          <li>
            <strong>Correo electrónico (opcional):</strong> solo si vos lo
            escribís, por ejemplo para recuperar tu cuenta. Nunca es
            obligatorio.
          </li>
          <li>
            <strong>Resultados de exámenes y juegos:</strong> tus respuestas
            del examen diagnóstico y tu progreso en los juegos de
            conocimiento, para que veas cómo vas avanzando.
          </li>
          <li>
            <strong>Mensajes del buzón privado:</strong> lo que escribas en el{" "}
            <Link
              href="/buzon"
              className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
            >
              Buzón privado
            </Link>
            , con tu alias o de forma anónima, si así lo elegís.
          </li>
        </ul>
        <p>
          No pedimos documentos, direcciones particulares, números de
          teléfono de estudiantes ni datos de salud.
        </p>
      </Seccion>

      <Seccion titulo="2. Para qué usamos esos datos">
        <ul className="list-disc space-y-1 pl-5">
          <li>Para que puedas entrar con tu alias y ver tu progreso.</li>
          <li>
            Para que tus docentes sepan cómo va tu aprendizaje y te puedan
            ayudar.
          </li>
          <li>
            Para organizar los horarios y las actividades del colegio.
          </li>
          <li>
            Para leer y responder los mensajes del buzón privado.
          </li>
        </ul>
        <p>
          Nunca usamos tus datos para vender nada, ni para publicidad, ni
          para otra cosa que no sea el trabajo del colegio.
        </p>
      </Seccion>

      <Seccion titulo="3. Quién puede ver tus datos">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Vos:</strong> solo vos ves tus resultados y tu progreso.
            Ningún otro estudiante puede verlos.
          </li>
          <li>
            <strong>Tus docentes:</strong> ven los resultados y el progreso de
            sus estudiantes, para acompañarlos, y leen los mensajes del
            buzón privado.
          </li>
          <li>
            <strong>La dirección del colegio</strong> (director Irguen Rosas):
            ve los mismos datos que los docentes y administra el buzón
            privado.
          </li>
        </ul>
        <p>
          Nadie fuera del colegio tiene acceso a tus datos. No los
          compartimos con empresas ni con otras instituciones.
        </p>
      </Seccion>

      <Seccion titulo="4. Consentimiento y autorización para menores de edad">
        <p>
          Muchos estudiantes del colegio son menores de edad. Por eso, para
          crear una cuenta en este sitio hace falta la{" "}
          <strong>
            autorización de tu madre, tu padre o tu tutor o tutora
          </strong>
          .
        </p>
        <p>
          Al registrarte, confirmás que tu madre, padre o tutor sabe que vas
          a usar el sitio y está de acuerdo con esta política. Si sos madre,
          padre o tutor y querés saber qué datos tiene tu hijo o hija, o
          retirar la autorización, hablá con la dirección del colegio (ver
          contacto al final de esta página).
        </p>
      </Seccion>

      <Seccion titulo="5. Qué NO recogemos">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Sin anuncios:</strong> este sitio no tiene publicidad.
          </li>
          <li>
            <strong>Sin rastreadores de terceros:</strong> no usamos servicios
            que sigan lo que hacés en internet ni vendan tu información.
          </li>
          <li>
            <strong>Sin ubicación:</strong> no registramos dónde estás.
          </li>
          <li>
            <strong>Sin contraseñas ajenas:</strong> tu contraseña del sitio
            solo sirve para entrar acá; nunca te vamos a pedir la contraseña
            de tu correo ni de ninguna otra cuenta.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="6. Cómo pedir que se borren tus datos">
        <p>
          Si querés que borremos tus datos (tu cuenta, tus resultados o un
          mensaje del buzón), podés pedirlo de dos formas:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Escribiendo por el{" "}
            <Link
              href="/buzon"
              className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
            >
              Buzón privado
            </Link>{" "}
            (podés hacerlo de forma anónima, indicando qué querés que se
            borre).
          </li>
          <li>
            Hablando directamente con la dirección del colegio, en persona o
            por los medios de la página de{" "}
            <Link
              href="/contacto"
              className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
            >
              Contacto
            </Link>
            .
          </li>
        </ul>
        <p>
          La dirección responde la solicitud y borra los datos que le pidas,
          salvo los que el colegio deba guardar por obligación (por ejemplo,
          registros académicos oficiales).
        </p>
      </Seccion>

      <Seccion titulo="7. Contacto">
        <p>
          Responsable de este sitio: {institucion.nombre}, Ixiamas, provincia
          Iturralde, La Paz, Bolivia. Director: {institucion.director}.
        </p>
        <p>
          Teléfono:{" "}
          <a
            href={`tel:${institucion.contacto.telefono.replace(/\s/g, "")}`}
            className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
          >
            {institucion.contacto.telefono}
          </a>
          . Para más formas de contactarnos, visitá la página de{" "}
          <Link
            href="/contacto"
            className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
          >
            Contacto
          </Link>
          .
        </p>
        <p>
          ¿Tenés un comentario, una sugerencia o una consulta? Usá el{" "}
          <Link
            href="/buzon"
            className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
          >
            Buzón privado
          </Link>
          : tu mensaje llega solo a la dirección del colegio.
        </p>
      </Seccion>
    </div>
  );
}
