import type { NextConfig } from "next";

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
};

export default nextConfig;
