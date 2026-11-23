/**
 * lib/admin.ts — Lecturas del panel super admin (/admin).
 *
 * Solo lo usa el panel. Todo pasa por el cliente de servidor (clave anon
 * + RLS): el panel NUNCA usa `service_role`.
 *
 * TABLAS REALES (verificadas en el código y en las migraciones 0001/0002;
 * los nombres del plan §5.3/§5.4 no coinciden con la realidad):
 * - `diagnosticos`: UNA FILA POR ÁREA (area, nivel, puntaje 0–100,
 *   respuestas, created_at). No existe `intentos_diagnostico`.
 * - `actitudes`: una fila por cuestionario (dimensiones jsonb).
 *   No existe `intentos_actitudes`.
 * - `orientacion_vocacional`: dimensiones jsonb + perfil_top2 jsonb.
 *   No tiene columnas `respuestas` ni `perfil`.
 * - `buzon`: los mensajes (el plan la nombra `mensajes_buzon`).
 * - `progreso_juegos`, `profiles` y `actividad` (migración 0003).
 *
 * Reglas que cumple este archivo (decisiones de Mike, 22-nov-2026):
 * - Solo rol 'admin' (Mike, Irguen Rosas, Clarivel Loayza). Los docentes
 *   NO ven el panel (la guarda está en app/admin/layout.tsx).
 * - Privacidad de menores: solo se muestra el alias, nunca nombres
 *   reales, fotos, teléfonos ni correos. El buzón anónimo se muestra
 *   sin remitente.
 * - Nada se descarga: no hay exportación CSV en ninguna parte.
 * - Todo agregado muestra su N; si N < 3, se avisa que no es
 *   representativo.
 * - La tabla `actividad` (migración 0003) todavía no existe en
 *   producción hasta que Mike la corra: sus lecturas devuelven vacío
 *   con el aviso `actividadPendiente: true` en vez de romper el panel.
 *   La tabla `orientacion_vocacional` (migración 0002) YA existe
 *   (corrida por Mike 22-nov-2026 19:27) y se lee directamente.
 */

import { crearClienteServidor, obtenerPerfil } from "./supabase/server";
import {
  AREAS,
  AREA_LOGICA,
  NIVELES,
  nivelGeneral,
  type Area,
  type Nivel,
} from "./diagnostico";
import {
  DIMENSIONES_RIASEC,
  mapearFamilias,
  type PerfilVocacional,
} from "./vocacional";
import datosActitudes from "@/data/actitudes.json";
import despuesDelCole from "@/data/despues-del-cole.json";
import { institucion, esMarcador } from "./institucion";
import { JUEGOS } from "./juegos";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type PerfilAdmin = {
  id: string;
  alias: string;
  rol: string;
};

/** Una fila de `diagnosticos`: el resultado de UN área (o de lógica). */
export type ResultadoAreaAdmin = {
  id: string;
  created_at: string;
  area: string;
  nivel: string;
  puntaje: number | null;
  aciertos: number | null;
  total: number | null;
};

export type ResumenEstudiante = {
  user_id: string;
  alias: string;
  creado: string;
  /** Resultados por área guardados (filas de `diagnosticos`). */
  resultadosDiagnostico: number;
  /** De las 6 áreas, cuántas tienen al menos un resultado. */
  areasCompletadas: number;
  ultimoDiagnostico: {
    fecha: string;
    nivelGeneral: Nivel | null;
    porcentajePromedio: number | null;
  } | null;
  logica: { puntaje: number; aciertos: number | null; total: number | null } | null;
  intentosActitudes: number;
  tieneVocacional: boolean;
  intentosActividad: number;
  ultimaActividad: string | null;
  juegos: { juego: string; puntos: number; insignias: string[] }[];
};

