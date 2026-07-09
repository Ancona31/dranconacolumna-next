import type { TestDefinition, TestQuestion } from "@/lib/evaluacion/types";

/** Encabezado agrupador de las 21 actividades. */
const HEADER = "Por tu tobillo o pie, ¿qué tanta dificultad tienes para…";

/** Escala oficial del FAAM (0-4). Más = peor. */
const DIFFICULTY_OPTIONS = [
  { label: "Ninguna dificultad", value: 0 },
  { label: "Dificultad leve", value: 1 },
  { label: "Dificultad moderada", value: 2 },
  { label: "Dificultad extrema", value: 3 },
  { label: "Incapaz de hacerlo", value: 4 },
];

/**
 * Todas las actividades del FAAM-ADL comparten encabezado, escala y la opción
 * "No aplica" (limitación por otra causa): el ítem sale del denominador.
 */
function item(
  id: string,
  text: string,
  shortLabel: string,
  mirrorPhrase: string
): TestQuestion {
  return {
    id,
    contextHeader: HEADER,
    text,
    shortLabel,
    mirrorPhrase,
    options: DIFFICULTY_OPTIONS,
    allowNA: true,
  };
}

export const tobilloTest: TestDefinition = {
  id: "tobillo-faam-adl",
  zoneId: "tobillo",
  zoneLabel: "Tobillo y pie",
  instrumentName: "FAAM-ADL",
  instrumentCitation:
    "FAAM (Foot and Ankle Ability Measure, subescala de actividades de la vida diaria; Martin et al., Foot Ankle Int 2005). Traducción orientativa; instrumento de dominio público.",
  estimatedMinutes: 2,
  questionNoun: { singular: "actividad", plural: "actividades" },
  // Validez oficial: por debajo de 19 de 21 respondidas el score es orientativo.
  minAnswered: 19,

  flagLabels: {
    trauma: "La molestia inició tras una torcedura o golpe",
    // Flag de precaución (CAUTION_FLAGS): se lista en "Marcaste:" del banner.
    "inflamacion-aguda": "Hinchazón con calor o enrojecimiento de la piel",
  },

  triage: [
    {
      id: "T1",
      text: "¿Tu molestia empezó por una torcedura, golpe o caída reciente?",
      options: [
        { label: "Sí", action: "goto:T2" },
        { label: "No", action: "goto:T3" },
      ],
    },
    {
      id: "T2",
      text: "¿Puedes apoyar el pie y dar al menos cuatro pasos, aunque duela?",
      options: [
        // Ningún flag interrumpe el test: se registra y el flujo continúa.
        { label: "Sí", action: "flag:trauma" },
        { label: "No", action: "flag:urgente-trauma" },
      ],
    },
    {
      id: "T3",
      text: "¿La zona está muy hinchada, caliente o con la piel enrojecida?",
      options: [
        { label: "Sí", action: "flag:inflamacion-aguda" },
        { label: "No", action: "continue" },
      ],
    },
  ],

  questions: [
    item("q1", "…estar de pie", "Estar de pie", "estar de pie te pasa factura"),
    item(
      "q2",
      "…caminar en terreno plano",
      "Caminar en plano",
      "caminar en plano ya se siente"
    ),
    item(
      "q3",
      "…caminar en terreno plano sin zapatos",
      "Caminar descalzo",
      "andar descalzo incomoda"
    ),
    item("q4", "…subir cuestas", "Subir cuestas", "las subidas te cuestan"),
    item(
      "q5",
      "…bajar cuestas",
      "Bajar cuestas",
      "las bajadas castigan tu pisada"
    ),
    item(
      "q6",
      "…subir escaleras",
      "Subir escaleras",
      "subir escaleras te cuesta"
    ),
    item(
      "q7",
      "…bajar escaleras",
      "Bajar escaleras",
      "bajar escaleras se volvió delicado"
    ),
    item(
      "q8",
      "…caminar en terreno disparejo",
      "Terreno disparejo",
      "el terreno disparejo se volvió territorio incómodo"
    ),
    item(
      "q9",
      "…subir y bajar banquetas",
      "Banquetas",
      "subir y bajar banquetas exige cuidado"
    ),
    item(
      "q10",
      "…ponerte en cuclillas",
      "Cuclillas",
      "ponerte en cuclillas quedó difícil"
    ),
    item(
      "q11",
      "…pararte de puntas",
      "Pararte de puntas",
      "pararte de puntas cuesta"
    ),
    item(
      "q12",
      "…dar los primeros pasos al levantarte",
      "Primeros pasos",
      "los primeros pasos del día duelen"
    ),
    item(
      "q13",
      "…caminar 5 minutos o menos",
      "Caminar 5 min",
      "hasta las caminatas cortas se sienten"
    ),
    item(
      "q14",
      "…caminar alrededor de 10 minutos",
      "Caminar 10 min",
      "caminar diez minutos ya es un reto"
    ),
    item(
      "q15",
      "…caminar 15 minutos o más",
      "Caminar 15+ min",
      "las caminatas largas quedaron en pausa"
    ),
    item(
      "q16",
      "…las tareas de tu casa",
      "Tareas del hogar",
      "las tareas del hogar te cuestan"
    ),
    item(
      "q17",
      "…tus actividades de todos los días",
      "Actividades cotidianas",
      "tus actividades de todos los días se ven afectadas"
    ),
    item(
      "q18",
      "…tu cuidado personal",
      "Cuidado personal",
      "hasta tu arreglo personal se complica"
    ),
    item(
      "q19",
      "…trabajo ligero a moderado (estar de pie, caminar)",
      "Trabajo ligero",
      "el trabajo de pie o caminando te cuesta"
    ),
    item(
      "q20",
      "…trabajo pesado (empujar, jalar, subir, cargar)",
      "Trabajo pesado",
      "el trabajo pesado quedó fuera de alcance"
    ),
    item(
      "q21",
      "…tus actividades recreativas",
      "Recreativas",
      "tus pasatiempos quedaron en pausa"
    ),
  ],

  domains: [
    {
      id: "basicas",
      label: "Actividades básicas",
      examples: "estar de pie, caminar, tu arreglo personal",
      itemIds: ["q1", "q2", "q12", "q13", "q18"],
    },
    {
      id: "moderadas",
      label: "Marcha y vida diaria",
      examples: "escaleras, banquetas, caminatas, el hogar",
      itemIds: ["q3", "q6", "q7", "q9", "q14", "q15", "q16", "q17", "q19"],
    },
    {
      id: "demandantes",
      label: "Terreno difícil y esfuerzo",
      examples: "cuestas, cuclillas, trabajo pesado",
      itemIds: ["q4", "q5", "q8", "q10", "q11", "q20", "q21"],
    },
  ],

  // FAAM-ADL: denominador adaptativo — los "No aplica" salen del cálculo.
  scoring: { kind: "linear-adaptive", perItemMax: 4 },

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
};
