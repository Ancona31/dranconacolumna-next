import type { TestContent } from "../../types";

const PAIN_LABELS = ["Ninguno", "Leve", "Moderado", "Severo", "Extremo"];
const DIFFICULTY_LABELS = ["Ninguna", "Leve", "Moderada", "Severa", "Extrema"];

const PAIN_HEADER =
  "Durante la última semana, ¿cuánto dolor de cadera has tenido al…";
const DIFFICULTY_HEADER =
  "Durante la última semana, ¿qué tanta dificultad has tenido para…";

export const caderaContentEs: TestContent = {
  zoneLabel: "Cadera",
  instrumentName: "HOOS-JR",
  instrumentCitation:
    "HOOS-JR (Hip Disability and Osteoarthritis Outcome Score, Joint Replacement; Lyman et al., Clin Orthop Relat Res 2016). Traducción orientativa; instrumento © Hospital for Special Surgery, de uso libre.",

  flagLabels: {
    trauma: "La molestia inició tras un golpe o caída",
  },

  questions: {
    q1: {
      contextHeader: PAIN_HEADER,
      text: "…subir o bajar escaleras",
      shortLabel: "Dolor en escaleras",
      mirrorPhrase: "las escaleras despiertan tu dolor",
      optionLabels: PAIN_LABELS,
    },
    q2: {
      contextHeader: PAIN_HEADER,
      text: "…caminar sobre una superficie irregular",
      shortLabel: "Dolor en terreno irregular",
      mirrorPhrase: "el piso disparejo se volvió territorio incómodo",
      optionLabels: PAIN_LABELS,
    },
    q3: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…levantarte desde una silla",
      shortLabel: "Levantarte de una silla",
      mirrorPhrase: "incorporarte de un asiento se volvió un esfuerzo",
      optionLabels: DIFFICULTY_LABELS,
    },
    q4: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…agacharte al piso o recoger un objeto",
      shortLabel: "Agacharte al piso",
      mirrorPhrase: "agacharte por algo del suelo cuesta trabajo",
      optionLabels: DIFFICULTY_LABELS,
    },
    q5: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…estar acostado en la cama (voltearte o mantener la postura de la cadera)",
      shortLabel: "Estar acostado",
      mirrorPhrase: "hasta el descanso en cama se ve afectado",
      optionLabels: DIFFICULTY_LABELS,
    },
    q6: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…permanecer sentado",
      shortLabel: "Permanecer sentado",
      mirrorPhrase: "estar sentado mucho rato te incomoda",
      optionLabels: DIFFICULTY_LABELS,
    },
  },

  triage: {
    T1: {
      text: "¿Tu molestia empezó por un golpe, caída o accidente reciente?",
      optionLabels: ["Sí", "No"],
    },
    T2: {
      text: "¿Puedes apoyar el pie y caminar, aunque duela?",
      optionLabels: ["Sí", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Actividades básicas",
      examples: "levantarte de una silla, estar sentado o acostado",
    },
    moderadas: {
      label: "Actividad moderada",
      examples: "subir y bajar escaleras",
    },
    demandantes: {
      label: "Actividad demandante",
      examples: "caminar en terreno disparejo, agacharte al piso",
    },
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
