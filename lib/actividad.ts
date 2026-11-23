/**
 * lib/actividad.ts — Registro de inicio/fin de un intento en la tabla
 * `actividad` (fase i, migración 0003).
 *
 * Lo llaman los POST de /api/diagnostico, /api/actitudes y
 * /api/vocacional después de guardar el resultado. El inicio lo mide
 * el cliente (cuando el estudiante empieza el área o el cuestionario)
 * y lo manda en el cuerpo del POST; el fin es el momento del guardado.
 *
 * Nunca rompe el guardado: si la tabla todavía no existe (Mike corre
 * la 0003 después), si el inicio no viene o no es válido, o si el
 * insert falla por RLS, la función traga el error y el intento queda
 * guardado igual — solo queda sin su registro de tiempo.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type TipoActividad = "diagnostico" | "actitudes" | "vocacional" | "juego";

export async function registrarActividad(
  supabase: SupabaseClient | null | undefined,
  userId: string,
  tipo: TipoActividad,
  inicioISO: unknown
): Promise<void> {
  if (!supabase || !userId) return;
  try {
    const fin = new Date();
    let inicio = fin;
    if (typeof inicioISO === "string" && inicioISO) {
      const parsed = new Date(inicioISO);
      // Solo se acepta un inicio válido y no futuro (reloj del cliente).
      if (!Number.isNaN(parsed.getTime()) && parsed.getTime() <= fin.getTime()) {
        inicio = parsed;
      }
    }
    const duracion = Math.max(
      0,
      Math.round((fin.getTime() - inicio.getTime()) / 1000)
    );
    await supabase.from("actividad").insert({
      user_id: userId,
      tipo,
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
      duracion_segundos: duracion,
    });
  } catch {
    // Sin tabla todavía, o sin conexión: el intento ya quedó guardado.
  }
}
