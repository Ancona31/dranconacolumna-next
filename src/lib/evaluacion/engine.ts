import { buildWhatsAppLink } from "@/lib/whatsapp";
import { RED_FLAGS } from "./red-flags";
import type {
  AlertLevel,
  AnswerMap,
  DomainId,
  DomainPhrases,
  EvaluationResult,
  FuncState,
  NonUrgentLevel,
  Recommendation,
  RecommendationKey,
  Scoring,
  ScoringLevels,
  TestDefinition,
} from "./types";

export type { FuncState } from "./types";

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
export const CAUTION_FLAGS = new Set(["mielopatia", "deficit-dorsal"]);

/** Cortes por defecto del nivel funcional cuando el scoring no define `levels`. */
const DEFAULT_LEVELS: ScoringLevels = { leveMax: 30, moderadaMax: 60 };

/**
 * Banner de urgencia por flag. Un flag presente en este mapa lleva el
 * alertLevel a 'urgente'; su texto sereno describe lo que el paciente indicó.
 */
const URGENT_FLAG_BANNERS: Record<string, { title: string; body: string }> = {
  "urgente-trauma": {
    title: "Tu lesión necesita valoración hoy",
    body: "Indicaste que tras un golpe o caída no puedes apoyar el pie. Eso debe revisarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo; le servirá al médico que te atienda.",
  },
  "urgente-neurologico": {
    title: "Tus respuestas incluyen datos que deben valorarse hoy",
    body: "Indicaste debilidad que avanza, adormecimiento en la zona genital o dificultad nueva para controlar esfínteres. Esos datos requieren valoración presencial hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo.",
  },
  "urgente-neurologico-dorsal": {
    title: "Tus respuestas incluyen datos que deben valorarse hoy",
    body: "Indicaste debilidad o torpeza en las piernas de aparición súbita. Ese dato debe valorarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo.",
  },
};

/**
 * Banner de 'urgente-trauma' específico por zona: el texto por defecto ("no
 * puedes apoyar el pie") es correcto para miembro inferior; el miembro superior
 * lo sobrescribe con un texto acorde a la lesión que el paciente indicó.
 */
const URGENT_TRAUMA_BANNER_BY_ZONE: Partial<
  Record<string, { title: string; body: string }>
> = {
  hombro: {
    title: "Tu lesión necesita valoración hoy",
    body: "Indicaste que tras un golpe o caída tienes deformidad o no puedes mover el brazo o la mano afectada. Eso debe revisarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo; le servirá al médico que te atienda.",
  },
  codo: {
    title: "Tu lesión necesita valoración hoy",
    body: "Indicaste que tras un golpe o caída tienes deformidad o no puedes mover el brazo o la mano afectada. Eso debe revisarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo; le servirá al médico que te atienda.",
  },
  muneca: {
    title: "Tu lesión necesita valoración hoy",
    body: "Indicaste que tras un golpe o caída tienes deformidad o no puedes mover el brazo o la mano afectada. Eso debe revisarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo; le servirá al médico que te atienda.",
  },
};

/** Eyebrow del bloque de recomendación. Fuente única (pantalla y PDF). */
export const RECOMMENDATION_EYEBROW = "VALORACIÓN RECOMENDADA";

/**
 * MATRIZ DE RECOMENDACIÓN, indexada por nivel funcional o —si hay alerta— por el
 * nivel de alerta, que lo sobrescribe. La ventana temporal es el protagonista;
 * el contexto la justifica. Sin invitación de contacto: esa vive ÚNICAMENTE en
 * el CTA final y en la firma de "qué debe evaluarse".
 */
export const RECOMMENDATIONS: Record<
  RecommendationKey,
  { window: string; context: string }
