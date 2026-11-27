import type { NextConfig } from "next";

// Cabeceras de seguridad para todo el sitio (27-nov-2026).
// Sin CSP a propósito: el script de tema en línea del layout la rompería.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Sin cabecera X-Powered-By (ruido) y sin console.* en producción.
  poweredByHeader: false,
  compiler: {
    removeConsole: true,
  },
  experimental: {
    // Inserta el CSS (8,6 kB) en el HTML: elimina la petición CSS que
    // bloquea el render en cada página (Lighthouse, fase f, 19-nov-2026).
    inlineCss: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
