"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Turnstile from "@/components/Turnstile";
import {
  supabaseConfigurado,
  turnstileConfigurado,
} from "@/lib/supabase/config";

const MAX_MENSAJE = 2000;

type TipoBuzon = "comentario" | "sugerencia" | "consulta";

const TIPOS: { valor: TipoBuzon; etiqueta: string }[] = [
  { valor: "comentario", etiqueta: "Comentario" },
  { valor: "sugerencia", etiqueta: "Sugerencia" },
  { valor: "consulta", etiqueta: "Consulta" },
];

/**
 * Buzón privado: los mensajes llegan solo al panel administrativo
 * (dirección y docentes). Se puede escribir de forma anónima.
 * Si Supabase no está configurado, el envío queda deshabilitado y se
 * muestra el aviso de configuración pendiente.
 */
export default function FormularioBuzon() {
  const [tipo, setTipo] = useState<TipoBuzon>("consulta");
  const [mensaje, setMensaje] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [alias, setAlias] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [tokenTurnstile, setTokenTurnstile] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  // Si hay sesión, prellenar el alias visible con el del perfil.
  // El cliente Supabase se importa de forma diferida para no cargar
  // su chunk en el paquete inicial de la página.
  useEffect(() => {
    // Sin proyecto Supabase configurado no hay sesión que comprobar.
    if (!supabaseConfigurado) return;
    let activo = true;
    const iniciar = async () => {
      const { crearClienteNavegador } = await import(
        "@/lib/supabase/client"
      );
      const cliente = crearClienteNavegador();
      if (!cliente) return;
      const cargarAlias = async () => {
      const {
        data: { user },
      } = await cliente.auth.getUser();
      if (!user || !activo) return;
      const { data } = await cliente
        .from("profiles")
        .select("alias")
        .eq("id", user.id)
        .single();
      if (activo && data?.alias) setAlias(data.alias);
      };
      cargarAlias().catch(() => {
        // Sin sesión o sin perfil: el alias queda vacío, no es un error.
      });
    };
    iniciar();
    return () => {
      activo = false;
    };
  }, []);

  const caracteres = mensaje.length;
  const mensajeValido = mensaje.trim().length > 0 && caracteres <= MAX_MENSAJE;
  const faltaTurnstile = turnstileConfigurado && !tokenTurnstile;
  const puedeEnviar =
    supabaseConfigurado && mensajeValido && !faltaTurnstile && !enviando;

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");
    if (!supabaseConfigurado) {
      setError(
        "El buzón todavía no está configurado. Avisá a la dirección del colegio."
      );
      return;
    }
    if (!mensajeValido) {
      setError("Escribí un mensaje de entre 1 y 2000 caracteres.");
      return;
    }
    if (faltaTurnstile) {
      setError("Completá la verificación anti-spam para enviar el mensaje.");
      return;
    }
    setEnviando(true);
    try {
      const respuesta = await fetch("/api/buzon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          mensaje: mensaje.trim(),
          anonimo,
          alias_visible: anonimo ? "" : alias.trim(),
          empresa,
          tokenTurnstile: tokenTurnstile || null,
        }),
      });
      const datos = (await respuesta.json()) as { error?: string };
      if (!respuesta.ok) {
        setError(
          datos.error ?? "No se pudo enviar el mensaje. Intentá de nuevo."
        );
        return;
      }
      setEnviado(true);
    } catch {
      setError(
        "No se pudo enviar el mensaje. Revisá tu conexión e intentá de nuevo."
      );
    } finally {
      setEnviando(false);
    }
  }

  function enviarOtro() {
    setMensaje("");
    setAnonimo(false);
    setTokenTurnstile("");
    setError("");
    setEnviado(false);
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p
          role="status"
          className="mx-auto max-w-xl rounded-3xl border-2 border-rio/40 bg-white p-6 text-lg leading-relaxed dark:border-white/10 dark:bg-noche-claro"
        >
          <span className="block font-display text-2xl font-extrabold text-selva dark:text-sol">
            Gracias, tu mensaje llegó solo a la dirección del colegio
          </span>
          <span className="mt-3 block text-base text-neutral-700 dark:text-white/85">
            Nadie más puede leerlo. Si pediste una respuesta, la dirección te
            va a contactar.
          </span>
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={enviarOtro}
            className="rounded-full bg-selva px-6 py-3 font-display font-bold text-white transition-transform hover:scale-105 dark:bg-sol dark:text-noche"
          >
            Enviar otro mensaje
          </button>
          <Link
            href="/"
            className="rounded-full border-2 border-selva px-6 py-3 font-display font-bold text-selva transition-transform hover:scale-105 dark:border-sol dark:text-sol"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-selva dark:text-rio-claro">
        Buzón privado
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-selva sm:text-4xl dark:text-sol">
        Contanos lo que necesites
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700 dark:text-white/85">
        Tu mensaje llega <strong>solo a la dirección del colegio</strong> y a
        los docentes autorizados. Nadie más puede leerlo. Podés escribir de
        forma anónima si querés.
      </p>

      {!supabaseConfigurado && (
        <p
          role="alert"
          className="mt-6 rounded-2xl border-2 border-dashed border-sol bg-sol/10 p-4 text-sm leading-relaxed text-neutral-700 dark:text-white/85"
        >
          <strong>Configuración pendiente:</strong> el buzón todavía no está
          conectado con la base de datos del colegio. El formulario está
          deshabilitado hasta que la dirección complete la configuración (ver{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs dark:bg-noche">
            docs/supabase-setup.md
          </code>
          ). Mientras tanto, podés acercarte a hablar con la dirección o
          escribir por{" "}
          <Link
            href="/contacto"
            className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
          >
            los medios de contacto
          </Link>
          .
        </p>
      )}

      <form
        onSubmit={enviar}
        className="mt-8 space-y-6 rounded-3xl border-2 border-rio/20 bg-white p-5 shadow-md sm:p-6 dark:border-white/10 dark:bg-noche-claro"
      >
        <fieldset>
          <legend className="font-display text-lg font-bold text-tierra-oscuro dark:text-sol">
            ¿Qué querés contarnos?
          </legend>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-4">
            {TIPOS.map(({ valor, etiqueta }) => (
              <label
                key={valor}
                className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-rio/30 px-4 py-2 font-bold has-checked:border-selva has-checked:bg-selva/10 dark:border-white/20 dark:has-checked:border-sol"
              >
                <input
                  type="radio"
                  name="tipo"
                  value={valor}
                  checked={tipo === valor}
                  onChange={() => setTipo(valor)}
                  disabled={!supabaseConfigurado}
                  className="accent-[#1b5e20]"
                />
                {etiqueta}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="mensaje"
            className="font-display text-lg font-bold text-tierra-oscuro dark:text-sol"
          >
            Tu mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            maxLength={MAX_MENSAJE}
            rows={6}
            required
            disabled={!supabaseConfigurado}
            aria-describedby="contador-mensaje ayuda-mensaje"
            placeholder="Escribí acá tu comentario, sugerencia o consulta…"
            className="mt-2 w-full rounded-2xl border-2 border-rio/30 bg-white p-3 leading-relaxed disabled:opacity-50 dark:border-white/20 dark:bg-noche"
          />
          <p
            id="contador-mensaje"
            className="mt-1 text-right text-sm text-neutral-600 dark:text-white/70"
            aria-live="polite"
          >
            {caracteres} / {MAX_MENSAJE} caracteres
          </p>
          <p id="ayuda-mensaje" className="text-sm text-neutral-600 dark:text-white/70">
            No escribas contraseñas ni datos sensibles que no quieras
            compartir.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-2 font-bold">
            <input
              type="checkbox"
              checked={anonimo}
              onChange={(e) => setAnonimo(e.target.checked)}
              disabled={!supabaseConfigurado}
              className="mt-1 size-5 accent-[#1b5e20]"
            />
            Enviar como anónimo
          </label>
          <p className="text-sm text-neutral-600 dark:text-white/70">
            Si marcás esta casilla, no se guarda tu nombre ni tu cuenta: el
            mensaje llega sin identificar.
          </p>
          {!anonimo && (
            <div>
              <label
                htmlFor="alias"
                className="font-bold text-neutral-800 dark:text-white/90"
              >
                Alias visible (opcional)
              </label>
              <input
                id="alias"
                name="alias"
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                maxLength={30}
                disabled={!supabaseConfigurado}
                placeholder="Tu alias, si querés que sepan quién escribe"
                className="mt-1 w-full rounded-2xl border-2 border-rio/30 bg-white p-3 disabled:opacity-50 dark:border-white/20 dark:bg-noche"
              />
            </div>
          )}
        </div>

        {/* Campo oculto anti-bots: las personas no lo ven ni lo llenan. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden opacity-0">
          <label htmlFor="empresa">Empresa (no completar)</label>
          <input
            id="empresa"
            name="empresa"
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {turnstileConfigurado && (
          <Turnstile alVerificar={setTokenTurnstile} />
        )}

        {error && (
          <p
            role="alert"
            className="rounded-2xl border-2 border-achiote/50 bg-achiote/10 p-3 text-sm font-bold text-achiote dark:text-achiote-claro"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!puedeEnviar}
          className="w-full rounded-full bg-selva px-6 py-3 font-display text-lg font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sol dark:text-noche"
        >
          {enviando ? "Enviando…" : "Enviar mensaje privado"}
        </button>

        <p className="text-center text-sm text-neutral-600 dark:text-white/70">
          Al enviar aceptás la{" "}
          <Link
            href="/privacidad"
            className="font-bold text-rio-oscuro underline-offset-2 hover:underline dark:text-rio-claro"
          >
            Política de Privacidad
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
