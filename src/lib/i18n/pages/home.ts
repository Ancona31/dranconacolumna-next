import type { Metadata } from "next";
import type { Locale } from "../types";
import type { ConditionSlug } from "@/lib/conditions";
import { CERTIFICACION } from "@/lib/config";

/**
 * Contenido de la home por locale. Cada componente de la home lee su sección
 * con getHomeContent(locale). El español se extrae literal de los componentes
 * actuales (render byte-idéntico); el inglés viene del brief de FASE 2.A.
 */

interface ConditionCopy {
  nombre: string;
  detalle?: string;
}

export interface HomeContent {
  metadata: { title: Metadata["title"]; description: string };
  hero: {
    h1: string;
    sub: string;
    cta: string;
    note: string;
    whatsappLink: string;
    figureAria: string;
  };
  trust: {
    rating: string;
    surgeries: string;
    cedulaProf: string;
    cedulaEsp: string;
    certification: string;
  };
  howItWorks: {
    h2: string;
    stepLabel: string;
    steps: { title: string; text: string }[];
  };
  differentiators: {
    eyebrow: string;
    cards: { title: string; text: string; linkLabel?: string }[];
    /** alt de cada imagen de tarjeta, en el mismo orden que las tarjetas. */
    imageAlts: string[];
  };
  conditions: {
    h2: string;
    subMobile: string;
    subDesktopPre: string;
    subDesktopLink: string;
    groupSpine: string;
    groupOrtho: string;
    ctaCard: string;
    ctaMobile: string;
    legendMobile: string;
    figureAria: string;
    zoneAriaBefore: string;
    items: Record<ConditionSlug, ConditionCopy>;
  };
  about: { text: string; cta: string; imageAlt: string };
  reviews: {
    eyebrow: string;
    h2: string;
    ratingNumber: string;
    ratingCaption: string;
    cardLabel: string;
    readMore: string;
    readLess: string;
    seeAll: string;
    /** aria-label del grupo de estrellas. */
    starsAria: string;
    /** aria-label de las flechas del carrusel. */
    prevAria: string;
    nextAria: string;
    /** Prefijo del aria-label de cada punto: `${goToReview} ${i + 1}`. */
    goToReview: string;
  };
  insurance: { eyebrow: string; h2: string; sub: string };
  locations: { h2: string; seeContact: string };
}

