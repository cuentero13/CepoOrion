"use client";

import { useEffect } from "react";

/** Registra el service worker (PWA con offline básico) cuando el navegador lo permite. */
export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Sin service worker el sitio sigue funcionando en línea.
      });
    }
  }, []);
  return null;
}