export type DetalleEstudiante = {
  perfil: { user_id: string; alias: string; creado: string };
  /** Últimos resultados por área (filas de `diagnosticos`). */
  diagnostico: ResultadoAreaAdmin[];
  /** Último resultado por área (para el nivel general y el vocacional). */
  ultimoPorArea: Partial<Record<string, ResultadoAreaAdmin>>;
  actitudes: { id: string; created_at: string; dimensiones: Record<string, number> }[];
  vocacional: {
    created_at: string;
    dimensiones: Record<string, number>;
    top2: string[];
    familias: { id: string; nombre: string }[];
  } | null;
  juegos: { juego: string; puntos: number; nivel: number; insignias: string[] }[];
  actividad: FilaActividad[];
};

export type FilaActividad = {
  id: string;
  user_id: string;
  alias: string;
  tipo: string;
  inicio: string;
  fin: string | null;
  duracion_segundos: number | null;
};

export type AgregadoArea = {
  area: string;
  estudiantes: number;
  intentos: number;
  promedio: number | null;
  niveles: Record<Nivel, number>;
};

export type EvaluacionAdmin = {
  diagnostico: AgregadoArea[];
  logica: {
    estudiantes: number;
    intentos: number;
    promedioPuntaje: number | null;
    promedioAciertos: number | null;
  };
  actitudes: { dimension: string; nombre: string; estudiantes: number; promedio: number | null }[];
  vocacional: {
    completados: number;
    top2: { dimension: string; nombre: string; cantidad: number }[];
  };
  juegos: {
    juego: string;
    jugadores: number;
    partidas: number;
    puntosPromedio: number | null;
    insignias: number;
  }[];
};

export type MarcadorPendiente = {
  ruta: string;
  valor: string;
  tipo: "COMPLETAR" | "VERIFICAR";
};

