/**
 * PASO 2 de F3.A — cada test se parte en dos:
 *  - TestStructure: la LÓGICA, independiente del locale (ids, kind de pregunta,
 *    values de options, scoring, umbrales, acciones de triaje, aggregation,
 *    applyGradient, resultDisplay, minAnswered, estimatedMinutes, itemIds de
 *    dominios).
 *  - TestContent: TODO el TEXTO, por locale (zoneLabel, instrumentName,
 *    instrumentCitation, questionNoun, instructions, flagLabels, labels y
 *    examples de dominios, semaphoreTitle, domainPhrases propia, textos y labels
 *    de triaje, text/shortLabel/contextHeader/mirrorPhrase/anchors/labels de
 *    opciones de cada pregunta, y reportTexts).
 *
 * assembleTest(structure, content) reconstruye el TestDefinition que el motor ya
 * consume: así types.ts (del motor) y engine.ts casi no cambian.
 */

import type {
  DomainAggregation,
  DomainId,
  DomainPhrases,
  QuestionKind,
  QuestionNoun,
  ReportTexts,
  ResultDisplay,
  ScaleAnchors,
  Scoring,
  TriageAction,
  ZoneId,
} from "../types";

/* ============================ ESTRUCTURA (lógica) ========================= */

/** Reactivo: lógica. Los labels de opciones y anchors viven en el contenido. */
export type QuestionStructure = {
  id: string;
  /** Tipo de reactivo; default 'options'. */
  kind?: QuestionKind;
  /** Solo 'options': valores puntuables, en orden (labels en el contenido). */
  optionValues?: number[];
  /** Ofrece "No aplica" (FAAM). */
  allowNA?: boolean;
};

/** Opción de triaje: solo la acción (el label vive en el contenido). */
export type TriageOptionStructure = { action: TriageAction };

/** Pregunta de triaje: id + acciones de sus opciones (texto en el contenido). */
export type TriageStructure = {
  id: string;
  options: TriageOptionStructure[];
};

/** Dominio del semáforo: id + ítems + agregación (label/examples en contenido). */
export type DomainStructure = {
  id: DomainId;
  itemIds: string[];
  aggregation?: DomainAggregation;
};

export type TestStructure = {
  id: string;
  zoneId: ZoneId;
  estimatedMinutes: number;
  resultDisplay?: ResultDisplay;
  minAnswered?: number;
  domainThresholds?: [number, number, number];
  applyGradient?: boolean;
  triage: TriageStructure[];
  questions: QuestionStructure[];
  domains?: DomainStructure[];
  scoring: Scoring;
};

/* ============================= CONTENIDO (texto) ========================== */

/** Texto de un reactivo. optionLabels va en paralelo a optionValues. */
export type QuestionContent = {
  text: string;
  shortLabel: string;
  contextHeader?: string;
  mirrorPhrase?: string;
  /** Solo 'scale': anclas de los extremos (0-10). */
  anchors?: ScaleAnchors;
  /** Solo 'options': labels en el MISMO orden que optionValues. */
  optionLabels?: string[];
};

/** Texto de una pregunta de triaje. optionLabels en paralelo a las acciones. */
export type TriageContent = {
  text: string;
  optionLabels: string[];
  /** Texto para el reporte urgente si esta pregunta escala a urgente. */
  urgentReason?: string;
};

/** Texto de un dominio del semáforo. */
export type DomainContent = { label: string; examples: string };

export type TestContent = {
  zoneLabel: string;
  instrumentName: string;
  instrumentCitation: string;
  questionNoun?: QuestionNoun;
  instructions?: string;
  semaphoreTitle?: string;
  flagLabels?: Record<string, string>;
  /** Matriz de frases propia del test; sobrescribe la global por dominio. */
  domainPhrases?: DomainPhrases;
  /** Texto por id de pregunta. */
  questions: Record<string, QuestionContent>;
  /** Texto por id de pregunta de triaje. */
  triage: Record<string, TriageContent>;
  /** Texto por id de dominio. */
  domains?: Record<string, DomainContent>;
  reportTexts: ReportTexts;
};
