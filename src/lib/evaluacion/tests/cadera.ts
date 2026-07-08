import type { TestDefinition } from "@/lib/evaluacion/types";

const PAIN_OPTIONS = [
  { label: "Ninguno", value: 0 },
  { label: "Leve", value: 1 },
  { label: "Moderado", value: 2 },
  { label: "Severo", value: 3 },
  { label: "Extremo", value: 4 },
];

const DIFFICULTY_OPTIONS = [
  { label: "Ninguna", value: 0 },
  { label: "Leve", value: 1 },
  { label: "Moderada", value: 2 },
  { label: "Severa", value: 3 },
  { label: "Extrema", value: 4 },
];

// Tabla de conversión OFICIAL HSS (raw 0-24 → interval de salud 0-100).
const RAW_TO_INTERVAL = [
  100.0, 92.34, 85.257, 80.55, 76.776, 73.472, 70.426, 67.516, 64.664, 61.815,
  58.93, 55.985, 52.965, 49.858, 46.652, 43.335, 39.902, 36.363, 32.735, 29.009,
  25.103, 20.805, 15.633, 8.104, 0.0,
];

// TODO verificar contra traducción española oficial distribuida por HSS.
export const caderaTest: TestDefinition = {
  id: "cadera-hoos-jr",
  zoneId: "cadera",
  zoneLabel: "Cadera",
  instrumentName: "HOOS-JR",
  instrumentCitation:
    "HOOS-JR (Hip Disability and Osteoarthritis Outcome Score, Joint Replacement; Lyman et al., Clin Orthop Relat Res 2016). Traducción orientativa; instrumento © Hospital for Special Surgery, de uso libre.",
  estimatedMinutes: 1,

  triage: [
    {
      id: "T1",
      text: "¿Tu molestia empezó por un golpe, caída o accidente reciente?",
      options: [
        { label: "Sí", action: "goto:T2" },
        { label: "No", action: "continue" },
      ],
    },
    {
      id: "T2",
      text: "¿Puedes apoyar el pie y caminar, aunque duela?",
      options: [
        { label: "Sí", action: "flag:trauma" },
        // Ningún flag interrumpe el test: 'urgente-trauma' se registra y el
        // flujo continúa; la urgencia se comunica en el reporte.
        { label: "No", action: "flag:urgente-trauma" },
      ],
    },
  ],

  questions: [
    {
      id: "q1",
      contextHeader:
        "Durante la última semana, ¿cuánto dolor de cadera has tenido al…",
      text: "…subir o bajar escaleras",
      shortLabel: "Dolor en escaleras",
      mirrorPhrase: "las escaleras despiertan tu dolor",
      options: PAIN_OPTIONS,
    },
    {
      id: "q2",
      contextHeader:
        "Durante la última semana, ¿cuánto dolor de cadera has tenido al…",
      text: "…caminar sobre una superficie irregular",
      shortLabel: "Dolor en terreno irregular",
      mirrorPhrase: "el piso disparejo se volvió territorio incómodo",
      options: PAIN_OPTIONS,
    },
    {
      id: "q3",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…levantarte desde una silla",
      shortLabel: "Levantarte de una silla",
      mirrorPhrase: "incorporarte de un asiento se volvió un esfuerzo",
      options: DIFFICULTY_OPTIONS,
    },
    {
      id: "q4",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…agacharte al piso o recoger un objeto",
      shortLabel: "Agacharte al piso",
      mirrorPhrase: "agacharte por algo del suelo cuesta trabajo",
      options: DIFFICULTY_OPTIONS,
    },
    {
      id: "q5",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…estar acostado en la cama (voltearte o mantener la postura de la cadera)",
      shortLabel: "Estar acostado",
      mirrorPhrase: "hasta el descanso en cama se ve afectado",
      options: DIFFICULTY_OPTIONS,
    },
    {
      id: "q6",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…permanecer sentado",
      shortLabel: "Permanecer sentado",
      mirrorPhrase: "estar sentado mucho rato te incomoda",
      options: DIFFICULTY_OPTIONS,
    },
  ],

  flagLabels: {
    trauma: "La molestia inició tras un golpe o caída",
  },

  domains: [
    {
      id: "basicas",
      label: "Actividades básicas",
      examples: "levantarte de una silla, estar sentado o acostado",
      itemIds: ["q3", "q5", "q6"],
    },
    {
      id: "moderadas",
      label: "Actividad moderada",
      examples: "subir y bajar escaleras",
      itemIds: ["q1"],
    },
    {
      id: "demandantes",
      label: "Actividad demandante",
      examples: "caminar en terreno disparejo, agacharte al piso",
      itemIds: ["q2", "q4"],
    },
  ],

  scoring: { kind: "table", table: RAW_TO_INTERVAL },

  reportTexts: {
    leve: [
      "Tu cadera te está avisando, pero el impacto en tu vida diaria todavía es bajo. Es el mejor momento para actuar: los problemas de cadera detectados temprano tienen más opciones y más simples.",
      "Una valoración con exploración física te dirá con certeza qué lo está causando.",
    ],
    moderada: [
      "Tu puntaje indica que el problema de tu cadera ya está limitando actividades de tu vida diaria de forma importante. Este patrón es frecuente en el desgaste articular y en algunas lesiones de cadera — pero distinguir cuál es tu caso requiere exploración física y, generalmente, estudios de imagen.",
      "La buena noticia: identificarlo a tiempo amplía tus opciones. Una valoración te dará un diagnóstico con nombre y apellido, y un plan concreto.",
    ],
    severa: [
      "Tu puntaje indica una limitación importante: tu cadera está condicionando gran parte de tu vida diaria. Un problema con este nivel de impacto necesita diagnóstico preciso pronto — cada semana sin él es una semana de opciones que se estrechan.",
      "La valoración incluye exploración física y la solicitud de los estudios que tu caso requiera.",
    ],
  },
};
