/**
 * Juegos de conocimiento útil — fase (e).
 *
 * Tipos del esquema de datos (contrato en data/juegos/*.json), catálogo
 * de juegos, sistema de puntos / niveles / insignias (funciones puras)
 * y guardado del progreso: Supabase cuando hay sesión, localStorage
 * cuando no. SIN ranking público: nunca se muestran puntos de otros
 * usuarios; cada estudiante solo ve lo suyo.
 */

import { crearClienteNavegador } from "./supabase/client";

// ---------------------------------------------------------------------------
// Esquema de datos (contrato — no cambiar sin avisar al trabajador de datos)
// ---------------------------------------------------------------------------

export type PreguntaJuego = {
  id: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number;
  justificacion: string;
  fuente: string;
};

export type JuegoPreguntas = {
  juego: string;
  titulo: string;
  descripcion: string;
  fuente_general: string;
  preguntas: PreguntaJuego[];
};

export type PreguntaPrimerosAuxilios = {
  id: string;
  situacion: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number;
  justificacion: string;
  fuente: string;
};

export type JuegoPrimerosAuxilios = {
  juego: string;
  titulo: string;
  descripcion: string;
  fuente_general: string;
  preguntas: PreguntaPrimerosAuxilios[];
};

export type CasoDetective = {
  id: string;
  titular: string;
  texto: string;
  es_verdadera: boolean;
  pistas: string[];
  explicacion: string;
  fuente: string;
};

export type JuegoDetective = {
  juego: string;
  titulo: string;
  descripcion: string;
  fuente_general: string;
  casos: CasoDetective[];
};

export type CategoriaPresupuesto = {
  nombre: string;
  sugerencia_bs: number;
  consejo: string;
};

export type OpcionPresupuesto = {
  texto: string;
  ahorro_bs: number;
  justificacion: string;
};

export type EscenarioPresupuesto = {
  id: string;
  titulo: string;
  descripcion: string;
  ingreso_mensual_bs: number;
  meta_ahorro_bs: number;
  categorias: CategoriaPresupuesto[];
  pregunta: string;
  opciones: OpcionPresupuesto[];
  respuesta_correcta: number;
  fuente: string;
};

export type JuegoPresupuesto = {
  juego: string;
  titulo: string;
  descripcion: string;
  fuente_general: string;
  escenarios: EscenarioPresupuesto[];
};

// ---------------------------------------------------------------------------
// Catálogo de juegos
// ---------------------------------------------------------------------------

export type JuegoId =
  | "madidi"
  | "primeros-auxilios"
  | "mapa"
  | "constelaciones"
  | "detective"
  | "presupuesto";

export const JUEGOS_IDS: JuegoId[] = [
  "madidi",
  "presupuesto",
  "detective",
  "primeros-auxilios",
  "mapa",
  "constelaciones",
];

export type JuegoCatalogo = {
  id: JuegoId;
  titulo: string;
  descripcion: string;
  ruta: string;
  /** Clave del icono SVG inline (ver components/juegos/IconosJuego.tsx). */
  icono: "selva" | "monedas" | "lupa" | "cruz" | "mapa" | "estrella";
};

/**
 * Catálogo de los 6 juegos. Sin emojis en la interfaz: los iconos son
 * SVG inline (componente IconoJuego).
 */
