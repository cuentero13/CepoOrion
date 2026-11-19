/**
 * Configuración de Supabase y Turnstile.
 * Todas las claves se leen de variables de entorno (ver .env.example).
 * Si el proyecto Supabase aún no está creado, `supabaseConfigurado` es
 * false y las páginas muestran un aviso de configuración pendiente en
 * lugar de fallar. Ver docs/supabase-setup.md.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True cuando hay URL y clave anónima válidas para conectar con Supabase. */
export const supabaseConfigurado = Boolean(
  supabaseUrl.startsWith("http") && supabaseAnonKey.length > 10
);

/** True cuando hay site key de Cloudflare Turnstile para el buzón. */
export const turnstileConfigurado = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
);
