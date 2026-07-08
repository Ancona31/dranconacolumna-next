import { buildWhatsAppLink } from "@/lib/whatsapp";
import { RED_FLAGS } from "./red-flags";
import type {
  AlertLevel,
  AnswerMap,
  DomainId,
  EvaluationResult,
  NonUrgentLevel,
  Scoring,
  ScoringLevels,
  TestDefinition,
} from "./types";

/** Flag de urgencia (hoy solo: trauma sin poder apoyar el pie). */
export const URGENT_TRAUMA_FLAG = "urgente-trauma";
/** Flag informativo: trauma con apoyo. No cambia el nivel funcional. */
export const TRAUMA_FLAG = "trauma";

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
};

/**
 * MATRIZ DE RECOMENDACIÓN por nivel funcional (alertLevel 'none').
 * Comunica la ventana temporal recomendada, sin invitación de contacto: esa
 * vive ÚNICAMENTE en el CTA final y en la firma de "qué debe evaluarse".
 */
export const RECOMMENDATION_TEXTS: Record<NonUrgentLevel, string> = {
  leve: "Tu resultado no muestra datos de urgencia. Una valoración médica te dará un diagnóstico claro y un plan — lo recomendable es agendarla esta semana.",
  moderada:
    "Este nivel de limitación amerita valoración médica. Lo recomendable es agendarla en los próximos 3 días.",
  severa:
    "Tu resultado amerita valoración pronta: lo recomendable es agendarla dentro de las próximas 24 a 48 horas.",
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

function levelFromScore(score: number, levels: ScoringLevels): NonUrgentLevel {
  if (score <= levels.leveMax) return "leve";
  if (score <= levels.moderadaMax) return "moderada";
  return "severa";
}

/** Intervalo de salud 0-100 a partir del raw, según la forma de scoring. */
function intervalFromRaw(scoring: Scoring, raw: number): number {
  if (scoring.kind === "linear") {
    return 100 - (raw / scoring.maxRaw) * 100;
  }
  return scoring.table[raw] ?? 0;
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
    return "Lo indicado es valoración presencial hoy mismo, en un servicio de urgencias.";
  }
  if (alertLevel === "precaucion") {
    return "Además de tu nivel de limitación, los datos que marcaste ameritan valoración pronta: lo recomendable es agendarla en las próximas 24 a 48 horas.";
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
    const flag = result.flags.find((f) => f in URGENT_FLAG_BANNERS);
    const banner = URGENT_FLAG_BANNERS[flag ?? URGENT_TRAUMA_FLAG];
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
 * en `flagLabels`). No incluye flags de alarma/urgencia. Respeta el orden de
 * los flags acumulados.
 */
export function getInfoFlagLabels(result: EvaluationResult): string[] {
  const map = result.test.flagLabels;
  if (!map) return [];
  return result.flags.map((f) => map[f]).filter((label): label is string =>
    Boolean(label)
  );
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

export type FuncState = "verde" | "amarillo" | "naranja" | "rojo";

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
 * Matriz de 12 frases (estado × dominio). Cada dominio tiene voz propia en cada
 * estado, así dos dominios en el mismo estado nunca repiten texto. El marcador
 * {ej} se sustituye por el fragmento de ejemplos (verde nunca lo lleva).
 */
const DOMAIN_PHRASES: Record<FuncState, Record<DomainId, string>> = {
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

/** Frase de la matriz con los ejemplos ya incorporados. */
function domainPhrase(
  state: FuncState,
  domainId: DomainId,
  mirrors: string[]
): string {
  return DOMAIN_PHRASES[state][domainId].replace("{ej}", exampleFragment(mirrors));
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
 * Semáforo por dominio. 'bars' (0-4): estado por promedio; mirrors = ítems de
 * mayor valor (≥2). 'checklist' (Sí/No): estado por proporción de marcadas;
 * mirrors = hasta 2 marcadas en orden.
 *
 * Gradiente funcional: tras los estados brutos se eleva hacia dominios más
 * demandantes (basicas → moderadas → demandantes), nunca a la inversa.
 */
export function computeDomains(
  test: TestDefinition,
  answers: AnswerMap
): DomainResult[] {
  const domains = test.domains ?? [];
  const isChecklist = test.resultDisplay === "checklist";
  const byId = new Map(test.questions.map((q) => [q.id, q]));

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
      const avg =
        items.reduce((s, it) => s + it.value, 0) / (items.length || 1);
      rawState =
        avg < 1 ? "verde" : avg < 2 ? "amarillo" : avg < 3 ? "naranja" : "rojo";
      mirrorItems = [...items]
        .filter((it) => it.value >= 2)
        .sort((a, b) => b.value - a.value)
        .slice(0, 2);
    }

    const mirrors = mirrorItems
      .map((it) => it.q.mirrorPhrase)
      .filter((m): m is string => Boolean(m));

    return { domain, rawState, mirrors };
  });

  // 2. Gradiente funcional: elevar en orden basicas → moderadas → demandantes.
  const rawById = new Map(raw.map((r) => [r.domain.id, r.rawState]));
  const finalById = new Map<DomainId, FuncState>();
  const basicasFinal = rawById.get("basicas") ?? "verde";
  const moderadasFinal = maxState(rawById.get("moderadas") ?? "verde", basicasFinal);
  const demandantesFinal = maxState(
    rawById.get("demandantes") ?? "verde",
    moderadasFinal
  );
  finalById.set("basicas", basicasFinal);
  finalById.set("moderadas", moderadasFinal);
  finalById.set("demandantes", demandantesFinal);

  // 3. Construir resultados con estado final + elevated + frases.
  return raw.map(({ domain, rawState, mirrors }) => {
    const state = finalById.get(domain.id) ?? rawState;
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
        : domainPhrase(state, domain.id, usedMirrors),
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
  const raw = test.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
  const interval = intervalFromRaw(test.scoring, raw);
  const score = Math.round(100 - interval);
  const level = levelFromScore(score, test.scoring.levels ?? DEFAULT_LEVELS);

  const alertMarks = RED_FLAGS.filter((rf) => flags.includes(rf.id)).map(
    (rf) => rf.label
  );
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
