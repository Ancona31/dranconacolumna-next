import type { Locale } from "../types";
import type { NonUrgentLevel } from "@/lib/evaluacion/types";

/**
 * Chrome de UI del flujo de evaluación y del PDF, por locale (PASO 3 de F3.A).
 *
 * Aquí va SOLO el texto fijo de los componentes (botones, títulos de sección,
 * etiquetas, plantillas): EvaluationFlow, ZonePicker, AlarmScreen, TriageScreen,
 * QuestionScreen, ResultScreen, PdfDownload y ReportPdf. El contenido clínico
 * (preguntas, resultados, recomendación, señales…) NO vive aquí: viene del motor
 * (getEngineCopy) y del contenido de cada test (getTest).
 *
 * El español se extrae LITERAL de los componentes actuales para que su render
 * quede byte-idéntico. El inglés (EVAL_UI_EN) es la contrapartida con los
 * literales traducidos campo por campo.
 */
export interface EvaluationUi {
  flow: {
    /** Botón para salir del flujo. */
    exit: string;
    /** Duración cuando el test dura ≤ 1 min. */
    timeUnder1: string;
    /** Duración aproximada, en minutos. */
    timeApprox: (min: number) => string;
  };

  zonePicker: {
    h1: string;
    subtitle: string;
    /** aria-label de la silueta (BodyFigureSVG). */
    figureAria: string;
    /** aria-label del botón de una zona. */
    zoneAria: (label: string) => string;
  };

  alarm: {
    h1: string;
    subtitle: string;
    /** Sustantivo por defecto del ítem cuando el test no define questionNoun. */
    nounFallbackSingular: string;
    nounFallbackPlural: string;
    /** "alrededor de N minuto(s)". */
    durationApprox: (min: number) => string;
    /** "N frases · alrededor de 2 minutos". */
    durationJoin: (count: number, noun: string, time: string) => string;
    continue: string;
  };

  triage: {
    /** "Sobre tu dolor · 1 de 3". */
    eyebrow: (current: number, total: number) => string;
  };

  question: {
    back: string;
    /** "Pregunta 1 de 24 · ~2 min". */
    header: (noun: string, current: number, total: number, time: string) => string;
    /** Prefijo del "No aplica"; el fragmento de zona sale del contenido del test. */
    naLead: string;
  };

  result: {
    /** Ruta (relativa a SITE_URL) del enlace compartible de la evaluación. */
    shareUrlPath: string;
    shareTitle: string;
    shareText: string;
    sharePrompt: string;
    shareButtonLabel: string;
    /** "Tu evaluación de {zona}". */
    headerTitle: (zoneLabel: string) => string;
    /** Etiqueta previa al folio. */
    folioLabel: string;
    /** aria-label del medidor. */
    gaugeAria: (score: number) => string;
    /** aria-label de la mini-silueta. */
    zoneAria: (zoneLabel: string) => string;
    per100: string;
    indexCaption: string;
    cutsLegend: string;
    /** Etiqueta de la pill de nivel (pantalla y PDF). */
    levelPill: Record<NonUrgentLevel, string>;
    /** "¿Qué significa limitación {nivel}?". */
    badgeQuestion: (level: NonUrgentLevel) => string;
    meaningTitle: string;
    evalPlanTitle: string;
    warningTitle: string;
    ctaUrgent: string;
    ctaNormal: string;
    urgentCarryNote: string;
    disclaimer: string;
  };

  pdfDownload: {
    /** Botón que abre el formulario. */
    open: string;
    nameQuestion: string;
    namePlaceholder: string;
    generate: string;
    generating: string;
    privacyNote: string;
  };