export const JUEGOS: JuegoCatalogo[] = [
  {
    id: "madidi",
    titulo: "Aventura Madidi",
    descripcion:
      "Explorá el Parque Nacional Madidi: su selva, sus ríos y su fauna. Preguntas sobre el pulmón verde de Ixiamas.",
    ruta: "/juegos/madidi",
    icono: "selva",
  },
  {
    id: "presupuesto",
    titulo: "Mi primer presupuesto",
    descripcion:
      "Aprendé a manejar tu dinero: ingresos, gastos y ahorro. Decidí mes a mes y llegá a tu meta.",
    ruta: "/juegos/presupuesto",
    icono: "monedas",
  },
  {
    id: "detective",
    titulo: "Detective de noticias",
    descripcion:
      "¿Verdadera o falsa? Leé cada noticia, buscá las pistas y descubrí si lo que dice es real.",
    ruta: "/juegos/detective",
    icono: "lupa",
  },
  {
    id: "primeros-auxilios",
    titulo: "Primeros auxilios",
    descripcion:
      "Qué hacer cuando alguien se lastima: situaciones de la vida real, paso a paso y con calma.",
    ruta: "/juegos/primeros-auxilios",
    icono: "cruz",
  },
  {
    id: "mapa",
    titulo: "Mapa de Bolivia",
    descripcion:
      "Departamentos, capitales y ríos de nuestro país. Poné a prueba tu mapa mental de Bolivia.",
    ruta: "/juegos/mapa",
    icono: "mapa",
  },
  {
    id: "constelaciones",
    titulo: "Constelaciones",
    descripcion:
      "Las estrellas sobre Ixiamas: Orión, la Cruz del Sur y el cielo que nos da nombre.",
    ruta: "/juegos/constelaciones",
    icono: "estrella",
  },
];

export function esJuegoId(valor: string): valor is JuegoId {
  return (JUEGOS_IDS as string[]).includes(valor);
}

export function juegoPorId(id: JuegoId): JuegoCatalogo {
  return JUEGOS.find((j) => j.id === id) ?? JUEGOS[0];
}

// ---------------------------------------------------------------------------
// Puntos y niveles (funciones puras)
// ---------------------------------------------------------------------------

export const PUNTOS_POR_ACIERTO = 10;
export const PUNTOS_BONUS_PERFECTA = 5;

/**
 * Puntos de una partida: +10 por acierto y +5 extra si la partida es
 * perfecta (sin fallos y al menos una pregunta/caso/escenario).
 */
export function calcularPuntos(aciertos: number, total: number): number {
  const a = Math.max(0, Math.floor(aciertos));
  const t = Math.max(0, Math.floor(total));
  if (t === 0) return 0;
  const perfecta = a >= t;
  return a * PUNTOS_POR_ACIERTO + (perfecta ? PUNTOS_BONUS_PERFECTA : 0);
}

/** Nivel a partir de los puntos totales: 1 + floor(puntos / 100). */
export function nivelDesdePuntos(puntosTotales: number): number {
  const p = Math.max(0, Math.floor(puntosTotales));
  return 1 + Math.floor(p / 100);
}

// ---------------------------------------------------------------------------
// Insignias (funciones puras — IDs estables)
// ---------------------------------------------------------------------------

export type InsigniaId =
  | "explorador-madidi"
  | "presupuesto-en-orden"
  | "ojo-critico"
  | "guardian"
  | "cartografo"
  | "cazador-de-orion"
  | "estrella-cepo";

export type Insignia = {
  id: InsigniaId;
  nombre: string;
  descripcion: string;
};

export const INSIGNIAS: Insignia[] = [
  {
    id: "explorador-madidi",
    nombre: "Explorador del Madidi",
    descripcion: "Completaste la Aventura Madidi.",
  },
  {
    id: "presupuesto-en-orden",
    nombre: "Presupuesto en orden",
    descripcion: "Ahorraste igual o más que la meta en un escenario de Mi primer presupuesto.",
  },
  {
    id: "ojo-critico",
    nombre: "Ojo crítico",
    descripcion:
      "Acertaste al menos el 80% de los casos en Detective de noticias.",
  },
  {
    id: "guardian",
    nombre: "Guardián",
    descripcion:
      "Acertaste al menos el 80% de las situaciones en Primeros auxilios.",
  },
  {
    id: "cartografo",
    nombre: "Cartógrafo",
    descripcion:
      "Acertaste al menos el 80% de las preguntas en Mapa de Bolivia.",
  },
  {
    id: "cazador-de-orion",
    nombre: "Cazador de Orión",
    descripcion:
      "Acertaste al menos el 80% de las preguntas en Constelaciones.",
  },
  {
    id: "estrella-cepo",
    nombre: "Estrella CEPO",
    descripcion: "Sumaste 100 puntos o más en total entre todos los juegos.",
  },
];

