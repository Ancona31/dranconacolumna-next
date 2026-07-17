import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n/types";
import { getEngineCopy } from "./i18n";
import { RED_FLAGS } from "./red-flags";
import type {
  AlertLevel,
  AnswerMap,
  DomainId,
  DomainPhrases,
  DomainState,
  EvaluationResult,
  FuncState,
  NonUrgentLevel,
  Recommendation,
  RecommendationKey,
  Scoring,
  ScoringLevels,
  TestDefinition,
} from "./types";

export type { DomainState, FuncState } from "./types";

/** Flag de urgencia (hoy solo: trauma sin poder apoyar el pie). */
export const URGENT_TRAUMA_FLAG = "urgente-trauma";
/** Flag informativo: trauma con apoyo. No cambia el nivel funcional. */
export const TRAUMA_FLAG = "trauma";

/**
 * Flags de triaje que ameritan valoración prioritaria pero NO urgencias: el
 * déficit neurológico de instauración lenta. Elevan el alertLevel a 'precaución'
 * y se listan en "Marcaste:" con su `flagLabel`, junto a la alarma universal.
 * El déficit AGUDO tiene su propio flag urgente y no vive aquí.
 */
export const CAUTION_FLAGS = new Set([
  "mielopatia",
  "deficit-dorsal",
  "inflamacion-aguda",
]);

/** Cortes por defecto del nivel funcional cuando el scoring no define `levels`. */
const DEFAULT_LEVELS: ScoringLevels = { leveMax: 30, moderadaMax: 60 };

/**
 * Conjunto de flags que llevan el alertLevel a 'urgente'. Es LÓGICA, no texto:
 * el mismo conjunto de claves en todos los locales. El texto de cada banner
 * (título y cuerpo, más la variante por zona del trauma) vive en la copy
 * transversal (getEngineCopy → urgentFlagBanners / urgentTraumaBannerByZone).
 */
const URGENT_FLAG_IDS = new Set([
  "urgente-trauma",
  "urgente-neurologico",
  "urgente-neurologico-dorsal",
]);

/** Eyebrow del bloque de recomendación. Fuente única (pantalla y PDF). */
export const RECOMMENDATION_EYEBROW = getEngineCopy("es").recommendationEyebrow;

/**
 * MATRIZ DE RECOMENDACIÓN, indexada por nivel funcional o —si hay alerta— por el
 * nivel de alerta, que lo sobrescribe. La ventana temporal es el protagonista;
 * el contexto la justifica. Sin invitación de contacto: esa vive ÚNICAMENTE en
 * el CTA final y en la firma de "qué debe evaluarse".
 *
 * Export de compatibilidad (locale por defecto 'es'); el texto se lee ahora de
 * la copy transversal. Ver getRecommendation(level, alertLevel, locale).
 */
export const RECOMMENDATIONS: Record<
  RecommendationKey,
  { window: string; context: string }
> = getEngineCopy("es").recommendations;

/**
 * Definición del nivel de limitación (transversal a todos los tests). Fuente
 * ÚNICA: ResultScreen y ReportPdf la consumen; sin copias hardcodeadas.
 * Export de compatibilidad ('es'); el texto vive en la copy transversal.
 */
export const nivelDefinitions: Record<NonUrgentLevel, string> =
  getEngineCopy("es").nivelDefinitions;

/**
 * Par de color por nivel para el badge de definición: fondo muy claro + color
 * intenso (borde, título y acentos). Fuente única para pantalla y PDF.
 */
export const NIVEL_BADGE_COLORS: Record<
  NonUrgentLevel,
  { bg: string; strong: string }
> = {
  leve: { bg: "#EAF4EF", strong: "#2E7D5B" },
  moderada: { bg: "#FAF1E3", strong: "#C77D1F" },
  severa: { bg: "#F9EAE8", strong: "#C0453A" },
};

/**
 * Paleta del bloque de recomendación, DESACOPLADA de la severidad: el color no
 * dice qué tan grave es el resultado, solo si hay urgencia. Estándar (azul de
 * marca) para leve, moderada, severa y precaución; coral únicamente en urgente.
 * Fuente única para pantalla y PDF.
 */
export const RECOMMENDATION_COLORS: Record<
  "standard" | "urgente",
  { bg: string; strong: string }
> = {
  standard: { bg: "#E8F1F8", strong: "#0B3C5D" },
  urgente: { bg: "#F9EAE8", strong: "#C0453A" },
};

