import type { MetadataRoute } from "next";

const BASE = "https://cepo-orion.vercel.app";

// Páginas públicas del sitio (las áreas con sesión no se indexan).
const routes = [
  "",
  "/nosotros",
  "/contacto",
  "/horarios",
  "/diagnostico",
  "/futuro",
  "/vocacional",
  "/juegos",
  "/actitudes",
  "/buzon",
  "/privacidad",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
