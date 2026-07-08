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

// Tabla de conversión OFICIAL HSS (raw → interval de salud 0-100).
const RAW_TO_INTERVAL: Record<number, number> = {
  0: 100.0,
  1: 92.34,
  2: 85.257,
  3: 80.55,
  4: 76.776,
  5: 73.472,
  6: 70.426,
  7: 67.516,
  8: 64.664,
  9: 61.815,
  10: 58.93,
  11: 55.985,
  12: 52.965,
  13: 49.858,
  14: 46.652,
  15: 43.335,
  16: 39.902,
  17: 36.363,
  18: 32.735,
  19: 29.009,
  20: 25.103,
  21: 20.805,
  22: 15.633,
  23: 8.104,
  24: 0.0,
};

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
      options: PAIN_OPTIONS,
    },
    {
      id: "q2",
      contextHeader:
        "Durante la última semana, ¿cuánto dolor de cadera has tenido al…",
      text: "…caminar sobre una superficie irregular",
      shortLabel: "Dolor en terreno irregular",
      options: PAIN_OPTIONS,
    },
    {
      id: "q3",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…levantarte desde una silla",
      shortLabel: "Levantarte de una silla",
      options: DIFFICULTY_OPTIONS,
    },
    {
      id: "q4",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…agacharte al piso o recoger un objeto",
      shortLabel: "Agacharte al piso",
      options: DIFFICULTY_OPTIONS,
    },
    {
      id: "q5",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…estar acostado en la cama (voltearte o mantener la postura de la cadera)",
      shortLabel: "Estar acostado",
      options: DIFFICULTY_OPTIONS,
    },
    {
      id: "q6",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…permanecer sentado",
      shortLabel: "Permanecer sentado",
      options: DIFFICULTY_OPTIONS,
    },
  ],

  scoring: {
    rawToInterval: RAW_TO_INTERVAL,
    levels: { leveMax: 30, moderadaMax: 60 },
    // Los flags ya no escalan el nivel funcional.
    escalationFlags: [],
  },

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
