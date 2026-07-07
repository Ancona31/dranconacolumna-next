/** Padecimientos que trata el doctor. Slugs reutilizables en /padecimientos/[slug]. */

export type Condition = {
  slug: string;
  nombre: string;
  detalle?: string;
  grupo: "columna" | "ortopedia";
};

export const CONDITIONS: Condition[] = [
  // Columna
  { slug: "hernia-de-disco", nombre: "Hernia de disco", grupo: "columna" },
  {
    slug: "ciatica",
    nombre: "Ciática",
    detalle: "dolor que baja a la pierna",
    grupo: "columna",
  },
  {
    slug: "canal-lumbar-estrecho",
    nombre: "Canal lumbar estrecho",
    detalle: "dolor al caminar que obliga a detenerse",
    grupo: "columna",
  },
  {
    slug: "vertebra-desplazada",
    nombre: "Vértebra desplazada",
    detalle: "espondilolistesis",
    grupo: "columna",
  },
  {
    slug: "desviacion-de-columna",
    nombre: "Desviación de la columna",
    detalle: "escoliosis",
    grupo: "columna",
  },
  {
    slug: "fractura-de-columna",
    nombre: "Fracturas de columna",
    detalle: "incluye aplastamientos por osteoporosis",
    grupo: "columna",
  },
  {
    slug: "dolor-de-cuello",
    nombre: "Dolor de cuello",
    detalle: "cervicalgia",
    grupo: "columna",
  },
  // Ortopedia y traumatología
  {
    slug: "fracturas-y-esguinces",
    nombre: "Fracturas y esguinces",
    grupo: "ortopedia",
  },
  {
    slug: "dolor-de-hombro",
    nombre: "Dolor de hombro",
    detalle: "manguito rotador y más",
    grupo: "ortopedia",
  },
  {
    slug: "dolor-de-rodilla",
    nombre: "Dolor de rodilla",
    detalle: "desgaste y lesiones",
    grupo: "ortopedia",
  },
  { slug: "dolor-de-cadera", nombre: "Dolor de cadera", grupo: "ortopedia" },
  {
    slug: "tunel-del-carpo",
    nombre: "Túnel del carpo",
    detalle: "adormecimiento de manos",
    grupo: "ortopedia",
  },
  {
    slug: "lesiones-deportivas",
    nombre: "Lesiones deportivas",
    grupo: "ortopedia",
  },
];

/** Etiquetas de grupo para los subtítulos en mayúsculas. */
export const CONDITION_GROUPS: { id: Condition["grupo"]; label: string }[] = [
  { id: "columna", label: "Columna" },
  { id: "ortopedia", label: "Ortopedia y traumatología" },
];
