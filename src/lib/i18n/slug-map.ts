import type { Locale } from "./types";

/**
 * Pares de rutas equivalentes entre idiomas. De momento solo el home
 * (/ ↔ /en); la estructura está lista para crecer conforme se traduzcan
 * páginas: basta con añadir entradas aquí.
 */
const PAIRS: ReadonlyArray<{ es: string; en: string }> = [{ es: "/", en: "/en" }];

const ES_TO_EN = new Map(PAIRS.map((p) => [p.es, p.en] as const));
const EN_TO_ES = new Map(PAIRS.map((p) => [p.en, p.es] as const));

/** Home de cada idioma, usado como destino de reserva. */
const HOME: Record<Locale, string> = { es: "/", en: "/en" };

/**
 * Devuelve la ruta equivalente en el otro idioma para `pathname`, partiendo
 * del locale actual `from`. Si aún no existe equivalente, cae al home del
 * idioma destino.
 */
export function getAlternatePath(pathname: string, from: Locale): string {
  if (from === "es") return ES_TO_EN.get(pathname) ?? HOME.en;
  return EN_TO_ES.get(pathname) ?? HOME.es;
}
