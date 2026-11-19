/**
 * Verificación de Cloudflare Turnstile en el servidor (anti-spam del buzón).
 *
 * Si no hay TURNSTILE_SECRET_KEY configurada, devuelve true (el buzón
 * funciona sin captcha; la clave queda como [COMPLETAR] en .env.example y
 * en docs/supabase-setup.md). Cuando la clave existe, el token del
 * formulario debe verificarse contra Cloudflare; si falta o es inválido,
 * devuelve false y el mensaje no se guarda.
 */
export async function verificarTurnstile(
  token: string | null | undefined,
  ip?: string | null
): Promise<boolean> {
  const secreto = process.env.TURNSTILE_SECRET_KEY;
  if (!secreto) return true;
  if (!token) return false;

  try {
    const cuerpo = new URLSearchParams({
      secret: secreto,
      response: token,
    });
    if (ip) cuerpo.set("remoteip", ip);
    const respuesta = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: cuerpo,
      }
    );
    const datos = (await respuesta.json()) as { success?: boolean };
    return datos.success === true;
  } catch {
    return false;
  }
}