/** Par de color del bloque a partir de su variante. */
export function getRecommendationColors(rec: Recommendation) {
  return RECOMMENDATION_COLORS[rec.urgent ? "urgente" : "standard"];
}

function levelFromScore(score: number, levels: ScoringLevels): NonUrgentLevel {
  if (score <= levels.leveMax) return "leve";
  if (score <= levels.moderadaMax) return "moderada";
  return "severa";
}

/** Media aritmética; 0 con lista vacía. */
function mean(values: number[]): number {
  return values.length
    ? values.reduce((s, v) => s + v, 0) / values.length
    : 0;
}

/** Valor puntuable de un ítem; undefined si no se respondió o marcó "No aplica". */
function scored(answers: AnswerMap, id: string): number | undefined {
  const v = answers[id];
  return typeof v === "number" ? v : undefined;
}

/**
 * Deriva raw (suma de los ítems respondidos), interval (salud 0-100), score
 * (índice de limitación 0-100) y el conteo de respondidos según la forma de
 * scoring.
 * - table/linear ('higher-is-better'): score = 100 − interval.
 * - linear-adaptive / weighted-subscales / comi ('higher-is-worse'): score
 *   directo, SIN inversión; interval = 100 − score.
 * `unscorable` solo puede ser true en 'linear-adaptive' (todos los ítems "No
 * aplica"): ahí score/interval/level no significan nada.
 */
function computeScore(
  scoring: Scoring,
  answers: AnswerMap,
  questions: TestDefinition["questions"]
): {
  raw: number;
  interval: number;
  score: number;
  answeredCount: number;
  unscorable: boolean;
} {
  const values = questions
    .map((q) => scored(answers, q.id))
    .filter((v): v is number => v !== undefined);
  const answeredCount = values.length;
  const raw = values.reduce((sum, v) => sum + v, 0);

  if (scoring.kind === "linear-adaptive") {
    if (answeredCount === 0) {
      return { raw: 0, interval: 0, score: 0, answeredCount: 0, unscorable: true };
    }
    const score = Math.round(
      (raw / (scoring.perItemMax * answeredCount)) * 100
    );
    return {
      raw,
      interval: 100 - score,
      score,
      answeredCount,
      unscorable: false,
    };
  }

  const withCount = <T extends { raw: number; interval: number; score: number }>(
    r: T
  ) => ({ ...r, answeredCount, unscorable: false });

  if (scoring.kind === "comi") {
    const v = (id: string) => answers[id] ?? 0;
    // Dolor: el peor de los dos sitios. Discapacidad: promedio de sus dos ítems.
    const pain = Math.max(...scoring.painItems.map(v));
    const disability = mean(scoring.disabilityItems.map(v));
    const score = Math.round(
      mean([
        pain,
        v(scoring.functionItem),
        v(scoring.wellbeingItem),
        v(scoring.qolItem),
        disability,
      ]) * 10
    );
    return withCount({ raw, interval: 100 - score, score });
  }

  if (scoring.kind === "weighted-subscales") {
    const scoreRaw = scoring.subscales.reduce((acc, sub) => {
      const sum = sub.itemIds.reduce((s, id) => s + (scored(answers, id) ?? 0), 0);
      return acc + (sum / sub.maxRaw) * sub.weight * 100;
    }, 0);
    const score = Math.round(scoreRaw);
    return withCount({ raw, interval: 100 - score, score });
  }

  const interval =
    scoring.kind === "linear"
      ? 100 - (raw / scoring.maxRaw) * 100
      : scoring.table[raw] ?? 0;
  return withCount({ raw, interval, score: Math.round(100 - interval) });
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
  /** Sin ítems puntuables: el mensaje no puede citar score ni nivel. */
  unscorable?: boolean;
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
  alertLevel: AlertLevel,
  locale: Locale
): string {
  const v = getEngineCopy(locale).whatsapp.ventanaCorta;
  if (alertLevel === "urgente") return v.urgente;
  if (alertLevel === "precaucion") return v.precaucion;
  if (level === "severa") return v.severa;
  if (level === "moderada") return v.moderada;
  return v.leve;
}

/** Ventana de atención recomendada, derivada del resultado (sin duplicar texto). */
export function getVentanaCorta(
  result: EvaluationResult,
  locale: Locale = "es"
): string {
  return ventanaFromLevels(result.level, result.alertLevel, locale);
}