export function insigniaPorId(id: string): Insignia | undefined {
  return INSIGNIAS.find((i) => i.id === id);
}

/** ¿Alcanzó el umbral de 8/10 (o su equivalente si el total difiere)? */
function cumpleOchoDeDiez(aciertos: number, total: number): boolean {
  if (total < 8) return false;
  return aciertos >= 8 && aciertos / total >= 0.8;
}

export type DatosPartida = {
  juego: JuegoId;
  aciertos: number;
  total: number;
  /** Puntos totales acumulados (todos los juegos) incluyendo esta partida. */
  puntosTotales: number;
  /** Solo presupuesto: true si en algún escenario el ahorro elegido llegó a la meta. */
  ahorroCumpleMeta?: boolean;
};

/**
 * Insignias que otorga ESTA partida (según sus datos y los puntos
 * totales acumulados). Quien llama mezcla el resultado con las
 * insignias que el estudiante ya tenía.
 */
export function insigniasGanadas(partida: DatosPartida): InsigniaId[] {
  const ganadas: InsigniaId[] = [];
  const { juego, aciertos, total } = partida;

  if (juego === "madidi" && total > 0) {
    ganadas.push("explorador-madidi");
  }
  if (juego === "presupuesto" && partida.ahorroCumpleMeta) {
    ganadas.push("presupuesto-en-orden");
  }
  if (juego === "detective" && cumpleOchoDeDiez(aciertos, total)) {
    ganadas.push("ojo-critico");
  }
  if (juego === "primeros-auxilios" && cumpleOchoDeDiez(aciertos, total)) {
    ganadas.push("guardian");
  }
  if (juego === "mapa" && cumpleOchoDeDiez(aciertos, total)) {
    ganadas.push("cartografo");
  }
  if (juego === "constelaciones" && cumpleOchoDeDiez(aciertos, total)) {
    ganadas.push("cazador-de-orion");
  }
  if (partida.puntosTotales >= 100) {
    ganadas.push("estrella-cepo");
  }
  return ganadas;
}

// ---------------------------------------------------------------------------
// Progreso local (localStorage) — clave estable
// ---------------------------------------------------------------------------

export const CLAVE_LOCAL_JUEGOS = "cepo_juegos_v1";

export type ProgresoLocalJuego = {
  puntos: number;
  insignias: InsigniaId[];
  partidas: number;
  mejorPuntaje: number;
  mejorAciertos: number;
  mejorTotal: number;
};

export type ProgresoLocal = {
  juegos: Partial<Record<JuegoId, ProgresoLocalJuego>>;
};

export function progresoLocalVacio(): ProgresoLocal {
  return { juegos: {} };
}

export function leerProgresoLocal(): ProgresoLocal {
  if (typeof window === "undefined") return progresoLocalVacio();
  try {
    const crudo = window.localStorage.getItem(CLAVE_LOCAL_JUEGOS);
    if (!crudo) return progresoLocalVacio();
    const parsed = JSON.parse(crudo) as ProgresoLocal;
    if (!parsed || typeof parsed !== "object" || !parsed.juegos) {
      return progresoLocalVacio();
    }
    return parsed;
  } catch {
    return progresoLocalVacio();
  }
}

function escribirProgresoLocal(progreso: ProgresoLocal): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CLAVE_LOCAL_JUEGOS,
      JSON.stringify(progreso)
    );
  } catch {
    // Almacenamiento lleno o bloqueado: el juego sigue funcionando,
    // solo no queda guardado en este dispositivo.
  }
}

/** Puntos totales acumulados en todos los juegos (progreso local). */
export function puntosTotalesLocal(progreso: ProgresoLocal): number {
  return JUEGOS_IDS.reduce(
    (suma, id) => suma + (progreso.juegos[id]?.puntos ?? 0),
    0
  );
}

