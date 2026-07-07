/**
 * Reseñas placeholder para la Fase 2.
 * En la Fase 5 se reemplazan por opiniones verificadas de Google vía API.
 * NO inventar testimonios con nombres reales.
 */

export type Review = {
  author: string;
  rating: number;
  text: string;
  source: string;
};

export const PLACEHOLDER_REVIEWS: Review[] = [
  {
    author: "[Reseña real de Google — Fase 5]",
    rating: 5,
    text: "Aquí se mostrará una opinión verificada de Google al conectar la API.",
    source: "Google",
  },
  {
    author: "[Reseña real de Google — Fase 5]",
    rating: 5,
    text: "Aquí se mostrará una opinión verificada de Google al conectar la API.",
    source: "Google",
  },
  {
    author: "[Reseña real de Google — Fase 5]",
    rating: 5,
    text: "Aquí se mostrará una opinión verificada de Google al conectar la API.",
    source: "Google",
  },
];
