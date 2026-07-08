import type {
  ScaleAnchors,
  TestDefinition,
  TestQuestion,
} from "@/lib/evaluacion/types";

const PAIN_ANCHORS: ScaleAnchors = { min: "Sin dolor", max: "El peor posible" };
const FREQ_ANCHORS: ScaleAnchors = { min: "Nunca", max: "Siempre" };
const FUNC_ANCHORS: ScaleAnchors = {
  min: "Sin dificultad",
  max: "Incapaz de hacerlo",
};

const PAIN_HEADER =
  "Durante la última semana, califica tu dolor de muñeca o mano del 0 al 10…";
const FUNC_HEADER =
  "…tu dificultad para realizar cada actividad con la mano afectada";

const scale = (
  id: string,
  text: string,
  shortLabel: string,
  anchors: ScaleAnchors,
  header?: string,
  mirrorPhrase?: string
): TestQuestion => ({
  id,
  kind: "scale",
  contextHeader: header,
  text,
  shortLabel,
  anchors,
  mirrorPhrase,
});

const questions: TestQuestion[] = [
  scale("r1", "…en reposo", "Dolor en reposo", PAIN_ANCHORS, PAIN_HEADER),
  scale(
    "r2",
    "…al hacer un movimiento repetido con la muñeca",
    "Dolor en movimiento repetido",
    PAIN_ANCHORS,
    PAIN_HEADER
  ),
  scale(
    "r3",
    "…al levantar un objeto pesado",
    "Dolor al levantar peso",
    PAIN_ANCHORS,
    PAIN_HEADER,
    "levantar objetos pesados dispara el dolor"
  ),
  scale("r4", "…en su peor momento", "Dolor máximo", PAIN_ANCHORS, PAIN_HEADER),
  scale(
    "r5",
    "¿Con qué frecuencia tienes dolor?",
    "Frecuencia del dolor",
    FREQ_ANCHORS
  ),
  scale(
    "s1",
    "Girar una perilla",
    "Girar una perilla",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "girar una perilla se volvió doloroso"
  ),
  scale(
    "s2",
    "Cortar carne con un cuchillo",
    "Cortar con cuchillo",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "cortar tu comida cuesta trabajo"
  ),
  scale(
    "s3",
    "Abrocharte los botones de la camisa",
    "Abotonar camisa",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "abotonarte la camisa se ha vuelto lento"
  ),
  scale(
    "s4",
    "Usar esa mano para empujarte y levantarte de una silla",
    "Levantarte de la silla",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "apoyar la mano para levantarte duele"
  ),
  scale(
    "s5",
    "Cargar un objeto de 4 a 5 kilos",
    "Cargar 4-5 kg",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "cargar peso con esa mano quedó en pausa"
  ),
  scale(
    "s6",
    "Usar papel higiénico",
    "Usar papel higiénico",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "hasta el aseo personal se complica"
  ),
  scale(
    "u1",
    "Tus actividades personales (vestirte, asearte)",
    "Actividades personales",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "tu arreglo personal se volvió más lento"
  ),
  scale(
    "u2",
    "El trabajo del hogar (limpieza, mantenimiento)",
    "Trabajo del hogar",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "el trabajo del hogar te está costando"
  ),
  scale(
    "u3",
    "Tu trabajo (empleo o labor habitual)",
    "Tu trabajo",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "tu trabajo diario se ve afectado"
  ),
  scale(
    "u4",
    "Tus actividades recreativas",
    "Actividades recreativas",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "tus pasatiempos quedaron en pausa"
  ),
];

export const munecaTest: TestDefinition = {
  id: "muneca-prwhe",
  zoneId: "muneca",
  zoneLabel: "Muñeca y mano",
  instrumentName: "PRWHE",
  instrumentCitation:
    "PRWHE (Patient-Rated Wrist/Hand Evaluation; MacDermid, 1998). Traducción orientativa; © J. MacDermid, de uso libre citando la fuente.",
  estimatedMinutes: 2,
  instructions:
    "Si alguna actividad no la realizas normalmente, estima la dificultad que tendrías al intentarla.",
  domainThresholds: [2.5, 5, 7.5],

  flagLabels: {
    trauma: "La molestia inició tras una caída o golpe",
    mediano: "Hormigueo nocturno en pulgar, índice y medio",
  },

  triage: [
    {
      id: "T1",
      text: "¿Tu molestia empezó por una caída apoyando la mano o por un golpe?",
      options: [
        { label: "Sí", action: "goto:T2" },
        { label: "No", action: "goto:T3" },
      ],
    },
    {
      id: "T2",
      text: "¿Ves la muñeca deformada o tienes dolor intenso en un punto del hueso?",
      options: [
        { label: "Sí", action: "flag:urgente-trauma" },
        { label: "No", action: "flag:trauma" },
      ],
    },
    {
      id: "T3",
      text: "¿Tienes hormigueo en pulgar, índice y medio que te despierta por la noche?",
      options: [
        { label: "Sí", action: "flag:mediano" },
        { label: "No", action: "continue" },
      ],
    },
  ],

  questions,

  domains: [
    {
      id: "basicas",
      label: "Actividades básicas",
      examples: "vestirte, tu aseo personal",
      itemIds: ["s3", "s6", "u1"],
    },
    {
      id: "moderadas",
      label: "Uso cotidiano de la mano",
      examples: "puertas, cocinar, el hogar",
      itemIds: ["s1", "s2", "u2"],
    },
    {
      id: "demandantes",
      label: "Fuerza y carga",
      examples: "apoyarte, cargar, tu trabajo",
      itemIds: ["s4", "s5", "r3", "u3", "u4"],
    },
  ],

  // PRWHE: dolor (r1-r5, /50) y función (s1-s6 + u1-u4, /100), cada uno 50%.
  // higher-is-worse → limitación = score directo (sin inversión).
  scoring: {
    kind: "weighted-subscales",
    direction: "higher-is-worse",
    subscales: [
      {
        id: "dolor",
        itemIds: ["r1", "r2", "r3", "r4", "r5"],
        maxRaw: 50,
        weight: 0.5,
      },
      {
        id: "funcion",
        itemIds: ["s1", "s2", "s3", "s4", "s5", "s6", "u1", "u2", "u3", "u4"],
        maxRaw: 100,
        weight: 0.5,
      },
    ],
  },

  reportTexts: {
    leve: [
      "Tu muñeca te está avisando, pero la función de tu mano se conserva. Es el mejor momento para identificar la causa — la mano agradece los diagnósticos tempranos.",
      "Una valoración con exploración física te dirá con certeza qué lo origina.",
    ],
    moderada: [
      "Tu puntaje indica que la muñeca o la mano ya limitan actividades de tu día a día. Este patrón aparece en tendinitis, compresiones de nervio y secuelas de lesiones — distinguirlo requiere exploración dirigida.",
      "Atenderlo a tiempo protege la función de tu mano. Una valoración te dará un diagnóstico con nombre y apellido, y un plan concreto.",
    ],
    severa: [
      "Tu puntaje refleja una limitación importante: tu mano está condicionando actividades esenciales. La mano no perdona los retrasos — un cuadro así necesita diagnóstico pronto.",
      "La valoración incluye exploración de movilidad, fuerza y nervios, y los estudios que tu caso requiera.",
    ],
  },
};
