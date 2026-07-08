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
  "Durante la última semana, califica tu dolor de codo del 0 al 10…";
const FUNC_HEADER = "…tu dificultad para realizar cada actividad";

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
  scale("p1", "…en reposo", "Dolor en reposo", PAIN_ANCHORS, PAIN_HEADER),
  scale(
    "p2",
    "…al hacer una tarea con movimiento repetido del codo",
    "Dolor en movimiento repetido",
    PAIN_ANCHORS,
    PAIN_HEADER
  ),
  scale(
    "p3",
    "…al levantar un objeto pesado",
    "Dolor al levantar peso",
    PAIN_ANCHORS,
    PAIN_HEADER,
    "levantar objetos pesados dispara el dolor"
  ),
  scale("p4", "…en su peor momento", "Dolor máximo", PAIN_ANCHORS, PAIN_HEADER),
  scale(
    "p5",
    "¿Con qué frecuencia tienes dolor?",
    "Frecuencia del dolor",
    FREQ_ANCHORS
  ),
  scale(
    "e1",
    "Peinarte",
    "Peinarte",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "peinarte se volvió incómodo"
  ),
  scale(
    "e2",
    "Comer con tenedor o cuchara",
    "Usar cubiertos",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "usar cubiertos te cuesta"
  ),
  scale(
    "e3",
    "Jalar un objeto pesado",
    "Jalar objeto pesado",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "jalar objetos pesados quedó en pausa"
  ),
  scale(
    "e4",
    "Usar tu brazo para levantarte de una silla",
    "Levantarte de la silla",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "apoyar el brazo para levantarte cuesta"
  ),
  scale(
    "e5",
    "Cargar un objeto de 4 a 5 kilos con el brazo al costado",
    "Cargar 4-5 kg",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "cargar peso con ese brazo se volvió un reto"
  ),
  scale(
    "e6",
    "Lanzar un objeto pequeño, como una pelota",
    "Lanzar una pelota",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "lanzar hasta algo ligero resulta difícil"
  ),
  scale(
    "e7",
    "Usar el teléfono",
    "Usar el teléfono",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "sostener el teléfono incomoda"
  ),
  scale(
    "e8",
    "Abrocharte los botones de la camisa",
    "Abotonar camisa",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "abotonarte la camisa se ha vuelto lento"
  ),
  scale(
    "e9",
    "Lavarte la axila del lado contrario",
    "Lavarte la axila contraria",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "lavarte la axila contraria cuesta trabajo"
  ),
  scale(
    "e10",
    "Atarte las agujetas",
    "Atarte las agujetas",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "atarte las agujetas se complica"
  ),
  scale(
    "e11",
    "Girar una perilla y abrir una puerta",
    "Abrir una puerta",
    FUNC_ANCHORS,
    FUNC_HEADER,
    "abrir una puerta girando la perilla duele"
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

export const codoTest: TestDefinition = {
  id: "codo-pree",
  zoneId: "codo",
  zoneLabel: "Codo",
  instrumentName: "PREE",
  instrumentCitation:
    "PREE (Patient-Rated Elbow Evaluation; MacDermid, 2009). Traducción orientativa; © J. MacDermid, de uso libre citando la fuente.",
  estimatedMinutes: 2,
  instructions:
    "Si alguna actividad no la realizas normalmente, estima la dificultad que tendrías al intentarla.",
  domainThresholds: [2.5, 5, 7.5],

  flagLabels: {
    trauma: "La molestia inició tras un golpe o caída",
    cubital: "Hormigueo en meñique y anular",
  },

  triage: [
    {
      id: "T1",
      text: "¿Tu molestia empezó por un golpe o una caída reciente?",
      options: [
        { label: "Sí", action: "goto:T2" },
        { label: "No", action: "goto:T3" },
      ],
    },
    {
      id: "T2",
      text: "¿Ves el codo deformado o no puedes doblarlo ni estirarlo?",
      options: [
        { label: "Sí", action: "flag:urgente-trauma" },
        { label: "No", action: "flag:trauma" },
      ],
    },
    {
      id: "T3",
      text: "¿Sientes hormigueo en el dedo meñique y el anular?",
      options: [
        { label: "Sí", action: "flag:cubital" },
        { label: "No", action: "continue" },
      ],
    },
  ],

  questions,

  domains: [
    {
      id: "basicas",
      label: "Actividades básicas",
      examples: "comer, vestirte, el teléfono",
      itemIds: ["e2", "e7", "e8", "u1"],
    },
    {
      id: "moderadas",
      label: "Uso cotidiano del brazo",
      examples: "asearte, puertas, el hogar",
      itemIds: ["e1", "e9", "e10", "e11", "e4", "u2"],
    },
    {
      id: "demandantes",
      label: "Fuerza y carga",
      examples: "jalar, cargar, lanzar, tu trabajo",
      itemIds: ["e3", "e5", "e6", "p3", "u3", "u4"],
    },
  ],

  // PREE: dolor (p1-p5, /50) y función (e1-e11 + u1-u4, /150), cada uno 50%.
  // higher-is-worse → limitación = score directo (sin inversión).
  scoring: {
    kind: "weighted-subscales",
    direction: "higher-is-worse",
    subscales: [
      {
        id: "dolor",
        itemIds: ["p1", "p2", "p3", "p4", "p5"],
        maxRaw: 50,
        weight: 0.5,
      },
      {
        id: "funcion",
        itemIds: [
          "e1",
          "e2",
          "e3",
          "e4",
          "e5",
          "e6",
          "e7",
          "e8",
          "e9",
          "e10",
          "e11",
          "u1",
          "u2",
          "u3",
          "u4",
        ],
        maxRaw: 150,
        weight: 0.5,
      },
    ],
  },

  reportTexts: {
    leve: [
      "Tu codo te está avisando, pero conserva su función general. Es buen momento para identificar la causa con precisión — la mayoría de los problemas de codo detectados temprano responden a tratamientos simples.",
      "Una valoración con exploración física te dirá qué lo origina.",
    ],
    moderada: [
      "Tu puntaje indica que el codo ya interfiere con actividades de tu día a día. Este patrón aparece en tendinitis, sobrecargas y otras lesiones del codo — distinguirlas requiere exploración física dirigida.",
      "Atenderlo a tiempo evita que se vuelva crónico. Una valoración te dará un diagnóstico con nombre y apellido, y un plan concreto.",
    ],
    severa: [
      "Tu puntaje refleja una limitación importante: tu codo está condicionando desde comer hasta trabajar. Un cuadro con este impacto necesita diagnóstico preciso pronto.",
      "La valoración incluye exploración completa del codo y los estudios que tu caso requiera.",
    ],
  },
};
