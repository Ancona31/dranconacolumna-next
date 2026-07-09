import type {
  DomainPhrases,
  QuestionOption,
  ScaleAnchors,
  TestDefinition,
  TestQuestion,
} from "@/lib/evaluacion/types";

const PAIN_ANCHORS: ScaleAnchors = {
  min: "Sin dolor",
  max: "El peor imaginable",
};

// Las cinco opciones del COMI reparten la escala 0-10 en pasos de 2.5.
const INTERFERENCE_OPTIONS: QuestionOption[] = [
  { label: "Nada", value: 0 },
  { label: "Un poco", value: 2.5 },
  { label: "Moderadamente", value: 5 },
  { label: "Mucho", value: 7.5 },
  { label: "Muchísimo", value: 10 },
];

const WELLBEING_OPTIONS: QuestionOption[] = [
  { label: "Muy satisfecho", value: 0 },
  { label: "Algo satisfecho", value: 2.5 },
  { label: "Ni satisfecho ni insatisfecho", value: 5 },
  { label: "Algo insatisfecho", value: 7.5 },
  { label: "Muy insatisfecho", value: 10 },
];

const QOL_OPTIONS: QuestionOption[] = [
  { label: "Muy buena", value: 0 },
  { label: "Buena", value: 2.5 },
  { label: "Regular", value: 5 },
  { label: "Mala", value: 7.5 },
  { label: "Muy mala", value: 10 },
];

const DAYS_OPTIONS: QuestionOption[] = [
  { label: "Ningún día", value: 0 },
  { label: "Entre 1 y 7", value: 2.5 },
  { label: "Entre 8 y 14", value: 5 },
  { label: "Entre 15 y 21", value: 7.5 },
  { label: "Más de 21", value: 10 },
];

const questions: TestQuestion[] = [
  {
    id: "i1",
    kind: "scale",
    anchors: PAIN_ANCHORS,
    text: "¿Cuánto dolor de CUELLO has tenido durante la última semana?",
    shortLabel: "Dolor de cuello",
    mirrorPhrase: "el dolor de cuello se mantiene presente",
  },
  {
    id: "i2",
    kind: "scale",
    anchors: PAIN_ANCHORS,
    text: "¿Cuánto dolor en el BRAZO o el HOMBRO del lado afectado has tenido durante la última semana?",
    shortLabel: "Dolor hacia el brazo",
    mirrorPhrase: "el dolor se corre hacia tu brazo",
  },
  {
    id: "i3",
    options: INTERFERENCE_OPTIONS,
    text: "Durante la última semana, ¿cuánto interfirió tu problema de cuello con tus actividades normales, incluyendo el trabajo dentro y fuera de casa?",
    shortLabel: "Interferencia diaria",
    mirrorPhrase: "tus tareas de todos los días se ven interferidas",
  },
  {
    id: "i4",
    options: WELLBEING_OPTIONS,
    text: "Si tuvieras que pasar el resto de tu vida con los síntomas que tienes ahora mismo, ¿cómo te sentirías?",
    shortLabel: "Vivir con los síntomas",
    mirrorPhrase: "la idea de seguir así no te deja tranquilo",
  },
  {
    id: "i5",
    options: QOL_OPTIONS,
    text: "En general, durante la última semana, ¿cómo ha sido tu calidad de vida?",
    shortLabel: "Calidad de vida",
    mirrorPhrase: "calificas tu calidad de vida por debajo de lo que mereces",
  },
  {
    id: "i6",
    options: DAYS_OPTIONS,
    text: "Durante las últimas 4 semanas, ¿cuántos días redujiste tus actividades habituales (trabajo, casa o escuela) por tu problema de cuello?",
    shortLabel: "Días con actividades reducidas",
    mirrorPhrase: "has tenido que recortar días de tus actividades",
  },
  {
    id: "i7",
    options: DAYS_OPTIONS,
    text: "Durante las últimas 4 semanas, ¿cuántos días faltaste al trabajo — incluido el trabajo del hogar — por tu problema de cuello?",
    shortLabel: "Días de trabajo perdidos",
    mirrorPhrase: "el problema te ha costado días de trabajo",
  },
];

