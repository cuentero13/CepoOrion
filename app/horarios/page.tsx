import type { Metadata } from "next";
import { institucion, esMarcador } from "@/lib/institucion";
import { horarios, tieneDatosReales } from "@/lib/horarios";
import Marcador from "@/components/Marcador";
import HorariosTabla from "@/components/HorariosTabla";

export const metadata: Metadata = {
  title: "Horarios | CEPO",
  description:
    "Tabla de horarios de CEPO por nivel, turno y materia, con vista semanal y vista de hoy.",
};

export default function Horarios() {
  const reales = tieneDatosReales(horarios.niveles);
  const niveles = reales ? horarios.niveles : horarios.ejemplo.niveles;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-rio">
        Horarios
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Horarios de clases
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-neutral-700 dark:text-white/85">
        La tabla de horarios por nivel, turno y materia. Elegí la vista de
        hoy o la vista semanal.
      </p>

      <div className="mt-6 max-w-2xl">
        {esMarcador(institucion.horarios) ? (
          <Marcador
            texto={institucion.horarios}
            titulo="Horarios definitivos pendientes"
          />
        ) : (
          <p className="leading-relaxed text-neutral-700 dark:text-white/85">
            {institucion.horarios}
          </p>
        )}
        <p className="mt-3 text-sm text-neutral-600 dark:text-white/75">
          Turnos:{" "}
          {esMarcador(institucion.turnos)
            ? institucion.turnos
            : institucion.turnos}
        </p>
      </div>

      <div className="mt-8">
        <HorariosTabla
          niveles={niveles}
          esEjemplo={!reales}
          aviso={reales ? undefined : horarios.ejemplo.aviso}
        />
      </div>

      <p className="mt-8 max-w-2xl rounded-2xl border-2 border-sol/60 bg-white p-4 text-sm leading-relaxed dark:bg-noche-claro">
        ¿Sos docente o parte de la dirección? Los horarios se editan sin
        programar en el archivo{" "}
        <code className="rounded bg-sol/20 px-1 py-0.5 text-xs">
          data/horarios.json
        </code>
        : al reemplazar los marcadores [COMPLETAR] con los datos reales, esta
        página muestra automáticamente el horario real y deja de mostrar el
        ejemplo.
      </p>
    </div>
  );
}
