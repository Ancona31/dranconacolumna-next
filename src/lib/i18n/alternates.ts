import type { Metadata } from "next";
import type { Locale } from "./types";
import { routeFor } from "./slug-map";
import { SITE_URL } from "@/lib/config";

/**
 * Construye el bloque `alternates` de Next (hreflang + canonical) para una
 * página, partiendo de su ruta canónica en español `esPath` y del `locale` en
 * el que se está renderizando.
 *
 * - `canonical`: la URL absoluta de la propia página en su locale.
 * - `languages`: `es`, `en` y `x-default`. El par EN se resuelve con `routeFor`
 *   del slug-map; si la ruta no tiene equivalente en inglés (p. ej.
 *   /aviso-de-privacidad), se omite `en` y `x-default` apunta a la ES.
 *
 * `x-default` siempre apunta al español, que es la versión original y de mayor
 * cobertura del sitio.
 */
export function buildAlternates(
  esPath: string,
  locale: Locale
): Metadata["alternates"] {
  const abs = (path: string) => `${SITE_URL}${path}`;

  const enPath = routeFor(esPath, "en");
  // routeFor devuelve la propia ruta ES cuando no hay par EN: así se detecta.
  const hasEnPair = enPath !== esPath;

  const esUrl = abs(esPath);
  const enUrl = abs(enPath);

  const languages: Record<string, string> = { es: esUrl };
  if (hasEnPair) languages.en = enUrl;
  languages["x-default"] = esUrl;

  return {
    canonical: locale === "en" && hasEnPair ? enUrl : esUrl,
    languages,
  };
}
