import type { Metadata } from "next";
import type { Locale } from "../types";

/**
 * Contenido de "cirugía de columna" / "spine surgery" por locale. El español
 * se extrae literal de la página actual (render byte-idéntico); el inglés del
 * brief de FASE 2.A.
 */
export interface SpineContent {
  metadata: { title: Metadata["title"]; description: string };
  /** alt de la imagen del hero. */
  imageAlt: string;
  hero: { eyebrow: string; h1: string; text: string };
  when: { h2: string; text: string };
  techniques: {
    h2: string;
    intro: string;
    cards: { title: string; text: string }[];
    closing: string;
  };
  recovery: { h2: string; text: string };
  cta: { h2: string; sub: string; evaluationCta: string; whatsappCta: string };
  /** Mensaje ES de WhatsApp; en EN se usa el default vía waMessage. */
  whatsappMessage: string;
}

const SPINE_ES: SpineContent = {
  metadata: {
    title: "Cirugía de columna en Mérida — mínima invasión",
    description:
      "Cirugía de columna con alta especialidad en Mérida: hernia de disco, canal estrecho, fracturas vertebrales. Técnicas de mínima invasión cuando el caso lo permite.",
  },
  imageAlt:
    "Cirugía endoscópica de columna: el monitor muestra la visión del endoscopio en tiempo real",
  hero: {
    eyebrow: "Mi subespecialidad",
    h1: "Cirugía de columna",
    text: "La columna es mi alta especialidad: cervical, dorsal y lumbar. Mi trabajo es identificar con precisión qué necesita tu caso — y cuando la cirugía es la mejor opción para ti, la realizo con las técnicas de mínima invasión más avanzadas: incisiones milimétricas, menos dolor y una recuperación más rápida.",
  },
  when: {
    h2: "Cuándo se considera la cirugía",
    text: "La cirugía de columna se considera cuando el tratamiento conservador bien llevado no fue suficiente, o cuando hay datos que no admiten espera: pérdida de fuerza progresiva, alteración de la sensibilidad que avanza, o compresión importante de un nervio. Rara vez es la primera opción por dolor solamente; primero se agota el tratamiento conservador. Mi compromiso es indicarte cirugía únicamente cuando de verdad es lo mejor para ti.",
  },
  techniques: {
    h2: "Técnicas de mínima invasión: cuándo sí y cuándo no",
    intro:
      "Mi formación de alta especialidad incluye técnicas de mínima invasión: operar a través de incisiones de uno a dos centímetros, respetando el músculo, con menos sangrado y recuperación más rápida. No todos los casos son candidatos a mínima invasión, y evaluar eso con precisión es parte de mi especialidad — para ofrecerte siempre la técnica más adecuada a tu caso. Cuando tu caso lo permite, estas son las técnicas que uso:",
    cards: [
      {
        title: "Microdiscectomía endoscópica",
        text: "Extracción de la hernia de disco a través de un endoscopio, con incisión menor a un centímetro. En la mayoría de los casos, alta el mismo día o en 24 horas.",
      },
      {
        title: "Instrumentación percutánea",
        text: "Tornillos y barras colocados a través de la piel, sin cortar los músculos de la espalda. Menos sangrado y menos dolor postoperatorio.",
      },
      {
        title: "Cifoplastia y vertebroplastia",
        text: "Estabilización de fracturas vertebrales por compresión — frecuentes en osteoporosis — mediante cemento óseo. El alivio del dolor suele sentirse en horas.",
      },
      {
        title: "Cirugía asistida por navegación",
        text: "Guía por imagen en tiempo real para colocar cada implante con precisión milimétrica y máxima seguridad para tus nervios.",
      },
    ],
    closing:
      "¿Tu caso no es candidato a mínima invasión? También realizo cirugía abierta cuando es lo más seguro — la técnica se elige por tu anatomía y tu diagnóstico, no por moda.",
  },
  recovery: {
    h2: "Cómo es la recuperación",
    text: "Depende del procedimiento, pero en cirugía de mínima invasión la mayoría de mis pacientes camina el mismo día, se va a casa en 24 a 48 horas y retoma actividades ligeras en dos a cuatro semanas. Te entrego un plan de recuperación claro y revisiones programadas — y mi WhatsApp para el camino.",
  },
  cta: {
    h2: "¿Te dijeron que necesitas cirugía de columna?",
    sub: "Una segunda opinión a tiempo vale mucho. Evalúa tu caso gratis o escríbeme.",
    evaluationCta: "Hacer mi evaluación",
    whatsappCta: "Escribir por WhatsApp",
  },
  whatsappMessage: "Hola Dr. Ancona, quiero una valoración de columna.",
};

