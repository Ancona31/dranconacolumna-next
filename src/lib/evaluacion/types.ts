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

/**
 * Opción de una pregunta puntuable. `value` no asume enteros: los instrumentos
 * que reparten 5 opciones sobre una escala 0-10 usan 0 / 2.5 / 5 / 7.5 / 10.
 */
export type QuestionOption = { label: string; value: number };

/**
 * Clave del bloque de recomendación: el nivel funcional cuando no hay alerta, o
 * el propio nivel de alerta cuando lo hay (precaución/urgente lo sobrescriben).
 */
export type RecommendationKey = NonUrgentLevel | "precaucion" | "urgente";

/**
 * Bloque de recomendación de cierre. La ventana temporal (`window`) es el
 * titular; `context` la justifica. Mismo contenido en pantalla y PDF.
 *
 * El color NO depende del nivel funcional: la variante estándar es azul de
 * marca para leve, moderada, severa y precaución. Solo `urgent` cambia la
 * paleta (coral) y el icono. Ver RECOMMENDATION_COLORS.
 */
export type Recommendation = {
  /** Eyebrow del bloque (mayúsculas, tracking amplio). */
  label: string;
  /** Ventana de atención recomendada. Titular del bloque. */
  window: string;
  /** Frase que justifica la ventana. */
  context: string;
  /** true solo con alertLevel 'urgente'; selecciona paleta e icono. */
  urgent: boolean;
};

/** Tipo de reactivo. 'options' (default): botones etiquetados. 'scale': 0-10. */
export type QuestionKind = "options" | "scale";

/** Anclas de los extremos de una escala numérica (bajo el 0 y bajo el 10). */
export type ScaleAnchors = { min: string; max: string };

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
  /** Tipo de reactivo; default 'options'. */
  kind?: QuestionKind;
  /** Solo 'options': opciones puntuables. */
  options?: QuestionOption[];
  /** Solo 'scale': anclas de los extremos (0-10). */
  anchors?: ScaleAnchors;
  /**
   * Ofrece "No aplica" bajo las opciones (respuesta `null`). Es la opción
   * oficial de los instrumentos que la contemplan (FAAM): el ítem sale del
   * denominador en vez de puntuar 0.
   */
  allowNA?: boolean;
};

/** Estado del semáforo (4 matices). */
export type FuncState = "verde" | "amarillo" | "naranja" | "rojo";

/**
 * Estado de la tarjeta de dominio: los 4 matices del semáforo, o 'na' cuando
 * ningún ítem del dominio fue respondido (todos marcados "No aplica").
 */
export type DomainState = FuncState | "na";

/**
 * Id de dominio del semáforo. Los tests de actividades usan la tríada funcional
 * ("basicas" / "moderadas" / "demandantes"); los multidimensionales (COMI) usan
 * sus propias dimensiones ("dolor" / "actividades" / "bienestar").
 */
export type DomainId = string;

/**
 * Matriz de frases estado × dominio. El marcador {ej} se sustituye por el
 * fragmento de ejemplos (verde nunca lo lleva).
 */
export type DomainPhrases = Record<FuncState, Record<DomainId, string>>;

/** Cómo se agrega el valor del dominio a partir de sus ítems; default 'mean'. */
export type DomainAggregation = "mean" | "max";