/** Mensaje de WhatsApp según nivel funcional y nivel de alerta. */
export function buildWhatsAppMessage(
  input: MessageInput,
  locale: Locale = "es"
): string {
  const wa = getEngineCopy(locale).whatsapp;
  if (input.variant === "qr" || input.variant === "qr-short") {
    const ventana = ventanaFromLevels(input.level, input.alertLevel, locale);
    if (input.variant === "qr-short") {
      return wa.qrShort(input.folio, input.score, input.level, ventana);
    }
    const zona = deburr(input.zoneLabel).toLowerCase();
    let msg = wa.qr(zona, input.folio, input.score, input.level, ventana);
    if (input.alertLevel === "urgente" || input.alertLevel === "precaucion") {
      msg += wa.qrAlarmSuffix;
    }
    return msg;
  }
  if (input.alertLevel === "urgente") {
    return wa.fullUrgente(input.zoneLabel, input.folio);
  }
  if (input.unscorable) {
    return wa.fullUnscorable(input.zoneLabel, input.folio);
  }
  const base = wa.fullBase(
    input.zoneLabel,
    input.folio,
    input.level,
    input.score
  );
  if (input.alertLevel === "precaucion") {
    return `${base}${wa.fullPrecaucionSuffix}`;
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
  opts?: { short?: boolean; locale?: Locale }
): string {
  return buildWhatsAppLink(
    buildWhatsAppMessage(
      {
        zoneLabel: result.zoneLabel,
        folio: result.folio,
        level: result.level,
        score: result.score,
        alertLevel: result.alertLevel,
        variant: opts?.short ? "qr-short" : "qr",
      },
      opts?.locale ?? "es"
    )
  );
}

/**
 * Bloque ÚNICO de recomendación según (nivel, alertLevel). Una sola voz: sin
 * ventanas contradictorias. El nivel de alerta, si existe, manda sobre el nivel
 * funcional. Fuente única para pantalla y PDF.
 */
export function getRecommendation(
  level: NonUrgentLevel,
  alertLevel: AlertLevel,
  locale: Locale = "es"
): Recommendation {
  const copy = getEngineCopy(locale);
  const key: RecommendationKey = alertLevel === "none" ? level : alertLevel;
  return {
    label: copy.recommendationEyebrow,
    ...copy.recommendations[key],
    urgent: alertLevel === "urgente",
  };
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
export function buildAlertBanner(
  result: EvaluationResult,
  locale: Locale = "es"
): AlertBanner | null {
  const copy = getEngineCopy(locale);
  if (result.alertLevel === "urgente") {
    const flag = result.flags.find((f) => URGENT_FLAG_IDS.has(f));
    // El trauma tiene texto por zona (miembro superior sobrescribe el default).
    const zoneBanner =
      flag === URGENT_TRAUMA_FLAG
        ? copy.urgentTraumaBannerByZone[result.test.zoneId]
        : undefined;
    const banner =
      zoneBanner ?? copy.urgentFlagBanners[flag ?? URGENT_TRAUMA_FLAG];
    return { tone: "urgente", title: banner.title, body: banner.body };
  }
  if (result.alertLevel === "precaucion") {
    return {
      tone: "precaucion",
      title: copy.cautionBannerTitle,
      body: copy.cautionBannerBody(result.alertMarks.join(", ")),
    };
  }
  return null;
}

/**
 * Frases legibles de los flags informativos presentes (los que el test define
 * en `flagLabels`). No incluye flags de alarma/urgencia ni los de precaución:
 * esos ya viven en la lista "Marcaste:" del banner. Respeta el orden de los
 * flags acumulados.
 */
export function getInfoFlagLabels(result: EvaluationResult): string[] {
  const map = result.test.flagLabels;
  if (!map) return [];
  return result.flags
    .filter((f) => !CAUTION_FLAGS.has(f))
    .map((f) => map[f])
    .filter((label): label is string => Boolean(label));
}

/**
 * Ítems marcados "Sí" (valor ≥ 1), en orden del cuestionario. Fuente única
 * para el desglose 'checklist' en pantalla y PDF.
 */
export function getMarkedItems(
  result: EvaluationResult
): { id: string; text: string }[] {
  return result.test.questions
    .filter((q) => (result.answers[q.id] ?? 0) >= 1)
    .map((q) => ({ id: q.id, text: q.text }));
}

/* ===================== SEMÁFORO FUNCIONAL POR DOMINIO ===================== */

/**
 * Paleta EXCLUSIVA del semáforo funcional (4 matices + el gris neutro de 'na').
 * No reutilizar los tokens ámbar/coral del resto del sitio. Par fondo-suave /
 * color-intenso.
 */
export const FUNC_COLORS: Record<DomainState, { bg: string; strong: string }> = {
  verde: { bg: "#EAF4EF", strong: "#2E7D5B" },
  amarillo: { bg: "#FDF7DC", strong: "#E3B505" },
  naranja: { bg: "#FBEFE5", strong: "#D96C2C" },
  rojo: { bg: "#F9EAE8", strong: "#C0453A" },
  na: { bg: "#F1F4F6", strong: "#94A3B2" },
};

export const FUNC_STATE_LABELS: Record<DomainState, string> =
  getEngineCopy("es").funcStateLabels;

/** Frase de la tarjeta gris: el dominio entero salió del cálculo. */
export const DOMAIN_NA_PHRASE = getEngineCopy("es").domainNaPhrase;

/** Mensaje cuando el paciente marcó "No aplica" en TODOS los ítems. */
export const UNSCORABLE_MESSAGE = getEngineCopy("es").unscorableMessage;

/**
 * Nota bajo el medidor cuando el resultado se calculó con menos ítems de los
 * que el instrumento exige (`minAnswered`). Fuente única: pantalla y PDF.
 */
export function getPartialAnswersNote(
  result: EvaluationResult,
  locale: Locale = "es"
): string | null {
  const min = result.test.minAnswered;
  if (!min || result.unscorable || result.answeredCount >= min) return null;
  return getEngineCopy(locale).partialAnswersNote(
    result.answeredCount,
    result.test.questions.length
  );
}

/** Línea global cuando los tres dominios salen verdes. */
export const FUNC_ALL_GREEN_LINE = getEngineCopy("es").funcAllGreenLine;

/** Título de la sección del semáforo cuando el test no define el suyo. */
export const DEFAULT_SEMAPHORE_TITLE = getEngineCopy("es").defaultSemaphoreTitle;

/** Título de la sección del semáforo. Fuente única para pantalla y PDF. */
export function getSemaphoreTitle(
  test: TestDefinition,
  locale: Locale = "es"
): string {
  return test.semaphoreTitle ?? getEngineCopy(locale).defaultSemaphoreTitle;
}

export type DomainResult = {
  id: DomainId;
  label: string;
  examples: string;
  /** 'na' cuando todos los ítems del dominio se marcaron "No aplica". */
  state: DomainState;
  /** true si el gradiente funcional elevó el estado por encima del bruto. */
  elevated: boolean;
  /** Hasta 2 paráfrasis de los ítems más afectados del dominio. Vacío si elevated. */
  mirrors: string[];
  /** Frase completa de la matriz (con ejemplos); misma en pantalla y PDF. */
  fullPhrase: string;
};

/**
 * true si el semáforo salió íntegramente verde. Los dominios 'na' no cuentan:
 * no se sabe nada de ellos, así que ni confirman ni desmienten la línea global.
 */
export function allDomainsGreen(domains: DomainResult[]): boolean {
  const scored = domains.filter((d) => d.state !== "na");
  return scored.length > 0 && scored.every((d) => d.state === "verde");
}

const STATE_ORDER: Record<FuncState, number> = {
  verde: 0,
  amarillo: 1,
  naranja: 2,
  rojo: 3,
};
function maxState(a: FuncState, b: FuncState): FuncState {
  return STATE_ORDER[a] >= STATE_ORDER[b] ? a : b;
}

/**
 * Fragmento " — por ejemplo, {m1} y {m2}" según cuántas mirrors haya. El
 * encabezado (`lead`) y el conector (`join`) son texto transversal (copy).
 */
function exampleFragment(
  mirrors: string[],
  lead: string,
  join: string
): string {
  if (mirrors.length === 0) return "";
  if (mirrors.length === 1) return `${lead}${mirrors[0]}`;
  return `${lead}${mirrors[0]}${join}${mirrors[1]}`;
}

/**
 * Frase de la matriz (propia del test o global) con los ejemplos incorporados.
 * La matriz global 4×3 vive ahora en la copy transversal (getEngineCopy →
 * domainPhrases); un test con dimensiones propias la sobrescribe con su
 * `domainPhrases`. El marcador {ej} se sustituye por el fragmento de ejemplos.
 */
function domainPhrase(
  state: FuncState,
  domainId: DomainId,
  mirrors: string[],
  phrases: DomainPhrases,
  lead: string,
  join: string
): string {
  const phrase = phrases[state][domainId] ?? "";
  return phrase.replace("{ej}", exampleFragment(mirrors, lead, join));
}

// Frases para dominios elevados por el gradiente (sin mirrors: el paciente no
// marcó ítems propios ahí). Distintas entre sí; tienen prioridad sobre la
// matriz. El texto vive en la copy transversal (elevatedPhrases); verde es
// inalcanzable (la elevación nunca produce verde).
function elevatedFullPhrase(state: FuncState, locale: Locale): string {
  if (state === "verde") return "";
  return getEngineCopy(locale).elevatedPhrases[state];
}

/**
 * Semáforo por dominio. 'bars': estado por el valor agregado del dominio
 * (promedio, o máximo si el dominio declara aggregation 'max'); mirrors = ítems
 * de mayor valor (≥ t1). 'checklist' (Sí/No): estado por proporción de
 * marcadas; mirrors = hasta 2 marcadas en orden.
 *
 * Los ítems marcados "No aplica" quedan fuera del agregado. Un dominio sin
 * ningún ítem respondido no tiene estado: sale 'na' (tarjeta gris neutra).
 *
 * Gradiente funcional (opt-out con applyGradient:false): tras los estados
 * brutos se eleva cada dominio al estado del anterior, en el orden del arreglo
 * `domains` (ligeras → demandantes), nunca a la inversa. Los dominios 'na' se
 * saltan: no reciben elevación ni la propagan, y el gradiente encadena entre
 * los que sí tienen estado. Los tests de dimensiones lo desactivan: sus
 * dominios no se ordenan por exigencia.
 */
export function computeDomains(
  test: TestDefinition,
  answers: AnswerMap,
  locale: Locale = "es"
): DomainResult[] {
  const copy = getEngineCopy(locale);
  const domains = test.domains ?? [];
  const isChecklist = test.resultDisplay === "checklist";
  const byId = new Map(test.questions.map((q) => [q.id, q]));
  // Umbrales del valor agregado (verde<t0, amarillo<t1, naranja<t2, rojo≥t2).
  // t1 es además el mínimo para que un ítem aporte su mirror. Default 0-4:
  // [1,2,3]; los tests de escala 0-10 usan [2.5, 5, 7.5]. Nunca asumen enteros.
  const [tVerde, tAmarillo, tNaranja] = test.domainThresholds ?? [1, 2, 3];
  const phrases = test.domainPhrases ?? copy.domainPhrases;

  // 1. Estado bruto + mirrors por dominio (lógica por test intacta). Los ítems
  //    marcados "No aplica" no entran; sin ninguno respondido el dominio es 'na'.
  const raw = domains.map((domain) => {
    const items = domain.itemIds
      .map((id) => byId.get(id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q))
      .map((q) => ({ q, value: scored(answers, q.id) }))
      .filter((it): it is { q: TestDefinition["questions"][number]; value: number } =>
        it.value !== undefined
      );

    if (items.length === 0) {
      return { domain, rawState: "na" as const, mirrors: [] as string[] };
    }

    let rawState: FuncState;
    let mirrorItems: typeof items;

    if (isChecklist) {
      const total = items.length || 1;
      const markedItems = items.filter((it) => it.value >= 1);
      const p = markedItems.length / total;
      rawState =
        p === 0
          ? "verde"
          : p <= 1 / 3
            ? "amarillo"
            : p <= 2 / 3
              ? "naranja"
              : "rojo";
      mirrorItems = markedItems.slice(0, 2);
    } else {
      const values = items.map((it) => it.value);
      const aggregate =
        domain.aggregation === "max"
          ? values.length
            ? Math.max(...values)
            : 0
          : mean(values);
      rawState =
        aggregate < tVerde
          ? "verde"
          : aggregate < tAmarillo
            ? "amarillo"
            : aggregate < tNaranja
              ? "naranja"
              : "rojo";
      mirrorItems = [...items]
        .filter((it) => it.value >= tAmarillo)
        .sort((a, b) => b.value - a.value)
        .slice(0, 2);
    }

    const mirrors = mirrorItems
      .map((it) => it.q.mirrorPhrase)
      .filter((m): m is string => Boolean(m));

    return { domain, rawState, mirrors };
  });

  // 2. Gradiente funcional: máximo acumulado en el orden del arreglo. Los 'na'
  //    no participan — el acumulado los atraviesa sin alterarse.
  const applyGradient = test.applyGradient !== false;
  let running: FuncState = "verde";
  const finalStates: DomainState[] = raw.map(({ rawState }) => {
    if (rawState === "na" || !applyGradient) return rawState;
    running = maxState(running, rawState);
    return running;
  });

  // 3. Construir resultados con estado final + elevated + frases.
  return raw.map(({ domain, rawState, mirrors }, i) => {
    const state = finalStates[i];
    const base = {
      id: domain.id,
      label: domain.label,
      examples: domain.examples,
    };
    if (state === "na" || rawState === "na") {
      return {
        ...base,
        state: "na" as const,
        elevated: false,
        mirrors: [],
        fullPhrase: copy.domainNaPhrase,
      };
    }
    const elevated = STATE_ORDER[state] > STATE_ORDER[rawState];
    const usedMirrors = elevated ? [] : mirrors;
    return {
      ...base,
      state,
      elevated,
      mirrors: usedMirrors,
      fullPhrase: elevated
        ? elevatedFullPhrase(state, locale)
        : domainPhrase(
            state,
            domain.id,
            usedMirrors,
            phrases,
            copy.exampleLead,
            copy.exampleJoin
          ),
    };
  });
}

/* ============= "QUÉ DEBE EVALUARSE" Y "SEÑALES PARA NO ESPERAR" ============ */

/** Firma comercial única permitida fuera del CTA. Export de compatibilidad ('es'). */
export const EVALUATION_SIGNATURE = getEngineCopy("es").evaluationSignature;

/** Cierre transversal de "Señales para no esperar tu cita". Compat ('es'). */
export const WARNING_CLOSING = getEngineCopy("es").warningClosing;

/** Bullets de "Qué debe evaluarse en tu caso": base por zona + condicionales por flag. */
export function getEvaluationPlan(
  result: EvaluationResult,
  locale: Locale = "es"
): string[] {
  const plan = getEngineCopy(locale).evaluationPlans[result.test.zoneId];
  if (!plan) return [];
  const extras = plan.byFlag
    ? Object.entries(plan.byFlag)
        .filter(([flag]) => result.flags.includes(flag))
        .map(([, text]) => text)
    : [];
  return [...plan.base, ...extras];
}

/** Bullets de "Señales para no esperar tu cita" por zona. */
export function getWarningSigns(
  result: EvaluationResult,
  locale: Locale = "es"
): string[] {
  return getEngineCopy(locale).warningSigns[result.test.zoneId] ?? [];
}

/**
 * Calcula SIEMPRE score y nivel funcional por la tabla (nunca cambian por
 * flags). Los flags solo derivan alertLevel + los datos marcados.
 */
export function computeResult(
  test: TestDefinition,
  answers: AnswerMap,
  flags: string[],
  locale: Locale = "es"
): EvaluationResult {
  const { raw, interval, score, answeredCount, unscorable } = computeScore(
    test.scoring,
    answers,
    test.questions
  );
  const level = levelFromScore(score, test.scoring.levels ?? DEFAULT_LEVELS);

  // "Marcaste:" = alarma universal + flags de triaje de precaución, en ese orden.
  const redFlagLabels = getEngineCopy(locale).redFlagLabels;
  const alertMarks = [
    ...RED_FLAGS.filter((rf) => flags.includes(rf.id)).map(
      (rf) => redFlagLabels[rf.id]
    ),
    ...flags
      .filter((f) => CAUTION_FLAGS.has(f))
      .map((f) => test.flagLabels?.[f])
      .filter((label): label is string => Boolean(label)),
  ];
  const alertLevel: AlertLevel = flags.some((f) => URGENT_FLAG_IDS.has(f))
    ? "urgente"
    : alertMarks.length > 0
      ? "precaucion"
      : "none";

  const breakdown = test.questions.map((q) => ({
    shortLabel: q.shortLabel,
    value: scored(answers, q.id) ?? null,
  }));

  const base = {
    test,
    folio: buildFolio(),
    zoneLabel: test.zoneLabel,
    score,
    interval,
    raw,
    level,
    answeredCount,
    unscorable,
    answers,
    flags,
    alertLevel,
    alertMarks,
    breakdown,
    createdAt: new Date(),
  };

  return {
    ...base,
    whatsappMessage: buildWhatsAppMessage(
      {
        zoneLabel: base.zoneLabel,
        folio: base.folio,
        level: base.level,
        score: base.score,
        alertLevel: base.alertLevel,
        unscorable: base.unscorable,
      },
      locale
    ),
  };
}