const HOME_ES: HomeContent = {
  metadata: {
    title: {
      absolute:
        "Ortopedista y Traumatólogo en Mérida | Dr. Angel Ancona · Cirugía de Columna",
    },
    description:
      "Ortopedista y traumatólogo en Mérida y Umán. Alta especialidad en cirugía de columna y técnicas de mínima invasión. Haz una evaluación gratuita de tu dolor y agenda tu valoración.",
  },
  hero: {
    h1: "¿Dónde te duele?",
    sub: "Haz una evaluación clínica gratuita y recibe un reporte explicado en minutos.",
    cta: "Comenzar mi evaluación",
    note: "Evaluación diseñada por el Dr. Angel Ancona — ortopedista y traumatólogo, especialista en cirugía de columna.",
    whatsappLink: "Prefiero agendar directamente",
    figureAria: "Comenzar mi evaluación",
  },
  trust: {
    rating: "5.0 en Google",
    surgeries: "+200 cirugías de columna",
    cedulaProf: "Céd. Prof.",
    cedulaEsp: "Céd. Esp.",
    certification: CERTIFICACION,
  },
  howItWorks: {
    h2: "Cómo funciona",
    stepLabel: "Paso",
    steps: [
      {
        title: "Señala dónde te duele",
        text: "Toca la zona de tu cuerpo donde sientes molestia. Sin registro, sin dar tus datos.",
      },
      {
        title: "Responde una evaluación clínica validada",
        text: "Preguntas sencillas — las mismas escalas que uso en consulta.",
      },
      {
        title: "Recibe tu reporte explicado",
        text: "En lenguaje claro, al momento, con el siguiente paso recomendado.",
      },
    ],
  },
  differentiators: {
    eyebrow: "Por qué conmigo",
    cards: [
      {
        title: "Alta especialidad en cirugía de columna",
        text: "No todos los ortopedistas operan columna. Cursé una alta especialidad dedicada exclusivamente a ella, y cuando el caso lo permite uso técnicas de mínima invasión: incisiones más pequeñas, menos dolor y una recuperación más rápida.",
        linkLabel: "Conocer más",
      },
      {
        title: "Ortopedia y traumatología integral",
        text: "Fracturas, esguinces, lesiones deportivas y desgaste articular: hombro, cadera, rodilla, mano y tobillo. La misma rigurosidad para un esguince que para una cirugía compleja.",
        linkLabel: "Ver padecimientos",
      },
      {
        title: "Atención personal, de inicio a fin",
        text: "Te atiendo yo en la valoración, en el quirófano y en cada revisión — no un equipo rotativo. Mi WhatsApp responde, porque las urgencias no esperan.",
      },
    ],
    imageAlts: [
      "Equipo quirúrgico durante una cirugía de columna de mínima invasión",
      "El Dr. Ancona durante la cirugía de una fractura",
      "El Dr. Angel Ancona en el hospital",
    ],
  },
  conditions: {
    h2: "Padecimientos que trato",
    subMobile: "Cada padecimiento está ligado a su zona en el cuerpo.",
    subDesktopPre:
      "Cada padecimiento está ligado a su zona en el cuerpo. ¿No encuentras el tuyo? ",
    subDesktopLink: "Empieza por la evaluación",
    groupSpine: "Columna",
    groupOrtho: "Ortopedia y traumatología",
    ctaCard: "¿No encuentras tu dolor? Haz la evaluación gratuita",
    ctaMobile: "¿No encuentras tu dolor? Haz la evaluación gratuita →",
    legendMobile: "7 = Rodilla · ± = varias zonas",
    figureAria: "Silueta del cuerpo con las zonas de cada padecimiento",
    zoneAriaBefore: "Ir a padecimientos de esta zona",
    items: {
      "hernia-de-disco": { nombre: "Hernia de disco" },
      ciatica: { nombre: "Ciática", detalle: "dolor que baja a la pierna" },
      "canal-lumbar-estrecho": {
        nombre: "Canal lumbar estrecho",
        detalle: "dolor al caminar que obliga a detenerse",
      },
      "vertebra-desplazada": {
        nombre: "Vértebra desplazada",
        detalle: "espondilolistesis",
      },
      "desviacion-de-columna": {
        nombre: "Desviación de la columna",
        detalle: "escoliosis",
      },
      "fractura-de-columna": {
        nombre: "Fracturas de columna",
        detalle: "incluye aplastamientos por osteoporosis",
      },
      "dolor-de-cuello": { nombre: "Dolor de cuello", detalle: "cervicalgia" },
      "fracturas-y-esguinces": { nombre: "Fracturas y esguinces" },
      "dolor-de-hombro": {
        nombre: "Dolor de hombro",
        detalle: "manguito rotador y más",
      },
      "dolor-de-rodilla": {
        nombre: "Dolor de rodilla",
        detalle: "desgaste y lesiones",
      },
      "dolor-de-cadera": { nombre: "Dolor de cadera" },
      "tunel-del-carpo": {
        nombre: "Túnel del carpo",
        detalle: "adormecimiento de manos",
      },
      "lesiones-deportivas": { nombre: "Lesiones deportivas" },
    },
  },
  about: {
    text: "Ortopedista y traumatólogo con alta especialidad en cirugía de columna. Atiendo todo el aparato musculoesquelético — de una fractura a una cirugía compleja de columna — con las técnicas menos invasivas disponibles, personalmente y en cada etapa: desde la primera consulta hasta tu recuperación.",
    cta: "Conóceme",
    imageAlt: "Retrato profesional del Dr. Angel Ancona",
  },
  reviews: {
    eyebrow: "Opiniones en Google",
    h2: "Lo que dicen mis pacientes",
    ratingNumber: "5.0",
    ratingCaption: "opiniones verificadas en Google",
    cardLabel: "Opinión en Google",
    readMore: "Leer más",
    readLess: "Leer menos",
    seeAll: "Ver todas las opiniones en Google →",
    starsAria: "5 de 5 estrellas",
    prevAria: "Opinión anterior",
    nextAria: "Opinión siguiente",
    goToReview: "Ir a la opinión",
  },
  insurance: {
    eyebrow: "Cobertura",
    h2: "Trabajo con tu Seguro de Gastos Médicos Mayores",
    sub: "¿Tienes seguro de gastos médicos? Te ayudo con el trámite.",
  },
  locations: {
    h2: "Dónde atiendo",
    seeContact: "Ver ubicación y datos de contacto →",
  },
};

