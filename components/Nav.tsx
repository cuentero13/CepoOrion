"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import OrionLogo from "./OrionLogo";
import { crearClienteNavegador } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

const ENLACES = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/nosotros", etiqueta: "Nosotros" },
  { href: "/horarios", etiqueta: "Horarios" },
  { href: "/diagnostico", etiqueta: "Diagnóstico" },
  { href: "/actitudes", etiqueta: "Actitudes" },
  { href: "/juegos", etiqueta: "Juegos" },
  { href: "/progreso", etiqueta: "Mi progreso" },
  { href: "/buzon", etiqueta: "Buzón" },
  { href: "/contacto", etiqueta: "Contacto" },
];

type TamanoLetra = "font-a" | "font-m" | "font-g";

export default function Nav() {
  const [oscuro, setOscuro] = useState(false);
  const [tamano, setTamano] = useState<TamanoLetra>("font-m");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [alias, setAlias] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = crearClienteNavegador();
    if (!supabase) {
      setAlias(null);
      return;
    }
    let activo = true;
    const cargarAlias = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!activo) return;
      if (!user) {
        setAlias(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("alias")
        .eq("id", user.id)
        .single();
      if (activo) setAlias(data?.alias ?? null);
    };
    cargarAlias();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento: AuthChangeEvent, sesion: Session | null) => {
      if (!sesion?.user) {
        setAlias(null);
      } else {
        cargarAlias();
      }
    });
    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  const salir = async () => {
    const supabase = crearClienteNavegador();
    if (supabase) await supabase.auth.signOut();
    setAlias(null);
    setMenuAbierto(false);
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const guardadoOscuro = localStorage.getItem("cepo-tema");
    const guardadoTamano = localStorage.getItem("cepo-letra") as TamanoLetra | null;
    if (guardadoOscuro === "oscuro") setOscuro(true);
    if (guardadoTamano) setTamano(guardadoTamano);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", oscuro);
    localStorage.setItem("cepo-tema", oscuro ? "oscuro" : "claro");
  }, [oscuro]);

  useEffect(() => {
    document.documentElement.classList.remove("font-a", "font-m", "font-g");
    document.documentElement.classList.add(tamano);
    localStorage.setItem("cepo-letra", tamano);
  }, [tamano]);

  const cicloLetra = () => {
    setTamano((t) => (t === "font-a" ? "font-m" : t === "font-m" ? "font-g" : "font-a"));
  };

  const etiquetaLetra = tamano === "font-a" ? "A" : tamano === "font-m" ? "A+" : "A++";

  return (
    <header className="sticky top-0 z-50 border-b-4 border-sol bg-white/95 shadow-sm backdrop-blur dark:bg-noche/95">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-sol focus:px-3 focus:py-2 focus:font-bold focus:text-noche"
      >
        Saltar al contenido
      </a>
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2"
        aria-label="Navegación principal"
      >
        <Link href="/" aria-label="CEPO — Inicio">
          <OrionLogo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                aria-current={pathname === e.href ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-sm font-bold transition-colors hover:bg-rio/15 hover:text-rio dark:hover:bg-rio-claro/20 dark:hover:text-rio-claro ${
                  pathname === e.href
                    ? "bg-selva text-white dark:bg-sol dark:text-noche"
                    : "text-noche dark:text-white"
                }`}
              >
                {e.etiqueta}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {alias ? (
            <>
              <span className="hidden max-w-32 truncate text-sm font-bold text-selva sm:block dark:text-sol">
                Hola, {alias}
              </span>
              <button
                type="button"
                onClick={salir}
                aria-label={`Salir de la sesión de ${alias}`}
                className="rounded-full border-2 border-achiote px-3 py-1 text-sm font-extrabold text-achiote transition-colors hover:bg-achiote hover:text-white"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              href="/login"
              aria-label="Entrar con tu cuenta"
              className="rounded-full border-2 border-selva px-3 py-1 text-sm font-extrabold text-selva transition-colors hover:bg-selva hover:text-white dark:border-sol dark:text-sol dark:hover:bg-sol dark:hover:text-noche"
            >
              Entrar
            </Link>
          )}
          <button
            type="button"
            onClick={cicloLetra}
            aria-label={`Tamaño de letra actual: ${etiquetaLetra}. Toca para cambiarlo.`}
            title="Cambiar tamaño de letra"
            className="rounded-full border-2 border-rio px-2 py-1 text-sm font-extrabold text-rio transition-colors hover:bg-rio hover:text-white dark:border-rio-claro dark:text-rio-claro dark:hover:bg-rio-claro dark:hover:text-noche"
          >
            {etiquetaLetra}
          </button>
          <button
            type="button"
            onClick={() => setOscuro((o) => !o)}
            aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={oscuro ? "Modo claro" : "Modo oscuro"}
            className="rounded-full border-2 border-noche px-2 py-1 text-sm font-extrabold text-noche transition-colors hover:bg-noche hover:text-white dark:border-sol dark:text-sol dark:hover:bg-sol dark:hover:text-noche"
          >
            {oscuro ? "☀️" : "🌙"}
          </button>
          <button
            type="button"
            onClick={() => setMenuAbierto((m) => !m)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            className="rounded-lg border-2 border-selva px-3 py-1 text-lg font-extrabold text-selva lg:hidden dark:border-sol dark:text-sol"
          >
            {menuAbierto ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuAbierto && (
        <ul id="menu-movil" className="border-t border-rio/30 px-4 py-2 lg:hidden">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                aria-current={pathname === e.href ? "page" : undefined}
                onClick={() => setMenuAbierto(false)}
                className={`block rounded-lg px-3 py-2 font-bold ${
                  pathname === e.href
                    ? "bg-selva text-white dark:bg-sol dark:text-noche"
                    : "text-noche dark:text-white"
                }`}
              >
                {e.etiqueta}
              </Link>
            </li>
          ))}
          <li>
            {alias ? (
              <button
                type="button"
                onClick={salir}
                className="block w-full rounded-lg px-3 py-2 text-left font-bold text-achiote"
              >
                Salir ({alias})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuAbierto(false)}
                className="block rounded-lg px-3 py-2 font-bold text-noche dark:text-white"
              >
                Entrar
              </Link>
            )}
          </li>
        </ul>
      )}
    </header>
  );
}
