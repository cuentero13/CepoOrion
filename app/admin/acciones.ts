"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor, obtenerPerfil } from "@/lib/supabase/server";

const ESTADOS_VALIDOS = ["nuevo", "en_revision", "resuelto"] as const;

type EstadoBuzon = (typeof ESTADOS_VALIDOS)[number];

/**
 * Cambia el estado de un mensaje del buzón.
 * Solo un administrador puede hacerlo: el rol se verifica en el servidor
 * antes de actualizar (la política RLS de la tabla también lo exige).
 */
export async function actualizarEstadoBuzon(
  id: string,
  estado: string
): Promise<{ ok: boolean; error?: string }> {
  if (!ESTADOS_VALIDOS.includes(estado as EstadoBuzon)) {
    return { ok: false, error: "Estado no válido." };
  }

  const perfil = await obtenerPerfil();
  if (!perfil || perfil.rol !== "admin") {
    return { ok: false, error: "Solo un administrador puede cambiar el estado." };
  }

  const supabase = await crearClienteServidor();
  if (!supabase) {
    return { ok: false, error: "El buzón todavía no está configurado." };
  }

  const { error } = await supabase
    .from("buzon")
    .update({ estado })
    .eq("id", id);

  if (error) {
    return { ok: false, error: "No se pudo actualizar el estado." };
  }

  // La página del buzón se mudó a /admin/buzon (fase i): se revalidan
  // ambas rutas (la portada muestra el conteo de mensajes nuevos).
  revalidatePath("/admin");
  revalidatePath("/admin/buzon");
  return { ok: true };
}