/** Insignias únicas acumuladas (progreso local), en orden del catálogo. */
export function insigniasLocales(progreso: ProgresoLocal): InsigniaId[] {
  const todas: InsigniaId[] = [];
  for (const id of JUEGOS_IDS) {
    for (const ins of progreso.juegos[id]?.insignias ?? []) {
      if (!todas.includes(ins)) todas.push(ins);
    }
  }
  return todas;
}

// ---------------------------------------------------------------------------
// Guardado de una partida: Supabase si hay sesión, localStorage si no.
// Nunca lanza: si algo falla, el resultado igual se muestra en pantalla.
// ---------------------------------------------------------------------------

export type ResultadoGuardado = {
  /** Puntos de esta partida. */
  puntosPartida: number;
  /** Puntos acumulados del juego tras esta partida. */
  puntosJuego: number;
  /** Puntos totales acumulados (todos los juegos). */
  puntosTotales: number;
  /** Nivel global tras esta partida. */
  nivel: number;
  /** Insignias NUEVAS de esta partida (que el estudiante no tenía). */
  insigniasNuevas: InsigniaId[];
  /** Dónde quedó guardado. */
  guardado: "supabase" | "local" | "ninguno";
};

/**
 * Registra una partida terminada. Siempre guarda en localStorage (para
 * que /juegos muestre el mejor puntaje aunque no haya cuenta) e intenta
 * además el upsert en `public.progreso_juegos` cuando hay sesión de
 * Supabase. No falla si Supabase no está configurado.
 */
export async function guardarPartida(args: {
  juego: JuegoId;
  aciertos: number;
  total: number;
  ahorroCumpleMeta?: boolean;
}): Promise<ResultadoGuardado> {
  const puntosPartida = calcularPuntos(args.aciertos, args.total);

  // 1) Progreso local (siempre, como base y como respaldo).
  const progreso = leerProgresoLocal();
  const previo = progreso.juegos[args.juego];
  const puntosJuego = (previo?.puntos ?? 0) + puntosPartida;
  const puntosTotalesAntes = puntosTotalesLocal(progreso);
  const puntosTotales = puntosTotalesAntes + puntosPartida;
  const ganadas = insigniasGanadas({
    juego: args.juego,
    aciertos: args.aciertos,
    total: args.total,
    puntosTotales,
    ahorroCumpleMeta: args.ahorroCumpleMeta,
  });
  const yaTenidas = insigniasLocales(progreso);
  const insigniasNuevas = ganadas.filter((g) => !yaTenidas.includes(g));
  const insigniasJuego = Array.from(
    new Set([...(previo?.insignias ?? []), ...ganadas])
  );

  progreso.juegos[args.juego] = {
    puntos: puntosJuego,
    insignias: insigniasJuego,
    partidas: (previo?.partidas ?? 0) + 1,
    mejorPuntaje: Math.max(previo?.mejorPuntaje ?? 0, puntosPartida),
    mejorAciertos: Math.max(previo?.mejorAciertos ?? 0, args.aciertos),
    mejorTotal: args.total,
  };
  escribirProgresoLocal(progreso);

  const resultado: ResultadoGuardado = {
    puntosPartida,
    puntosJuego,
    puntosTotales,
    nivel: nivelDesdePuntos(puntosTotales),
    insigniasNuevas,
    guardado: "local",
  };

  // 2) Supabase (solo si hay sesión; si no, queda en local).
  try {
    const supabase = crearClienteNavegador();
    if (!supabase) return resultado;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return resultado;
    const { error } = await supabase.from("progreso_juegos").upsert(
      {
        user_id: user.id,
        juego: args.juego,
        puntos: puntosJuego,
        insignias: insigniasJuego,
        nivel: nivelDesdePuntos(puntosJuego),
      },
      { onConflict: "user_id,juego" }
    );
    if (!error) resultado.guardado = "supabase";
  } catch {
    // Sin conexión o error de red: el progreso local ya quedó guardado.
  }
  return resultado;
}
