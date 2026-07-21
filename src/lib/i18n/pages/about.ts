import type { Metadata } from "next";
import type { Locale } from "../types";

/**
 * Contenido de la página "sobre mí" / "about" por locale. El español se extrae
 * literal de la página actual (render byte-idéntico); el inglés viene del brief
 * de FASE 2.A. El nombre del doctor (h1) sale de config, igual en ambos.
 */
export interface AboutContent {
  metadata: { title: Metadata["title"]; description: string };
  /** alt del retrato del hero. */
  imageAlt: string;
  hero: { eyebrow: string; subtitle: string; intro: string };
  work: { h2: string; paragraphs: string[] };
  training: { h2: string; items: string[] };
  certs: {
    h2: string;
    items: string[];
    cedulaProf: string;
    cedulaEsp: string;
    surgeries: string;
  };
  cta: { h2: string; sub: string; evaluationCta: string; whatsappCta: string };
  /** Mensaje ES de WhatsApp; en EN se usa el default vía waMessage. */
  whatsappMessage: string;
}

const ABOUT_ES: AboutContent = {
  metadata: {
    title: "Sobre mí — Ortopedista y Traumatólogo en Mérida",
    description:
      "Conoce al Dr. Angel M. Ancona Pérez: formación, certificaciones y su manera de tratar a cada paciente. Alta especialidad en cirugía de columna.",
  },
  imageAlt: "Dr. Angel M. Ancona Pérez, ortopedista y traumatólogo",
  hero: {
    eyebrow: "Sobre mí",
    subtitle: "Ortopedista y traumatólogo · Alta especialidad en cirugía de columna",
    intro:
      "Atiendo en Mérida y Umán todo el aparato musculoesquelético: desde una fractura o un esguince hasta la cirugía de columna más compleja. Mi consulta funciona con una regla simple: primero entender exactamente qué tienes, y después elegir juntos el tratamiento que de verdad necesitas.",
  },
  work: {
    h2: "Mi manera de trabajar",
    paragraphs: [
      "Muchos problemas de columna y lesiones ortopédicas mejoran con tratamiento conservador bien dirigido, y siempre es el punto de partida. Pero cuando la cirugía es lo que tu caso necesita, cuentas con un cirujano de columna con alta especialidad para resolverlo. Si te digo que necesitas cirugía, es porque es la mejor decisión para tu caso — y te lo explicaré con claridad, con estudios en la mano.",
      "Cuando operar es lo correcto, uso la técnica menos agresiva que tu caso permita. Mi alta especialidad me formó en cirugía de mínima invasión de columna: incisiones más pequeñas y menos daño muscular que, en casos indicados, pueden permitir una recuperación más rápida.",
      "Y te atiendo yo, en cada etapa. La valoración, la cirugía si hace falta y cada revisión posterior. Mi WhatsApp lo respondo personalmente, porque una duda a tiempo evita complicaciones.",
    ],
  },
  training: {
    h2: "Formación",
    items: [
      "Médico Cirujano — Universidad Autónoma Metropolitana · Mención Honorífica",
      "Especialidad en Traumatología y Ortopedia — Centro Médico del Noroeste, Cd. Obregón, Sonora",
      "Alta Especialidad en Cirugía de Columna — Hospital de Traumatología y Ortopedia Lomas Verdes",
    ],
  },
  certs: {
    h2: "Certificaciones y membresías",
    items: [
      "Certificado por el Consejo Mexicano de Ortopedia y Traumatología (CMOT) — Certificación 26/5567/25",
      "Miembro activo de la Asociación Mexicana de Cirujanos de Columna, A.C. (AMCICO)",
      "Miembro de la Asociación Mexicana de Cirugía Endoscópica Biportal (AMCEBiC)",
    ],
    cedulaProf: "Cédula profesional",
    cedulaEsp: "Cédula de especialista",
    surgeries: "Más de 200 cirugías de columna realizadas.",
  },
  cta: {
    h2: "¿Hablamos de tu caso?",
    sub: "Haz una evaluación gratuita de tu dolor o escríbeme directamente.",
    evaluationCta: "Hacer mi evaluación",
    whatsappCta: "Escribir por WhatsApp",
  },
  whatsappMessage: "Hola Dr. Ancona, me gustaría agendar una valoración.",
};

const ABOUT_EN: AboutContent = {
  metadata: {
    title: "About Me — Orthopedic & Spine Surgeon in Mérida, Mexico",
    description:
      "Meet Dr. Angel M. Ancona Pérez: training, board certification, and how he cares for his patients. Fellowship-trained spine surgeon in Mérida, Mexico.",
  },
  imageAlt: "Dr. Angel M. Ancona Pérez, orthopedic and spine surgeon",
  hero: {
    eyebrow: "About me",
    subtitle: "Orthopedic surgeon · Fellowship-trained in spine surgery",
    intro:
      "I treat the entire musculoskeletal system in Mérida and Umán: from a fracture or a sprain to the most complex spine surgery. My practice runs on a simple rule: first, understand exactly what you have — then we choose the treatment you truly need, together.",
  },
  work: {
    h2: "How I work",
    paragraphs: [
      "Many spine problems and orthopedic injuries improve with the right conservative (non-surgical) treatment, and that is always the starting point. But when surgery is what your case needs, you have a fellowship-trained spine surgeon to take care of it. If I tell you that you need surgery, it's because it's the best decision for your case — and I'll walk you through it clearly, with your scans in front of us.",
      "When surgery is the right call, I use the least invasive technique your case allows. My fellowship trained me in minimally invasive spine surgery: smaller incisions and less muscle damage that, in appropriate cases, may allow for a faster recovery.",
      "And I see you myself, at every stage. The consultation, the surgery if needed, and every follow-up visit. I answer my WhatsApp personally, because a question answered early can prevent a complication.",
    ],
  },
  training: {
    h2: "Training",
    items: [
      "Medical Degree — Universidad Autónoma Metropolitana · Graduated with Honors",
      "Residency in Orthopedics and Traumatology — Centro Médico del Noroeste, Ciudad Obregón, Sonora",
      "Spine Surgery Fellowship — Hospital de Traumatología y Ortopedia Lomas Verdes, Mexico City",
    ],
  },
  certs: {
    h2: "Certifications and memberships",
    items: [
      "Board certified by the Mexican Board of Orthopedics and Traumatology (CMOT) — Certification 26/5567/25",
      "Active member of the Mexican Association of Spine Surgeons (AMCICO)",
      "Member of the Mexican Association of Biportal Endoscopic Surgery (AMCEBiC)",
    ],
    cedulaProf: "Professional license",
    cedulaEsp: "Specialist license",
    surgeries: "200+ spine surgeries performed.",
  },
  cta: {
    h2: "Ready to talk about your case?",
    sub: "Take the free pain assessment, or message me directly.",
    evaluationCta: "Start my assessment",
    whatsappCta: "Message me on WhatsApp",
  },
  whatsappMessage: "Hola Dr. Ancona, me gustaría agendar una valoración.",
};

const ABOUT: Record<Locale, AboutContent> = { es: ABOUT_ES, en: ABOUT_EN };

export function getAboutContent(locale: Locale): AboutContent {
  return ABOUT[locale];
}
