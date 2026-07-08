import type { BodyZoneId } from "@/components/home/BodyFigureSVG";

/** Reutiliza los ids de zona de la figura corporal. */
export type ZoneId = BodyZoneId;

export type Severity = "leve" | "moderada" | "severa" | "urgente";
export type NonUrgentLevel = Exclude<Severity, "urgente">;

/**
 * Nivel de alerta, independiente del nivel funcional (score). Los flags nunca
 * cambian el score ni la pill de nivel: solo modulan la alerta y la recomendación.
 */
export type AlertLevel = "none" | "precaucion" | "urgente";

/** Opción de una pregunta puntuable (value 0-4). */
export type QuestionOption = { label: string; value: number };

export type TestQuestion = {
  id: string;
  text: string;
  shortLabel: string;
  /** Encabezado de contexto agrupador (p. ej. "Durante la última semana…"). */
  contextHeader?: string;
  /**
   * Paráfrasis en lenguaje del paciente (NUNCA el texto del reactivo). Se usa
   * como "espejo" en el semáforo funcional cuando el ítem está afectado.
   */
  mirrorPhrase?: string;
  options: QuestionOption[];
};

/** Dominio funcional del semáforo. */
export type DomainId = "basicas" | "moderadas" | "demandantes";

export type Domain = {
  id: DomainId;
  label: string;
  /** Ejemplos en lenguaje del paciente (línea gris de la tarjeta). */
  examples: string;
  /** Ítems (question ids) que puntúan este dominio. */
  itemIds: string[];
};

/**
 * Acción de una opción de triaje.
 * - "continue": termina el triaje y pasa al test (rama terminal).
 * - "next": avanza a la siguiente pregunta del triaje por orden de arreglo.
 * - "flag:X": registra el flag X y termina el triaje (rama terminal con flag).
 * - "flag-next:X": registra el flag X y avanza a la siguiente pregunta.
 * - "goto:Y": salta a la pregunta con id Y.
 */
export type TriageAction =
  | "continue"
  | "next"
  | "urgent"
  | `flag:${string}`
  | `flag-next:${string}`
  | `goto:${string}`;

export type TriageOption = { label: string; action: TriageAction };

export type TriageQuestion = {
  id: string;
  text: string;
  options: TriageOption[];
  /** Texto que aparece en el reporte urgente si esta pregunta escala a urgente. */
  urgentReason?: string;
};

export type ScoringLevels = {
  /** Índice de limitación máximo para "leve". */
  leveMax: number;
  /** Índice de limitación máximo para "moderada". */
  moderadaMax: number;
};

/**
 * Dos formas de convertir el raw (suma de valores) a intervalo de salud 0-100:
 * - 'table': tabla oficial indexada por raw (raw 0..N → table[raw]).
 * - 'linear': interval = 100 − (raw / maxRaw) * 100.
 * En ambas: limitación = 100 − interval (redondeado). Si se omite `levels`,
 * el motor usa los cortes por defecto 30 / 60.
 */
export type Scoring =
  | { kind: "table"; table: number[]; levels?: ScoringLevels }
  | { kind: "linear"; maxRaw: number; levels?: ScoringLevels };

/** Presentación del desglose de resultado. 'checklist' para instrumentos Sí/No. */
export type ResultDisplay = "bars" | "checklist";

/** Sustantivo del ítem para encabezados de progreso (default "pregunta"). */
export type QuestionNoun = { singular: string; plural: string };

export type ReportTexts = {
  leve: string[];
  moderada: string[];
  severa: string[];
};

export type TestDefinition = {
  id: string;
  zoneId: ZoneId;
  zoneLabel: string;
  instrumentName: string;
  instrumentCitation: string;
  estimatedMinutes: number;
  /** Presentación del resultado; default 'bars'. */
  resultDisplay?: ResultDisplay;
  /** Sustantivo del ítem en los encabezados; default {singular:"pregunta", plural:"preguntas"}. */
  questionNoun?: QuestionNoun;
  /**
   * Frase legible de cada flag informativo del test. Los flags presentes aquí
   * aparecen en "Datos adicionales de tus respuestas" y NO afectan nivel ni alerta.
   */
  flagLabels?: Record<string, string>;
  /** Dominios funcionales del semáforo (básicas / moderadas / demandantes). */
  domains?: Domain[];
  triage: TriageQuestion[];
  questions: TestQuestion[];
  scoring: Scoring;
  reportTexts: ReportTexts;
};

export type RedFlag = { id: string; label: string };

/** questionId → value elegido. */
export type AnswerMap = Record<string, number>;

export type BreakdownItem = { shortLabel: string; value: number };

export type EvaluationResult = {
  test: TestDefinition;
  folio: string;
  zoneLabel: string;
  /** Índice de limitación 0-100 (100 = máxima limitación). */
  score: number;
  /** Intervalo de salud oficial (100 = salud perfecta). */
  interval: number;
  raw: number;
  /** Nivel funcional por la tabla; NUNCA cambia por flags. */
  level: NonUrgentLevel;
  answers: AnswerMap;
  flags: string[];
  /** Nivel de alerta derivado de los flags (independiente del score). */
  alertLevel: AlertLevel;
  /** Textos literales de los datos de alarma universal que marcó el paciente. */
  alertMarks: string[];
  breakdown: BreakdownItem[];
  whatsappMessage: string;
  createdAt: Date;
};
