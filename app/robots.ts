import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/progreso", "/login", "/registro"],
    },
    sitemap: "https://cepo-orion.vercel.app/sitemap.xml",
  };
}
