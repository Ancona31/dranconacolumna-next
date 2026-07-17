import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { PADECIMIENTOS } from "@/lib/padecimientos";
import { routeFor } from "@/lib/i18n/slug-map";

/**
 * Sitemap bilingüe nativo de Next. Emite una entrada por cada URL indexable de
 * los dos árboles (ES y EN) y, cuando la ruta tiene par en el otro idioma,
 * declara sus `alternates.languages` (formato nativo de MetadataRoute.Sitemap)
 * para que Google enlace ambas versiones.
 *
 * Las rutas salen del slug-map (routeFor resuelve el par EN) y del registro de
 * padecimientos, no a mano: añadir un padecimiento o traducir una página basta
 * para que aparezca aquí. /aviso-de-privacidad no tiene par EN: va solo en ES,
 * sin alternates. Cada EN hereda priority/changeFrequency de su par ES.
 */

type RouteMeta = Pick<
  MetadataRoute.Sitemap[number],
  "changeFrequency" | "priority"
>;

/** Rutas estáticas ES con su prioridad/frecuencia. El EN hereda las mismas. */
const STATIC_ROUTES: (RouteMeta & { es: string })[] = [
  { es: "/", changeFrequency: "monthly", priority: 1.0 },
  { es: "/evaluacion", changeFrequency: "monthly", priority: 0.9 },
  { es: "/cirugia-de-columna", changeFrequency: "monthly", priority: 0.8 },
  { es: "/padecimientos", changeFrequency: "monthly", priority: 0.8 },
  { es: "/sobre-mi", changeFrequency: "yearly", priority: 0.7 },
  { es: "/contacto", changeFrequency: "yearly", priority: 0.6 },
  { es: "/aviso-de-privacidad", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;

  /**
   * Devuelve las entradas de una ruta ES: la propia ES y, si tiene par EN, la
   * EN — ambas con el mismo bloque `alternates.languages`. Sin par EN, una sola
   * entrada en español, sin alternates.
   */
  const entriesFor = (esPath: string, meta: RouteMeta): MetadataRoute.Sitemap => {
    const enPath = routeFor(esPath, "en");
    const hasEnPair = enPath !== esPath;

    if (!hasEnPair) {
      return [{ url: url(esPath), lastModified, ...meta }];
    }

    const languages = { es: url(esPath), en: url(enPath) };
    return [
      { url: url(esPath), lastModified, ...meta, alternates: { languages } },
      { url: url(enPath), lastModified, ...meta, alternates: { languages } },
    ];
  };

  const staticEntries = STATIC_ROUTES.flatMap(({ es, ...meta }) =>
    entriesFor(es, meta)
  );

  const padecimientoEntries = Object.keys(PADECIMIENTOS).flatMap((slug) =>
    entriesFor(`/padecimientos/${slug}`, {
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...staticEntries, ...padecimientoEntries];
}
