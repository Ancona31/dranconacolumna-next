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
  options: QuestionOption[];
};

/** Acción de una opción de triaje. */
export type TriageAction =
  | "continue"
  | "urgent"
  | `flag:${string}`
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

export type Scoring = {
  /** Tabla oficial raw (suma de valores) → intervalo de salud 0-100. */
  rawToInterval: Record<number, number>;
  levels: ScoringLevels;
  /**
   * Reservado. Los flags ya NO escalan el nivel funcional (el score y la pill
   * nunca cambian por flags). Se mantiene por compatibilidad; normalmente [].
   */
  escalationFlags?: string[];
};

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
