/**
 * Orientación vocacional — modelo RIASEC de Holland (fase h).
 *
 * El cuestionario mide INTERESES (qué te gusta hacer), no capacidad:
 * se cruza con los resultados del diagnóstico (qué sabés hoy) para
 * sugerir familias de carreras para explorar. Nada de lo que sale aquí
 * es una predicción ni una decisión: es un punto de partida.
 * Solo aparecen carreras e instituciones confirmadas en el informe
 * oficial (data/despues-del-cole.json). No se muestran sueldos: ningún
 * organismo público de Bolivia publica sueldos por carrera.
 * Todo es funciones puras: se puede probar sin navegador ni base de datos.
 */

import {
  NIVEL_ORDEN,
  type Area,
  type Nivel,
  type ResultadoArea,
} from "./diagnostico";

export const DIMENSIONES_RIASEC = [
  {
    id: "realista",
    nombre: "Realista",
    descripcion: "Trabajo práctico, con las manos, al aire libre.",
    /** Área del diagnóstico afín (para desempatar dos dimensiones empatadas). */
    areaAfin: "Ciencias Naturales" as Area,
  },
  {
    id: "investigativo",
    nombre: "Investigativo",
    descripcion: "Entender cómo funcionan las cosas y por qué pasan.",
    areaAfin: "Matemática" as Area,
  },
  {
    id: "artistico",
    nombre: "Artístico",
    descripcion: "Crear, expresarse, inventar cosas nuevas.",
    areaAfin: "Lenguaje" as Area,
  },
  {
    id: "social",
    nombre: "Social",
    descripcion: "Ayudar, enseñar y cuidar a otras personas.",
    areaAfin: "Ciencias Sociales" as Area,
  },
  {
    id: "emprendedor",
    nombre: "Emprendedor",
    descripcion: "Vender, organizar y liderar proyectos.",
    areaAfin: "Ciencias Sociales" as Area,
  },
  {
    id: "convencional",
    nombre: "Convencional",
    descripcion: "Orden, registros y números exactos.",
    areaAfin: "Matemática" as Area,
  },
] as const;

export type DimensionRiasec = (typeof DIMENSIONES_RIASEC)[number]["id"];

export type PerfilVocacional = {
  /** Promedio 1–5 por dimensión RIASEC. */
  dimensiones: Record<string, number>;
  /** Las 2 dimensiones más altas (desempatadas por el área afín). */
  top2: DimensionRiasec[];
};

/** Aviso obligatorio: el cuestionario no decide por vos. */
export const AVISO_VOCACIONAL =
  "Esto no es un test psicológico ni una prueba oficial. Muestra qué te interesa hoy. Hablalo con tu familia y con tus docentes antes de decidir.";

/** Clave en el navegador donde queda guardado tu último perfil vocacional. */
export const CLAVE_PERFIL_LOCAL = "cepo-vocacional";

/**
 * Las 2 dimensiones con mayor promedio. Desempate: puntaje del área
 * del diagnóstico afín; si persiste, el orden fijo de la lista.
 */
export function calcularPerfilVocacional(
  promedios: Record<string, number>,
  puntajesAreas?: Partial<Record<Area, number>>
): PerfilVocacional {
  const ordenadas = [...DIMENSIONES_RIASEC].sort((a, b) => {
    const pa = promedios[a.id] ?? 0;
    const pb = promedios[b.id] ?? 0;
    if (pb !== pa) return pb - pa;
    const aa = puntajesAreas?.[a.areaAfin] ?? 0;
    const ab = puntajesAreas?.[b.areaAfin] ?? 0;
    return ab - aa;
  });
  return {
    dimensiones: promedios,
    top2: ordenadas.slice(0, 2).map((d) => d.id),
  };
}

export type FamiliaCarreras = {
  id: string;
  nombre: string;
  descripcion: string;
  /** Áreas del diagnóstico que pesan para esta familia. */
  areas: Area[];
  /** Dimensiones RIASEC ligadas a esta familia. */
  riasec: DimensionRiasec[];
  carreras: string[];
  vias: string[];
  advertencia?: string;
};

/**
 * Familias de carreras (plan fase h, §5.2). Solo carreras e
 * instituciones del informe oficial. Sin sueldos, sin promesas.
 */
