import { buildWhatsAppLink } from "@/lib/whatsapp";
import { RED_FLAGS } from "./red-flags";
import type {
  AlertLevel,
  AnswerMap,
  EvaluationResult,
  NonUrgentLevel,
  ScoringLevels,
  TestDefinition,
} from "./types";

/** Flag de urgencia (hoy solo: trauma sin poder apoyar el pie). */
export const URGENT_TRAUMA_FLAG = "urgente-trauma";
/** Flag informativo: trauma con apoyo. No cambia el nivel funcional. */
export const TRAUMA_FLAG = "trauma";

/**
 * MATRIZ DE RECOMENDACIÓN por nivel funcional (alertLevel 'none').
 * El reporte nunca sugiere tratamiento ni autocuidado: siempre desemboca en
 * agendar valoración.
 */
export const RECOMMENDATION_TEXTS: Record<NonUrgentLevel, string> = {
  leve: "Tu resultado no muestra datos de urgencia. Una valoración te da un diagnóstico claro y un plan — escríbenos para agendarla esta semana.",
  moderada:
    "Este nivel de limitación amerita valoración médica. Te recomendamos agendarla en los próximos 3 días — escríbenos por WhatsApp.",
  severa:
    "Tu resultado amerita valoración pronta: recomendable dentro de las próximas 24 a 48 horas. Escríbenos para coordinarla.",
};

function levelFromScore(score: number, levels: ScoringLevels): NonUrgentLevel {
  if (score <= levels.leveMax) return "leve";
  if (score <= levels.moderadaMax) return "moderada";
  return "severa";
}

/** Folio "EV-" + yyMM + "-" + 4 dígitos aleatorios (ej. EV-2607-4831). */
export function buildFolio(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `EV-${yy}${mm}-${rand}`;
}

type MessageInput = {
  zoneLabel: string;
  folio: string;
  level: NonUrgentLevel;
  score: number;
  alertLevel: AlertLevel;
  /**
   * 'qr' = mensaje del QR/Link del PDF (sin acentos). 'qr-short' = recorte de
   * densidad cuando el QR supera la versión 5.
   */
  variant?: "full" | "qr" | "qr-short";
};

