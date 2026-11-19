"use client";

import { useEffect, useRef } from "react";

/**
 * Widget de Cloudflare Turnstile (anti-spam del buzón).
 * Solo se muestra si existe NEXT_PUBLIC_TURNSTILE_SITE_KEY; sin ella el
 * buzón funciona sin captcha (ver docs/supabase-setup.md).
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        contenedor: HTMLElement,
        opciones: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

const URL_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js";

export default function Turnstile({
  alVerificar,
}: {
  /** Se llama con el token cuando la persona completa el desafío. */
  alVerificar: (token: string) => void;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const refContenedor = useRef<HTMLDivElement>(null);
  const refWidget = useRef<string | null>(null);
  const refCallback = useRef(alVerificar);
  refCallback.current = alVerificar;

  useEffect(() => {
    if (!siteKey || !refContenedor.current) return;

    let cancelado = false;

    const mostrar = () => {
      if (cancelado || !window.turnstile || !refContenedor.current) return;
      if (refWidget.current) return;
      refWidget.current = window.turnstile.render(refContenedor.current, {
        sitekey: siteKey,
        callback: (token: string) => refCallback.current(token),
        "expired-callback": () => {
          if (refWidget.current && window.turnstile) {
            window.turnstile.reset(refWidget.current);
          }
          refCallback.current("");
        },
        "error-callback": () => refCallback.current(""),
      });
    };

    const existente = document.querySelector(`script[src="${URL_SCRIPT}"]`);
    if (window.turnstile) {
      mostrar();
    } else if (existente) {
      existente.addEventListener("load", mostrar);
    } else {
      const script = document.createElement("script");
      script.src = URL_SCRIPT;
      script.async = true;
      script.defer = true;
      script.addEventListener("load", mostrar);
      document.head.appendChild(script);
    }

    return () => {
      cancelado = true;
    };
  }, [siteKey]);

  if (!siteKey) return null;

  return (
    <div
      ref={refContenedor}
      aria-label="Verificación anti-spam (Cloudflare Turnstile)"
    />
  );
}