  pdf: {
    /** Subtítulo del membrete. */
    headerSub: string;
    cedProfLabel: string;
    cedEspLabel: string;
    cert: string;
    /** Pie de página fijo. */
    footer: (phone: string) => string;
    /** "Página X de Y". */
    pageLabel: (page: number, total: number) => string;
    /** Locale de formateo de fecha (toLocaleString). */
    dateLocale: string;
    /** "REPORTE DE EVALUACIÓN — {ZONA}". */
    titleReport: (zoneUpper: string) => string;
    /** "{fecha} · Folio {folio}". */
    metaLine: (fecha: string, folio: string) => string;
    /** "Reporte de: {nombre}". */
    reportOf: (name: string) => string;
    per100: string;
    indexCaption: string;
    cutsLegend: string;
    /** "¿Qué significa limitación {nivel}?". */
    badgeQuestion: (level: NonUrgentLevel) => string;
    meaningTitle: string;
    evalPlanTitle: string;
    warningTitle: string;
    /** Línea extra del banner urgente. */
    urgentShowReport: string;
    ctaUrgent: string;
    ctaNormal: string;
    urgentCarryNote: string;
    ctaConsultLine: string;
    ctaPresentReport: string;
    qrCaption: string;
    /** Mensaje del enlace/QR de agendamiento. */
    scheduleWaMessage: string;
    /** Líneas legales fijas del pie del reporte. */
    legalDisclaimer: string;
  };
}

export const EVAL_UI_ES: EvaluationUi = {
  flow: {
    exit: "Salir",
    timeUnder1: "menos de 1 min",
    timeApprox: (min) => `~${min} min`,
  },

  zonePicker: {
    h1: "¿Dónde te duele?",
    subtitle: "Toca la zona donde sientes la molestia.",
    figureAria:
      "Figura humana vista de espaldas con las zonas del cuerpo que puedes evaluar",
    zoneAria: (label) => `Evaluar ${label}`,
  },

  alarm: {
    h1: "Antes de empezar, ¿algo de esto te está pasando?",
    subtitle: "Selecciona todo lo que aplique. Es importante para orientarte bien.",
    nounFallbackSingular: "pregunta",
    nounFallbackPlural: "preguntas",
    durationApprox: (min) =>
      `alrededor de ${min} ${min === 1 ? "minuto" : "minutos"}`,
    durationJoin: (count, noun, time) => `${count} ${noun} · ${time}`,
    continue: "Continuar",
  },

  triage: {
    eyebrow: (current, total) => `Sobre tu dolor · ${current} de ${total}`,
  },

  question: {
    back: "Atrás",
    header: (noun, current, total, time) =>
      `${noun} ${current} de ${total} · ${time}`,
    naLead: "No aplica — está limitada por otra causa, no por ",
  },

  result: {
    shareUrlPath: "/evaluacion",
    shareTitle: "Evaluación clínica gratuita — Dr. Angel Ancona",
    shareText:
      "Hice esta evaluación de mi dolor y me dio un reporte en minutos. Haz la tuya gratis:",
    sharePrompt: "¿Conoces a alguien con dolor? Comparte la evaluación gratuita.",
    shareButtonLabel: "Compartir esta evaluación",
    headerTitle: (zoneLabel) => `Tu evaluación de ${zoneLabel}`,
    folioLabel: "Folio",
    gaugeAria: (score) => `Índice de limitación ${score} de 100`,
    zoneAria: (zoneLabel) => `Zona evaluada: ${zoneLabel}`,
    per100: "/100",
    indexCaption: "índice de limitación",
    cutsLegend: "0–30 leve · 31–60 moderada · 61–100 severa",
    levelPill: {
      leve: "Limitación leve",
      moderada: "Limitación moderada",
      severa: "Limitación severa",
    },
    badgeQuestion: (level) => `¿Qué significa limitación ${level}?`,
    meaningTitle: "Qué significa tu resultado",
    evalPlanTitle: "Qué debe evaluarse en tu caso",
    warningTitle: "Señales para no esperar tu cita",
    ctaUrgent: "Avísanos de tu caso por WhatsApp",
    ctaNormal: "Escríbenos para agendar tu valoración",
    urgentCarryNote:
      "Y lleva este reporte a tu valoración de hoy — le servirá al médico que te atienda.",
    disclaimer:
      "Esta evaluación es orientativa y no sustituye una consulta médica. Tus respuestas no salen de tu dispositivo.",
  },

  pdfDownload: {
    open: "Descargar mi reporte (PDF)",
    nameQuestion: "¿A nombre de quién generamos tu PDF? (opcional)",
    namePlaceholder: "Tu nombre",
    generate: "Generar PDF",
    generating: "Generando…",
    privacyNote:
      "El nombre solo se imprime en el documento; no se guarda en ningún lado.",
  },

  pdf: {
    headerSub: "Ortopedia · Traumatología · Cirugía de Columna",
    cedProfLabel: "Céd. Prof.",
    cedEspLabel: "Céd. Esp.",
    cert: "Certificado CMOT 26/5567/25",
    footer: (phone) =>
      `dranconacolumna.com  ·  WhatsApp ${phone}  ·  Mérida y Umán`,
    pageLabel: (page, total) => `Página ${page} de ${total}`,
    dateLocale: "es-MX",
    titleReport: (zoneUpper) => `REPORTE DE EVALUACIÓN — ${zoneUpper}`,
    metaLine: (fecha, folio) => `${fecha} · Folio ${folio}`,
    reportOf: (name) => `Reporte de: ${name}`,
    per100: "/100",
    indexCaption: "índice de limitación",
    cutsLegend: "0–30 leve · 31–60 moderada · 61–100 severa",
    badgeQuestion: (level) => `¿Qué significa limitación ${level}?`,
    meaningTitle: "QUÉ SIGNIFICA TU RESULTADO",
    evalPlanTitle: "QUÉ DEBE EVALUARSE EN TU CASO",
    warningTitle: "SEÑALES PARA NO ESPERAR TU CITA",
    urgentShowReport: "Muestra este reporte al médico que te atienda.",
    ctaUrgent: "Avísanos de tu caso por WhatsApp",
    ctaNormal: "Escríbenos por WhatsApp para agendar tu valoración",
    urgentCarryNote:
      "Y lleva este reporte a tu valoración de hoy — le servirá al médico que te atienda.",
    ctaConsultLine: "Consulta en Mérida y Umán",
    ctaPresentReport:
      "Presenta este reporte en tu cita — me permite conocer tu caso antes de explorarte.",
    qrCaption: "Escanéalo o tócalo",
    scheduleWaMessage: "Hola Dr. Ancona, quiero agendar una consulta.",
    legalDisclaimer:
      "Este reporte no constituye un diagnóstico ni sustituye una consulta médica. Generado en tu dispositivo: tus respuestas no se almacenan en ningún servidor. dranconacolumna.com",
  },
};