export type MejorasAdmin = {
  marcadores: MarcadorPendiente[];
  futuro: {
    ultimaRevision: string;
    instituciones: number;
    becas: number;
    plazos: number;
    plazosPorConfirmar: number;
  };
};

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/** Fecha corta es-BO para el panel. */
export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleString("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Duración en segundos → "4 min 32 s" (o "45 s"). */
export function formatearDuracion(segundos: number | null): string {
  if (segundos === null || segundos === undefined) return "—";
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  if (min === 0) return `${seg} s`;
  return `${min} min ${seg} s`;
}

/** Aviso estándar cuando un agregado tiene muy pocos casos. */
export function avisoN(n: number): string | null {
  if (n === 0) return "Sin datos todavía.";
  if (n < 3) return `Solo ${n} caso${n === 1 ? "" : "s"}: no es representativo.`;
  return null;
}

const ETIQUETA_TIPO_ACTIVIDAD: Record<string, string> = {
  diagnostico: "Diagnóstico",
  actitudes: "Actitudes y hábitos",
  vocacional: "Vocacional",
  juego: "Juego",
};

export function etiquetaTipoActividad(tipo: string): string {
  return ETIQUETA_TIPO_ACTIVIDAD[tipo] ?? tipo;
}

/** Título público de un juego por su id (para las tablas del panel). */
export function tituloJuego(id: string): string {
  return JUEGOS.find((j) => j.id === id)?.titulo ?? id;
}

/**
 * Aciertos de una fila de `diagnosticos` a partir de sus respuestas
 * guardadas (cada una trae `correcta: boolean`). Para lógica, el
 * puntaje es ponderado por dificultad, así que los aciertos solo se
 * sacan de acá, no del puntaje.
 */
function aciertosDeRespuestas(respuestas: unknown): { aciertos: number; total: number } | null {
  if (!Array.isArray(respuestas)) return null;
  let aciertos = 0;
  let total = 0;
  for (const r of respuestas as { correcta?: unknown }[]) {
    if (r && typeof r === "object") {
      total += 1;
      if ((r as { correcta?: unknown }).correcta === true) aciertos += 1;
    }
  }
  return { aciertos, total };
}

function filaAreaAdmin(f: {
  id: string;
  created_at: string;
  area: string;
  nivel: string;
  puntaje: number | null;
  respuestas: unknown;
}): ResultadoAreaAdmin {
  const c = aciertosDeRespuestas(f.respuestas);
  return {
    id: f.id,
    created_at: f.created_at,
    area: f.area,
    nivel: f.nivel,
    puntaje: f.puntaje,
    aciertos: c?.aciertos ?? null,
    total: c?.total ?? null,
  };
}

// ---------------------------------------------------------------------------
// Guarda: perfil del admin actual (null si no hay sesión o no es admin).
// ---------------------------------------------------------------------------

export async function obtenerPerfilAdmin(): Promise<PerfilAdmin | null> {
  const perfil = await obtenerPerfil();
  if (!perfil || perfil.rol !== "admin") return null;
  return { id: perfil.id, alias: perfil.alias, rol: perfil.rol };
}

// ---------------------------------------------------------------------------
// Portada: resumen general del panel.
// ---------------------------------------------------------------------------

export async function obtenerResumenAdmin(): Promise<{
  estudiantes: number;
  resultadosDiagnostico: number;
  mensajesNuevos: number;
  mensajesTotal: number;
  vocacionalCompletados: number;
  actividadTotal: number;
  actividadPendiente: boolean;
  marcadores: number;
  ultimoDiagnostico: string | null;
}> {
  const supabase = await crearClienteServidor();
  const vacio = {
    estudiantes: 0,
    resultadosDiagnostico: 0,
    mensajesNuevos: 0,
    mensajesTotal: 0,
    vocacionalCompletados: 0,
    actividadTotal: 0,
    actividadPendiente: true,
    marcadores: 0,
    ultimoDiagnostico: null as string | null,
  };
  if (!supabase) return vacio;

  const [est, diag, buz, voc, act] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("rol", "estudiante"),
    supabase
      .from("diagnosticos")
      .select("created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(1),
    supabase.from("buzon").select("estado", { count: "exact" }),
    supabase
      .from("orientacion_vocacional")
      .select("user_id", { count: "exact", head: true }),
    // La tabla actividad puede no existir aún (migración 0003 pendiente).
    supabase.from("actividad").select("id", { count: "exact", head: true }),
  ]);

  const actividadPendiente = act.error?.code === "PGRST205";

  return {
    estudiantes: est.count ?? 0,
    resultadosDiagnostico: diag.count ?? 0,
    mensajesNuevos: (buz.data ?? []).filter(
      (m: { estado: string }) => m.estado === "nuevo"
    ).length,
    mensajesTotal: buz.count ?? 0,
    vocacionalCompletados: voc.count ?? 0,
    actividadTotal: actividadPendiente ? 0 : (act.count ?? 0),
    actividadPendiente,
    marcadores: listarMarcadores().length,
    ultimoDiagnostico: diag.data?.[0]?.created_at ?? null,
  };
}

// ---------------------------------------------------------------------------
// Estudiantes: lista y detalle (solo alias, nunca datos personales).
// ---------------------------------------------------------------------------

