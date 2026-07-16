import type { TestContent } from "../../types";

/** Encabezado agrupador de las 21 actividades. */
const HEADER = "Por tu tobillo o pie, ¿qué tanta dificultad tienes para…";

/** Labels de la escala oficial del FAAM (0-4), en el orden de los valores. */
const DIFFICULTY_LABELS = [
  "Ninguna dificultad",
  "Dificultad leve",
  "Dificultad moderada",
  "Dificultad extrema",
  "Incapaz de hacerlo",
];

export const tobilloContentEs: TestContent = {
  zoneLabel: "Tobillo y pie",
  instrumentName: "FAAM-ADL",
  instrumentCitation:
    "FAAM (Foot and Ankle Ability Measure, subescala de actividades de la vida diaria; Martin et al., Foot Ankle Int 2005). Traducción orientativa; instrumento de dominio público.",
  questionNoun: { singular: "actividad", plural: "actividades" },

  flagLabels: {
    trauma: "La molestia inició tras una torcedura o golpe",
    // Flag de precaución (CAUTION_FLAGS): se lista en "Marcaste:" del banner.
    "inflamacion-aguda": "Hinchazón con calor o enrojecimiento de la piel",
  },

  questions: {
    q1: {
      contextHeader: HEADER,
      text: "…estar de pie",
      shortLabel: "Estar de pie",
      mirrorPhrase: "estar de pie te pasa factura",
      optionLabels: DIFFICULTY_LABELS,
    },
    q2: {
      contextHeader: HEADER,
      text: "…caminar en terreno plano",
      shortLabel: "Caminar en plano",
      mirrorPhrase: "caminar en plano ya se siente",
      optionLabels: DIFFICULTY_LABELS,
    },
    q3: {
      contextHeader: HEADER,
      text: "…caminar en terreno plano sin zapatos",
      shortLabel: "Caminar descalzo",
      mirrorPhrase: "andar descalzo incomoda",
      optionLabels: DIFFICULTY_LABELS,
    },
    q4: {
      contextHeader: HEADER,
      text: "…subir cuestas",
      shortLabel: "Subir cuestas",
      mirrorPhrase: "las subidas te cuestan",
      optionLabels: DIFFICULTY_LABELS,
    },
    q5: {
      contextHeader: HEADER,
      text: "…bajar cuestas",
      shortLabel: "Bajar cuestas",
      mirrorPhrase: "las bajadas castigan tu pisada",
      optionLabels: DIFFICULTY_LABELS,
    },
    q6: {
      contextHeader: HEADER,
      text: "…subir escaleras",
      shortLabel: "Subir escaleras",
      mirrorPhrase: "subir escaleras te cuesta",
      optionLabels: DIFFICULTY_LABELS,
    },
    q7: {
      contextHeader: HEADER,
      text: "…bajar escaleras",
      shortLabel: "Bajar escaleras",
      mirrorPhrase: "bajar escaleras se volvió delicado",
      optionLabels: DIFFICULTY_LABELS,
    },
    q8: {
      contextHeader: HEADER,
      text: "…caminar en terreno disparejo",
      shortLabel: "Terreno disparejo",
      mirrorPhrase: "el terreno disparejo se volvió territorio incómodo",
      optionLabels: DIFFICULTY_LABELS,
    },
    q9: {
      contextHeader: HEADER,
      text: "…subir y bajar banquetas",
      shortLabel: "Banquetas",
      mirrorPhrase: "subir y bajar banquetas exige cuidado",
      optionLabels: DIFFICULTY_LABELS,
    },
    q10: {
      contextHeader: HEADER,
      text: "…ponerte en cuclillas",
      shortLabel: "Cuclillas",
      mirrorPhrase: "ponerte en cuclillas quedó difícil",
      optionLabels: DIFFICULTY_LABELS,
    },
    q11: {
      contextHeader: HEADER,
      text: "…pararte de puntas",
      shortLabel: "Pararte de puntas",
      mirrorPhrase: "pararte de puntas cuesta",
      optionLabels: DIFFICULTY_LABELS,
    },
    q12: {
      contextHeader: HEADER,
      text: "…dar los primeros pasos al levantarte",
      shortLabel: "Primeros pasos",
      mirrorPhrase: "los primeros pasos del día duelen",
      optionLabels: DIFFICULTY_LABELS,
    },
    q13: {
      contextHeader: HEADER,
      text: "…caminar 5 minutos o menos",
      shortLabel: "Caminar 5 min",
      mirrorPhrase: "hasta las caminatas cortas se sienten",
      optionLabels: DIFFICULTY_LABELS,
    },
    q14: {
      contextHeader: HEADER,
      text: "…caminar alrededor de 10 minutos",
      shortLabel: "Caminar 10 min",
      mirrorPhrase: "caminar diez minutos ya es un reto",
      optionLabels: DIFFICULTY_LABELS,
    },
    q15: {
      contextHeader: HEADER,
      text: "…caminar 15 minutos o más",
      shortLabel: "Caminar 15+ min",
      mirrorPhrase: "las caminatas largas quedaron en pausa",
      optionLabels: DIFFICULTY_LABELS,
    },
    q16: {
      contextHeader: HEADER,
      text: "…las tareas de tu casa",
      shortLabel: "Tareas del hogar",
      mirrorPhrase: "las tareas del hogar te cuestan",
      optionLabels: DIFFICULTY_LABELS,
    },
    q17: {
      contextHeader: HEADER,
      text: "…tus actividades de todos los días",
      shortLabel: "Actividades cotidianas",
      mirrorPhrase: "tus actividades de todos los días se ven afectadas",
      optionLabels: DIFFICULTY_LABELS,
    },
    q18: {
      contextHeader: HEADER,
      text: "…tu cuidado personal",
      shortLabel: "Cuidado personal",
      mirrorPhrase: "hasta tu arreglo personal se complica",
      optionLabels: DIFFICULTY_LABELS,
    },
    q19: {
      contextHeader: HEADER,
      text: "…trabajo ligero a moderado (estar de pie, caminar)",
      shortLabel: "Trabajo ligero",
      mirrorPhrase: "el trabajo de pie o caminando te cuesta",
      optionLabels: DIFFICULTY_LABELS,
    },
    q20: {
      contextHeader: HEADER,
      text: "…trabajo pesado (empujar, jalar, subir, cargar)",
      shortLabel: "Trabajo pesado",
      mirrorPhrase: "el trabajo pesado quedó fuera de alcance",
      optionLabels: DIFFICULTY_LABELS,
    },
    q21: {
      contextHeader: HEADER,
      text: "…tus actividades recreativas",
      shortLabel: "Recreativas",
      mirrorPhrase: "tus pasatiempos quedaron en pausa",
      optionLabels: DIFFICULTY_LABELS,
    },
  },

  triage: {
    T1: {
      text: "¿Tu molestia empezó por una torcedura, golpe o caída reciente?",
      optionLabels: ["Sí", "No"],
    },
    T2: {
      text: "¿Puedes apoyar el pie y dar al menos cuatro pasos, aunque duela?",
      optionLabels: ["Sí", "No"],
    },
    T3: {
      text: "¿La zona está muy hinchada, caliente o con la piel enrojecida?",
      optionLabels: ["Sí", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Actividades básicas",
      examples: "estar de pie, caminar, tu arreglo personal",
    },
    moderadas: {
      label: "Marcha y vida diaria",
      examples: "escaleras, banquetas, caminatas, el hogar",
    },
    demandantes: {
      label: "Terreno difícil y esfuerzo",
      examples: "cuestas, cuclillas, trabajo pesado",
    },
  },

  reportTexts: {
    leve: [
      "Tu tobillo o pie te está avisando, pero tu marcha general se conserva. Es el mejor momento para identificar la causa — el pie sostiene todo lo demás, y los problemas detectados temprano se corrigen con medidas simples.",
      "Una valoración con exploración física te dirá con certeza qué lo origina.",
    ],
    moderada: [
      "Tu puntaje indica que el tobillo o el pie ya limita tu marcha y tus actividades de forma importante. Este patrón aparece en secuelas de esguince, tendinitis y desgaste articular — distinguirlo requiere exploración física y, a veces, estudios de imagen.",
      "Atenderlo a tiempo evita compensaciones que terminan doliendo en la rodilla, la cadera o la espalda. Una valoración te dará un diagnóstico con nombre y apellido, y un plan concreto.",
    ],
    severa: [
      "Tu puntaje refleja una limitación importante: cada paso está condicionado. Un pie que no apoya bien compromete todo lo que está arriba — un cuadro así necesita diagnóstico pronto.",
      "La valoración incluye exploración de apoyo, estabilidad y marcha, y los estudios que tu caso requiera.",
    ],
  },

  // F3 corrección (a): completa el "No aplica — …no por {naZoneFragment}" del
  // QuestionScreen. Byte-idéntico al literal que estaba hardcodeado ("mi tobillo o pie").
  naZoneFragment: "mi tobillo o pie",
};
