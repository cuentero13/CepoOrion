/**
 * Carga de los datos de los juegos: import estático de los JSON en
 * data/juegos/ (ver lib/juegos.ts para el esquema — contrato).
 *
 * Los datos los edita la dirección o un docente sin programar: basta
 * con editar el JSON y el sitio muestra el contenido nuevo. Ver
 * docs/fase-e.md y data/README.md.
 */

import madidiJson from "@/data/juegos/madidi.json";
import primerosAuxiliosJson from "@/data/juegos/primeros-auxilios.json";
import mapaJson from "@/data/juegos/mapa.json";
import constelacionesJson from "@/data/juegos/constelaciones.json";
import detectiveJson from "@/data/juegos/detective.json";
import presupuestoJson from "@/data/juegos/presupuesto.json";
import type {
  JuegoDetective,
  JuegoId,
  JuegoPreguntas,
  JuegoPresupuesto,
  JuegoPrimerosAuxilios,
} from "./juegos";

export const DATOS_MADIDI = madidiJson as unknown as JuegoPreguntas;
export const DATOS_PRIMEROS_AUXILIOS =
  primerosAuxiliosJson as unknown as JuegoPrimerosAuxilios;
export const DATOS_MAPA = mapaJson as unknown as JuegoPreguntas;
export const DATOS_CONSTELACIONES =
  constelacionesJson as unknown as JuegoPreguntas;
export const DATOS_DETECTIVE = detectiveJson as unknown as JuegoDetective;
export const DATOS_PRESUPUESTO =
  presupuestoJson as unknown as JuegoPresupuesto;

export const DATOS_JUEGOS: Record<
  JuegoId,
  | JuegoPreguntas
  | JuegoPrimerosAuxilios
  | JuegoDetective
  | JuegoPresupuesto
> = {
  madidi: DATOS_MADIDI,
  "primeros-auxilios": DATOS_PRIMEROS_AUXILIOS,
  mapa: DATOS_MAPA,
  constelaciones: DATOS_CONSTELACIONES,
  detective: DATOS_DETECTIVE,
  presupuesto: DATOS_PRESUPUESTO,
};

export function datosJuego(id: JuegoId) {
  return DATOS_JUEGOS[id];
}

/** Cantidad de ítems (preguntas / casos / escenarios) de cada juego. */
export function totalItems(id: JuegoId): number {
  switch (id) {
    case "madidi":
      return DATOS_MADIDI.preguntas.length;
    case "primeros-auxilios":
      return DATOS_PRIMEROS_AUXILIOS.preguntas.length;
    case "mapa":
      return DATOS_MAPA.preguntas.length;
    case "constelaciones":
      return DATOS_CONSTELACIONES.preguntas.length;
    case "detective":
      return DATOS_DETECTIVE.casos.length;
    case "presupuesto":
      return DATOS_PRESUPUESTO.escenarios.length;
  }
}
