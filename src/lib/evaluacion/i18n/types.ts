/**
 * Contrato de TODA la copy transversal del motor de evaluación, por locale.
 *
 * "Transversal" = texto que NO pertenece a un test concreto sino al motor: la
 * matriz de recomendación, las definiciones de nivel, el semáforo funcional
 * (etiquetas, matriz global de frases, frases de gradiente, na/unscorable), los
 * banners de alerta (urgentes por flag y por zona, precaución), los planes de
 * "qué debe evaluarse" y las "señales para no esperar", y las plantillas de los
 * mensajes de WhatsApp.
 *
 * Las PALETAS DE COLOR no viven aquí: no son texto (ver FUNC_COLORS,
 * NIVEL_BADGE_COLORS y RECOMMENDATION_COLORS en engine.ts).
 *
 * Los textos PROPIOS de cada test (zoneLabel, instrumentName, preguntas,
 * reportTexts, flagLabels, domainPhrases propia, etc.) tampoco viven aquí: son
 * contenido por test y se parametrizan en el PASO 2.
 */

import type {
  DomainPhrases,
  DomainState,
  FuncState,
  NonUrgentLevel,
  RecommendationKey,
} from "../types";

/** Ventana + contexto de una entrada de la matriz de recomendación. */
export interface RecommendationCopy {
  window: string;
  context: string;
}

/** Título + cuerpo de un banner de alerta. */
export interface BannerCopy {
  title: string;
  body: string;
}

/** Plan de "qué debe evaluarse": base por zona + condicionales por flag. */
export interface EvaluationPlanCopy {
  base: string[];
  byFlag?: Record<string, string>;
}

export interface EngineCopy {
  /* ----------------------------- Recomendación ---------------------------- */
  /** Eyebrow del bloque de recomendación (mayúsculas). */
  recommendationEyebrow: string;
  /** Matriz por nivel funcional o —si hay alerta— por nivel de alerta. */
  recommendations: Record<RecommendationKey, RecommendationCopy>;

  /* ------------------------- Definiciones de nivel ------------------------ */
  nivelDefinitions: Record<NonUrgentLevel, string>;

  /* ---------------------- Semáforo funcional por dominio ------------------ */
  funcStateLabels: Record<DomainState, string>;
  /** Frase de la tarjeta gris (dominio fuera del cálculo). */
  domainNaPhrase: string;
  /** Mensaje cuando todos los ítems se marcaron "No aplica". */
  unscorableMessage: string;
  /** Línea global cuando los tres dominios salen verdes. */
  funcAllGreenLine: string;
  /** Título de la sección del semáforo cuando el test no define el suyo. */
  defaultSemaphoreTitle: string;
  /** Matriz global 4×3 (estado × dominio de la tríada funcional). */
  domainPhrases: DomainPhrases;
  /** Frases para dominios elevados por el gradiente (verde es inalcanzable). */
  elevatedPhrases: Record<Exclude<FuncState, "verde">, string>;
  /** Encabezado del fragmento de ejemplos del semáforo (" — por ejemplo, "). */
  exampleLead: string;
  /** Conector entre las dos paráfrasis de ejemplo (" y "). */
  exampleJoin: string;

  /* -------------------------- Alarma universal ---------------------------- */
  /** Etiquetas de los datos de alarma universales, por id (ver RED_FLAGS). */
  redFlagLabels: Record<string, string>;
  /** Etiqueta de la opción exclusiva de "ninguna" (RED_FLAG_NONE_ID). */
  redFlagNoneLabel: string;

  /* ------------------------------ Banners --------------------------------- */
  /** Banner de urgencia por flag (lleva el alertLevel a 'urgente'). */
  urgentFlagBanners: Record<string, BannerCopy>;
  /** Banner de 'urgente-trauma' específico por zona (miembro superior). */
  urgentTraumaBannerByZone: Partial<Record<string, BannerCopy>>;
  /** Título del banner de precaución. */
  cautionBannerTitle: string;
  /** Cuerpo del banner de precaución, con la lista de datos marcados. */
  cautionBannerBody: (marks: string) => string;

  /* ------------------ "Qué debe evaluarse" / "Señales" -------------------- */
  /** Firma comercial única permitida fuera del CTA. */
  evaluationSignature: string;
  /** Cierre transversal de "Señales para no esperar tu cita". */
  warningClosing: string;
  /** Planes de "qué debe evaluarse" por zona. */
  evaluationPlans: Record<string, EvaluationPlanCopy>;
  /** "Señales para no esperar tu cita" por zona. */
  warningSigns: Record<string, string[]>;

  /* ----------------------- Nota de respuestas parciales ------------------- */
  /** Nota bajo el medidor cuando se respondió menos de `minAnswered`. */
  partialAnswersNote: (answered: number, total: number) => string;

  /* ------------------------------ WhatsApp -------------------------------- */
  whatsapp: {
    /** Ventana de atención compacta y sin acentos, por (nivel/alertLevel). */
    ventanaCorta: Record<
      "urgente" | "precaucion" | "severa" | "moderada" | "leve",
      string
    >;
    /** Variante 'qr-short': recorte de densidad del QR. */
    qrShort: (
      folio: string,
      score: number,
      level: NonUrgentLevel,
      ventana: string
    ) => string;
    /** Variante 'qr': mensaje del QR/Link del PDF (zona ya sin acentos). */
    qr: (
      zona: string,
      folio: string,
      score: number,
      level: NonUrgentLevel,
      ventana: string
    ) => string;
    /** Sufijo del QR cuando hay datos de alarma. */
    qrAlarmSuffix: string;
    /** Variante 'full' con alertLevel 'urgente'. */
    fullUrgente: (zoneLabel: string, folio: string) => string;
    /** Variante 'full' cuando el resultado es unscorable. */
    fullUnscorable: (zoneLabel: string, folio: string) => string;
    /** Variante 'full' base (scorable, sin urgencia). */
    fullBase: (
      zoneLabel: string,
      folio: string,
      level: NonUrgentLevel,
      score: number
    ) => string;
    /** Sufijo de la variante 'full' cuando hay precaución. */
    fullPrecaucionSuffix: string;
  };
}
