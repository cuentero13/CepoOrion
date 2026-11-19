"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { iniciarSesion } from "@/lib/auth";
import { supabaseConfigurado } from "@/lib/supabase/config";

function destinoSeguro(valor: string | null): string {
  if (valor && valor.startsWith("/") && !valor.startsWith("//")) return valor;
  return "/progreso";
}

export default function FormularioLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function alEnviar(e: FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    const resultado = await iniciarSesion(alias, password);
    setCargando(false);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    router.push(destinoSeguro(params.get("siguiente")));
    router.refresh();
  }

  if (!supabaseConfigurado) {
    return (
      <div
        role="alert"
        className="mt-8 rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-5 text-sm leading-relaxed text-neutral-700 dark:text-white/85"
      >
        <p className="font-display text-base font-bold text-noche dark:text-sol">
          Configuración pendiente
        </p>
        <p className="mt-2">
          El inicio de sesión aún no está disponible: el colegio todavía no
          creó el proyecto Supabase. Cuando esté listo, aquí podrás entrar
          con tu alias y tu contraseña.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={alEnviar}
      className="mt-8 rounded-2xl border border-rio/30 bg-white p-5 shadow-sm sm:p-6 dark:border-rio-claro/30 dark:bg-noche-claro"
    >
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border-2 border-achiote bg-achiote/10 px-4 py-3 text-sm font-bold text-achiote"
        >
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="alias"
          className="block text-sm font-bold text-noche dark:text-white"
        >
          Alias
        </label>
        <input
          id="alias"
          name="alias"
          type="text"
          autoComplete="username"
          required
          minLength={3}
          maxLength={30}
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="tu_alias"
          className="mt-1 w-full rounded-xl border-2 border-rio/40 bg-white px-3 py-2 text-noche placeholder:text-neutral-400 dark:border-rio-claro/50 dark:bg-noche dark:text-white"
        />
        <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">
          El alias que elegiste al registrarte, en minúsculas.
        </p>
      </div>

      <div className="mt-4">
        <label
          htmlFor="password"
          className="block text-sm font-bold text-noche dark:text-white"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border-2 border-rio/40 bg-white px-3 py-2 text-noche dark:border-rio-claro/50 dark:bg-noche dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="mt-6 w-full rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 dark:bg-sol dark:text-noche"
      >
        {cargando ? "Entrando…" : "Entrar"}
      </button>

      <p className="mt-4 text-center text-sm text-neutral-600 dark:text-white/75">
        ¿Aún no tienes cuenta?{" "}
        <Link
          href="/registro"
          className="font-bold text-rio underline underline-offset-2 dark:text-rio-claro"
        >
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
