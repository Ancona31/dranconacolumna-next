import type { Locale } from "../types";

/**
 * Strings de UI de la plantilla de padecimiento (`ConditionTemplate`), por
 * locale. El contenido de cada padecimiento vive en sus registros
 * (`@/lib/padecimientos` para ES, `@/lib/padecimientos/en` para EN); aquí solo
 * van los labels y textos fijos que la plantilla comparte entre todos.
 *
 * El español se extrae LITERAL de la página `/padecimientos/[slug]` original
 * para que su render quede byte-idéntico; el inglés es la traducción
 * consistente de esos mismos labels (FASE 2.B).
 */
export interface ConditionsUi {
  /** Migaja de pan: enlace de vuelta al índice de padecimientos. */
  breadcrumbLabel: string;
  breadcrumbHref: string;
  /** Etiqueta del grupo, tras la migaja. */
  groupLabel: { columna: string; ortopedia: string };
  /**
   * Sección opcional "Qué puede estar pasando" (páginas con varias patologías):
   * eyebrow, H2 y los tres labels de cada bloque de patología.
   */
  causesEyebrow: string;
  causesH2: string;
  pathoWhatLabel: string;
  pathoFeelLabel: string;
  pathoTreatLabel: string;
  /** H2 de la sección de síntomas. */
  symptomsH2: string;
  /** Puente al test tras los síntomas, alrededor de la zona en minúsculas. */
  bridgeBefore: string;
  bridgeAfter: string;
  /** H2 del banner de señales de alarma. */
  whenToWorryH2: string;
  /** Cierre en cursiva del banner de alarma. */
  warningFooter: string;
  /** H2 y subtítulo de la escalera de tratamiento. */
  treatmentH2: string;
  treatmentIntro: string;
  /** Prefijo del paso numerado ("Paso 1" / "Step 1"). */
  stepLabel: string;
  /** Eyebrow del bloque "cómo lo trato yo". */
  howITreatEyebrow: string;
  /** Cargo del doctor bajo la cita. */
  doctorRole: string;
  /** Etiquetas de cédula profesional / de especialidad. */
  cedProf: string;
  cedEsp: string;
  /** Prefijo del alt de la foto de quirófano, antes del nombre del padecimiento. */
  imageAltBefore: string;
  /** H2 de preguntas frecuentes. */
  faqH2: string;
  /** Bloque compartir. */
  sharePrompt: string;
  shareLabel: string;
  shareTitleAfter: string;
  shareTextBefore: string;
  shareTextAfter: string;
  /** Base de la URL pública del padecimiento (para el enlace de compartir). */
  pathBase: string;
  /** Línea meta bajo el botón del hero (termina en espacio) + texto del enlace WA. */
  heroMetaLine: string;
  heroWaLinkText: string;
  /** CTA final. */
  finalCtaH2: string;
  finalCtaSubSuffix: string;
  finalWaButton: string;
  /** Recordatorio de la barra sticky de escritorio. */
  stickyReminder: string;
  /** Silueta del hero: prefijo del pie ("Zona"/"Zone") y aria alrededor de la zona. */
  zoneCaptionPrefix: string;
  zoneAriaBefore: string;
  zoneAriaAfter: string;
  /** Idioma para el JSON-LD MedicalWebPage. */
  jsonLdLang: string;
}