/** Elimina tildes y ñ (el URL-encoding de esos caracteres infla el QR). */
function deburr(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Ventana de atención recomendada, compacta y sin acentos. Fuente única
 * derivada de (nivel, alertLevel) — misma matriz de recomendación.
 */
function ventanaFromLevels(
  level: NonUrgentLevel,
  alertLevel: AlertLevel
): string {
  if (alertLevel === "urgente") return "hoy mismo";
  if (alertLevel === "precaucion") return "en 24 a 48 horas";
  if (level === "severa") return "en 24 a 48 horas";
  if (level === "moderada") return "en los proximos 3 dias";
  return "esta semana";
}

/** Ventana de atención recomendada, derivada del resultado (sin duplicar texto). */
export function getVentanaCorta(result: EvaluationResult): string {
  return ventanaFromLevels(result.level, result.alertLevel);
}

/** Mensaje de WhatsApp según nivel funcional y nivel de alerta. */
export function buildWhatsAppMessage(input: MessageInput): string {
  if (input.variant === "qr" || input.variant === "qr-short") {
    const ventana = ventanaFromLevels(input.level, input.alertLevel);
    if (input.variant === "qr-short") {
      return `Quiero agendar una valoracion. ${input.folio}: ${input.score}/100, ${input.level}, valoracion ${ventana}.`;
    }
    const zona = deburr(input.zoneLabel).toLowerCase();
    let msg = `Quiero agendar una valoracion. Evaluacion de ${zona} ${input.folio}: ${input.score}/100, limitacion ${input.level}. Recomendacion del test: valoracion ${ventana}.`;
    if (input.alertLevel === "urgente" || input.alertLevel === "precaucion") {
      msg += " Marque datos de alarma.";
    }
    return msg;
  }
  if (input.alertLevel === "urgente") {
    return `Hola Dr. Ancona, mi evaluación de ${input.zoneLabel} detectó datos de alarma (folio ${input.folio}). Acudiré a urgencias; le aviso de mi caso.`;
  }
  const base = `Hola Dr. Ancona, completé la evaluación de ${input.zoneLabel} (folio ${input.folio}). Resultado: limitación ${input.level}, ${input.score}/100. Quiero agendar una valoración.`;
  if (input.alertLevel === "precaucion") {
    return `${base} Marqué datos de alarma en el cuestionario.`;
  }
  return base;
}

/** Enlace wa.me listo para usar a partir del resultado. */
export function getResultWhatsAppLink(result: EvaluationResult): string {
  return buildWhatsAppLink(result.whatsappMessage);
}

/**
 * Enlace wa.me del QR/Link del PDF. Fuente única: el mismo mensaje alimenta el
 * QR y ambos <Link>. Con { short } usa la forma recortada por densidad.
 */
export function getQrWhatsAppLink(
  result: EvaluationResult,
  opts?: { short?: boolean }
): string {
  return buildWhatsAppLink(
    buildWhatsAppMessage({
      zoneLabel: result.zoneLabel,
      folio: result.folio,
      level: result.level,
      score: result.score,
      alertLevel: result.alertLevel,
      variant: opts?.short ? "qr-short" : "qr",
    })
  );
}

/**
 * Texto ÚNICO del recuadro de recomendación según (nivel, alertLevel).
 * Una sola voz: sin ventanas contradictorias.
 */
export function getRecommendationText(
  level: NonUrgentLevel,
  alertLevel: AlertLevel
): string {
  if (alertLevel === "urgente") {
    return "Lo indicado es valoración presencial hoy mismo, en un servicio de urgencias. Si quieres, avísanos de tu caso por WhatsApp.";
  }
  if (alertLevel === "precaucion") {
    return "Además de tu nivel de limitación, los datos que marcaste ameritan valoración pronta: te recomendamos agendarla en las próximas 24 a 48 horas — escríbenos por WhatsApp.";
  }
  return RECOMMENDATION_TEXTS[level];
}

export type AlertBanner = {
  tone: "precaucion" | "urgente";
  title: string;
  body: string;
};

/**
 * Banner condicional. Tono sereno; jamás nombra causas ni enfermedades: en
 * precaución solo repite textualmente lo que el paciente marcó.
 */
export function buildAlertBanner(result: EvaluationResult): AlertBanner | null {
  if (result.alertLevel === "urgente") {
    return {
      tone: "urgente",
      title: "Tu lesión necesita valoración hoy",
      body: "Indicaste que tras un golpe o caída no puedes apoyar el pie. Eso debe revisarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo; le servirá al médico que te atienda.",
    };
  }
  if (result.alertLevel === "precaucion") {
    return {
      tone: "precaucion",
      title: "Datos que merecen valoración médica",
      body: `Marcaste: ${result.alertMarks.join(
        ", "
      )}. Estos datos por sí solos no confirman ningún problema grave, pero sí ameritan que un médico los valore pronto para descartar causas que requieren tratamiento específico.`,
    };
  }
  return null;
}

/**
 * Calcula SIEMPRE score y nivel funcional por la tabla (nunca cambian por
 * flags). Los flags solo derivan alertLevel + los datos marcados.
 */
export function computeResult(
  test: TestDefinition,
  answers: AnswerMap,
  flags: string[]
): EvaluationResult {
  const raw = test.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const interval = test.scoring.rawToInterval[raw] ?? 0;
  const score = Math.round(100 - interval);
  const level = levelFromScore(score, test.scoring.levels);

  const alertMarks = RED_FLAGS.filter((rf) => flags.includes(rf.id)).map(
    (rf) => rf.label
  );
  const alertLevel: AlertLevel = flags.includes(URGENT_TRAUMA_FLAG)
    ? "urgente"
    : alertMarks.length > 0
      ? "precaucion"
      : "none";

  const breakdown = test.questions.map((q) => ({
    shortLabel: q.shortLabel,
    value: answers[q.id] ?? 0,
  }));

  const base = {
    test,
    folio: buildFolio(),
    zoneLabel: test.zoneLabel,
    score,
    interval,
    raw,
    level,
    answers,
    flags,
    alertLevel,
    alertMarks,
    breakdown,
    createdAt: new Date(),
  };

  return {
    ...base,
    whatsappMessage: buildWhatsAppMessage({
      zoneLabel: base.zoneLabel,
      folio: base.folio,
      level: base.level,
      score: base.score,
      alertLevel: base.alertLevel,
    }),
  };
}
