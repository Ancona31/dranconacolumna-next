import type { TestContent } from "../../types";

const PAIN_LABELS = ["Ninguno", "Leve", "Moderado", "Severo", "Extremo"];
const DIFFICULTY_LABELS = ["Ninguna", "Leve", "Moderada", "Severa", "Extrema"];

const PAIN_HEADER =
  "Durante la última semana, ¿cuánto dolor de rodilla has tenido al…";
const DIFFICULTY_HEADER =
  "Durante la última semana, ¿qué tanta dificultad has tenido para…";

// TODO verificar contra traducción española oficial distribuida por HSS.
export const rodillaContentEs: TestContent = {
  zoneLabel: "Rodilla",
  instrumentName: "KOOS-JR",
  instrumentCitation:
    "KOOS-JR (Knee injury and Osteoarthritis Outcome Score, Joint Replacement; Lyman et al., Clin Orthop Relat Res 2016). Traducción orientativa; instrumento © Hospital for Special Surgery, de uso libre.",

  flagLabels: {
    trauma: "La molestia inició tras un golpe o torcedura",
    inestabilidad: "La rodilla se traba o se dobla sola",
  },

  questions: {
    q1: {
      contextHeader: "Piensa en tu rodilla durante la última semana.",
      text: "¿Qué tan severa es la rigidez de tu rodilla al despertar por la mañana?",
      shortLabel: "Rigidez matutina",
      mirrorPhrase: "tu rodilla amanece rígida",
      optionLabels: DIFFICULTY_LABELS,
    },
    q2: {
      contextHeader: PAIN_HEADER,
      text: "…girar o pivotar sobre tu rodilla",
      shortLabel: "Girar sobre la rodilla",
      mirrorPhrase: "los giros sobre la rodilla despiertan el dolor",
      optionLabels: PAIN_LABELS,
    },
    q3: {
      contextHeader: PAIN_HEADER,
      text: "…estirar completamente la rodilla",
      shortLabel: "Estirar la rodilla",
      mirrorPhrase: "estirarla por completo genera molestia",
      optionLabels: PAIN_LABELS,
    },
    q4: {
      contextHeader: PAIN_HEADER,
      text: "…subir o bajar escaleras",
      shortLabel: "Escaleras",
      mirrorPhrase: "las escaleras despiertan tu dolor",
      optionLabels: PAIN_LABELS,
    },
    q5: {
      contextHeader: PAIN_HEADER,
      text: "…estar de pie",
      shortLabel: "Estar de pie",
      mirrorPhrase: "estar de pie te pasa factura",
      optionLabels: PAIN_LABELS,
    },
    q6: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…levantarte desde una silla",
      shortLabel: "Levantarte de una silla",
      mirrorPhrase: "incorporarte de un asiento se volvió un esfuerzo",
      optionLabels: DIFFICULTY_LABELS,
    },
    q7: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…agacharte al piso o recoger un objeto",
      shortLabel: "Agacharte al piso",
      mirrorPhrase: "agacharte al piso cuesta trabajo",
      optionLabels: DIFFICULTY_LABELS,
    },
  },

  triage: {
    T1: {
      text: "¿Tu molestia empezó por un golpe, torcedura o accidente reciente?",
      optionLabels: ["Sí", "No"],
    },
    T2: {
      text: "¿Puedes apoyar la pierna y dar unos pasos, aunque duela?",
      optionLabels: ["Sí", "No"],
    },
    T3: {
      text: "¿La rodilla se te traba o se te dobla sola de repente?",
      optionLabels: ["Sí", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Actividades básicas",
      examples: "levantarte de una silla, la rigidez al despertar",
    },
    moderadas: {
      label: "Actividad moderada",
      examples: "escaleras, estar de pie, estirar la rodilla",
    },
    demandantes: {
      label: "Actividad demandante",
      examples: "girar sobre la rodilla, agacharte al piso",
    },
  },

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
