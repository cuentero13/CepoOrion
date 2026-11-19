"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registrar, validarAlias } from "@/lib/auth";
import { supabaseConfigurado } from "@/lib/supabase/config";

const CURSOS = [
  "1.º de Secundaria",
  "2.º de Secundaria",
  "3.º de Secundaria",
  "4.º de Secundaria",
  "5.º de Secundaria",
  "6.º de Secundaria",
];

const campo =
  "mt-1 w-full rounded-xl border-2 border-rio/40 bg-white px-3 py-2 text-noche placeholder:text-neutral-500 dark:placeholder:text-white/50 dark:border-rio-claro/50 dark:bg-noche dark:text-white";
const etiqueta =
  "block text-sm font-bold text-noche dark:text-white";

export default function FormularioRegistro() {
  const router = useRouter();
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [curso, setCurso] = useState("");
  const [email, setEmail] = useState("");
  const [esMenor, setEsMenor] = useState<boolean | null>(null);
  const [tutorConsent, setTutorConsent] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  async function alEnviar(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!validarAlias(alias)) {
      setError(
        "El alias debe tener de 3 a 30 caracteres, solo letras minúsculas, números, guion bajo (_) o guion (-), y empezar por letra, número o guion bajo."
      );
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden. Escríbelas de nuevo.");
      return;
    }
    if (!curso) {
      setError("Elige tu curso.");
      return;
    }
    if (esMenor === null) {
      setError("Indica si eres mayor o menor de edad.");
      return;
    }
    if (esMenor && !tutorConsent) {
      setError(
        "Si eres menor de edad, necesitas la autorización de tu madre, padre o tutor. Marca la casilla de autorización para continuar."
      );
      return;
    }
    setCargando(true);
    const resultado = await registrar({
      alias,
      password,
      curso,
      email: email.trim() || undefined,
      esMenor,
      tutorConsent,
    });
    setCargando(false);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    setExito(true);
    window.setTimeout(() => {
      router.push("/progreso");
      router.refresh();
    }, 2500);
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
          El registro aún no está disponible: el colegio todavía no creó el
          proyecto Supabase. Cuando esté listo, aquí podrás crear tu cuenta
          con tu alias.
        </p>
      </div>
    );
  }

  if (exito) {
    return (
      <div
        role="status"
        className="mt-8 rounded-2xl border-2 border-selva bg-selva/10 p-6 text-center dark:border-sol dark:bg-sol/10"
      >
        <p className="font-display text-2xl font-extrabold text-selva dark:text-sol">
          ¡Bienvenido a CEPO, {alias.trim().toLowerCase()}!
        </p>
        <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
          Tu cuenta está lista. Te llevamos a Mi progreso…
        </p>
        <Link
          href="/progreso"
          className="mt-5 inline-block rounded-full bg-selva px-6 py-3 font-display font-bold text-white dark:bg-sol dark:text-noche"
        >
          Ir a Mi progreso →
        </Link>
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
          className="mb-4 rounded-xl border-2 border-achiote bg-achiote/10 px-4 py-3 text-sm font-bold text-achiote dark:text-achiote-claro"
        >
          {error}
        </p>
      )}

      <div>
        <label htmlFor="alias" className={etiqueta}>
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
          className={campo}
        />
        <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">
          De 3 a 30 caracteres: solo letras minúsculas, números, guion bajo
          (_) o guion (-). Será tu nombre dentro del colegio.
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor="password" className={etiqueta}>
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={campo}
        />
        <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">
          Mínimo 8 caracteres. No la compartas con nadie.
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor="confirmar" className={etiqueta}>
          Confirmar contraseña
        </label>
        <input
          id="confirmar"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          required
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          className={campo}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="curso" className={etiqueta}>
          Curso
        </label>
        <select
          id="curso"
          name="curso"
          required
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          className={campo}
        >
          <option value="">Elige tu curso</option>
          {CURSOS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="email" className={etiqueta}>
          Correo electrónico (opcional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className={campo}
        />
        <p className="mt-1 text-xs text-neutral-500 dark:text-white/60">
          Solo si quieres que el colegio pueda contactarte. No es obligatorio.
        </p>
      </div>

      <fieldset className="mt-5">
        <legend className={etiqueta}>Edad</legend>
        <div className="mt-2 flex flex-col gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-rio/30 px-3 py-2 text-sm font-bold text-noche dark:border-rio-claro/40 dark:text-white">
            <input
              type="radio"
              name="edad"
              checked={esMenor === false}
              onChange={() => setEsMenor(false)}
              className="accent-[#1B5E20]"
            />
            Soy mayor de edad
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-rio/30 px-3 py-2 text-sm font-bold text-noche dark:border-rio-claro/40 dark:text-white">
            <input
              type="radio"
              name="edad"
              checked={esMenor === true}
              onChange={() => setEsMenor(true)}
              className="accent-[#1B5E20]"
            />
            Soy menor de edad
          </label>
        </div>
      </fieldset>

      {esMenor && (
        <div className="mt-4 rounded-xl border-2 border-sol bg-sol/10 p-4">
          <label className="flex cursor-pointer items-start gap-2 text-sm leading-relaxed text-noche dark:text-white">
            <input
              type="checkbox"
              checked={tutorConsent}
              onChange={(e) => setTutorConsent(e.target.checked)}
              className="mt-1 accent-[#1B5E20]"
            />
            <span>
              <strong>
                Tengo autorización de mi madre, padre o tutor
              </strong>{" "}
              para crear esta cuenta en el sitio del colegio.
            </span>
          </label>
          <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-white/70">
            Al registrarte, aceptas que el colegio guarde tu alias, tu curso
            y tus resultados de diagnósticos y juegos, solo para tu
            seguimiento educativo. Tus datos no se comparten con nadie fuera
            del colegio. Puedes pedir que se borren en la dirección.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="mt-6 w-full rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 dark:bg-sol dark:text-noche"
      >
        {cargando ? "Creando tu cuenta…" : "Crear mi cuenta"}
      </button>

      <p className="mt-4 text-center text-sm text-neutral-600 dark:text-white/75">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-bold text-rio underline underline-offset-2 dark:text-rio-claro"
        >
          Entra aquí
        </Link>
      </p>
    </form>
  );
}
