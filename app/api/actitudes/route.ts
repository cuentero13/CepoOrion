import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { crearClienteServidor, obtenerUsuario } from "@/lib/supabase/server";
import { registrarActividad } from "@/lib/actividad";

function error(mensaje: string, estado: number) {
  return NextResponse.json({ ok: false, error: mensaje }, { status: estado });
}

type CuerpoActitudes = {
  dimensiones?: unknown;
  /** ISO del momento en que el estudiante abrió el cuestionario (lo mide el cliente). */
  inicio?: unknown;
};

/**
 * POST /api/actitudes — guarda el resultado del cuestionario de
 * actitudes y hábitos en la tabla `actitudes` (solo el dueño, por RLS).
 * Las dimensiones son promedios de 1 a 5 por dimensión. Sin Supabase o
 * sin sesión responde ok con guardado:false: el resultado igual se
 * muestra en pantalla, solo no queda guardado.
 */
export async function POST(request: NextRequest) {
  let cuerpo: CuerpoActitudes;
  try {
    cuerpo = (await request.json()) as CuerpoActitudes;
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

  const limpias: Record<string, number> = {};
  for (const [nombre, valor] of entradas) {
    if (typeof valor !== "number" || Number.isNaN(valor)) {
      return error("El resultado no es válido.", 400);
    }
    limpias[nombre] = Math.max(1, Math.min(5, Math.round(valor * 100) / 100));
  }

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

  const { error: errorInsert } = await supabase.from("actitudes").insert({
    user_id: usuario.id,
    dimensiones: limpias,
  });

  if (errorInsert) {
    return error("No se pudo guardar el resultado. Intentá de nuevo.", 500);
  }

  // Fase i: tiempo del intento (no falla si la tabla aún no existe).
  await registrarActividad(supabase, usuario.id, "actitudes", cuerpo.inicio);

  return NextResponse.json({ ok: true, guardado: true });
}