> = {
  leve: {
    window: "Esta semana",
    context:
      "Tu resultado no muestra datos de urgencia. Una valoración médica te dará un diagnóstico claro y un plan.",
  },
  moderada: {
    window: "En los próximos 3 días",
    context: "Este nivel de limitación amerita valoración médica.",
  },
  severa: {
    window: "En las próximas 24 a 48 horas",
    context: "Tu resultado amerita valoración pronta.",
  },
  precaucion: {
    window: "En las próximas 24 a 48 horas",
    context:
      "Además de tu nivel de limitación, los datos que marcaste ameritan valoración pronta.",
  },
  urgente: {
    window: "Hoy mismo, en un servicio de urgencias",
    context: "Lo indicado es valoración presencial.",
  },
};

/**
 * Definición del nivel de limitación (transversal a todos los tests). Fuente
 * ÚNICA: ResultScreen y ReportPdf la consumen; sin copias hardcodeadas.
 */
export const nivelDefinitions: Record<NonUrgentLevel, string> = {
  leve: "Una limitación leve significa que puedes realizar la mayoría de tus actividades diarias y laborales, aunque con molestias ocasionales o al final del día.",
  moderada:
    "Una limitación moderada puede dificultar tus actividades de la vida diaria o laborales. Ten precaución si tu trabajo incluye cargar objetos pesados, o caminar por lugares peligrosos, estrechos o con desniveles.",
  severa:
    "Una limitación severa puede imposibilitar casi por completo las actividades básicas del día a día y puede hacer inseguro el trabajo físico. Evita esfuerzos importantes, cargas pesadas y superficies de riesgo hasta que un médico valore tu caso.",
};

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

/**
 * Deriva raw (suma de todos los ítems), interval (salud 0-100) y score (índice
 * de limitación 0-100) según la forma de scoring.
 * - table/linear ('higher-is-better'): score = 100 − interval.
 * - weighted-subscales / comi ('higher-is-worse'): score directo, SIN inversión;
 *   interval = 100 − score.
 */
function computeScore(
  scoring: Scoring,
  answers: AnswerMap,
  questions: TestDefinition["questions"]
): { raw: number; interval: number; score: number } {
  const raw = questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);

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
    return { raw, interval: 100 - score, score };
  }

  if (scoring.kind === "weighted-subscales") {
    const scoreRaw = scoring.subscales.reduce((acc, sub) => {
      const sum = sub.itemIds.reduce((s, id) => s + (answers[id] ?? 0), 0);
      return acc + (sum / sub.maxRaw) * sub.weight * 100;
    }, 0);
    const score = Math.round(scoreRaw);
    return { raw, interval: 100 - score, score };
  }

  const interval =
    scoring.kind === "linear"
      ? 100 - (raw / scoring.maxRaw) * 100
      : scoring.table[raw] ?? 0;
  return { raw, interval, score: Math.round(100 - interval) };
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
 * Bloque ÚNICO de recomendación según (nivel, alertLevel). Una sola voz: sin
 * ventanas contradictorias. El nivel de alerta, si existe, manda sobre el nivel
 * funcional. Fuente única para pantalla y PDF.
 */
