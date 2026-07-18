import type { Locale } from "./types";

/**
 * Pares de rutas equivalentes entre idiomas. Crece conforme se traducen
 * páginas: basta con añadir entradas aquí.
 */
const PAIRS: ReadonlyArray<{ es: string; en: string }> = [
  { es: "/", en: "/en" },
  { es: "/sobre-mi", en: "/en/about" },
  { es: "/cirugia-de-columna", en: "/en/spine-surgery" },
  { es: "/contacto", en: "/en/contact" },
  // Padecimientos EN — FASE 2.B lote 1 (los 4 de zona lumbar). Los 9 restantes
  // aún no tienen par EN: el selector cae al home EN hasta traducirlos.
  {
    es: "/padecimientos/hernia-de-disco",
    en: "/en/conditions/herniated-disc",
  },
  { es: "/padecimientos/ciatica", en: "/en/conditions/sciatica" },
  {
    es: "/padecimientos/canal-lumbar-estrecho",
    en: "/en/conditions/lumbar-spinal-stenosis",
  },
  {
    es: "/padecimientos/vertebra-desplazada",
    en: "/en/conditions/slipped-vertebra",
  },
  // FASE 2.B lote 2 (columna dorsal/cervical). Quedan 6 sin par EN.
  {
    es: "/padecimientos/desviacion-de-columna",
    en: "/en/conditions/scoliosis",
  },
  {
    es: "/padecimientos/fractura-de-columna",
    en: "/en/conditions/spinal-fractures",
  },
  { es: "/padecimientos/dolor-de-cuello", en: "/en/conditions/neck-pain" },
  // FASE 2.C lote 1 (ortopedia: hombro, rodilla, cadera).
  {
    es: "/padecimientos/dolor-de-hombro",
    en: "/en/conditions/shoulder-pain",
  },
  { es: "/padecimientos/dolor-de-codo", en: "/en/conditions/elbow-pain" },
  { es: "/padecimientos/dolor-de-rodilla", en: "/en/conditions/knee-pain" },
  { es: "/padecimientos/dolor-de-cadera", en: "/en/conditions/hip-pain" },
  // FASE 2.C lote 2 (mano y paraguas: túnel, fracturas/esguinces, deportivas).
  {
    es: "/padecimientos/dolor-de-muneca-y-mano",
    en: "/en/conditions/wrist-and-hand-pain",
  },
  {
    es: "/padecimientos/fracturas-y-esguinces",
    en: "/en/conditions/fractures-sprains",
  },
  {
    es: "/padecimientos/lesiones-deportivas",
    en: "/en/conditions/sports-injuries",
  },
  // Índice de padecimientos (los 14 padecimientos ya tienen par EN).
  { es: "/padecimientos", en: "/en/conditions" },
  // Evaluación (F3.A).
  { es: "/evaluacion", en: "/en/assessment" },
];

const ES_TO_EN = new Map(PAIRS.map((p) => [p.es, p.en] as const));
const EN_TO_ES = new Map(PAIRS.map((p) => [p.en, p.es] as const));

/** Home de cada idioma, usado como destino de reserva. */
const HOME: Record<Locale, string> = { es: "/", en: "/en" };

/**
 * Devuelve la ruta equivalente en el otro idioma para `pathname`, partiendo
 * del locale actual `from`. Si aún no existe equivalente, cae al home del
 * idioma destino. Lo usa el selector de idioma.
 */
export function getAlternatePath(pathname: string, from: Locale): string {
  if (from === "es") return ES_TO_EN.get(pathname) ?? HOME.en;
  return EN_TO_ES.get(pathname) ?? HOME.es;
}

/**
 * Dada la ruta canónica en español `esPath`, devuelve la ruta a usar en
 * `locale`. Para "es" es la misma; para "en" es su equivalente traducido si
 * existe, o la propia ruta ES como reserva (páginas EN aún no creadas —
 * TODO F2.B/F3). Lo usan los enlaces internos de las páginas.
 */
export function routeFor(esPath: string, locale: Locale): string {
  if (locale === "es") return esPath;
  return ES_TO_EN.get(esPath) ?? esPath;
}

/**
 * Ruta del evaluador en `locale`, con la zona precargada opcional. La base sale
 * del slug-map (ES /evaluacion · EN /en/assessment). El id de zona es INTERNO y
 * no cambia entre idiomas; solo cambia el nombre del parámetro: `zona` en ES,
 * `zone` en EN.
 */
export function assessmentHref(locale: Locale, zone?: string): string {
  const base = routeFor("/evaluacion", locale);
  if (!zone) return base;
  return `${base}?${locale === "en" ? "zone" : "zona"}=${zone}`;
}
