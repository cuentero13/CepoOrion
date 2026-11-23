/**
 * Trabajos modernos sugeridos al terminar el diagnóstico (fase k).
 *
 * Solo trabajos de `data/despues-del-cole.json` (sección «¿Y si quiero
 * trabajar ya?» + lista extra). Nada inventado, cero sueldos: el nombre,
 * la descripción y el curso recomendado salen tal cual del informe.
 * La TABLA DE CORRESPONDENCIA (qué áreas del colegio se parecen a cada
 * trabajo) es una decisión de diseño explícita del equipo CEPO, no un
 * dato del informe: por eso está documentada acá, área por área.
 */

import datos from "@/data/despues-del-cole.json";
import type { Area, AreaLogica } from "./diagnostico";

export type TrabajoSugerido = {
  id: string;
  nombre: string;
  descripcion: string;
  /** Qué hace falta para empezar (tal cual del informe). */
  queNecesita?: string;
  /** Primer curso gratis recomendado (tal cual del informe). */
  curso?: { nombre: string; plataforma: string; enlace: string };
  /** Viene de la lista extra («bonus») del informe, no de los 10 principales. */
  extra?: boolean;
};

type TrabajoJson = {
  id: string;
  nombre: string;
  descripcion: string;
  que_necesita?: string;
  cursos?: { nombre: string; plataforma: string; enlace: string }[];
};

const trabajosBase = (datos.trabajar_ya.trabajos as TrabajoJson[]).map(
  (t): TrabajoSugerido => ({
    id: t.id,
    nombre: t.nombre,
    descripcion: t.descripcion,
    queNecesita: t.que_necesita,
    curso:
      t.cursos && t.cursos.length > 0
        ? {
            nombre: t.cursos[0].nombre,
            plataforma: t.cursos[0].plataforma,
            enlace: t.cursos[0].enlace,
          }
        : undefined,
  })
);

/** Ids de la lista extra del informe (no traen `id` propio). */
const IDS_EXTRA: Record<string, string> = {
  "Tester de apps": "tester-apps",
  "Creador UGC": "creador-ugc",
  "Tutor de español por conversación": "tutor-espanol",
};

const trabajosExtra: TrabajoSugerido[] = (
  datos.trabajar_ya.bonus as { nombre: string; descripcion: string }[]
).map((b) => ({
  id: IDS_EXTRA[b.nombre] ?? b.nombre.toLowerCase().replace(/\s+/g, "-"),
  nombre: b.nombre,
  descripcion: b.descripcion,
  extra: true,
}));

/** Todos los trabajos del informe (10 principales + 3 extra). */
export const TRABAJOS: TrabajoSugerido[] = [...trabajosBase, ...trabajosExtra];

/**
 * Los 3 más aptos para principiantes (según el propio informe: «cero
 * lectura y cero matemática» o «cero matemática»). Se usan para
 * completar la lista cuando las áreas fuertes del estudiante no dan
 * una correspondencia clara.
 */
export const TRABAJOS_PRINCIPIANTES = [
  "editor-video",
  "disenador-canva",
  "fotografia-celular",
];

/**
 * CORRESPONDENCIA ÁREA → TRABAJOS (decisión de diseño del equipo CEPO).
 * Se lee: «para este trabajo hace falta sobre todo esta habilidad del
 * colegio». No es un dato del informe ni una promesa de empleo.
 * - Lenguaje: escribir claro (redes, transcripción).
 * - Matemática / Lógica: orden y números (datos, Excel, asistencia).
 * - Inglés: escribir bien y escuchar (atención al cliente, transcripción;
 *   tutor de español: conversar, la otra cara del idioma).
 * - Ciencias Sociales: tratar con gente (ventas, redes).
 * - Ciencias Naturales: observar y registrar con el celular (foto, video).
 * - Filosofía: escuchar con atención y escribir con cuidado.
 */
export const MAPA_TRABAJOS_POR_AREA: Partial<
  Record<Area | AreaLogica, string[]>
> = {
  Lenguaje: ["community-manager", "transcripcion"],
  Matemática: ["entrada-datos", "asistente-virtual"],
  "Lógica matemática": ["entrada-datos", "asistente-virtual"],
  Inglés: ["atencion-cliente", "tutor-espanol", "transcripcion"],
  "Ciencias Sociales": ["ventas-whatsapp", "community-manager"],
  "Ciencias Naturales": ["fotografia-celular", "editor-video"],
  Filosofía: ["transcripcion", "atencion-cliente"],
};

/**
 * Sugiere 2–3 trabajos según las áreas más fuertes del estudiante
 * (por puntaje, de mayor a menor). Si no hay correspondencia clara,
 * completa con los trabajos más aptos para principiantes.
 */
export function sugerirTrabajos(
  puntajes: Partial<Record<Area | AreaLogica, number>>,
  cantidad = 3
): TrabajoSugerido[] {
  const areasOrdenadas = (
    Object.entries(puntajes) as [Area | AreaLogica, number][]
  )
    .filter(([, p]) => typeof p === "number")
    .sort((a, b) => b[1] - a[1])
    .map(([area]) => area);
  const elegidos: string[] = [];
  for (const area of areasOrdenadas) {
    for (const id of MAPA_TRABAJOS_POR_AREA[area] ?? []) {
      if (!elegidos.includes(id)) elegidos.push(id);
      if (elegidos.length >= cantidad) break;
    }
    if (elegidos.length >= cantidad) break;
  }
  for (const id of TRABAJOS_PRINCIPIANTES) {
    if (elegidos.length >= cantidad) break;
    if (!elegidos.includes(id)) elegidos.push(id);
  }
  const porId = new Map(TRABAJOS.map((t) => [t.id, t]));
  return elegidos
    .map((id) => porId.get(id))
    .filter((t): t is TrabajoSugerido => t !== undefined);
}
