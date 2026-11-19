import horariosJson from "@/data/horarios.json";

export interface Bloque {
  hora: string;
  materia: string;
  docente?: string;
}

export interface DiaHorario {
  dia: string;
  bloques: Bloque[];
}

export interface NivelHorario {
  nivel: string;
  turno: string;
  dias: DiaHorario[];
}

export interface HorariosData {
  nota: string;
  niveles: NivelHorario[];
  ejemplo: {
    aviso: string;
    niveles: NivelHorario[];
  };
}

export const horarios: HorariosData = horariosJson as HorariosData;

export const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
] as const;

/** Un bloque cuenta como dato real solo si la materia no es un marcador. */
export function esBloqueReal(bloque: Bloque): boolean {
  return (
    bloque.materia.trim() !== "" &&
    !bloque.materia.includes("[COMPLETAR") &&
    !bloque.materia.includes("[VERIFICAR")
  );
}

/** True si algún nivel tiene al menos un bloque con datos reales. */
export function tieneDatosReales(niveles: NivelHorario[]): boolean {
  return niveles.some((n) =>
    n.dias.some((d) => d.bloques.some((b) => esBloqueReal(b))),
  );
}
