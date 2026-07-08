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

// Tabla oficial HSS ©2022 (raw 0-28 → interval de salud 0-100).
const RAW_TO_INTERVAL = [
  100.0, 91.975, 84.6, 79.914, 76.332, 73.342, 70.704, 68.284, 65.994, 63.776,
  61.583, 59.381, 57.14, 54.84, 52.465, 50.012, 47.487, 44.905, 42.281, 39.625,
  36.931, 34.174, 31.307, 28.251, 24.875, 20.941, 15.939, 8.291, 0.0,
];

// TODO verificar contra traducción española oficial distribuida por HSS.
export const rodillaTest: TestDefinition = {
  id: "rodilla-koos-jr",
  zoneId: "rodilla",
  zoneLabel: "Rodilla",
  instrumentName: "KOOS-JR",
  instrumentCitation:
    "KOOS-JR (Knee injury and Osteoarthritis Outcome Score, Joint Replacement; Lyman et al., Clin Orthop Relat Res 2016). Traducción orientativa; instrumento © Hospital for Special Surgery, de uso libre.",
  estimatedMinutes: 1,
  resultDisplay: "bars",

  flagLabels: {
    trauma: "La molestia inició tras un golpe o torcedura",
    inestabilidad: "La rodilla se traba o se dobla sola",
  },

  triage: [
    {
      id: "T1",
      text: "¿Tu molestia empezó por un golpe, torcedura o accidente reciente?",
      options: [
        { label: "Sí", action: "goto:T2" },
        { label: "No", action: "goto:T3" },
      ],
    },
    {
      id: "T2",
      text: "¿Puedes apoyar la pierna y dar unos pasos, aunque duela?",
      options: [
        // Ningún flag interrumpe el test: se registra y el flujo continúa.
        { label: "Sí", action: "flag:trauma" },
        { label: "No", action: "flag:urgente-trauma" },
      ],
    },
    {
      id: "T3",
      text: "¿La rodilla se te traba o se te dobla sola de repente?",
      options: [
        { label: "Sí", action: "flag:inestabilidad" },
        { label: "No", action: "continue" },
      ],
    },
  ],

  questions: [
    {
      id: "q1",
      contextHeader: "Piensa en tu rodilla durante la última semana.",
      text: "¿Qué tan severa es la rigidez de tu rodilla al despertar por la mañana?",
      shortLabel: "Rigidez matutina",
      mirrorPhrase: "tu rodilla amanece rígida",
      options: DIFFICULTY_OPTIONS,
    },
    {
      id: "q2",
      contextHeader:
        "Durante la última semana, ¿cuánto dolor de rodilla has tenido al…",
      text: "…girar o pivotar sobre tu rodilla",
      shortLabel: "Girar sobre la rodilla",
      mirrorPhrase: "los giros sobre la rodilla despiertan el dolor",
      options: PAIN_OPTIONS,
    },
    {
      id: "q3",
      contextHeader:
        "Durante la última semana, ¿cuánto dolor de rodilla has tenido al…",
      text: "…estirar completamente la rodilla",
      shortLabel: "Estirar la rodilla",
      mirrorPhrase: "estirarla por completo genera molestia",
      options: PAIN_OPTIONS,
    },
    {
      id: "q4",
      contextHeader:
        "Durante la última semana, ¿cuánto dolor de rodilla has tenido al…",
      text: "…subir o bajar escaleras",
      shortLabel: "Escaleras",
      mirrorPhrase: "las escaleras despiertan tu dolor",
      options: PAIN_OPTIONS,
    },
    {
      id: "q5",
      contextHeader:
        "Durante la última semana, ¿cuánto dolor de rodilla has tenido al…",
      text: "…estar de pie",
      shortLabel: "Estar de pie",
      mirrorPhrase: "estar de pie te pasa factura",
      options: PAIN_OPTIONS,
    },
    {
      id: "q6",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…levantarte desde una silla",
      shortLabel: "Levantarte de una silla",
      mirrorPhrase: "incorporarte de un asiento se volvió un esfuerzo",
      options: DIFFICULTY_OPTIONS,
    },
    {
      id: "q7",
      contextHeader:
        "Durante la última semana, ¿qué tanta dificultad has tenido para…",
      text: "…agacharte al piso o recoger un objeto",
      shortLabel: "Agacharte al piso",
      mirrorPhrase: "agacharte al piso cuesta trabajo",
      options: DIFFICULTY_OPTIONS,
    },
  ],

  domains: [
    {
      id: "basicas",
      label: "Actividades básicas",
      examples: "levantarte de una silla, la rigidez al despertar",
      itemIds: ["q1", "q6"],
    },
    {
      id: "moderadas",
      label: "Actividad moderada",
      examples: "escaleras, estar de pie, estirar la rodilla",
      itemIds: ["q3", "q4", "q5"],
    },
    {
      id: "demandantes",
      label: "Actividad demandante",
      examples: "girar sobre la rodilla, agacharte al piso",
      itemIds: ["q2", "q7"],
    },
  ],

  // KOOS-JR: raw 0-28 → tabla oficial HSS.
  scoring: { kind: "table", table: RAW_TO_INTERVAL },

  reportTexts: {
    leve: [
      "Tu rodilla te está avisando, pero el impacto en tu día a día todavía es bajo. Detectar el origen ahora — cartílago, meniscos o ligamentos — abre las opciones más simples de tratamiento.",
      "Una valoración con exploración física te dirá con certeza qué lo está causando.",
    ],
    moderada: [
      "Tu puntaje indica que el problema de tu rodilla ya limita actividades de tu vida diaria de forma importante. Este patrón es frecuente en el desgaste articular y en lesiones de meniscos o ligamentos — pero distinguir cuál es tu caso requiere exploración física y, generalmente, estudios de imagen.",
      "Identificarlo a tiempo amplía tus opciones. Una valoración te dará un diagnóstico con nombre y apellido, y un plan concreto.",
    ],
    severa: [
      "Tu puntaje indica una limitación importante: tu rodilla está condicionando gran parte de tu vida diaria. Con este nivel de impacto, posponer el diagnóstico solo estrecha las opciones.",
      "La valoración incluye exploración física completa y la solicitud de los estudios que tu caso requiera.",
    ],
  },
};