/**
 * Chrome EN. Contrapartida en inglés de EVAL_UI_ES. Las claves de nivel son
 * internas en español (leve/moderada/severa); LEVEL_EN las mapea a inglés en
 * badgeQuestion. Es capa de copy, no lógica.
 */
const LEVEL_EN: Record<NonUrgentLevel, string> = {
  leve: "mild",
  moderada: "moderate",
  severa: "severe",
};

export const EVAL_UI_EN: EvaluationUi = {
  flow: {
    exit: "Exit",
    timeUnder1: "under 1 min",
    timeApprox: (min) => `~${min} min`,
  },

  zonePicker: {
    h1: "Where does it hurt?",
    subtitle: "Tap the area where you feel the discomfort.",
    figureAria:
      "Human figure seen from behind, showing the body areas you can assess",
    zoneAria: (label) => `Assess ${label}`,
  },

  alarm: {
    h1: "Before we start — is any of this happening to you?",
    subtitle: "Select everything that applies. It matters for guiding you well.",
    nounFallbackSingular: "question",
    nounFallbackPlural: "questions",
    durationApprox: (min) =>
      `about ${min} ${min === 1 ? "minute" : "minutes"}`,
    durationJoin: (count, noun, time) => `${count} ${noun} · ${time}`,
    continue: "Continue",
  },

  triage: {
    eyebrow: (current, total) => `About your pain · ${current} of ${total}`,
  },

  question: {
    back: "Back",
    header: (noun, current, total, time) =>
      `${noun} ${current} of ${total} · ${time}`,
    naLead: "Doesn't apply — it's limited by another cause, not by ",
  },

  result: {
    shareUrlPath: "/en/assessment",
    shareTitle: "Free clinical assessment — Dr. Angel Ancona",
    shareText:
      "I took this assessment of my pain and got a report in minutes. Take yours for free:",
    sharePrompt: "Know someone in pain? Share the free assessment.",
    shareButtonLabel: "Share this assessment",
    headerTitle: (zoneLabel) => `Your ${zoneLabel} assessment`,
    folioLabel: "Report ID",
    gaugeAria: (score) => `Limitation index ${score} out of 100`,
    zoneAria: (zoneLabel) => `Area assessed: ${zoneLabel}`,
    per100: "/100",
    indexCaption: "limitation index",
    cutsLegend: "0–30 mild · 31–60 moderate · 61–100 severe",
    levelPill: {
      leve: "Mild limitation",
      moderada: "Moderate limitation",
      severa: "Severe limitation",
    },
    badgeQuestion: (level) => `What does ${LEVEL_EN[level]} limitation mean?`,
    meaningTitle: "What your result means",
    evalPlanTitle: "What should be evaluated in your case",
    warningTitle: "Signs not to wait for your appointment",
    ctaUrgent: "Let us know about your case on WhatsApp",
    ctaNormal: "Message us to book your consultation",
    urgentCarryNote:
      "And take this report to your evaluation today — it will help the doctor who sees you.",
    disclaimer:
      "This assessment is for guidance and doesn't replace a medical consultation. Your answers never leave your device.",
  },

  pdfDownload: {
    open: "Download my report (PDF)",
    nameQuestion: "Whose name should we put on your PDF? (optional)",
    namePlaceholder: "Your name",
    generate: "Generate PDF",
    generating: "Generating…",
    privacyNote:
      "The name is only printed on the document; it isn't stored anywhere.",
  },

  pdf: {
    headerSub: "Orthopedics · Spine Surgery",
    cedProfLabel: "Prof. License",
    cedEspLabel: "Specialist License",
    cert: "CMOT Board Certified 26/5567/25",
    footer: (phone) =>
      `dranconacolumna.com  ·  WhatsApp ${phone}  ·  Mérida & Umán`,
    pageLabel: (page, total) => `Page ${page} of ${total}`,
    dateLocale: "en-US",
    titleReport: (zoneUpper) => `ASSESSMENT REPORT — ${zoneUpper}`,
    metaLine: (fecha, folio) => `${fecha} · Report ID ${folio}`,
    reportOf: (name) => `Report for: ${name}`,
    per100: "/100",
    indexCaption: "limitation index",
    cutsLegend: "0–30 mild · 31–60 moderate · 61–100 severe",
    badgeQuestion: (level) => `What does ${LEVEL_EN[level]} limitation mean?`,
    meaningTitle: "WHAT YOUR RESULT MEANS",
    evalPlanTitle: "WHAT SHOULD BE EVALUATED IN YOUR CASE",
    warningTitle: "SIGNS NOT TO WAIT FOR YOUR APPOINTMENT",
    urgentShowReport: "Show this report to the doctor who sees you.",
    ctaUrgent: "Let us know about your case on WhatsApp",
    ctaNormal: "Message us on WhatsApp to book your consultation",
    urgentCarryNote:
      "And take this report to your evaluation today — it will help the doctor who sees you.",
    ctaConsultLine: "Seeing patients in Mérida and Umán",
    ctaPresentReport:
      "Bring this report to your appointment — it lets me know your case before I examine you.",
    qrCaption: "Scan it or tap it",
    scheduleWaMessage: "Hello Dr. Ancona, I'd like to schedule a consultation.",
    legalDisclaimer:
      "This report is not a diagnosis and doesn't replace a medical consultation. Generated on your device: your answers are not stored on any server. dranconacolumna.com",
  },
};

const EVAL_UI: Record<Locale, EvaluationUi> = {
  es: EVAL_UI_ES,
  en: EVAL_UI_EN,
};

/** Chrome de UI del flujo de evaluación y del PDF para el locale pedido. */
export function getEvaluationUi(locale: Locale): EvaluationUi {
  return EVAL_UI[locale];
}