const HOME_EN: HomeContent = {
  metadata: {
    title: {
      absolute:
        "Orthopedic Surgeon in Mérida, Mexico | Dr. Angel Ancona · Spine Surgery",
    },
    description:
      "Orthopedic surgeon in Mérida and Umán, Mexico. Fellowship-trained spine surgeon specializing in minimally invasive techniques. Take a free pain assessment and book your consultation.",
  },
  hero: {
    h1: "Where does it hurt?",
    sub: "Take a free clinical assessment and get a clear, easy-to-understand report in minutes.",
    cta: "Start my assessment",
    note: "Assessment designed by Dr. Angel Ancona — orthopedic surgeon, fellowship-trained in spine surgery.",
    whatsappLink: "I'd rather book directly",
    figureAria: "Start my assessment",
  },
  trust: {
    rating: "5.0 on Google",
    surgeries: "200+ spine surgeries",
    cedulaProf: "Professional License",
    cedulaEsp: "Specialist License",
    certification:
      "Board certified by the Mexican Board of Orthopedics and Traumatology (CMOT)",
  },
  howItWorks: {
    h2: "How it works",
    stepLabel: "Step",
    steps: [
      {
        title: "Point to where it hurts",
        text: "Tap the area of your body that's bothering you. No sign-up, no personal data required.",
      },
      {
        title: "Answer a validated clinical questionnaire",
        text: "Simple questions — the same scales I use with my patients.",
      },
      {
        title: "Get your report, explained",
        text: "In plain language, instantly, with a recommended next step.",
      },
    ],
  },
  differentiators: {
    eyebrow: "Why me",
    cards: [
      {
        title: "Fellowship-trained spine surgeon",
        text: "Not every orthopedic surgeon operates on the spine. I completed a fellowship dedicated exclusively to spine surgery, and when your case allows, I use minimally invasive techniques: smaller incisions, less pain, and a faster recovery.",
        linkLabel: "Learn more",
      },
      {
        title: "Comprehensive orthopedic and fracture care",
        text: "Fractures, sprains, sports injuries, and wear-and-tear arthritis: shoulder, hip, knee, hand, and ankle. I take a sprain as seriously as complex surgery.",
        linkLabel: "See conditions",
      },
      {
        title: "Personal care, from start to finish",
        text: "I see you myself at every step — consultation, operating room, and every follow-up. Not a rotating team. I answer my own WhatsApp, because urgent problems can't wait.",
      },
    ],
    imageAlts: [
      "Surgical team during a minimally invasive spine surgery",
      "Dr. Ancona operating on a fracture",
      "Dr. Angel Ancona at the hospital",
    ],
  },
  conditions: {
    h2: "Conditions I treat",
    subMobile: "Each condition is linked to the area of the body it affects.",
    subDesktopPre:
      "Each condition is linked to the area of the body it affects. Don't see yours? ",
    subDesktopLink: "Start with the assessment",
    groupSpine: "Spine",
    groupOrtho: "General orthopedics",
    // ctaCard = variante desktop: la flecha va en un span aparte (sin →);
    // ctaMobile = variante móvil de ancho completo, con la flecha en el texto.
    ctaCard: "Don't see your condition? Take the free assessment",
    ctaMobile: "Don't see your condition? Take the free assessment →",
    legendMobile: "7 = Knee · ± = multiple areas",
    figureAria: "Body silhouette showing the area of each condition",
    zoneAriaBefore: "Go to conditions for this area",
    items: {
      "hernia-de-disco": { nombre: "Herniated disc" },
      ciatica: { nombre: "Sciatica", detalle: "pain that shoots down your leg" },
      "canal-lumbar-estrecho": {
        nombre: "Lumbar spinal stenosis",
        detalle: "pain when walking that forces you to stop",
      },
      "vertebra-desplazada": {
        nombre: "Slipped vertebra",
        detalle: "spondylolisthesis",
      },
      "desviacion-de-columna": {
        nombre: "Scoliosis",
        detalle: "curvature of the spine",
      },
      "fractura-de-columna": {
        nombre: "Spinal fractures",
        detalle: "including osteoporosis compression fractures",
      },
      "dolor-de-cuello": { nombre: "Neck pain" },
      "fracturas-y-esguinces": { nombre: "Fractures and sprains" },
      "dolor-de-hombro": {
        nombre: "Shoulder pain",
        detalle: "rotator cuff injuries and more",
      },
      "dolor-de-rodilla": {
        nombre: "Knee pain",
        detalle: "injuries and arthritis",
      },
      "dolor-de-cadera": { nombre: "Hip pain" },
      "tunel-del-carpo": {
        nombre: "Carpal tunnel",
        detalle: "numbness in the hands",
      },
      "lesiones-deportivas": { nombre: "Sports injuries" },
    },
  },
  about: {
    text: "Orthopedic surgeon, fellowship-trained in spine surgery. I treat the entire musculoskeletal system — from a fracture to complex spine surgery — with the least invasive techniques available — and I'm with you personally at every stage, from your first consultation through recovery.",
    cta: "Meet Dr. Ancona",
    imageAlt: "Professional portrait of Dr. Angel Ancona",
  },
  reviews: {
    eyebrow: "Google reviews",
    h2: "What my patients say",
    ratingNumber: "5.0",
    ratingCaption: "verified Google reviews",
    cardLabel: "Google review",
    readMore: "Read more",
    readLess: "Read less",
    seeAll: "See all reviews on Google →",
    starsAria: "5 out of 5 stars",
    prevAria: "Previous review",
    nextAria: "Next review",
    goToReview: "Go to review",
  },
  insurance: {
    eyebrow: "Coverage",
    h2: "I work with private health insurance",
    sub: "Have health insurance? I'll help you with the paperwork.",
  },
  locations: {
    h2: "Where I practice",
    seeContact: "See locations and contact info →",
  },
};

const HOME: Record<Locale, HomeContent> = { es: HOME_ES, en: HOME_EN };

export function getHomeContent(locale: Locale): HomeContent {
  return HOME[locale];
}
