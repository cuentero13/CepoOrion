import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  supabaseAnonKey,
  supabaseConfigurado,
  supabaseUrl,
} from "./config";

export type Perfil = {
  id: string;
  alias: string;
  curso: string | null;
  email: string | null;
  rol: "estudiante" | "docente" | "admin";
  es_menor: boolean;
  tutor_consent: boolean;
  created_at: string;
};

type ClienteServidor = ReturnType<typeof createServerClient>;

/**
 * Cliente Supabase para Server Components y Route Handlers.
 * Devuelve null si Supabase no está configurado.
 */
export async function crearClienteServidor(): Promise<ClienteServidor | null> {
  if (!supabaseConfigurado) return null;
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // En un Server Component no se pueden escribir cookies; se ignora.
        }
      },
    },
  });
}

/** Usuario autenticado actual, o null (sin sesión o sin Supabase). */
export async function obtenerUsuario() {
  const supabase = await crearClienteServidor();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Perfil (alias, curso, rol) del usuario actual, o null. */
export async function obtenerPerfil(): Promise<Perfil | null> {
  const supabase = await crearClienteServidor();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return (data as Perfil | null) ?? null;
}
