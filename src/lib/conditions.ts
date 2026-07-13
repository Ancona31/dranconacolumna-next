/** Padecimientos que trata el doctor. Slugs reutilizables en /padecimientos/[slug]. */

/** Slugs válidos de padecimiento. Fuente única para rutas y registro de contenido. */
export type ConditionSlug =
  | "hernia-de-disco"
  | "ciatica"
  | "canal-lumbar-estrecho"
  | "vertebra-desplazada"
  | "desviacion-de-columna"
  | "fractura-de-columna"
  | "dolor-de-cuello"
  | "fracturas-y-esguinces"
  | "dolor-de-hombro"
  | "dolor-de-rodilla"
  | "dolor-de-cadera"
  | "tunel-del-carpo"
  | "lesiones-deportivas";

/**
 * Nodo anatómico en la silueta compartida de ConditionsBodyMap. `n` es el
 * número que se muestra; `cx`/`cy` son coordenadas en el viewBox 0 0 220 540 de
 * BodyFigureSVG. Los valores son un espejo de BODY_ZONES — se copian aquí (en
 * vez de importarlos) para que este módulo de datos no quede atado al boundary
 * "use client" de ese componente y siga siendo importable desde el servidor.
 * Los padecimientos comparten nodo cuando comparten zona; el enlace de cada
 * card sigue yendo a su propio slug, así que el nodo es solo indicador visual.
 */
export type ConditionNode = { n: string; cx: number; cy: number };

export type Condition = {
  slug: ConditionSlug;
  nombre: string;
  detalle?: string;
  grupo: "columna" | "ortopedia";
  /** null en padecimientos multi-zona: se marcan con "±" y sin punto. */
  node: ConditionNode | null;
};

// Nodos (coordenadas espejo de BODY_ZONES en BodyFigureSVG).
const NODE_CUELLO: ConditionNode = { n: "1", cx: 100, cy: 85 }; // cuello
const NODE_DORSAL: ConditionNode = { n: "2", cx: 100, cy: 127 }; // espalda-alta
const NODE_LUMBAR: ConditionNode = { n: "3", cx: 100, cy: 233 }; // espalda-baja
const NODE_HOMBRO: ConditionNode = { n: "4", cx: 47, cy: 107 }; // hombro
const NODE_MUNECA: ConditionNode = { n: "5", cx: 54, cy: 286 }; // muñeca y mano
const NODE_CADERA: ConditionNode = { n: "6", cx: 143, cy: 283 }; // cadera
const NODE_RODILLA: ConditionNode = { n: "7", cx: 117, cy: 410 }; // rodilla

export const CONDITIONS: Condition[] = [
  // Columna
  {
    slug: "hernia-de-disco",
    nombre: "Hernia de disco",
    grupo: "columna",
    node: NODE_LUMBAR,
  },
  {
    slug: "ciatica",
    nombre: "Ciática",
    detalle: "dolor que baja a la pierna",
    grupo: "columna",
    node: NODE_LUMBAR,
  },
  {
    slug: "canal-lumbar-estrecho",
    nombre: "Canal lumbar estrecho",
    detalle: "dolor al caminar que obliga a detenerse",
    grupo: "columna",
    node: NODE_LUMBAR,
  },
  {
    slug: "vertebra-desplazada",
    nombre: "Vértebra desplazada",
    detalle: "espondilolistesis",
    grupo: "columna",
    node: NODE_LUMBAR,
  },
  {
    slug: "desviacion-de-columna",
    nombre: "Desviación de la columna",
    detalle: "escoliosis",
    grupo: "columna",
    node: NODE_DORSAL,
  },
  {
    // Slug canónico en singular; H1 y nombre en plural ('Fracturas de columna').
    slug: "fractura-de-columna",
    nombre: "Fracturas de columna",
    detalle: "incluye aplastamientos por osteoporosis",
    grupo: "columna",
    node: NODE_DORSAL,
  },
  {
    slug: "dolor-de-cuello",
    nombre: "Dolor de cuello",
    detalle: "cervicalgia",
    grupo: "columna",
    node: NODE_CUELLO,
  },
  // Ortopedia y traumatología
  {
    slug: "fracturas-y-esguinces",
    nombre: "Fracturas y esguinces",
    grupo: "ortopedia",
    node: null,
  },
  {
    slug: "dolor-de-hombro",
    nombre: "Dolor de hombro",
    detalle: "manguito rotador y más",
    grupo: "ortopedia",
    node: NODE_HOMBRO,
  },
  {
    slug: "dolor-de-rodilla",
    nombre: "Dolor de rodilla",
    detalle: "desgaste y lesiones",
    grupo: "ortopedia",
    node: NODE_RODILLA,
  },
  {
    slug: "dolor-de-cadera",
    nombre: "Dolor de cadera",
    grupo: "ortopedia",
    node: NODE_CADERA,
  },
  {
    slug: "tunel-del-carpo",
    nombre: "Túnel del carpo",
    detalle: "adormecimiento de manos",
    grupo: "ortopedia",
    node: NODE_MUNECA,
  },
  {
    slug: "lesiones-deportivas",
    nombre: "Lesiones deportivas",
    grupo: "ortopedia",
    node: null,
  },
];

/** Etiquetas de grupo para los subtítulos en mayúsculas. */
export const CONDITION_GROUPS: { id: Condition["grupo"]; label: string }[] = [
  { id: "columna", label: "Columna" },
  { id: "ortopedia", label: "Ortopedia y traumatología" },
];
