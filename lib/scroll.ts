/**
 * Scroll a inicio de página (fase k).
 *
 * Al avanzar a la siguiente pregunta de un examen/cuestionario, o al
 * aparecer una pantalla de resultados, la pantalla vuelve arriba sola:
 * en celular el botón «Siguiente» queda abajo y el usuario no tiene
 * que subir a mano. Respeta `prefers-reduced-motion`: con movimiento
 * reducido el salto es inmediato (behavior "auto") en vez de animado.
 */
export function subirAlInicio(): void {
  if (typeof window === "undefined") return;
  const reducido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  window.scrollTo({ top: 0, behavior: reducido ? "auto" : "smooth" });
}