export function getRecommendation(
  level: NonUrgentLevel,
  alertLevel: AlertLevel
): Recommendation {
  const key: RecommendationKey = alertLevel === "none" ? level : alertLevel;
  return {
    label: RECOMMENDATION_EYEBROW,
    ...RECOMMENDATIONS[key],
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
export function buildAlertBanner(result: EvaluationResult): AlertBanner | null {
  if (result.alertLevel === "urgente") {
    const flag = result.flags.find((f) => f in URGENT_FLAG_BANNERS);
    // El trauma tiene texto por zona (miembro superior sobrescribe el default).
    const zoneBanner =
      flag === URGENT_TRAUMA_FLAG
        ? URGENT_TRAUMA_BANNER_BY_ZONE[result.test.zoneId]
        : undefined;
    const banner = zoneBanner ?? URGENT_FLAG_BANNERS[flag ?? URGENT_TRAUMA_FLAG];
    return { tone: "urgente", title: banner.title, body: banner.body };
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
 * Paleta EXCLUSIVA del semáforo funcional (4 matices). No reutilizar los tokens
 * ámbar/coral del resto del sitio. Par fondo-suave / color-intenso.
 */
export const FUNC_COLORS: Record<FuncState, { bg: string; strong: string }> = {
  verde: { bg: "#EAF4EF", strong: "#2E7D5B" },
  amarillo: { bg: "#FDF7DC", strong: "#E3B505" },
  naranja: { bg: "#FBEFE5", strong: "#D96C2C" },
  rojo: { bg: "#F9EAE8", strong: "#C0453A" },
};

export const FUNC_STATE_LABELS: Record<FuncState, string> = {
  verde: "Sin dificultad importante",
  amarillo: "Con dificultad leve",
  naranja: "Con dificultad considerable",
  rojo: "Muy limitada hoy",
};

/** Línea global cuando los tres dominios salen verdes. */
export const FUNC_ALL_GREEN_LINE =
  "Tus respuestas no muestran limitación funcional. Si el dolor persiste a pesar de eso, también merece explicación.";

/** Título de la sección del semáforo cuando el test no define el suyo. */
export const DEFAULT_SEMAPHORE_TITLE = "Tu capacidad hoy, según tus respuestas";

/** Título de la sección del semáforo. Fuente única para pantalla y PDF. */
export function getSemaphoreTitle(test: TestDefinition): string {
  return test.semaphoreTitle ?? DEFAULT_SEMAPHORE_TITLE;
}

export type DomainResult = {
  id: DomainId;
  label: string;
  examples: string;
  state: FuncState;
  /** true si el gradiente funcional elevó el estado por encima del bruto. */
  elevated: boolean;
  /** Hasta 2 paráfrasis de los ítems más afectados del dominio. Vacío si elevated. */
  mirrors: string[];
  /** Frase completa de la matriz (con ejemplos); misma en pantalla y PDF. */
  fullPhrase: string;
};

const STATE_ORDER: Record<FuncState, number> = {
  verde: 0,
  amarillo: 1,
  naranja: 2,
  rojo: 3,
};
function maxState(a: FuncState, b: FuncState): FuncState {
  return STATE_ORDER[a] >= STATE_ORDER[b] ? a : b;
}

/** Fragmento " — por ejemplo, {m1} y {m2}" según cuántas mirrors haya. */
function exampleFragment(mirrors: string[]): string {
  if (mirrors.length === 0) return "";
  if (mirrors.length === 1) return ` — por ejemplo, ${mirrors[0]}`;
  return ` — por ejemplo, ${mirrors[0]} y ${mirrors[1]}`;
}

/**
 * Matriz global de 12 frases (estado × dominio) para la tríada funcional. Cada
 * dominio tiene voz propia en cada estado, así dos dominios en el mismo estado
 * nunca repiten texto. El marcador {ej} se sustituye por el fragmento de
 * ejemplos (verde nunca lo lleva). Un test con dimensiones propias la
 * sobrescribe con su `domainPhrases`.
 */
const DOMAIN_PHRASES: DomainPhrases = {
  verde: {
    basicas:
      "Lo esencial de tu día se mantiene sin dificultad importante. Cuida esa base: es tu punto de partida para recuperarte.",
    moderadas:
      "Tu movilidad cotidiana se conserva bien. Mantén la precaución para que siga así.",
    demandantes:
      "Los esfuerzos mayores todavía no te limitan de forma importante. Aun así, no te confíes: escucha a tu cuerpo.",
  },
  amarillo: {
    basicas:
      "Asoma una limitación en lo más elemental{ej}. Es leve, pero en este terreno cualquier señal temprana cuenta.",
    moderadas:
      "Tu movilidad diaria empieza a resentirse{ej}. Es una señal temprana que conviene no dejar crecer.",
    demandantes:
      "Los esfuerzos mayores empiezan a cobrarte factura{ej}. Modérate en este terreno.",
  },
  naranja: {
    basicas:
      "Lo esencial del día ya te exige un esfuerzo claro{ej}. Este dato pesa en tu evaluación: no lo normalices.",
    moderadas:
      "Tu movilidad cotidiana está claramente comprometida{ej}. Dosifica estas actividades.",
    demandantes:
      "Los esfuerzos mayores ya te generan dificultad franca{ej}. Redúcelos a lo indispensable.",
  },
  rojo: {
    basicas:
      "Las actividades más elementales están gravemente afectadas{ej}. Es el hallazgo de mayor peso en tu evaluación.",
    moderadas:
      "El impacto alcanza de lleno tu movilidad diaria{ej}. Limítala a lo estrictamente necesario.",
    demandantes:
      "Los esfuerzos mayores quedan fuera de tus posibilidades por ahora{ej}. Evítalos por completo hasta tener un diagnóstico.",
  },
};

/** Frase de la matriz (propia del test o global) con los ejemplos incorporados. */
function domainPhrase(
  state: FuncState,
  domainId: DomainId,
  mirrors: string[],
  phrases: DomainPhrases
): string {
  const phrase = phrases[state][domainId] ?? "";
  return phrase.replace("{ej}", exampleFragment(mirrors));
}

// Frases para dominios elevados por el gradiente (sin mirrors: el paciente no
// marcó ítems propios ahí). Distintas entre sí; tienen prioridad sobre la matriz.
function elevatedFullPhrase(state: FuncState): string {
  switch (state) {
    case "amarillo":
      return "Tus actividades más ligeras ya muestran limitación — este terreno merece la misma precaución.";
    case "naranja":
      return "Por el nivel de limitación que muestran tus actividades más ligeras, este terreno te exigirá aún más: dosifícalo.";
    case "rojo":
      return "Por el nivel de limitación que muestran tus actividades más ligeras, este es el terreno con mayor riesgo de sobreesfuerzo — evítalo hasta tener un diagnóstico.";
    case "verde":
      return ""; // inalcanzable: la elevación nunca produce verde
  }
}

/**
 * Semáforo por dominio. 'bars': estado por el valor agregado del dominio
 * (promedio, o máximo si el dominio declara aggregation 'max'); mirrors = ítems
 * de mayor valor (≥ t1). 'checklist' (Sí/No): estado por proporción de
 * marcadas; mirrors = hasta 2 marcadas en orden.
 *
 * Gradiente funcional (opt-out con applyGradient:false): tras los estados
 * brutos se eleva cada dominio al estado del anterior, en el orden del arreglo
 * `domains` (ligeras → demandantes), nunca a la inversa. Los tests de
 * dimensiones lo desactivan: sus dominios no se ordenan por exigencia.
 */
export function computeDomains(
  test: TestDefinition,
  answers: AnswerMap
): DomainResult[] {
  const domains = test.domains ?? [];
  const isChecklist = test.resultDisplay === "checklist";
  const byId = new Map(test.questions.map((q) => [q.id, q]));
  // Umbrales del valor agregado (verde<t0, amarillo<t1, naranja<t2, rojo≥t2).
  // t1 es además el mínimo para que un ítem aporte su mirror. Default 0-4:
  // [1,2,3]; los tests de escala 0-10 usan [2.5, 5, 7.5]. Nunca asumen enteros.
  const [tVerde, tAmarillo, tNaranja] = test.domainThresholds ?? [1, 2, 3];
  const phrases = test.domainPhrases ?? DOMAIN_PHRASES;

  // 1. Estado bruto + mirrors por dominio (lógica por test intacta).
  const raw = domains.map((domain) => {
    const items = domain.itemIds
      .map((id) => byId.get(id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q))
      .map((q) => ({ q, value: answers[q.id] ?? 0 }));

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

  // 2. Gradiente funcional: máximo acumulado en el orden del arreglo.
  const applyGradient = test.applyGradient !== false;
  let running: FuncState = "verde";
  const finalStates = raw.map(({ rawState }) => {
    if (!applyGradient) return rawState;
    running = maxState(running, rawState);
    return running;
  });

  // 3. Construir resultados con estado final + elevated + frases.
  return raw.map(({ domain, rawState, mirrors }, i) => {
    const state = finalStates[i];
    const elevated = STATE_ORDER[state] > STATE_ORDER[rawState];
    const usedMirrors = elevated ? [] : mirrors;
    return {
      id: domain.id,
      label: domain.label,
      examples: domain.examples,
      state,
      elevated,
      mirrors: usedMirrors,
      fullPhrase: elevated
        ? elevatedFullPhrase(state)
        : domainPhrase(state, domain.id, usedMirrors, phrases),
    };
  });
}

/* ============= "QUÉ DEBE EVALUARSE" Y "SEÑALES PARA NO ESPERAR" ============ */

/** Firma comercial única permitida fuera del CTA. */
export const EVALUATION_SIGNATURE =
  "Esta es la valoración que realizo en consulta.";

/** Cierre transversal de "Señales para no esperar tu cita". */
export const WARNING_CLOSING =
  "Si aparece cualquiera de estas señales, no esperes tu cita: busca valoración de inmediato. Lo más importante: no ignores lo que tu cuerpo te está diciendo.";

const EVALUATION_PLANS: Record<
  string,
  { base: string[]; byFlag?: Record<string, string> }
> = {
  cuello: {
    base: [
      "Exploraré la movilidad de tu cuello y los movimientos que despiertan tu dolor",
      "Revisaré la fuerza, los reflejos y la sensibilidad de tus brazos",
      "Valoraré estudios de imagen si tu caso los requiere",
    ],
    byFlag: {
      "radicular-cervical":
        "Buscaré el origen exacto del dolor que baja por tu brazo",
      mielopatia:
        "Exploraré con detalle la función de tus manos, tus reflejos y tu marcha — los datos que marcaste son importantes y merecen una revisión neurológica cuidadosa.",
      trauma: "Descartaré lesiones por el accidente que mencionaste",
    },
  },
  "espalda-alta": {
    base: [
      "Exploraré tu columna dorsal y las posturas o movimientos que despiertan el dolor",
      "Revisaré la fuerza y los reflejos de tus piernas",
      "Valoraré estudios de imagen — en esta zona suelen ser especialmente útiles",
    ],
    byFlag: {
      "banda-dorsal":
        "Evaluaré el trayecto del dolor que rodea hacia tu pecho",
      "deficit-dorsal":
        "Exploraré a fondo la fuerza y los reflejos de tus piernas — ese dato guiará tu valoración.",
      trauma: "Descartaré una fractura vertebral por el golpe que mencionaste",
    },
  },
  "espalda-baja": {
    base: [
      "Revisaré cómo se mueve tu columna y qué movimientos despiertan tu dolor",
      "Evaluaré la fuerza de tus piernas y cómo responden tus reflejos",
      "Valoraré si tu caso necesita estudios de imagen y cuáles",
    ],
    byFlag: {
      radicular: "Buscaré el origen exacto del dolor que baja por tu pierna",
      claudicacion:
        "Mediré cuánto puedes caminar antes de que el dolor te detenga — un dato clave en tu caso",
    },
  },
  cadera: {
    base: [
      "Exploraré los movimientos de tu cadera para localizar el origen del dolor",
      "Revisaré tu forma de caminar",
      "Valoraré estudios de imagen si tu caso los requiere",
    ],
    byFlag: {
      trauma: "Descartaré una lesión en el hueso por el golpe que mencionaste",
    },
  },
  rodilla: {
    base: [
      "Exploraré tu rodilla con maniobras específicas de meniscos y ligamentos",
      "Revisaré su estabilidad y su movilidad",
      "Valoraré estudios de imagen si se requieren",
    ],
    byFlag: {
      inestabilidad: "Buscaré la causa de que se trabe o se doble",
      trauma: "Descartaré una lesión en el hueso por el golpe que mencionaste",
    },
  },
  hombro: {
    base: [
      "Exploraré los movimientos de tu hombro con maniobras específicas del manguito rotador",
      "Revisaré tu fuerza para elevar y rotar el brazo",
      "Valoraré estudios de imagen si tu caso los requiere",
    ],
    byFlag: {
      manguito:
        "Pondré especial atención a la pérdida de fuerza que notaste tras el esfuerzo",
      "origen-cervical":
        "Revisaré también tu cuello: parte del dolor de hombro puede originarse ahí",
      trauma: "Descartaré una lesión en el hueso por el golpe que mencionaste",
    },
  },
  codo: {
    base: [
      "Exploraré la movilidad completa de tu codo y los puntos exactos donde duele",
      "Evaluaré la fuerza de tu brazo y antebrazo",
      "Valoraré estudios de imagen si se requieren",
    ],
    byFlag: {
      cubital: "Revisaré el nervio que causa el hormigueo en tus dedos",
      trauma: "Descartaré una lesión en el hueso por el golpe que mencionaste",
    },
  },
  muneca: {
    base: [
      "Exploraré tu muñeca y tu mano: movilidad, fuerza de puño y puntos de dolor",
      "Revisaré la función de tus nervios y tendones",
      "Valoraré estudios de imagen si se requieren",
    ],
    byFlag: {
      mediano: "Evaluaré el nervio que provoca el hormigueo nocturno",
      trauma: "Descartaré una fractura por la caída que mencionaste",
    },
  },
};

/** Bullets de "Qué debe evaluarse en tu caso": base por zona + condicionales por flag. */
export function getEvaluationPlan(result: EvaluationResult): string[] {
  const plan = EVALUATION_PLANS[result.test.zoneId];
  if (!plan) return [];
  const extras = plan.byFlag
    ? Object.entries(plan.byFlag)
        .filter(([flag]) => result.flags.includes(flag))
        .map(([, text]) => text)
    : [];
  return [...plan.base, ...extras];
}

const WARNING_SIGNS: Record<string, string[]> = {
  cuello: [
    "Torpeza en las manos o inestabilidad que empeora rápidamente",
    "Debilidad nueva en un brazo o una mano",
    "Fiebre junto con el dolor de cuello",
  ],
  "espalda-alta": [
    "Debilidad o torpeza nueva en las piernas",
    "Dificultad nueva para controlar la orina o el excremento",
    "Fiebre junto con el dolor de espalda",
  ],
  "espalda-baja": [
    "Debilidad nueva o creciente en el pie o la pierna",
    "Adormecimiento en la zona genital o dificultad nueva para controlar la orina o el excremento",
    "Fiebre junto con el dolor de espalda",
  ],
  cadera: [
    "Imposibilidad repentina de apoyar la pierna",
    "Deformidad visible o acortamiento de la pierna tras un golpe",
    "Fiebre junto con dolor de cadera",
  ],
  rodilla: [
    "Imposibilidad de apoyar o de estirar la rodilla",
    "Hinchazón súbita e importante",
    "Fiebre con la rodilla caliente y enrojecida",
  ],
  hombro: [
    "Deformidad visible del hombro tras un golpe o caída",
    "Incapacidad total para mover el brazo",
    "Fiebre con el hombro caliente e hinchado",
  ],
  codo: [
    "Deformidad visible del codo",
    "Imposibilidad de doblar o estirar el codo",
    "Fiebre con el codo caliente e hinchado",
  ],
  muneca: [
    "Deformidad visible tras una caída",
    "Dedos fríos, pálidos o amoratados",
    "Fiebre con hinchazón de la muñeca o la mano",
  ],
};

/** Bullets de "Señales para no esperar tu cita" por zona. */
export function getWarningSigns(result: EvaluationResult): string[] {
  return WARNING_SIGNS[result.test.zoneId] ?? [];
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
  const { raw, interval, score } = computeScore(
    test.scoring,
    answers,
    test.questions
  );
  const level = levelFromScore(score, test.scoring.levels ?? DEFAULT_LEVELS);

  // "Marcaste:" = alarma universal + flags de triaje de precaución, en ese orden.
  const alertMarks = [
    ...RED_FLAGS.filter((rf) => flags.includes(rf.id)).map((rf) => rf.label),
    ...flags
      .filter((f) => CAUTION_FLAGS.has(f))
      .map((f) => test.flagLabels?.[f])
      .filter((label): label is string => Boolean(label)),
  ];
  const alertLevel: AlertLevel = flags.some((f) => f in URGENT_FLAG_BANNERS)
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