export const FAMILIAS_CARRERAS: FamiliaCarreras[] = [
  {
    id: "ingenierias",
    nombre: "Ingenierías y tecnología",
    descripcion:
      "Construir, calcular y hacer que las cosas funcionen: sistemas, obras, máquinas, redes.",
    areas: ["Matemática"],
    riasec: ["investigativo", "realista"],
    carreras: [
      "Ing. de Sistemas",
      "Ing. Civil",
      "Ing. Forestal",
      "Ing. Agronómica",
      "Ing. Comercial",
      "Ing. Eléctrica",
      "Ing. Electrónica",
      "Mecánica Automotriz",
      "Mecánica Industrial",
      "Electromecánica",
      "Topografía / Geodesia",
      "Química Industrial",
      "Ing. en Inteligencia Artificial",
    ],
    vias: [
      "UMSA Tecnología (PSA Bs 150, inscripción hasta 23-ene-2027)",
      "UTO, UAGRM, UMSS",
      "UABJB Riberalta (Civil, Forestal)",
      "UAP virtual (Ing. en Inteligencia Artificial)",
    ],
    advertencia:
      "Son las áreas con mayor demanda empresarial (32% según la encuesta BID 2019).",
  },
  {
    id: "salud",
    nombre: "Salud y cuidado",
    descripcion:
      "Cuidar la salud de las personas y de los animales: medicina, enfermería, farmacia, veterinaria.",
    areas: ["Ciencias Naturales"],
    riasec: ["social", "investigativo"],
    carreras: [
      "Medicina",
      "Enfermería",
      "Nutrición",
      "Tecnología Médica",
      "Bioquímica y Farmacia",
      "Veterinaria y Zootecnia",
    ],
    vias: [
      "UMSA",
      "UABJB Trinidad (Medicina 5 años, Veterinaria)",
      "UTO (Medicina 210 plazas, Enfermería 78)",
      "UATF",
    ],
    advertencia:
      "Mucha competencia y sobredemanda de titulados (encuesta BID 2019).",
  },
  {
    id: "educacion",
    nombre: "Educación y docencia",
    descripcion:
      "Enseñar y acompañar a otros a aprender: maestro o maestra, educación especial, educación virtual.",
    areas: ["Lenguaje", "Ciencias Sociales"],
    riasec: ["social"],
    carreras: [
      "Maestro/a (ESFM)",
      "Ciencias de la Educación",
      "Educación Especial",
      "Educación Virtual",
    ],
    vias: [
      "ESFM (examen único nacional, Bs 108; 3.010 plazas en 2026)",
      "UABJB Riberalta",
      "UAP virtual",
    ],
    advertencia:
      "La convocatoria ESFM 2027 aún no está publicada [VERIFICAR].",
  },
  {
    id: "derecho-comunicacion",
    nombre: "Derecho, comunicación y ciencias sociales",
    descripcion:
      "Palabras, leyes y sociedad: derecho, periodismo, comunicación, lingüística.",
    areas: ["Lenguaje", "Ciencias Sociales"],
    riasec: ["social", "artistico", "emprendedor"],
    carreras: [
      "Derecho",
      "Comunicación Social",
      "Lingüística",
      "Ciencias de la Educación",
    ],
    vias: [
      "UABJB (Derecho en Riberalta, Comunicación en Trinidad)",
      "UMSA Humanidades",
    ],
    advertencia:
      "Derecho está entre las carreras con más egresados (sobredemanda).",
  },
  {
    id: "administracion",
    nombre: "Administración, economía y negocios",
    descripcion:
      "Cuentas, empresas y comercio: contaduría, administración, economía, marketing.",
    areas: ["Matemática", "Ciencias Sociales"],
    riasec: ["emprendedor", "convencional"],
    carreras: [
      "Contaduría Pública",
      "Administración de Empresas",
      "Ingeniería Comercial",
      "Economía",
      "Marketing Digital",
      "Comercio Internacional y Aduanas",
    ],
    vias: [
      "UMSA Económicas",
      "UABJB, UAGRM, UMSS",
      "UAP virtual (Contaduría, Administración Secretarial)",
    ],
    advertencia:
      "Contabilidad, Administración e Ing. Comercial: muy demandadas Y con muchísimos titulados (encuesta BID 2019).",
  },
  {
    id: "agro-territorio",
    nombre: "Agro, ambiente y territorio",
    descripcion:
      "La tierra, la selva y el turismo: agronomía, forestal, veterinaria, turismo.",
    areas: ["Ciencias Naturales"],
    riasec: ["realista", "investigativo"],
    carreras: [
      "Ing. Agronómica",
      "Ing. Forestal",
      "Ing. Agropecuaria",
      "Veterinaria y Zootecnia",
      "Gestión Turística y Hotelera",
      "Turismo",
      "Turismo Sostenible",
      "Gestión Ganadera",
    ],
    vias: [
      "UABJB (Riberalta, Guayaramerín, Trinidad)",
      "UAP",
      "UPEA (Turismo: Técnico Medio → Superior → Licenciatura)",
      "UMSA Agronomía",
    ],
    advertencia:
      "Hotelería y Turismo está entre las 10 carreras más demandadas (encuesta BID 2019).",
  },
  {
    id: "tecnicas-cortas",
    nombre: "Carreras técnicas cortas",
    descripcion:
      "Aprender un oficio en 3 años y salir a trabajar: técnico superior, práctico desde el primer día.",
    areas: [],
    riasec: ["realista", "convencional"],
    carreras: [
      "Técnico Superior INFOCAL: Enfermería, Mecánica Automotriz, Mecánica Industrial, Sistemas Informáticos, Gastronomía, Contaduría General, Administración Industrial, Mercadotecnia, Informática Industrial, Parvulario, Secretariado Ejecutivo",
      "Técnicos UMSA Tecnología y UPEA",
    ],
    vias: [
      "INFOCAL (3 años, 70% práctico)",
      "UMSA Tecnología",
      "UPEA",
    ],
    advertencia:
      "INFOCAL no otorga becas (FAQ oficial). Es la vía más rápida al trabajo.",
  },
];