// Matriz propia: el semáforo describe DIMENSIONES (dolor, actividades,
// bienestar), no niveles de exigencia física.
const domainPhrases: DomainPhrases = {
  verde: {
    dolor:
      "Tu dolor se mantiene en niveles bajos. Buen punto de partida para resolver la causa.",
    actividades:
      "Tu problema casi no está tocando tus actividades. Protege ese terreno.",
    bienestar:
      "Tu ánimo y tu calidad de vida se conservan. Eso ayuda mucho a la recuperación.",
  },
  amarillo: {
    dolor:
      "Tu dolor es de intensidad leve{ej}. Atenderlo ahora evita que escale.",
    actividades:
      "Tus actividades empiezan a resentirse{ej}. Es una señal temprana.",
    bienestar: "Tu bienestar empieza a pagar el precio{ej}.",
  },
  naranja: {
    dolor:
      "Tu dolor alcanza una intensidad considerable{ej}. No es un nivel para acostumbrarse a él: merece diagnóstico.",
    actividades:
      "Tu problema ya está recortando tus actividades de forma clara{ej}.",
    bienestar:
      "El problema ya pesa sobre tu ánimo y tu calidad de vida{ej}.",
  },
  rojo: {
    dolor:
      "Tu dolor está en niveles altos{ej}. Nadie debería funcionar así — necesita atención.",
    actividades:
      "Tu problema te está robando días completos de vida y de trabajo{ej}.",
    bienestar:
      "Vivir así te está desgastando{ej}. Tu bienestar también es motivo de consulta — y de los importantes.",
  },
};

export const cuelloTest: TestDefinition = {
  id: "cuello-comi",
  zoneId: "cuello",
  zoneLabel: "Cuello",
  instrumentName: "COMI-neck",
  instrumentCitation:
    "COMI (Core Outcome Measures Index; Deyo et al., 1998; Mannion et al., 2009) — instrumento del registro europeo de columna Spine Tango, EUROSPINE. Traducción orientativa; de uso libre.",
  estimatedMinutes: 1,
  domainThresholds: [2.5, 5, 7.5],
  semaphoreTitle: "Cómo te está afectando, según tus respuestas",
  // Las dimensiones no se ordenan por exigencia: un dolor alto no implica
  // actividades ni bienestar afectados.
  applyGradient: false,
  domainPhrases,

  flagLabels: {
    "radicular-cervical": "El dolor baja hacia el brazo",
    // Flag de precaución (CAUTION_FLAGS): se lista en "Marcaste:" del banner.
    mielopatia: "Torpeza nueva en las manos o inestabilidad al caminar",
    trauma: "El dolor inició tras un accidente o golpe",
  },

  triage: [
    {
      id: "T1",
      text: "¿El dolor baja hacia el brazo o la mano?",
      options: [
        { label: "Sí", action: "flag:radicular-cervical" },
        { label: "No", action: "goto:T2" },
      ],
    },
    {
      // Sospecha de mielopatía de evolución lenta: valoración prioritaria en
      // 24-48 h, no urgencias. 'urgente' queda reservado al déficit AGUDO.
      id: "T2",
      text: "¿Has notado torpeza nueva en las manos (se te caen las cosas, cuesta abotonar) o inestabilidad al caminar?",
      options: [
        { label: "Sí", action: "flag:mielopatia" },
        { label: "No", action: "goto:T3" },
      ],
    },
    {
      id: "T3",
      text: "¿El dolor empezó tras un accidente o golpe (por ejemplo, un choque)?",
      options: [
        { label: "Sí", action: "flag:trauma" },
        { label: "No", action: "continue" },
      ],
    },
  ],

  questions,

  domains: [
    {
      id: "dolor",
      label: "Tu dolor",
      examples: "el cuello y lo que baja al brazo",
      itemIds: ["i1", "i2"],
      // Manda el peor de los dos sitios, no su promedio.
      aggregation: "max",
    },
    {
      id: "actividades",
      label: "Tus actividades",
      examples: "trabajo, casa, días perdidos",
      itemIds: ["i3", "i6", "i7"],
    },
    {
      id: "bienestar",
      label: "Tu bienestar",
      examples: "ánimo y calidad de vida",
      itemIds: ["i4", "i5"],
    },
  ],

  // COMI: cinco dominios 0-10 con el mismo peso; dolor = peor sitio,
  // discapacidad = promedio. higher-is-worse (sin inversión).
  scoring: {
    kind: "comi",
    painItems: ["i1", "i2"],
    functionItem: "i3",
    wellbeingItem: "i4",
    qolItem: "i5",
    disabilityItems: ["i6", "i7"],
  },

  reportTexts: {
    leve: [
      "Tu cuello te está avisando, pero el impacto general aún es bajo. Es el mejor momento para entender la causa — la mayoría de los problemas cervicales detectados temprano se resuelven sin cirugía.",
      "Una valoración con exploración física te dará un diagnóstico claro.",
    ],
    moderada: [
      "Tu resultado indica que el problema de cuello ya está pesando sobre tu día a día. Este patrón puede venir de origen muscular, articular o de un nervio comprimido — distinguirlo requiere exploración física dirigida y, en algunos casos, estudios de imagen.",
      "Identificar la causa a tiempo evita que se vuelva crónico. Una valoración te dará un diagnóstico con nombre y apellido, y un plan concreto.",
    ],
    severa: [
      "Tu resultado refleja un impacto importante: el problema de cuello está condicionando tu dolor, tus actividades y tu bienestar. Un cuadro así necesita diagnóstico preciso pronto.",
      "La valoración incluye exploración neurológica de brazos y cuello, y los estudios que tu caso requiera.",
    ],
  },
};
