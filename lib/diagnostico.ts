/**
 * Examen diagnóstico — tipos, motor adaptativo y recomendaciones.
 *
 * El examen es por área (Matemática, Lenguaje, Ciencias Naturales,
 * Ciencias Sociales, Inglés). En cada área se hacen 6 preguntas: se
 * empieza en dificultad media (2) y la dificultad sube con cada acierto
 * y baja con cada error. El nivel final se calcula con un puntaje
 * ponderado por dificultad. Todo es funciones puras: se puede probar
 * sin navegador ni base de datos.
 */

export const AREAS = [
  "Matemática",
  "Lenguaje",
  "Ciencias Naturales",
  "Ciencias Sociales",
  "Inglés",
] as const;

export type Area = (typeof AREAS)[number];

export const NIVELES = ["Inicial", "Básico", "Intermedio", "Avanzado"] as const;

export type Nivel = (typeof NIVELES)[number];

/** Orden numérico del nivel (para comparar evolución en /progreso). */
export const NIVEL_ORDEN: Record<Nivel, number> = {
  Inicial: 1,
  Básico: 2,
  Intermedio: 3,
  Avanzado: 4,
};

export type Pregunta = {
  id: string;
  area: Area;
  /** 1 = fácil, 2 = medio, 3 = difícil */
  nivel: 1 | 2 | 3;
  pregunta: string;
  opciones: string[];
  /** Índice (0–3) de la opción correcta. */
  respuesta_correcta: number;
  justificacion: string;
  fuente: string;
};

export type RespuestaRegistrada = {
  preguntaId: string;
  /** Índice elegido por el estudiante (0–3). */
  elegida: number;
  correcta: boolean;
  /** Dificultad (1–3) de la pregunta respondida. */
  dificultad: number;
};

export type ResultadoArea = {
  area: Area;
  correctas: number;
  total: number;
  /** 0–100: puntaje ponderado por dificultad. Se guarda en `puntaje`. */
  puntaje: number;
  nivel: Nivel;
  respuestas: RespuestaRegistrada[];
};

/** Preguntas por área en cada diagnóstico. */
export const PREGUNTAS_POR_AREA = 6;

/** Dificultad con la que empieza cada área. */
export const DIFICULTAD_INICIAL = 2;

/** Nivel a partir del porcentaje ponderado (0–1). */
export function nivelDesdePorcentaje(porcentaje: number): Nivel {
  if (porcentaje >= 0.8) return "Avanzado";
  if (porcentaje >= 0.6) return "Intermedio";
  if (porcentaje >= 0.4) return "Básico";
  return "Inicial";
}

/** Dificultad siguiente: sube con acierto, baja con error. */
export function siguienteDificultad(actual: number, correcta: boolean): number {
  return correcta ? Math.min(3, actual + 1) : Math.max(1, actual - 1);
}

/**
 * Elige la siguiente pregunta sin repetir: primero busca en la
 * dificultad pedida; si no quedan, busca en la más cercana.
 */
export function elegirSiguientePregunta(
  banco: Pregunta[],
  usadas: ReadonlySet<string>,
  dificultad: number
): Pregunta | null {
  const disponibles = banco.filter((p) => !usadas.has(p.id));
  if (disponibles.length === 0) return null;
  const orden = [dificultad, dificultad - 1, dificultad + 1, 1, 2, 3];
  for (const d of orden) {
    const enNivel = disponibles.filter((p) => p.nivel === d);
    if (enNivel.length > 0) {
      return enNivel[Math.floor(Math.random() * enNivel.length)];
    }
  }
  return disponibles[0];
}

/** Calcula el resultado de un área a partir de sus respuestas. */
export function calcularResultadoArea(
  area: Area,
  respuestas: RespuestaRegistrada[]
): ResultadoArea {
  const total = respuestas.length;
  const correctas = respuestas.filter((r) => r.correcta).length;
  const pesoTotal = respuestas.reduce((s, r) => s + r.dificultad, 0);
  const pesoCorrecto = respuestas
    .filter((r) => r.correcta)
    .reduce((s, r) => s + r.dificultad, 0);
  const porcentaje = pesoTotal > 0 ? pesoCorrecto / pesoTotal : 0;
  return {
    area,
    correctas,
    total,
    puntaje: Math.round(porcentaje * 100),
    nivel: nivelDesdePorcentaje(porcentaje),
    respuestas,
  };
}

