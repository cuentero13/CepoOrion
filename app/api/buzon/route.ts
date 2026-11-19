import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { crearClienteServidor, obtenerUsuario } from "@/lib/supabase/server";
import { verificarTurnstile } from "@/lib/turnstile";

const MAX_MENSAJE = 2000;
const TIPOS_VALIDOS = ["comentario", "sugerencia", "consulta"] as const;

type TipoBuzon = (typeof TIPOS_VALIDOS)[number];

type CuerpoBuzon = {
  tipo?: unknown;
  mensaje?: unknown;
  anonimo?: unknown;
  alias_visible?: unknown;
  empresa?: unknown;
  tokenTurnstile?: unknown;
};

function error(mensaje: string, estado: number) {
  return NextResponse.json({ ok: false, error: mensaje }, { status: estado });
}

/**
 * POST /api/buzon — recibe un mensaje del buzón privado.
 * Valida tipo y longitud, rechaza el honeypot anti-bots, verifica
 * Turnstile (si está configurado) y guarda en la tabla `buzon`.
 * Si Supabase no está configurado, responde 503.
 */
export async function POST(request: NextRequest) {
  let cuerpo: CuerpoBuzon;
  try {
    cuerpo = (await request.json()) as CuerpoBuzon;
  } catch {
    return error("No se pudo leer el mensaje. Intentá de nuevo.", 400);
  }

  // Honeypot anti-bots: el campo "empresa" debe venir vacío.
  if (typeof cuerpo.empresa === "string" && cuerpo.empresa.trim() !== "") {
    return error("No se pudo enviar el mensaje. Intentá de nuevo.", 400);
  }

  const tipo = cuerpo.tipo;
  if (typeof tipo !== "string" || !TIPOS_VALIDOS.includes(tipo as TipoBuzon)) {
    return error("Elegí un tipo de mensaje válido.", 400);
  }

  const mensaje =
    typeof cuerpo.mensaje === "string" ? cuerpo.mensaje.trim() : "";
  if (mensaje.length === 0) {
    return error("Escribí un mensaje antes de enviar.", 400);
  }
  if (mensaje.length > MAX_MENSAJE) {
    return error(
      `El mensaje no puede tener más de ${MAX_MENSAJE} caracteres.`,
      400
    );
  }

  const anonimo = cuerpo.anonimo === true;
  const aliasVisible =
    typeof cuerpo.alias_visible === "string"
      ? cuerpo.alias_visible.trim().slice(0, 30)
      : "";

  // Verificación anti-spam (solo actúa si hay clave secreta configurada).
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const token =
    typeof cuerpo.tokenTurnstile === "string" ? cuerpo.tokenTurnstile : null;
  if (!(await verificarTurnstile(token, ip))) {
    return error(
      "No se pudo verificar que no sos un robot. Intentá de nuevo.",
      400
    );
  }

  if (!supabaseConfigurado) {
    return error(
      "El buzón todavía no está configurado. Avisá a la dirección del colegio.",
      503
    );
  }

  const supabase = await crearClienteServidor();
  if (!supabase) {
    return error(
      "El buzón todavía no está configurado. Avisá a la dirección del colegio.",
      503
    );
  }

  const usuario = await obtenerUsuario();

  const { error: errorInsert } = await supabase.from("buzon").insert({
    user_id: anonimo || !usuario ? null : usuario.id,
    anonimo,
    alias_visible: anonimo ? null : aliasVisible || null,
    tipo,
    mensaje,
  });

  if (errorInsert) {
    return error("No se pudo guardar el mensaje. Intentá de nuevo.", 500);
  }

  return NextResponse.json({ ok: true });
}
