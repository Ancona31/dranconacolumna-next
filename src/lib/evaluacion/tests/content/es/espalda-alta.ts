import type { TestContent } from "../../types";

const PAIN_ANCHORS = {
  min: "Sin dolor",
  max: "El peor imaginable",
};

const INTERFERENCE_LABELS = [
  "Nada",
  "Un poco",
  "Moderadamente",
  "Mucho",
  "Muchísimo",
];

const WELLBEING_LABELS = [
  "Muy satisfecho",
  "Algo satisfecho",
  "Ni satisfecho ni insatisfecho",
  "Algo insatisfecho",
  "Muy insatisfecho",
];

const QOL_LABELS = ["Muy buena", "Buena", "Regular", "Mala", "Muy mala"];

const DAYS_LABELS = [
  "Ningún día",
  "Entre 1 y 7",
  "Entre 8 y 14",
  "Entre 15 y 21",
  "Más de 21",
];

export const espaldaAltaContentEs: TestContent = {
  zoneLabel: "Espalda alta",
  instrumentName: "COMI",
  instrumentCitation:
    "COMI (Core Outcome Measures Index; Deyo et al., 1998; Mannion et al., 2009) — instrumento del registro europeo de columna Spine Tango, EUROSPINE. Traducción orientativa; de uso libre. Adaptación orientativa a la región dorsal.",
  semaphoreTitle: "Cómo te está afectando, según tus respuestas",

  // Matriz propia: el semáforo describe DIMENSIONES (dolor, actividades,
  // bienestar), no niveles de exigencia física.
  domainPhrases: {
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
  },

  flagLabels: {
    "banda-dorsal": "El dolor rodea el pecho como una banda",
    // Flag de precaución (CAUTION_FLAGS): se lista en "Marcaste:" del banner.
    "deficit-dorsal": "Debilidad o torpeza en las piernas de aparición gradual",
    trauma: "El dolor inició tras un golpe o caída",
  },

  questions: {
    i1: {
      text: "¿Cuánto dolor de ESPALDA ALTA has tenido durante la última semana?",
      shortLabel: "Dolor de espalda alta",
      mirrorPhrase: "el dolor de espalda alta se mantiene presente",
      anchors: PAIN_ANCHORS,
    },
    i2: {
      text: "¿Cuánto dolor que RODEA hacia el pecho o las costillas has tenido durante la última semana?",
      shortLabel: "Dolor en banda",
      mirrorPhrase: "el dolor rodea hacia tu pecho o costillas",
      anchors: PAIN_ANCHORS,
    },
    i3: {
      text: "Durante la última semana, ¿cuánto interfirió tu problema de espalda alta con tus actividades normales, incluyendo el trabajo dentro y fuera de casa?",
      shortLabel: "Interferencia diaria",
      mirrorPhrase: "tus tareas de todos los días se ven interferidas",
      optionLabels: INTERFERENCE_LABELS,
    },
    i4: {
      text: "Si tuvieras que pasar el resto de tu vida con los síntomas que tienes ahora mismo, ¿cómo te sentirías?",
      shortLabel: "Vivir con los síntomas",
      mirrorPhrase: "la idea de seguir así no te deja tranquilo",
      optionLabels: WELLBEING_LABELS,
    },
    i5: {
      text: "En general, durante la última semana, ¿cómo ha sido tu calidad de vida?",
      shortLabel: "Calidad de vida",
      mirrorPhrase: "calificas tu calidad de vida por debajo de lo que mereces",
      optionLabels: QOL_LABELS,
    },
    i6: {
      text: "Durante las últimas 4 semanas, ¿cuántos días redujiste tus actividades habituales (trabajo, casa o escuela) por tu problema de espalda alta?",
      shortLabel: "Días con actividades reducidas",
      mirrorPhrase: "has tenido que recortar días de tus actividades",
      optionLabels: DAYS_LABELS,
    },
    i7: {
      text: "Durante las últimas 4 semanas, ¿cuántos días faltaste al trabajo — incluido el trabajo del hogar — por tu problema de espalda alta?",
      shortLabel: "Días de trabajo perdidos",
      mirrorPhrase: "el problema te ha costado días de trabajo",
      optionLabels: DAYS_LABELS,
    },
  },

  triage: {
    T1: {
      text: "¿El dolor rodea el pecho o las costillas como una banda?",
      optionLabels: ["Sí", "No"],
    },
    T2: {
      text: "¿Has notado debilidad o torpeza en las piernas?",
      optionLabels: ["Sí", "No"],
    },
    T2b: {
      text: "¿Apareció de forma súbita (en horas o pocos días)?",
      optionLabels: ["Sí", "No"],
    },
    T3: {
      text: "¿El dolor empezó tras un golpe o caída fuerte?",
      optionLabels: ["Sí", "No"],
    },
  },

  domains: {
    dolor: {
      label: "Tu dolor",
      examples: "la espalda alta y lo que rodea al pecho",
    },
    actividades: {
      label: "Tus actividades",
      examples: "trabajo, casa, días perdidos",
    },
    bienestar: {
      label: "Tu bienestar",
      examples: "ánimo y calidad de vida",
    },
  },

  reportTexts: {
    leve: [
      "Tu espalda alta te está avisando, pero el impacto aún es bajo. En esta zona vale la pena entender la causa desde temprano — es la región donde un diagnóstico certero da más tranquilidad.",
      "Una valoración con exploración física te dará un diagnóstico claro.",
    ],
    moderada: [
      "Tu resultado indica que el dolor dorsal ya pesa sobre tu día a día. La espalda alta es una zona que merece estudio cuidadoso: su dolor puede venir del músculo, de la columna o, a veces, reflejarse desde otros órganos — distinguirlo requiere exploración dirigida.",
      "Una valoración te dará un diagnóstico con nombre y apellido, y un plan concreto.",
    ],
    severa: [
      "Tu resultado refleja un impacto importante en una zona que no conviene dejar sin diagnóstico: la columna dorsal. Con este nivel de afectación, la prioridad es identificar la causa pronto.",
      "La valoración incluye exploración de columna y neurológica de piernas, y los estudios que tu caso requiera — en esta región suelen ser especialmente informativos.",
    ],
  },
};