/** Nivel general a partir de los puntajes (0–100) de las áreas hechas. */
export function nivelGeneral(puntajes: number[]): Nivel {
  if (puntajes.length === 0) return "Inicial";
  const media = puntajes.reduce((s, p) => s + p, 0) / puntajes.length / 100;
  return nivelDesdePorcentaje(media);
}

/** Recomendación de estudio según el nivel alcanzado en un área. */
export const CONSEJO_POR_NIVEL: Record<Nivel, string> = {
  Inicial:
    "Empezá por lo básico, sin apuro: repasá los temas de los primeros años con tus apuntes y pedí ayuda a un docente cuando algo no cierre. Cada avance cuenta.",
  Básico:
    "Tenés una buena base. Repasá los temas donde fallaste y practicá un poco cada día: la constancia vale más que estudiar mucho de una sola vez.",
  Intermedio:
    "Vas por buen camino. Reforzá los temas difíciles con ejercicios y explicáselos a un compañero: enseñar es una de las mejores formas de aprender.",
  Avanzado:
    "¡Excelente nivel! Seguí desafiándote con problemas más difíciles y ayudá a tus compañeros: explicar lo que sabés también te hace aprender.",
};

/** Recomendaciones de estudio por área (2–3 consejos prácticos). */
export const RECOMENDACIONES_AREA: Record<
  Area,
  { descripcion: string; consejos: string[] }
> = {
  Matemática: {
    descripcion:
      "La matemática se aprende practicando: cada ejercicio es un paso más.",
    consejos: [
      "Hacé 3 ejercicios por día de lo que estás viendo en clase, aunque sean cortos.",
      "Cuando un ejercicio no sale, escribí dónde te trabaste y preguntá en clase con esa duda concreta.",
      "Usá ejemplos de la vida diaria: precios en bolivianos, medidas de la chaco o del río para practicar proporciones y porcentajes.",
    ],
  },
  Lenguaje: {
    descripcion:
      "Leer y escribir todos los días es el mejor entrenamiento para el lenguaje.",
    consejos: [
      "Leé 15 minutos por día: cuentos, noticias o lo que te guste, y anotá las palabras nuevas.",
      "Repasá las reglas de acentuación y puntuación con tus propios escritos.",
      "Contá en voz alta lo que leíste: si podés explicarlo, es que lo entendiste.",
    ],
  },
  "Ciencias Naturales": {
    descripcion:
      "La selva que te rodea es el mejor laboratorio: observá, preguntá y relacioná.",
    consejos: [
      "Relacioná cada tema con algo de Ixiamas o Madidi: el río, la selva, los animales.",
      "Dibujá esquemas de lo que estudies (la célula, el ciclo del agua): un dibujo vale más que una página memorizada.",
      "Hacé preguntas en clase sobre cómo funciona lo que ves todos los días.",
    ],
  },
  "Ciencias Sociales": {
    descripcion:
      "Conocer nuestra historia y nuestra geografía es conocer de dónde venimos.",
    consejos: [
      "Armá líneas de tiempo con los hechos que estudies: ver el orden ayuda a recordar.",
      "Ubicá en el mapa cada lugar que aparezca en clase: departamentos, ríos, parques.",
      "Conversá con tu familia sobre la historia de Ixiamas y de la región: la memoria oral también es historia.",
    ],
  },
  Inglés: {
    descripcion:
      "El inglés se aprende usándolo un poco cada día, sin miedo a equivocarse.",
    consejos: [
      "Aprendé 5 palabras nuevas por día y usalas en una frase.",
      "Escuchá canciones o videos cortos en inglés y tratá de entender las palabras que ya conocés.",
      "Practicá en voz alta: saludar, presentarte y contar tu rutina en inglés.",
    ],
  },
};
