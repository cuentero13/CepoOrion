import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { crearClienteServidor, obtenerUsuario } from "@/lib/supabase/server";
import { registrarActividad } from "@/lib/actividad";
import { DIMENSIONES_RIASEC } from "@/lib/vocacional";

function error(mensaje: string, estado: number) {
  return NextResponse.json({ ok: false, error: mensaje }, { status: estado });
}

type CuerpoVocacional = {
  dimensiones?: unknown;
  perfil_top2?: unknown;
  /** ISO del momento en que el estudiante abrió el cuestionario (lo mide el cliente). */
  inicio?: unknown;
};

/**
 * POST /api/vocacional — guarda el perfil vocacional (RIASEC) en la
 * tabla `orientacion_vocacional` (solo el dueño, por RLS; docentes y
 * admin leen). Sin Supabase o sin sesión responde ok con
 * guardado:false: el resultado igual se muestra en pantalla, solo no
 * queda guardado. Requiere la migración 0002_fase_h.sql aplicada.
 */
export async function POST(request: NextRequest) {
  let cuerpo: CuerpoVocacional;
  try {
    cuerpo = (await request.json()) as CuerpoVocacional;
  } catch {
    return error("No se pudo leer el resultado. Intentá de nuevo.", 400);
  }

  const dimensiones = cuerpo.dimensiones;
  if (
    typeof dimensiones !== "object" ||
    dimensiones === null ||
    Array.isArray(dimensiones)
  ) {
    return error("El resultado no es válido.", 400);
  }

  const entradas = Object.entries(dimensiones as Record<string, unknown>);
  if (entradas.length === 0) {
    return error("El resultado no trae dimensiones.", 400);
  }

  const idsValidos: Set<string> = new Set(
    DIMENSIONES_RIASEC.map((d) => d.id)
  );
  const limpias: Record<string, number> = {};
  for (const [nombre, valor] of entradas) {
    if (!idsValidos.has(nombre)) {
      return error("El resultado no es válido.", 400);
    }
    if (typeof valor !== "number" || Number.isNaN(valor)) {
      return error("El resultado no es válido.", 400);
    }
    limpias[nombre] = Math.max(1, Math.min(5, Math.round(valor * 100) / 100));
  }

  const top2 = Array.isArray(cuerpo.perfil_top2)
    ? (cuerpo.perfil_top2 as unknown[]).filter(
        (v): v is string => typeof v === "string" && idsValidos.has(v)
      )
    : [];

  if (!supabaseConfigurado) {
    return NextResponse.json({
      ok: true,
      guardado: false,
      motivo: "sin_supabase",
    });
  }

  const supabase = await crearClienteServidor();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      guardado: false,
      motivo: "sin_supabase",
    });
  }

  const usuario = await obtenerUsuario();
  if (!usuario) {
    return NextResponse.json({
      ok: true,
      guardado: false,
      motivo: "sin_sesion",
    });
  }

  const { error: errorInsert } = await supabase
    .from("orientacion_vocacional")
    .insert({
      user_id: usuario.id,
      dimensiones: limpias,
      perfil_top2: top2,
    });

  if (errorInsert) {
    return error("No se pudo guardar el resultado. Intentá de nuevo.", 500);
  }

  // Fase i: tiempo del intento (no falla si la tabla aún no existe).
  await registrarActividad(supabase, usuario.id, "vocacional", cuerpo.inicio);

  return NextResponse.json({ ok: true, guardado: true });
}