export async function listarEstudiantesAdmin(): Promise<ResumenEstudiante[]> {
  const supabase = await crearClienteServidor();
  if (!supabase) return [];

  const { data: perfilesRaw } = await supabase
    .from("profiles")
    .select("id, alias, created_at")
    .eq("rol", "estudiante")
    .order("created_at", { ascending: false });
  const perfiles = (perfilesRaw ?? []) as {
    id: string;
    alias: string;
    created_at: string;
  }[];
  if (perfiles.length === 0) return [];

  const ids = perfiles.map((p) => p.id);
  const [diag, act, voc, jue, actv] = await Promise.all([
    supabase
      .from("diagnosticos")
      .select("user_id, area, nivel, puntaje, respuestas, created_at")
      .in("user_id", ids)
      .order("created_at", { ascending: false }),
    supabase.from("actitudes").select("user_id").in("user_id", ids),
    supabase.from("orientacion_vocacional").select("user_id").in("user_id", ids),
    supabase
      .from("progreso_juegos")
      .select("user_id, juego, puntos, insignias")
      .in("user_id", ids),
    // Actividad: puede no existir aún (0003 pendiente) → lista vacía.
    supabase.from("actividad").select("user_id, inicio").in("user_id", ids),
  ]);
  type FilaDiag = {
    user_id: string;
    area: string;
    nivel: string;
    puntaje: number | null;
    respuestas: unknown;
    created_at: string;
  };
  const diagFilas = (diag.data ?? []) as FilaDiag[];
  const actFilas = (act.data ?? []) as { user_id: string }[];
  const vocFilas = (voc.data ?? []) as { user_id: string }[];
  const jueFilas = (jue.data ?? []) as {
    user_id: string;
    juego: string;
    puntos: number;
    insignias: string[] | null;
  }[];
  const actvFilas = (actv.data ?? []) as { user_id: string; inicio: string }[];

  const porUsuario = new Map<
    string,
    { filas: ResultadoAreaAdmin[]; porArea: Map<string, ResultadoAreaAdmin> }
  >();
  for (const d of diagFilas) {
    const fila = filaAreaAdmin({
      id: "",
      created_at: d.created_at,
      area: d.area,
      nivel: d.nivel,
      puntaje: d.puntaje,
      respuestas: d.respuestas,
    });
    const agg: {
      filas: ResultadoAreaAdmin[];
      porArea: Map<string, ResultadoAreaAdmin>;
    } = porUsuario.get(d.user_id) ?? { filas: [], porArea: new Map() };
    agg.filas.push(fila);
    if (!agg.porArea.has(d.area)) agg.porArea.set(d.area, fila);
    porUsuario.set(d.user_id, agg);
  }
  const contar = (filas: { user_id: string }[] | null | undefined) => {
    const mapa = new Map<string, number>();
    for (const f of filas ?? []) mapa.set(f.user_id, (mapa.get(f.user_id) ?? 0) + 1);
    return mapa;
  };
  const actitudesN = contar(actFilas);
  const vocacionalSet = new Set(vocFilas.map((v) => v.user_id));
  const actividadN = contar(actvFilas);
  const ultimaActividad = new Map<string, string>();
  for (const a of actvFilas) {
    const prev = ultimaActividad.get(a.user_id);
    if (!prev || a.inicio > prev) ultimaActividad.set(a.user_id, a.inicio);
  }
  const juegosPorUsuario = new Map<string, { juego: string; puntos: number; insignias: string[] }[]>();
  for (const j of jueFilas) {
    const lista = juegosPorUsuario.get(j.user_id) ?? [];
    lista.push({
      juego: j.juego,
      puntos: j.puntos,
      insignias: (j.insignias ?? []) as string[],
    });
    juegosPorUsuario.set(j.user_id, lista);
  }

  return perfiles.map((p) => {
    const agg = porUsuario.get(p.id);
    const filas = agg?.filas ?? [];
    const porArea = agg?.porArea ?? new Map<string, ResultadoAreaAdmin>();
    const puntajes = AREAS.map((a) => porArea.get(a)?.puntaje).filter(
      (v): v is number => typeof v === "number"
    );
    const promedio =
      puntajes.length > 0
        ? Math.round(puntajes.reduce((s, v) => s + v, 0) / puntajes.length)
        : null;
    const ultimaFecha = filas[0]?.created_at ?? null;
    const logicaFila = porArea.get(AREA_LOGICA) ?? null;

    return {
      user_id: p.id,
      alias: p.alias,
      creado: p.created_at,
      resultadosDiagnostico: filas.length,
      areasCompletadas: AREAS.filter((a) => porArea.has(a)).length,
      ultimoDiagnostico: ultimaFecha
        ? {
            fecha: ultimaFecha,
            nivelGeneral: puntajes.length > 0 ? nivelGeneral(puntajes) : null,
            porcentajePromedio: promedio,
          }
        : null,
      logica: logicaFila
        ? {
            puntaje: logicaFila.puntaje ?? 0,
            aciertos: logicaFila.aciertos,
            total: logicaFila.total,
          }
        : null,
      intentosActitudes: actitudesN.get(p.id) ?? 0,
      tieneVocacional: vocacionalSet.has(p.id),
      intentosActividad: actividadN.get(p.id) ?? 0,
      ultimaActividad: ultimaActividad.get(p.id) ?? null,
      juegos: juegosPorUsuario.get(p.id) ?? [],
    };
  });
}

