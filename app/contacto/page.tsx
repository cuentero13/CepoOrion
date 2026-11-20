import type { Metadata } from "next";
import Link from "next/link";
import { institucion, esMarcador } from "@/lib/institucion";
import Marcador from "@/components/Marcador";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contacto | CEPO",
  description:
    "Datos de contacto del Centro Educativo Privado Orion (CEPO) en Ixiamas, Bolivia: director, teléfono y WhatsApp.",
};

function DatoContacto({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md dark:border-white/10 dark:bg-noche-claro">
      <h2 className="font-display text-lg font-bold text-tierra-oscuro dark:text-sol">
        {etiqueta}
      </h2>
      <div className="mt-2 text-neutral-800 dark:text-white/90">{children}</div>
    </div>
  );
}

export default function Contacto() {
  const { contacto, ubicacion } = institucion;
  const telefonoLimpio = contacto.telefono.replace(/\s/g, "");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Contacto
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Hablemos
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-neutral-700 dark:text-white/85">
        Para inscripciones, consultas sobre horarios o cualquier duda sobre
        CEPO, escribinos o llamanos. Atendemos a estudiantes de bachillerato
        de Ixiamas y la región.
      </p>

      <Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DatoContacto etiqueta="📞 Teléfono">
          <a
            href={`tel:${telefonoLimpio}`}
            className="font-display text-2xl font-extrabold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
          >
            {contacto.telefono}
          </a>
          <p className="mt-2 text-sm text-neutral-600 dark:text-white/75">
            Director: {institucion.director}
          </p>
        </DatoContacto>

        <DatoContacto etiqueta="💬 WhatsApp">
          {esMarcador(contacto.whatsapp) ? (
            <>
              <p className="font-display text-xl font-bold">{contacto.telefono}</p>
              <div className="mt-2">
                <Marcador
                  texto={contacto.whatsapp}
                  titulo="Enlace pendiente de verificar"
                />
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-white/75">
                Mientras se confirma, el enlace es:{" "}
                <a
                  href={contacto.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
                >
                  wa.me/59173956239
                </a>
              </p>
            </>
          ) : (
            <a
              href={contacto.whatsapp_url}
              target="_blank"
              rel="noreferrer"
              className="font-display text-2xl font-extrabold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
            >
              {contacto.telefono} ↗
            </a>
          )}
        </DatoContacto>

        <DatoContacto etiqueta="✉️ Correo">
          {esMarcador(contacto.correo) ? (
            <Marcador texto={contacto.correo} />
          ) : (
            <a
              href={`mailto:${contacto.correo}`}
              className="font-display text-xl font-extrabold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
            >
              {contacto.correo}
            </a>
          )}
        </DatoContacto>

        <DatoContacto etiqueta="📍 Dirección">
          <p>
            {ubicacion.municipio}, provincia {ubicacion.provincia},{" "}
            {ubicacion.departamento}, {ubicacion.pais}
          </p>
          <p className="mt-2 text-sm">{ubicacion.direccion_exacta}</p>
          <Link
            href="/nosotros#ubicacion"
            className="mt-3 inline-block font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
          >
            Ver el mapa →
          </Link>
        </DatoContacto>

        <DatoContacto etiqueta="🕐 Horario de atención">
          {esMarcador(contacto.horario_atencion) ? (
            <Marcador texto={contacto.horario_atencion} />
          ) : (
            <p>{contacto.horario_atencion}</p>
          )}
        </DatoContacto>

        <DatoContacto etiqueta="🌐 Redes sociales">
          <p className="text-sm text-neutral-600 dark:text-white/75">
            Nuestra única red social es TikTok:
          </p>
          <a
            href={contacto.tiktok}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block font-display text-xl font-extrabold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
          >
            {contacto.tiktok_usuario} ↗
          </a>
        </DatoContacto>
      </div>
      </Reveal>

      <p className="mt-8 max-w-2xl rounded-2xl border-2 border-sol/60 bg-white p-4 text-sm leading-relaxed dark:bg-noche-claro">
        ¿Tenés un comentario, una sugerencia o una consulta para la dirección?
        Usá el{" "}
        <Link
          href="/buzon"
          className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
        >
          Buzón privado
        </Link>
        : los mensajes llegan solo al panel administrativo y podés escribir de
        forma anónima.
      </p>
    </div>
  );
}