const SPINE_EN: SpineContent = {
  metadata: {
    title: "Spine Surgery in Mérida, Mexico — Minimally Invasive",
    description:
      "Spine surgery in Mérida, Mexico, by a fellowship-trained surgeon: herniated discs, spinal stenosis, vertebral fractures. Minimally invasive techniques when the case allows.",
  },
  imageAlt:
    "Endoscopic spine surgery: the monitor shows the endoscope's real-time view",
  hero: {
    eyebrow: "My subspecialty",
    h1: "Spine surgery",
    text: "The spine is my fellowship specialty: cervical, thoracic, and lumbar. My job is to identify precisely what your case needs — and when surgery is the best option for you, I perform it with the most advanced minimally invasive techniques: incisions measured in millimeters, less pain, and a faster recovery.",
  },
  when: {
    h2: "When surgery is considered",
    text: "Spine surgery is considered when a proper course of conservative treatment hasn't been enough, or when there are findings that can't wait: progressive loss of strength, worsening numbness or sensory changes, or significant nerve compression. It is rarely the first option for pain alone; conservative treatment comes first. My commitment is to recommend surgery only when it is truly the best thing for you.",
  },
  techniques: {
    h2: "Minimally invasive techniques: when they're an option — and when they're not",
    intro:
      "My fellowship training includes minimally invasive techniques: operating through incisions of one to two centimeters — less than an inch — sparing the muscle, with less bleeding and a faster recovery. Not every case is a candidate for minimally invasive surgery, and knowing exactly which ones are is part of my specialty — so you always get the technique best suited to your case. When your case allows it, these are the techniques I use:",
    cards: [
      {
        title: "Endoscopic microdiscectomy",
        text: "Removal of the herniated disc through an endoscope, with an incision under one centimeter. Most patients go home the same day or within 24 hours.",
      },
      {
        title: "Percutaneous instrumentation",
        text: "Screws and rods placed through the skin, without cutting the back muscles. Less bleeding and less pain after surgery.",
      },
      {
        title: "Kyphoplasty and vertebroplasty",
        text: "Stabilization of vertebral compression fractures — common in osteoporosis — using bone cement. Most patients feel relief within hours.",
      },
      {
        title: "Navigation-assisted surgery",
        text: "Real-time image guidance to place each implant with pinpoint precision, keeping your nerves safe.",
      },
    ],
    closing:
      "Not a candidate for minimally invasive surgery? I also perform open surgery when it's the safest option — I choose the technique based on your anatomy and your diagnosis, not on trends.",
  },
  recovery: {
    h2: "What recovery looks like",
    text: "It depends on the procedure, but with minimally invasive surgery most of my patients walk the same day, go home within 24 to 48 hours, and return to light activity in two to four weeks. You'll leave with a clear recovery plan and scheduled follow-ups — and my personal WhatsApp for anything that comes up.",
  },
  cta: {
    h2: "Were you told you need spine surgery?",
    sub: "A timely second opinion is worth a lot. Get a free assessment of your case, or message me.",
    evaluationCta: "Start my assessment",
    whatsappCta: "Message me on WhatsApp",
  },
  whatsappMessage: "Hola Dr. Ancona, quiero una valoración de columna.",
};

const SPINE: Record<Locale, SpineContent> = { es: SPINE_ES, en: SPINE_EN };

export function getSpineContent(locale: Locale): SpineContent {
  return SPINE[locale];
}
