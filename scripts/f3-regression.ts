/**
 * HARNESS DE REGRESIÓN — FASE 3 (F3.A)
 *
 * Contrato de comportamiento del motor de evaluación en español. Ejecuta juegos
 * de respuestas DETERMINISTAS (escritos a mano) contra los 9 tests y serializa
 * TODO lo observable: score, nivel, dominios, banners, recomendación, plan,
 * señales, mensajes de WhatsApp (pantalla/QR) y las notas transversales.
 *
 * El folio (aleatorio) y createdAt (fecha) NO se serializan tal cual: el folio
 * se normaliza a "FOLIO" allí donde aparece, para que la salida sea 100%
 * reproducible y comparable entre pre- y post-refactor.
 *
 * Cobertura por test (task PASO 0):
 *  a) todas las respuestas en mínimo
 *  b) todas en máximo
 *  c) un caso intermedio mixto (determinista)
 *  d) FAAM/tobillo: caso con varios "No aplica" (orientativo) y caso unscorable
 *  e) un caso de flags que produce precaución y otro urgente (donde el test lo
 *     permite; cuello no tiene rama urgente y por diseño se omite)
 *
 * No se ejecuta solo: lo invoca scripts/run-f3.mjs con jiti (el entorno no tiene
 * tsx ni ts-node). Exporta runHarness() y stableStringify().
 */

import {
  allDomainsGreen,
  buildAlertBanner,
  buildWhatsAppMessage,
  computeDomains,
  computeResult,
  getEvaluationPlan,
  getInfoFlagLabels,
  getMarkedItems,
  getPartialAnswersNote,
  getRecommendation,
  getSemaphoreTitle,
  getVentanaCorta,
  getWarningSigns,
} from "@/lib/evaluacion/engine";
import { AVAILABLE_ZONES, getTest } from "@/lib/evaluacion/tests/index";
import type { AnswerMap, TestDefinition, TestQuestion } from "@/lib/evaluacion/types";

/** Valor máximo puntuable de un ítem según su tipo. */
function maxValueFor(q: TestQuestion): number {
  if (q.kind === "scale") return 10;
  const vals = (q.options ?? []).map((o) => o.value);
  return vals.length ? Math.max(...vals) : 0;
}

/** Todas las respuestas en el mínimo (0). */
function minAnswers(test: TestDefinition): AnswerMap {
  return Object.fromEntries(test.questions.map((q) => [q.id, 0]));
}

/** Todas las respuestas en el máximo puntuable. */
function maxAnswers(test: TestDefinition): AnswerMap {
  return Object.fromEntries(test.questions.map((q) => [q.id, maxValueFor(q)]));
}

/**
 * Caso intermedio DETERMINISTA. Escalas 0-10: (i*3) % 11. Opciones: cicla por el
 * arreglo de valores del propio ítem. Da variedad de estados de dominio sin
 * aleatoriedad — misma salida en cada corrida.
 */
function mixedAnswers(test: TestDefinition): AnswerMap {
  return Object.fromEntries(
    test.questions.map((q, i) => {
      if (q.kind === "scale") return [q.id, (i * 3) % 11];
      const vals = (q.options ?? []).map((o) => o.value);
      return [q.id, vals.length ? vals[i % vals.length] : 0];
    })
  );
}

/** Flags de triaje que llevan a PRECAUCIÓN por test (RED universal o CAUTION). */
const CAUTION_FLAGS_BY_ZONE: Record<string, string[]> = {
  cadera: ["dolor-nocturno"],
  codo: ["dolor-nocturno", "cubital"],
  cuello: ["mielopatia", "radicular-cervical"],
  "espalda-alta": ["deficit-dorsal", "banda-dorsal"],
  "espalda-baja": ["fiebre", "radicular"],
  hombro: ["fiebre", "manguito"],
  muneca: ["perdida-peso", "mediano"],
  rodilla: ["fiebre", "inestabilidad"],
  tobillo: ["inflamacion-aguda", "trauma"],
};

/** Flags de triaje que llevan a URGENTE por test; null si el test no lo permite. */
const URGENT_FLAGS_BY_ZONE: Record<string, string[] | null> = {
  cadera: ["urgente-trauma"],
  codo: ["urgente-trauma"],
  cuello: null, // el COMI-neck no tiene rama urgente por diseño
  "espalda-alta": ["urgente-neurologico-dorsal"],
  "espalda-baja": ["urgente-neurologico", "radicular"],
  hombro: ["urgente-trauma", "origen-cervical"],
  muneca: ["urgente-trauma", "mediano"],
  rodilla: ["urgente-trauma", "inestabilidad"],
  tobillo: ["urgente-trauma"],
};