export async function obtenerDetalleEstudiante(
  alias: string
): Promise<DetalleEstudiante | null> {
  const supabase = await crearClienteServidor();
  if (!supabase) return null;

  const { data: perfilRaw } = await supabase
    .from("profiles")
    .select("id, alias, created_at")
    .eq("alias", alias)
    .eq("rol", "estudiante")
    .maybeSingle();
  const perfil = perfilRaw as {
    id: string;
    alias: string;
    created_at: string;
  } | null;
  if (!perfil) return null;

  const [diag, act, voc, jue, actv] = await Promise.all([
    supabase
      .from("diagnosticos")
      .select("id, created_at, area, nivel, puntaje, respuestas")
      .eq("user_id", perfil.id)
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("actitudes")
      .select("id, created_at, dimensiones")
      .eq("user_id", perfil.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("orientacion_vocacional")
      .select("created_at, dimensiones, perfil_top2")
      .eq("user_id", perfil.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("progreso_juegos")
      .select("juego, puntos, nivel, insignias")
      .eq("user_id", perfil.id)
      .order("puntos", { ascending: false }),
    // Actividad: puede no existir aún (0003 pendiente) → lista vacía.
    supabase
      .from("actividad")
      .select("id, user_id, tipo, inicio, fin, duracion_segundos")
      .eq("user_id", perfil.id)
      .order("inicio", { ascending: false })
      .limit(50),
  ]);
  type FilaDiagDetalle = {
    id: string;
    created_at: string;
    area: string;
    nivel: string;
    puntaje: number | null;
    respuestas: unknown;
  };
  const diagFilas = (diag.data ?? []) as FilaDiagDetalle[];
  const actFilas = (act.data ?? []) as {
    id: string;
    created_at: string;
    dimensiones: Record<string, number>;
  }[];
  const vocFila = voc.data as {
    created_at: string;
    dimensiones: Record<string, number>;
    perfil_top2: unknown;
  } | null;
  const jueFilas = (jue.data ?? []) as {
    juego: string;
    puntos: number;
    nivel: number;
    insignias: string[] | null;
  }[];
  const actvFilas = (actv.data ?? []) as {
    id: string;
    user_id: string;
    tipo: string;
    inicio: string;
    fin: string | null;
    duracion_segundos: number | null;
  }[];

  const diagnostico: ResultadoAreaAdmin[] = diagFilas.map((d) =>
    filaAreaAdmin({
      id: d.id,
      created_at: d.created_at,
      area: d.area,
      nivel: d.nivel,
      puntaje: d.puntaje,
      respuestas: d.respuestas,
    })
  );
  const ultimoPorArea: Partial<Record<string, ResultadoAreaAdmin>> = {};
  for (const f of diagnostico) {
    if (!ultimoPorArea[f.area]) ultimoPorArea[f.area] = f;
  }

  let vocacional: DetalleEstudiante["vocacional"] = null;
  if (vocFila) {
    const dimensiones = (vocFila.dimensiones ?? {}) as Record<string, number>;
    const top2 = (Array.isArray(vocFila.perfil_top2)
      ? vocFila.perfil_top2
      : []) as string[];
    const perfilVoc: PerfilVocacional = { dimensiones, top2: top2 as PerfilVocacional["top2"] };
    const puntajes: Partial<Record<Area, number>> = {};
    const niveles: Partial<Record<Area, Nivel>> = {};
    for (const a of AREAS) {
      const f = ultimoPorArea[a];
      if (f) {
        if (typeof f.puntaje === "number") puntajes[a] = f.puntaje;
        niveles[a] = f.nivel as Nivel;
      }
    }
    const logicaFila = ultimoPorArea[AREA_LOGICA];
    const nivelLogica = logicaFila ? (logicaFila.nivel as Nivel) : null;
    const familias = mapearFamilias(perfilVoc, puntajes, niveles, nivelLogica).map((f) => ({
      id: f.id,
      nombre: f.nombre,
    }));
    vocacional = {
      created_at: vocFila.created_at,
      dimensiones,
      top2,
      familias,
    };
  }

  return {
    perfil: { user_id: perfil.id, alias: perfil.alias, creado: perfil.created_at },
    diagnostico,
    ultimoPorArea,
    actitudes: actFilas.map((a) => ({
      id: a.id,
      created_at: a.created_at,
      dimensiones: a.dimensiones as Record<string, number>,
    })),
    vocacional,
    juegos: jueFilas.map((j) => ({
      juego: j.juego,
      puntos: j.puntos,
      nivel: j.nivel,
      insignias: (j.insignias ?? []) as string[],
    })),
    actividad: actvFilas.map((a) => ({
      id: a.id,
      user_id: a.user_id,
      alias: perfil.alias,
      tipo: a.tipo,
      inicio: a.inicio,
      fin: a.fin,
      duracion_segundos: a.duracion_segundos,
    })),
  };
}

// ---------------------------------------------------------------------------
// Evaluación: agregados por área, con N visible en cada uno.
// ---------------------------------------------------------------------------

export async function obtenerEvaluacionAdmin(): Promise<EvaluacionAdmin> {
  const supabase = await crearClienteServidor();
  const vacio: EvaluacionAdmin = {
    diagnostico: [...AREAS, AREA_LOGICA].map((area) => ({
      area,
      estudiantes: 0,
      intentos: 0,
      promedio: null,
      niveles: { Inicial: 0, Básico: 0, Intermedio: 0, Avanzado: 0 },
    })),
    logica: { estudiantes: 0, intentos: 0, promedioPuntaje: null, promedioAciertos: null },
    actitudes: (
      datosActitudes as unknown as {
        dimensiones: { id: string; nombre: string }[];
      }
    ).dimensiones.map((d) => ({
      dimension: d.id,
      nombre: d.nombre,
      estudiantes: 0,
      promedio: null,
    })),
    vocacional: { completados: 0, top2: [] },
    juegos: [],
  };
  if (!supabase) return vacio;

  const [diag, act, voc, jue] = await Promise.all([
    supabase
      .from("diagnosticos")
      .select("user_id, area, nivel, puntaje, respuestas")
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase.from("actitudes").select("user_id, dimensiones").limit(500),
    supabase
      .from("orientacion_vocacional")
      .select("user_id, perfil_top2")
      .limit(500),
    supabase.from("progreso_juegos").select("user_id, juego, puntos, insignias").limit(1000),
  ]);

  const diagFilas = (diag.data ?? []) as {
    user_id: string;
    area: string;
    nivel: string;
    puntaje: number | null;
    respuestas: unknown;
  }[];
  const actFilas = (act.data ?? []) as {
    user_id: string;
    dimensiones: Record<string, number>;
  }[];
  const vocFilas = (voc.data ?? []) as {
    user_id: string;
    perfil_top2: unknown;
  }[];
  const jueFilas = (jue.data ?? []) as {
    user_id: string;
    juego: string;
    puntos: number;
    insignias: string[] | null;
  }[];

  // Diagnóstico por área (una fila = un resultado de un área).
  const porArea = new Map<string, { valores: number[]; usuarios: Set<string>; niveles: Record<Nivel, number> }>();
  for (const area of [...AREAS, AREA_LOGICA]) {
    porArea.set(area, {
      valores: [],
      usuarios: new Set(),
      niveles: { Inicial: 0, Básico: 0, Intermedio: 0, Avanzado: 0 },
    });
  }
  const logicaAciertos: number[] = [];
  for (const d of diagFilas) {
    const agg = porArea.get(d.area);
    if (!agg) continue;
    if (typeof d.puntaje === "number") agg.valores.push(d.puntaje);
    agg.usuarios.add(d.user_id);
    if (NIVELES.includes(d.nivel as Nivel)) {
      agg.niveles[d.nivel as Nivel] += 1;
    }
    if (d.area === AREA_LOGICA) {
      const c = aciertosDeRespuestas(d.respuestas);
      if (c) logicaAciertos.push(c.aciertos);
    }
  }
  const diagnostico: AgregadoArea[] = [...AREAS, AREA_LOGICA].map((area) => {
    const agg = porArea.get(area)!;
    return {
      area,
      estudiantes: agg.usuarios.size,
      intentos: agg.valores.length,
      promedio:
        agg.valores.length > 0
          ? Math.round(agg.valores.reduce((s, v) => s + v, 0) / agg.valores.length)
          : null,
      niveles: agg.niveles,
    };
  });
  const logicaAgg = porArea.get(AREA_LOGICA)!;

  // Actitudes por dimensión (promedio 1–5).
  const actAgg = new Map<string, { valores: number[]; usuarios: Set<string> }>();
  for (const a of actFilas) {
    const dims = a.dimensiones as Record<string, number>;
    for (const [id, valor] of Object.entries(dims)) {
      if (typeof valor !== "number") continue;
      const agg = actAgg.get(id) ?? { valores: [], usuarios: new Set() };
      agg.valores.push(valor);
      agg.usuarios.add(a.user_id);
      actAgg.set(id, agg);
    }
  }
  const actitudes = (
    datosActitudes as unknown as { dimensiones: { id: string; nombre: string }[] }
  ).dimensiones.map((d) => {
    const agg = actAgg.get(d.id);
    return {
      dimension: d.id,
      nombre: d.nombre,
      estudiantes: agg?.usuarios.size ?? 0,
      promedio:
        agg && agg.valores.length > 0
          ? Math.round((agg.valores.reduce((s, v) => s + v, 0) / agg.valores.length) * 10) / 10
          : null,
    };
  });

  // Vocacional: conteo de las 2 dimensiones más fuertes (top2).
  const top2Conteo = new Map<string, number>();
  for (const v of vocFilas) {
    const top2 = (Array.isArray(v.perfil_top2) ? v.perfil_top2 : []) as string[];
    for (const dim of top2) {
      top2Conteo.set(dim, (top2Conteo.get(dim) ?? 0) + 1);
    }
  }
  const vocacional = {
    completados: vocFilas.length,
    top2: DIMENSIONES_RIASEC.map((d) => ({
      dimension: d.id,
      nombre: d.nombre,
      cantidad: top2Conteo.get(d.id) ?? 0,
    })).sort((a, b) => b.cantidad - a.cantidad),
  };

  // Juegos: por juego, jugadores, puntos promedio e insignias.
  const juegosAgg = new Map<string, { usuarios: Set<string>; puntos: number[]; insignias: number }>();
  for (const j of jueFilas) {
    const agg = juegosAgg.get(j.juego) ?? { usuarios: new Set(), puntos: [], insignias: 0 };
    agg.usuarios.add(j.user_id);
    agg.puntos.push(j.puntos);
    agg.insignias += ((j.insignias ?? []) as string[]).length;
    juegosAgg.set(j.juego, agg);
  }
  const juegos = [...juegosAgg.entries()].map(([juego, agg]) => ({
    juego,
    jugadores: agg.usuarios.size,
    partidas: agg.puntos.length,
    puntosPromedio:
      agg.puntos.length > 0
        ? Math.round(agg.puntos.reduce((s, v) => s + v, 0) / agg.puntos.length)
        : null,
    insignias: agg.insignias,
  }));

  return {
    diagnostico,
    logica: {
      estudiantes: logicaAgg.usuarios.size,
      intentos: logicaAgg.valores.length,
      promedioPuntaje:
        logicaAgg.valores.length > 0
          ? Math.round(
              logicaAgg.valores.reduce((s, v) => s + v, 0) / logicaAgg.valores.length
            )
          : null,
      promedioAciertos:
        logicaAciertos.length > 0
          ? Math.round(
              (logicaAciertos.reduce((s, v) => s + v, 0) / logicaAciertos.length) * 10
            ) / 10
          : null,
    },
    actitudes,
    vocacional,
    juegos,
  };
}

// ---------------------------------------------------------------------------
// Buzón: lista de mensajes (tabla `buzon`; el plan la nombra
// `mensajes_buzon`, pero la tabla real creada en 0001 es `buzon`).
// ---------------------------------------------------------------------------

export type MensajeBuzonAdmin = {
  id: string;
  anonimo: boolean;
  alias_visible: string | null;
  tipo: string;
  mensaje: string;
  estado: string;
  created_at: string;
};

export async function listarMensajesBuzonAdmin(): Promise<MensajeBuzonAdmin[]> {
  const supabase = await crearClienteServidor();
  if (!supabase) return [];
  const { data } = await supabase
    .from("buzon")
    .select("id, anonimo, alias_visible, tipo, mensaje, estado, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as MensajeBuzonAdmin[];
}

// ---------------------------------------------------------------------------
// Actividad: últimas filas (vacía si la migración 0003 no se corrió).
// ---------------------------------------------------------------------------

export async function listarActividadAdmin(): Promise<{
  filas: FilaActividad[];
  pendiente: boolean;
}> {
  const supabase = await crearClienteServidor();
  if (!supabase) return { filas: [], pendiente: true };
  const { data, error } = await supabase
    .from("actividad")
    .select("id, user_id, tipo, inicio, fin, duracion_segundos")
    .order("inicio", { ascending: false })
    .limit(200);
  if (error && error.code === "PGRST205") return { filas: [], pendiente: true };
  if (error || !data) return { filas: [], pendiente: false };

  const filasRaw = data as {
    id: string;
    user_id: string;
    tipo: string;
    inicio: string;
    fin: string | null;
    duracion_segundos: number | null;
  }[];
  const ids = [...new Set(filasRaw.map((f) => f.user_id))];
  const { data: perfilesRaw } = await supabase
    .from("profiles")
    .select("id, alias")
    .in("id", ids);
  const perfiles = (perfilesRaw ?? []) as { id: string; alias: string }[];
  const aliasPorId = new Map(perfiles.map((p) => [p.id, p.alias]));

  return {
    filas: filasRaw.map((f) => ({
      id: f.id,
      user_id: f.user_id,
      alias: aliasPorId.get(f.user_id) ?? "[sin alias]",
      tipo: f.tipo,
      inicio: f.inicio,
      fin: f.fin,
      duracion_segundos: f.duracion_segundos,
    })),
    pendiente: false,
  };
}

// ---------------------------------------------------------------------------
// Mejoras pendientes: marcadores de config/institucion.json (solo lectura)
// + frescura de data/despues-del-cole.json (página /futuro).
// ---------------------------------------------------------------------------

export function listarMarcadores(): MarcadorPendiente[] {
  const salida: MarcadorPendiente[] = [];
  const recorrer = (valor: unknown, ruta: string) => {
    if (typeof valor === "string") {
      if (esMarcador(valor)) {
        salida.push({
          ruta,
          valor,
          tipo: valor.includes("[COMPLETAR") ? "COMPLETAR" : "VERIFICAR",
        });
      }
      return;
    }
    if (Array.isArray(valor)) {
      valor.forEach((v, i) => recorrer(v, `${ruta}[${i}]`));
      return;
    }
    if (valor && typeof valor === "object") {
      for (const [k, v] of Object.entries(valor as Record<string, unknown>)) {
        recorrer(v, ruta ? `${ruta}.${k}` : k);
      }
    }
  };
  recorrer(institucion, "");
  return salida;
}

export function obtenerMejorasAdmin(): MejorasAdmin {
  const futuro = despuesDelCole as unknown as {
    ultima_revision?: string;
    instituciones?: unknown[];
    becas?: unknown[];
    plazos?: { estado?: string }[];
  };
  return {
    marcadores: listarMarcadores(),
    futuro: {
      ultimaRevision: futuro.ultima_revision ?? "[sin fecha]",
      instituciones: futuro.instituciones?.length ?? 0,
      becas: futuro.becas?.length ?? 0,
      plazos: futuro.plazos?.length ?? 0,
      plazosPorConfirmar:
        futuro.plazos?.filter((p) => p.estado === "por confirmar").length ?? 0,
    },
  };
}