/**
 * Mapea el perfil vocacional + diagnóstico a 2–3 familias de carreras
 * para explorar (plan fase h, §5.1). Una familia se muestra cuando el
 * área ligada está en Intermedio o Avanzado, o cuando la dimensión
 * RIASEC ligada tiene interés fuerte (≥4). El nivel de lógica cuenta
 * como área para «Ingenierías y tecnología». Si ninguna familia cumple
 * el mínimo, devuelve lista vacía: no se inventa un perfil.
 */
export function mapearFamilias(
  perfil: PerfilVocacional,
  puntajes: Partial<Record<Area, number>>,
  niveles: Partial<Record<Area, Nivel>>,
  nivelLogica: Nivel | null
): FamiliaCarreras[] {
  const conPuntaje = FAMILIAS_CARRERAS.map((f) => {
    let puntos = 0;
    for (const area of f.areas) {
      const nivel = niveles[area];
      if (nivel && NIVEL_ORDEN[nivel] >= NIVEL_ORDEN["Intermedio"]) {
        puntos += 2;
      } else if (puntajes[area] !== undefined && puntajes[area]! >= 60) {
        puntos += 2;
      }
    }
    if (f.id === "ingenierias" && nivelLogica) {
      if (NIVEL_ORDEN[nivelLogica] >= NIVEL_ORDEN["Intermedio"]) puntos += 2;
    }
    for (const dim of f.riasec) {
      const promedio = perfil.dimensiones[dim] ?? 0;
      if (promedio >= 4) puntos += 2;
      else if (promedio >= 3) puntos += 1;
    }
    // Las técnicas cortas no exigen nivel alto: basta el interés.
    const cumple =
      f.id === "tecnicas-cortas"
        ? f.riasec.some((dim) => (perfil.dimensiones[dim] ?? 0) >= 4) ||
          f.riasec.some((dim) => perfil.top2.includes(dim))
        : puntos >= 2;
    return { familia: f, puntos, cumple };
  });
  return conPuntaje
    .filter((c) => c.cumple)
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, 3)
    .map((c) => c.familia);
}

/** Extrae puntajes y niveles de los resultados del diagnóstico. */
export function puntajesYNiveles(
  resultados: Partial<Record<Area, ResultadoArea>>
): {
  puntajes: Partial<Record<Area, number>>;
  niveles: Partial<Record<Area, Nivel>>;
} {
  const puntajes: Partial<Record<Area, number>> = {};
  const niveles: Partial<Record<Area, Nivel>> = {};
  for (const [area, r] of Object.entries(resultados)) {
    if (!r) continue;
    puntajes[area as Area] = r.puntaje;
    niveles[area as Area] = r.nivel;
  }
  return { puntajes, niveles };
}
