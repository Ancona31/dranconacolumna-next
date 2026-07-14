/**
 * Opiniones verificadas de la ficha de Google del doctor (textos exactos).
 * La ficha reporta 5.0 · 6 opiniones; aquí viven las 5 que traen texto.
 * El encabezado de la sección muestra "6 opiniones" a propósito: no toda
 * opinión de Google incluye reseña escrita.
 */

export type Review = {
  author: string;
  text: string;
};

export const REVIEWS: Review[] = [
  {
    author: "Tai",
    text: "Dr. Ancona is incredible and one of the few doctors I trust. I had an incident while roller skating and thought I had a broken ankle (as the urgent care doctors in Miami had said). I went to Dr. Ancona as a follow up and he informed me that my ankle was NOT broken and put me on a proper path to healing. I highly recommend Dr. Ancona.",
  },
  {
    author: "DacDiver",
    text: "I had my first visit with Dr. Ancona after having an MRI done on my knee. He took the time to show me the photos and explain everything to me. Very professional and I would not hesitate to see him again.",
  },
  {
    author: "José Antonio Martínez Reyna",
    text: "Mi mamá tuvo la oportunidad de atenderse con el doctor Ancona y la atención fue perfecta. Amable y siempre claro con el diagnóstico. Desde esa vez no ha tenido problemas de rodilla y de la mano. Lo recomiendo ampliamente.",
  },
  {
    author: "Emiliano Lugardo",
    text: "Muy buena operación del doctor Ancona, me ayudó con una hernia de disco y la atención recibida fue excelente sin problemas tras la operación.",
  },
  {
    author: "Jonatan Lugardo",
    text: "I had a severe back pain after lifting some heavy boxes, I went with Dr. Ancona and he was able to ease my pain and walk me through the next steps. I highly recommend him.",
  },
];
