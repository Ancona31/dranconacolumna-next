import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { PADECIMIENTOS } from "@/lib/padecimientos";

/**
 * Sitemap nativo de Next. Solo rutas que responden 200 (los slugs de
 * padecimientos salen del registro, así que coinciden con las páginas reales).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified, changeFrequency: "monthly", priority: 1.0 },
    {
      url: url("/evaluacion"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: url("/cirugia-de-columna"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/padecimientos"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/sobre-mi"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: url("/contacto"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: url("/aviso-de-privacidad"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const padecimientoRoutes: MetadataRoute.Sitemap = Object.keys(
    PADECIMIENTOS
  ).map((slug) => ({
    url: url(`/padecimientos/${slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...padecimientoRoutes];
}