/** Dominio del semáforo (actividad funcional o dimensión del instrumento). */
export type Domain = {
  id: DomainId;
  label: string;
  /** Ejemplos en lenguaje del paciente (línea gris de la tarjeta). */
  examples: string;
  /** Ítems (question ids) que puntúan este dominio. */
  itemIds: string[];
  /**
   * Agregación de los ítems para derivar el estado; default 'mean'. 'max' es la
   * forma correcta cuando el dominio mide intensidad y no promedio (p. ej. el
   * dolor del COMI: manda el peor de los dos sitios).
   */
  aggregation?: DomainAggregation;
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
 * Subescala ponderada: suma de sus ítems normalizada por `maxRaw`, escalada por
 * `weight` (fracción del score total). id/itemIds identifican los reactivos.
 */
export type Subscale = {
  id: string;
  itemIds: string[];
  maxRaw: number;
  weight: number;
};

/**
 * Cinco formas de derivar el score (índice de limitación 0-100):
 * - 'table': tabla oficial indexada por raw (raw 0..N → table[raw] = salud).
 * - 'linear': interval = 100 − (raw / maxRaw) * 100.
 * - 'linear-adaptive': denominador adaptativo — solo los ítems respondidos.
 * - 'weighted-subscales': score = round( Σ (sumaÍtems/maxRaw) * weight * 100 ).
 * - 'comi': índice multidimensional 0-10 escalado a 0-100 (ver abajo).
 *   Con direction 'higher-is-worse' la limitación es el score directo (SIN la
 *   inversión 100−x de las tablas). table/linear son 'higher-is-better'
 *   implícitas (limitación = 100 − interval).
 * En todas: si se omite `levels`, el motor usa los cortes por defecto 30 / 60.
 */
export type Scoring =
  | { kind: "table"; table: number[]; levels?: ScoringLevels }
  | { kind: "linear"; maxRaw: number; levels?: ScoringLevels }
  /**
   * Denominador adaptativo (FAAM): los ítems marcados "No aplica" salen del
   * cálculo en vez de puntuar 0.
   *   limitación = round( sumaRespondidos / (perItemMax × respondidos) × 100 )
   * Más = peor (higher-is-worse: sin inversión). Con 0 respondidos el resultado
   * no es puntuable (`unscorable`).
   */
  | { kind: "linear-adaptive"; perItemMax: number; levels?: ScoringLevels }
  | {
      kind: "weighted-subscales";
      direction: "higher-is-worse";
      subscales: Subscale[];
      levels?: ScoringLevels;
    }
  /**
   * COMI (Core Outcome Measures Index): cinco dominios en escala 0-10, cada uno
   * con el mismo peso. El dolor toma el PEOR de sus dos sitios; la discapacidad
   * promedia sus dos ítems. score = round( media de los 5 dominios × 10 ).
   * 0-100, más = peor (higher-is-worse: sin inversión).
   */
  | {
      kind: "comi";
      /** Los dos sitios de dolor; el dominio toma el máximo. */
      painItems: [string, string];
      functionItem: string;
      wellbeingItem: string;
      qolItem: string;
      /** Los dos ítems de discapacidad; el dominio toma su promedio. */
      disabilityItems: [string, string];
      levels?: ScoringLevels;
    };

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
   * Mínimo de ítems respondidos para que el resultado sea plenamente válido
   * según el instrumento. Por debajo, el score se calcula igual (denominador
   * adaptativo) pero se etiqueta como orientativo en pantalla y PDF.
   */
  minAnswered?: number;
  /**
   * Línea de contexto opcional mostrada antes del instrumento (en AlarmScreen).
   * Ej.: instrucción de estimación para actividades que el paciente no realiza.
   */
  instructions?: string;
  /**
   * Umbrales del promedio para el semáforo por dominio:
   * verde < t0 · amarillo < t1 · naranja < t2 · rojo ≥ t2. El segundo umbral (t1)
   * es además el mínimo para que un ítem aporte su mirrorPhrase. Default [1,2,3]
   * (instrumentos 0-4); los tests de escala 0-10 usan [2.5, 5, 7.5].
   */
  domainThresholds?: [number, number, number];
  /**
   * Frase legible de cada flag del test. Los informativos aparecen en "Datos
   * adicionales de tus respuestas" y NO afectan nivel ni alerta; los de triaje
   * declarados en CAUTION_FLAGS toman su texto de aquí para la lista "Marcaste:"
   * del banner de precaución. Ninguno cambia jamás el nivel funcional.
   */
  flagLabels?: Record<string, string>;
  /** Dominios del semáforo (actividades funcionales o dimensiones del instrumento). */
  domains?: Domain[];
  /**
   * Título de la sección del semáforo; default "Tu capacidad hoy, según tus
   * respuestas". Los tests de dimensiones (COMI) no miden capacidad, sino
   * afectación: usan su propio título.
   */
  semaphoreTitle?: string;
  /**
   * Gradiente funcional: eleva cada dominio al estado del anterior, en el orden
   * del arreglo `domains` (ligeras → demandantes). Default true. Los tests de
   * dimensiones lo desactivan: dolor, actividades y bienestar no se ordenan por
   * exigencia, y un estado no implica el siguiente.
   */
  applyGradient?: boolean;
  /** Matriz de frases propia del test; sobrescribe la matriz global por dominio. */
  domainPhrases?: DomainPhrases;
  triage: TriageQuestion[];
  questions: TestQuestion[];
  scoring: Scoring;
  reportTexts: ReportTexts;
};

export type RedFlag = { id: string; label: string };

/** questionId → value elegido; `null` = el paciente marcó "No aplica". */
export type AnswerMap = Record<string, number | null>;

export type BreakdownItem = { shortLabel: string; value: number | null };

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
  /** Ítems con respuesta puntuable (los "No aplica" no cuentan). */
  answeredCount: number;
  /**
   * true cuando no quedó ningún ítem puntuable: score, interval y level no
   * significan nada y no deben mostrarse.
   */
  unscorable: boolean;
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
