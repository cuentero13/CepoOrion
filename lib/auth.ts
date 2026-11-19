/**
 * Autenticación de CEPO con alias (no con correo real).
 *
 * Por dentro, Supabase Auth trabaja con un correo sintético
 * `alias@alias.cepo.local` (ver docs/supabase-setup.md: la confirmación
 * por correo debe estar desactivada en el proyecto). El alias es lo que
 * el estudiante ve y escribe; nunca se pide un correo real obligatorio.
 *
 * Si Supabase no está configurado (hoy no hay proyecto), todas las
 * funciones devuelven { ok: false, error: "Supabase no configurado" }
 * en lugar de fallar. El cliente Supabase se importa de forma diferida
 * dentro de cada función, para no cargar su chunk en el paquete
 * inicial de las páginas que usan este módulo.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfigurado } from "./supabase/config";

async function clienteSupabase(): Promise<SupabaseClient | null> {
  if (!supabaseConfigurado) return null;
  const { crearClienteNavegador } = await import("./supabase/client");
  return crearClienteNavegador();
}

export type ResultadoAuth = { ok: true } | { ok: false; error: string };

const ERROR_NO_CONFIGURADO =
  "Supabase no configurado. El inicio de sesión estará disponible cuando el colegio cree el proyecto Supabase (ver docs/supabase-setup.md).";

/** Correo interno que Supabase Auth usa para un alias. */
export function correoSintetico(alias: string): string {
  return `${alias.trim().toLowerCase()}@alias.cepo.local`;
}

const REGEX_ALIAS = /^[a-z0-9_][a-z0-9_-]{2,29}$/;

/**
 * True si el alias es válido: 3 a 30 caracteres, minúsculas, números,
 * guion bajo o guion; debe empezar por letra, número o guion bajo.
 */
export function validarAlias(alias: string): boolean {
  return REGEX_ALIAS.test(alias.trim().toLowerCase());
}

export function mensajeAliasInvalido(): string {
  return "El alias debe tener de 3 a 30 caracteres, solo letras minúsculas, números, guion bajo (_) o guion (-), y empezar por letra, número o guion bajo.";
}

export type DatosRegistro = {
  alias: string;
  password: string;
  curso: string;
  email?: string;
  esMenor: boolean;
  tutorConsent: boolean;
};

function traducirErrorAuth(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists"))
    return "Ese alias ya está registrado. Elige otro alias o entra con tu contraseña.";
  if (m.includes("invalid login credentials"))
    return "Alias o contraseña incorrectos. Revisa los datos e inténtalo de nuevo.";
  if (m.includes("password"))
    return "La contraseña no cumple los requisitos. Debe tener al menos 8 caracteres.";
  if (m.includes("email"))
    return "El correo no es válido. Revisa el alias o el correo opcional.";
  if (m.includes("duplicate key") || m.includes("unique"))
    return "Ese alias ya está registrado. Elige otro alias.";
  if (m.includes("row-level security") || m.includes("rls"))
    return "No se pudo guardar tu perfil. Inténtalo de nuevo y, si persiste, avisa a la dirección del colegio.";
  return "Ocurrió un error. Inténtalo de nuevo.";
}

/**
 * Crea la cuenta de un estudiante (rol siempre 'estudiante').
 * Si es menor de edad, exige la autorización de madre, padre o tutor.
 */
export async function registrar(datos: DatosRegistro): Promise<ResultadoAuth> {
  const alias = datos.alias.trim().toLowerCase();
  const curso = datos.curso.trim();
  const email = datos.email?.trim() || undefined;

  if (!validarAlias(alias)) {
    return { ok: false, error: mensajeAliasInvalido() };
  }
  if (datos.password.length < 8) {
    return { ok: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }
  if (!curso) {
    return { ok: false, error: "Elige tu curso." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "El correo opcional no es válido. Déjalo vacío o escribe uno válido." };
  }
  if (datos.esMenor && !datos.tutorConsent) {
    return {
      ok: false,
      error:
        "Si eres menor de edad, necesitas la autorización de tu madre, padre o tutor. Marca la casilla de autorización para continuar.",
    };
  }

  const supabase = await clienteSupabase();
  if (!supabase) return { ok: false, error: ERROR_NO_CONFIGURADO };

  const { data, error } = await supabase.auth.signUp({
    email: correoSintetico(alias),
    password: datos.password,
    options: { data: { alias, curso } },
  });
  if (error) return { ok: false, error: traducirErrorAuth(error.message) };
  if (!data.user) {
    return {
      ok: false,
      error: "No se pudo crear la cuenta. Inténtalo de nuevo.",
    };
  }

  const { error: errorPerfil } = await supabase.from("profiles").insert({
    id: data.user.id,
    alias,
    curso,
    email: email ?? null,
    rol: "estudiante",
    es_menor: datos.esMenor,
    tutor_consent: datos.esMenor ? true : datos.tutorConsent,
  });
  if (errorPerfil) {
    return { ok: false, error: traducirErrorAuth(errorPerfil.message) };
  }
  return { ok: true };
}

/** Entra con alias y contraseña. */
export async function iniciarSesion(
  alias: string,
  password: string
): Promise<ResultadoAuth> {
  const aliasLimpio = alias.trim().toLowerCase();
  if (!validarAlias(aliasLimpio)) {
    return { ok: false, error: mensajeAliasInvalido() };
  }
  if (!password) {
    return { ok: false, error: "Escribe tu contraseña." };
  }
  const supabase = await clienteSupabase();
  if (!supabase) return { ok: false, error: ERROR_NO_CONFIGURADO };

  const { error } = await supabase.auth.signInWithPassword({
    email: correoSintetico(aliasLimpio),
    password,
  });
  if (error) return { ok: false, error: traducirErrorAuth(error.message) };
  return { ok: true };
}

/** Cierra la sesión actual. */
export async function cerrarSesion(): Promise<ResultadoAuth> {
  const supabase = await clienteSupabase();
  if (!supabase) return { ok: false, error: ERROR_NO_CONFIGURADO };
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: traducirErrorAuth(error.message) };
  return { ok: true };
}
