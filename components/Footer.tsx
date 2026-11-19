import Link from "next/link";
import { institucion, esMarcador } from "@/lib/institucion";
import OrionLogo from "./OrionLogo";

export default function Footer() {
  const { ubicacion, contacto } = institucion;
  return (
    <footer className="patron-cesteria-oscuro bg-noche text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <OrionLogo />
          <p className="mt-3 text-sm leading-relaxed text-white/85">
            {institucion.nombre}. {ubicacion.municipio}, provincia{" "}
            {ubicacion.provincia}, {ubicacion.departamento}, {ubicacion.pais}.
          </p>
          <p className="mt-2 text-sm text-white/85">
            Director: {institucion.director}
          </p>
          <p className="mt-2 text-sm text-white/85">
            Niveles: {institucion.niveles.join(", ")}.
          </p>
        </div>

        <nav aria-label="Enlaces del pie de página">
          <h2 className="font-display text-lg font-bold text-sol">Secciones</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link className="underline-offset-2 hover:underline" href="/nosotros">Nosotros</Link></li>
            <li><Link className="underline-offset-2 hover:underline" href="/horarios">Horarios</Link></li>
            <li><Link className="underline-offset-2 hover:underline" href="/diagnostico">Examen diagnóstico</Link></li>
            <li><Link className="underline-offset-2 hover:underline" href="/juegos">Juegos de conocimiento</Link></li>
            <li><Link className="underline-offset-2 hover:underline" href="/buzon">Buzón privado</Link></li>
            <li><Link className="underline-offset-2 hover:underline" href="/privacidad">Política de Privacidad</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-lg font-bold text-sol">Contacto</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              Teléfono:{" "}
              <a className="underline-offset-2 hover:underline" href={`tel:${contacto.telefono.replace(/\s/g, "")}`}>
                {contacto.telefono}
              </a>
            </li>
            <li>
              WhatsApp:{" "}
              {esMarcador(contacto.whatsapp) ? (
                <span>{contacto.whatsapp}</span>
              ) : (
                <a className="underline-offset-2 hover:underline" href={contacto.whatsapp_url}>
                  {contacto.telefono}
                </a>
              )}
            </li>
            <li>
              Correo:{" "}
              {esMarcador(contacto.correo) ? (
                <span>{contacto.correo}</span>
              ) : (
                <a className="underline-offset-2 hover:underline" href={`mailto:${contacto.correo}`}>
                  {contacto.correo}
                </a>
              )}
            </li>
            <li>Dirección: {ubicacion.direccion_exacta}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 py-4 text-center text-xs text-white/70">
        <p>
          © {new Date().getFullYear()} {institucion.nombre} — Ixiamas, Bolivia.
          Sitio sin anuncios ni rastreadores de terceros.
        </p>
        <p className="mt-1">«{institucion.lema}»</p>
      </div>
    </footer>
  );
}
