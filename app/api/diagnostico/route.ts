import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { crearClienteServidor, obtenerUsuario } from "@/lib/supabase/server";
import {
  AREAS,
  NIVELES,
  type Area,
  type Nivel,
} from "@/lib/diagnostico";

function error(mensaje: string, estado: number) {
  return NextResponse.json({ ok: false, error: mensaje }, { status: estado });
}

type CuerpoDiagnostico = {
  area?: unknown;
  nivel?: unknown;
  puntaje?: unknown;
  respuestas?: unknown;
};

/**
 * POST /api/diagnostico — guarda el resultado de un área del examen
 * diagnóstico en la tabla `diagnosticos` (solo el dueño, por RLS).
 * Sin Supabase o sin sesión responde ok con guardado:false: el
 * resultado igual se muestra en pantalla, solo no queda guardado.
 */
export async function POST(request: NextRequest) {
  let cuerpo: CuerpoDiagnostico;
  try {
    cuerpo = (await request.json()) as CuerpoDiagnostico;
  } catch {
    return error("No se pudo leer el resultado. Intentá de nuevo.", 400);
  }

  const area = cuerpo.area;
  if (
    typeof area !== "string" ||
    !(AREAS as readonly string[]).includes(area)
  ) {
    return error("Elegí un área válida.", 400);
  }

  const nivel = cuerpo.nivel;
  if (
    typeof nivel !== "string" ||
    !(NIVELES as readonly string[]).includes(nivel)
  ) {
    return error("El nivel no es válido.", 400);
  }

  const puntaje =
    typeof cuerpo.puntaje === "number"
      ? Math.max(0, Math.min(100, Math.round(cuerpo.puntaje)))
      : null;

  const respuestas = Array.isArray(cuerpo.respuestas)
    ? cuerpo.respuestas.filter(
        (r): r is { preguntaId: string; elegida: number; correcta: boolean } =>
          typeof r === "object" &&
          r !== null &&
          typeof (r as { preguntaId?: unknown }).preguntaId === "string" &&
          typeof (r as { elegida?: unknown }).elegida === "number" &&
          typeof (r as { correcta?: unknown }).correcta === "boolean"
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

  const { error: errorInsert } = await supabase.from("diagnosticos").insert({
    user_id: usuario.id,
    area: area as Area,
    nivel: nivel as Nivel,
    puntaje,
    respuestas,
  });

  if (errorInsert) {
    return error("No se pudo guardar el resultado. Intentá de nuevo.", 500);
  }

  return NextResponse.json({ ok: true, guardado: true });
}
