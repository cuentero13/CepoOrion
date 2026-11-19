import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  supabaseAnonKey,
  supabaseConfigurado,
  supabaseUrl,
} from "@/lib/supabase/config";

/**
 * Protege /progreso y /admin: sin sesión, redirige a /login.
 * Si Supabase no está configurado, deja pasar (las páginas muestran el
 * aviso de configuración pendiente). La comprobación de rol (admin/docente)
 * se hace dentro de cada página, en el servidor.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  if (!supabaseConfigurado) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("siguiente", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/progreso/:path*", "/admin/:path*"],
};