type Case = { answers: AnswerMap; flags: string[] };

/** Casos de un test (todas las zonas comparten los 5 base; tobillo añade 2). */
function casesFor(zone: string, test: TestDefinition): Record<string, Case> {
  const mixed = mixedAnswers(test);
  const cases: Record<string, Case> = {
    min: { answers: minAnswers(test), flags: [] },
    max: { answers: maxAnswers(test), flags: [] },
    mixed: { answers: mixed, flags: [] },
    caution: { answers: mixed, flags: CAUTION_FLAGS_BY_ZONE[zone] ?? [] },
  };
  const urgent = URGENT_FLAGS_BY_ZONE[zone];
  if (urgent) cases.urgent = { answers: mixed, flags: urgent };

  if (zone === "tobillo") {
    // d) FAAM: varios "No aplica" (16 respondidas < 19 → orientativo) y todo NA.
    const naSome: AnswerMap = { ...mixed };
    for (const id of ["q1", "q2", "q3", "q4", "q5"]) naSome[id] = null;
    cases.naPartial = { answers: naSome, flags: [] };
    const naAll: AnswerMap = Object.fromEntries(
      test.questions.map((q) => [q.id, null])
    );
    cases.naUnscorable = { answers: naAll, flags: [] };
  }
  return cases;
}

/** Serializa TODO lo observable de un caso, con el folio normalizado. */
function serializeCase(test: TestDefinition, c: Case) {
  const result = computeResult(test, c.answers, c.flags);
  const domains = computeDomains(test, c.answers);
  const norm = (s: string) => s.split(result.folio).join("FOLIO");

  const waCommon = {
    zoneLabel: result.zoneLabel,
    folio: result.folio,
    level: result.level,
    score: result.score,
    alertLevel: result.alertLevel,
  };

  return {
    score: result.score,
    interval: result.interval,
    raw: result.raw,
    level: result.level,
    answeredCount: result.answeredCount,
    unscorable: result.unscorable,
    alertLevel: result.alertLevel,
    alertMarks: result.alertMarks,
    breakdown: result.breakdown,
    domains: domains.map((d) => ({
      id: d.id,
      state: d.state,
      na: d.state === "na",
      elevated: d.elevated,
      mirrors: d.mirrors,
      fullPhrase: d.fullPhrase,
    })),
    whatsappMessage: norm(result.whatsappMessage),
    whatsappQr: norm(buildWhatsAppMessage({ ...waCommon, variant: "qr" })),
    whatsappQrShort: norm(
      buildWhatsAppMessage({ ...waCommon, variant: "qr-short" })
    ),
    ventanaCorta: getVentanaCorta(result),
    banner: buildAlertBanner(result),
    recommendation: getRecommendation(result.level, result.alertLevel),
    plan: getEvaluationPlan(result),
    señales: getWarningSigns(result),
    partialNote: getPartialAnswersNote(result),
    semaphoreTitle: getSemaphoreTitle(test),
    allGreen: allDomainsGreen(domains),
    infoFlags: getInfoFlagLabels(result),
    markedItems: getMarkedItems(result),
  };
}

/** Ejecuta el harness completo y devuelve el objeto por zona → caso → salida. */
export function runHarness() {
  const zones = [...AVAILABLE_ZONES].sort();
  const out: Record<string, Record<string, unknown>> = {};
  for (const zone of zones) {
    const test = getTest(zone, "es");
    if (!test) continue;
    const cases = casesFor(zone, test);
    out[zone] = {};
    for (const [name, c] of Object.entries(cases)) {
      out[zone][name] = serializeCase(test, c);
    }
  }
  return out;
}

/**
 * JSON con claves ordenadas recursivamente: el diff refleja solo cambios de
 * valor. La detección de ciclos es por CAMINO (ancestros), no global: dos
 * referencias hermanas al mismo objeto (p. ej. un arreglo de opciones
 * compartido entre preguntas, o la lista de señales reutilizada entre casos) se
 * serializan completas — solo un ciclo real (un ancestro repetido) se corta.
 */
export function stableStringify(value: unknown): string {
  const sort = (v: unknown, ancestors: Set<object>): unknown => {
    if (v === null || typeof v !== "object") return v;
    if (ancestors.has(v as object)) return undefined; // ciclo real
    const next = new Set(ancestors);
    next.add(v as object);
    if (Array.isArray(v)) return v.map((x) => sort(x, next));
    const obj = v as Record<string, unknown>;
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = sort(obj[k], next);
        return acc;
      }, {});
  };
  return JSON.stringify(sort(value, new Set()), null, 2);
}
