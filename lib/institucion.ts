import institucionJson from "@/config/institucion.json";

export interface Institucion {
  nombre: string;
  sigla: string;
  lema: string;
  lema_estado: string;
  director: string;
  niveles: string[];
  niveles_nota: string;
  ubicacion: {
    municipio: string;
    provincia: string;
    departamento: string;
    pais: string;
    direccion_exacta: string;
    mapa_centro: {
      latitud: number;
      longitud: number;
      nota: string;
    };
    mapa_url: string;
  };
  contacto: {
    telefono: string;
    whatsapp: string;
    whatsapp_url: string;
    correo: string;
    tiktok: string;
    tiktok_usuario: string;
    horario_atencion: string;
  };
  materias: string[];
  costos: {
    inscripcion_bs: number;
    por_materia_bs: number;
    nota: string;
  };
  historia: string;
  mision: string;
  vision: string;
  valores: string;
  plantel_docente: string;
  turnos: string;
  horarios: string;
  anio_lectivo: string;
}

export const institucion: Institucion = institucionJson.institucion as Institucion;

/** Devuelve true si un valor es un marcador pendiente ([COMPLETAR] o [VERIFICAR]). */
export function esMarcador(valor: string): boolean {
  return valor.includes("[COMPLETAR") || valor.includes("[VERIFICAR");
}