const CONDITIONS_ES: ConditionsUi = {
  breadcrumbLabel: "Padecimientos",
  breadcrumbHref: "/padecimientos",
  groupLabel: { columna: "Columna", ortopedia: "Ortopedia y traumatología" },
  causesEyebrow: "Las causas más frecuentes",
  causesH2: "Qué puede estar pasando",
  pathoWhatLabel: "Qué es",
  pathoFeelLabel: "Cómo se siente",
  pathoTreatLabel: "Cómo se trata",
  symptomsH2: "Síntomas comunes",
  bridgeBefore:
    "¿Te reconociste en varios? Mide en 2 minutos cuánto está limitando tu ",
  bridgeAfter: " y si hay señales que no deben esperar.",
  whenToWorryH2: "¿Cuándo preocuparse?",
  warningFooter: "Estas señales no deben esperar.",
  treatmentH2: "Opciones de tratamiento",
  treatmentIntro: "Siempre empezamos por el escalón más simple.",
  stepLabel: "Paso",
  howITreatEyebrow: "Cómo lo trato yo",
  doctorRole: "Ortopedia y Cirugía de Columna",
  cedProf: "Céd. Prof.",
  cedEsp: "Céd. Esp.",
  imageAltBefore: "Dr. Angel Ancona en quirófano, tratamiento de ",
  faqH2: "Preguntas frecuentes",
  sharePrompt: "¿Puede servirle a alguien más?",
  shareLabel: "Compartir",
  shareTitleAfter: " — Dr. Angel Ancona",
  shareTextBefore: "Información sobre ",
  shareTextAfter: " que puede servirte:",
  pathBase: "/padecimientos",
  heroMetaLine: "2 minutos · gratis · sin registro · ",
  heroWaLinkText: "o escríbeme por WhatsApp",
  finalCtaH2: "¿Este dolor te suena conocido?",
  finalCtaSubSuffix: " — gratis y sin registro.",
  finalWaButton: "Escribir por WhatsApp",
  stickyReminder: "Mide cuánto te está limitando — 2 min",
  zoneCaptionPrefix: "Zona",
  zoneAriaBefore: "Silueta del cuerpo con la zona ",
  zoneAriaAfter: " marcada",
  jsonLdLang: "es-MX",
};

const CONDITIONS_EN: ConditionsUi = {
  breadcrumbLabel: "Conditions",
  breadcrumbHref: "/en/conditions",
  groupLabel: { columna: "Spine", ortopedia: "General orthopedics" },
  causesEyebrow: "The most common causes",
  causesH2: "What might be going on",
  pathoWhatLabel: "What it is",
  pathoFeelLabel: "How it feels",
  pathoTreatLabel: "How it's treated",
  symptomsH2: "Common symptoms",
  bridgeBefore:
    "See yourself in several of these? In 2 minutes, measure how much it's limiting your ",
  bridgeAfter: " and whether there are signs that shouldn't wait.",
  whenToWorryH2: "When to worry",
  warningFooter: "These signs shouldn't wait.",
  treatmentH2: "Treatment options",
  treatmentIntro: "We always start with the simplest step.",
  stepLabel: "Step",
  howITreatEyebrow: "How I treat it",
  doctorRole: "Orthopedics & Spine Surgery",
  cedProf: "Prof. License",
  cedEsp: "Specialty License",
  imageAltBefore: "Dr. Angel Ancona in the operating room, treating ",
  faqH2: "Frequently asked questions",
  sharePrompt: "Could this help someone else?",
  shareLabel: "Share",
  shareTitleAfter: " — Dr. Angel Ancona",
  shareTextBefore: "Information about ",
  shareTextAfter: " that may help you:",
  pathBase: "/en/conditions",
  heroMetaLine: "2 minutes · free · no sign-up · ",
  heroWaLinkText: "or message me on WhatsApp",
  finalCtaH2: "Does this pain sound familiar?",
  finalCtaSubSuffix: " — free, no sign-up.",
  finalWaButton: "Message me on WhatsApp",
  stickyReminder: "See how much it's limiting you — 2 min",
  zoneCaptionPrefix: "Zone",
  zoneAriaBefore: "Body silhouette with the ",
  zoneAriaAfter: " area highlighted",
  jsonLdLang: "en-US",
};

const CONDITIONS: Record<Locale, ConditionsUi> = {
  es: CONDITIONS_ES,
  en: CONDITIONS_EN,
};

export function getConditionsUi(locale: Locale): ConditionsUi {
  return CONDITIONS[locale];
}
