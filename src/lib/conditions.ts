/** Padecimientos que trata el doctor. Slugs reutilizables en /padecimientos/[slug]. */

export type Condition = {
  slug: string;
  nombre: string;
};

export const CONDITIONS: Condition[] = [
  { slug: "hernia-de-disco", nombre: "Hernia de disco" },
  { slug: "ciatica", nombre: "Ciática" },
  { slug: "estenosis-lumbar", nombre: "Estenosis lumbar" },
  { slug: "escoliosis", nombre: "Escoliosis" },
  { slug: "espondilolistesis", nombre: "Espondilolistesis" },
  { slug: "fractura-vertebral", nombre: "Fractura vertebral" },
  { slug: "dolor-cervical", nombre: "Dolor cervical" },
  { slug: "lesiones-deportivas", nombre: "Lesiones deportivas" },
];
