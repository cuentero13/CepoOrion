import { createBrowserClient } from "@supabase/ssr";
import {
  supabaseAnonKey,
  supabaseConfigurado,
  supabaseUrl,
} from "./config";

type ClienteNavegador = ReturnType<typeof createBrowserClient>;

let cliente: ClienteNavegador | null = null;

/**
 * Cliente Supabase para el navegador (componentes "use client").
 * Devuelve null si Supabase no está configurado (ver .env.example y
 * docs/supabase-setup.md). Quien lo usa debe mostrar el aviso de
 * configuración pendiente en ese caso, no fallar.
 */
export function crearClienteNavegador(): ClienteNavegador | null {
  if (!supabaseConfigurado) return null;
  if (!cliente) {
    cliente = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return cliente;
}
