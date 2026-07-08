import type { ScaleAnchors, TestQuestion } from "@/lib/evaluacion/types";
import type { TestDefinition } from "@/lib/evaluacion/types";

const PAIN_ANCHORS: ScaleAnchors = {
  min: "Sin dolor",
  max: "El peor imaginable",
};
const FUNC_ANCHORS: ScaleAnchors = {
  min: "Sin dificultad",
  max: "Necesito ayuda / no puedo",
};

const PAIN_HEADER =
  "Durante la última semana, califica tu dolor de hombro del 0 al 10…";
const FUNC_HEADER = "…tu dificultad para realizar cada actividad";

// Subescala de dolor (d1-d5) y de función (f1-f8): reactivos de escala 0-10.
const scale = (
  id: string,
  text: string,
  shortLabel: string,
  header: string,
  anchors: ScaleAnchors,
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
  scale("d1", "…en su peor momento", "Dolor máximo", PAIN_HEADER, PAIN_ANCHORS),
  scale(
    "d2",
    "…al acostarte sobre el lado afectado",
    "Dormir de ese lado",
    PAIN_HEADER,
    PAIN_ANCHORS
  ),
  scale(
    "d3",
    "…al alcanzar algo en una repisa alta",
    "Alcanzar en alto",
    PAIN_HEADER,
    PAIN_ANCHORS,
    "alcanzar una repisa alta despierta tu dolor"
  ),
  scale(
    "d4",
    "…al tocarte la parte de atrás del cuello",
    "Mano a la nuca",
    PAIN_HEADER,
    PAIN_ANCHORS,
    "llevarte la mano a la nuca duele"
  ),
  scale(
    "d5",
    "…al empujar con el brazo afectado",
    "Empujar",
    PAIN_HEADER,
    PAIN_ANCHORS,
    "empujar con ese brazo cobra factura"
  ),
  scale(
    "f1",
    "Lavarte el pelo",
    "Lavarte el pelo",
    FUNC_HEADER,
    FUNC_ANCHORS,
    "lavarte el pelo se volvió tarea difícil"
  ),
  scale(
    "f2",
    "Lavarte la espalda",
    "Lavarte la espalda",
    FUNC_HEADER,
    FUNC_ANCHORS,
    "lavarte la espalda cuesta trabajo"
  ),
  scale(
    "f3",
    "Ponerte una camiseta o suéter por la cabeza",
    "Camiseta por la cabeza",
    FUNC_HEADER,
    FUNC_ANCHORS,
    "meterte una camiseta por la cabeza se complica"
  ),
  scale(
    "f4",
    "Ponerte una camisa que se abotona por delante",
    "Abotonar camisa",
    FUNC_HEADER,
    FUNC_ANCHORS,
    "abotonarte la camisa se ha vuelto lento"
  ),
  scale(
    "f5",
    "Ponerte los pantalones",
    "Ponerte pantalones",
    FUNC_HEADER,
    FUNC_ANCHORS,
    "subirte los pantalones cuesta más de lo normal"
  ),
  scale(
    "f6",
    "Colocar un objeto en una repisa alta",
    "Objeto en repisa alta",
    FUNC_HEADER,
    FUNC_ANCHORS,
    "colocar cosas en alto quedó casi fuera de alcance"
  ),
  scale(
    "f7",
    "Cargar un objeto pesado de 4 a 5 kilos",
    "Cargar 4-5 kg",
    FUNC_HEADER,
    FUNC_ANCHORS,
    "cargar peso con ese brazo se volvió un reto"
  ),
  scale(
    "f8",
    "Sacar algo de tu bolsillo trasero",
    "Bolsillo trasero",
    FUNC_HEADER,
    FUNC_ANCHORS,
    "alcanzar tu bolsillo trasero se complica"
  ),
];

export const hombroTest: TestDefinition = {
  id: "hombro-spadi",
  zoneId: "hombro",
  zoneLabel: "Hombro",
  instrumentName: "SPADI",
  instrumentCitation:
    "SPADI (Shoulder Pain and Disability Index; Roach et al., 1991; versión numérica Williams et al., 1995). Traducción orientativa; instrumento de dominio público.",
  estimatedMinutes: 2,
  instructions:
    "Si alguna actividad no la realizas normalmente, estima la dificultad que tendrías al intentarla.",
  domainThresholds: [2.5, 5, 7.5],

  flagLabels: {
    trauma: "La molestia inició tras un golpe o caída",
    manguito: "Pérdida súbita de fuerza para elevar el brazo",
    "origen-cervical": "Hormigueo que baja del cuello al brazo",
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
      text: "¿Ves el hombro deformado o te resulta imposible mover el brazo?",
      options: [
        // Ningún flag interrumpe el test: se registra y el flujo continúa.
        { label: "Sí", action: "flag:urgente-trauma" },
        { label: "No", action: "flag:trauma" },
      ],
    },
    {
      id: "T3",
      text: "¿Tras un esfuerzo o una caída perdiste de repente la fuerza para levantar el brazo?",
      options: [
        { label: "Sí", action: "flag:manguito" },
        { label: "No", action: "goto:T4" },
      ],
    },
    {
      id: "T4",
      text: "¿Sientes hormigueo que baja del cuello hacia el brazo o la mano?",
      options: [
        { label: "Sí", action: "flag:origen-cervical" },
        { label: "No", action: "continue" },
      ],
    },
  ],

  questions,

  domains: [
    {
      id: "basicas",
      label: "Actividades básicas",
      examples: "vestirte, alcanzar tus bolsillos",
      itemIds: ["f4", "f5", "f8"],
    },
    {
      id: "moderadas",
      label: "Elevación media",
      examples: "asearte, vestirte por la cabeza",
      itemIds: ["f1", "f2", "f3", "d4"],
    },
    {
      id: "demandantes",
      label: "Elevación completa y carga",
      examples: "repisas altas, cargar, empujar",
      itemIds: ["d3", "f6", "f7", "d5"],
    },
  ],

  // SPADI numérico: dolor (d1-d5, /50) y función (f1-f8, /80), cada uno 50%.
  // higher-is-worse → limitación = score directo (sin inversión).
  scoring: {
    kind: "weighted-subscales",
    direction: "higher-is-worse",
    subscales: [
      { id: "dolor", itemIds: ["d1", "d2", "d3", "d4", "d5"], maxRaw: 50, weight: 0.5 },
      {
        id: "funcion",
        itemIds: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"],
        maxRaw: 80,
        weight: 0.5,
      },
    ],
  },

  reportTexts: {
    leve: [
      "Tu hombro te está avisando, pero su función general se conserva. Es el momento ideal para identificar la causa — los problemas de hombro atendidos temprano suelen resolverse con tratamientos simples.",
      "Una valoración con exploración física te dirá con certeza qué lo origina.",
    ],
    moderada: [
      "Tu puntaje indica que el hombro ya limita actividades de tu día a día de forma importante. Este patrón es frecuente en lesiones del manguito rotador y en la inflamación del hombro — distinguirlo requiere exploración física y, con frecuencia, estudios de imagen.",
      "Detectarlo a tiempo evita que la limitación avance. Una valoración te dará un diagnóstico con nombre y apellido, y un plan concreto.",
    ],
    severa: [
      "Tu puntaje refleja una limitación importante: tu hombro está condicionando desde vestirte hasta cargar. Con este nivel de impacto, posponer el diagnóstico puede costar movilidad difícil de recuperar.",
      "La valoración incluye maniobras específicas del hombro y los estudios que tu caso requiera.",
    ],
  },
};
