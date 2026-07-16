import type { TestContent } from "../../types";
import type { ScaleAnchors } from "../../../types";

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

export const hombroContentEs: TestContent = {
  zoneLabel: "Hombro",
  instrumentName: "SPADI",
  instrumentCitation:
    "SPADI (Shoulder Pain and Disability Index; Roach et al., 1991; versión numérica Williams et al., 1995). Traducción orientativa; instrumento de dominio público.",
  instructions:
    "Si alguna actividad no la realizas normalmente, estima la dificultad que tendrías al intentarla.",

  flagLabels: {
    trauma: "La molestia inició tras un golpe o caída",
    manguito: "Pérdida súbita de fuerza para elevar el brazo",
    "origen-cervical": "Hormigueo que baja del cuello al brazo",
  },

  questions: {
    d1: {
      contextHeader: PAIN_HEADER,
      text: "…en su peor momento",
      shortLabel: "Dolor máximo",
      anchors: PAIN_ANCHORS,
    },
    d2: {
      contextHeader: PAIN_HEADER,
      text: "…al acostarte sobre el lado afectado",
      shortLabel: "Dormir de ese lado",
      anchors: PAIN_ANCHORS,
    },
    d3: {
      contextHeader: PAIN_HEADER,
      text: "…al alcanzar algo en una repisa alta",
      shortLabel: "Alcanzar en alto",
      anchors: PAIN_ANCHORS,
      mirrorPhrase: "alcanzar una repisa alta despierta tu dolor",
    },
    d4: {
      contextHeader: PAIN_HEADER,
      text: "…al tocarte la parte de atrás del cuello",
      shortLabel: "Mano a la nuca",
      anchors: PAIN_ANCHORS,
      mirrorPhrase: "llevarte la mano a la nuca duele",
    },
    d5: {
      contextHeader: PAIN_HEADER,
      text: "…al empujar con el brazo afectado",
      shortLabel: "Empujar",
      anchors: PAIN_ANCHORS,
      mirrorPhrase: "empujar con ese brazo cobra factura",
    },
    f1: {
      contextHeader: FUNC_HEADER,
      text: "Lavarte el pelo",
      shortLabel: "Lavarte el pelo",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "lavarte el pelo se volvió tarea difícil",
    },
    f2: {
      contextHeader: FUNC_HEADER,
      text: "Lavarte la espalda",
      shortLabel: "Lavarte la espalda",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "lavarte la espalda cuesta trabajo",
    },
    f3: {
      contextHeader: FUNC_HEADER,
      text: "Ponerte una camiseta o suéter por la cabeza",
      shortLabel: "Camiseta por la cabeza",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "meterte una camiseta por la cabeza se complica",
    },
    f4: {
      contextHeader: FUNC_HEADER,
      text: "Ponerte una camisa que se abotona por delante",
      shortLabel: "Abotonar camisa",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "abotonarte la camisa se ha vuelto lento",
    },
    f5: {
      contextHeader: FUNC_HEADER,
      text: "Ponerte los pantalones",
      shortLabel: "Ponerte pantalones",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "subirte los pantalones cuesta más de lo normal",
    },
    f6: {
      contextHeader: FUNC_HEADER,
      text: "Colocar un objeto en una repisa alta",
      shortLabel: "Objeto en repisa alta",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "colocar cosas en alto quedó casi fuera de alcance",
    },
    f7: {
      contextHeader: FUNC_HEADER,
      text: "Cargar un objeto pesado de 4 a 5 kilos",
      shortLabel: "Cargar 4-5 kg",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "cargar peso con ese brazo se volvió un reto",
    },
    f8: {
      contextHeader: FUNC_HEADER,
      text: "Sacar algo de tu bolsillo trasero",
      shortLabel: "Bolsillo trasero",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "alcanzar tu bolsillo trasero se complica",
    },
  },

  triage: {
    T1: {
      text: "¿Tu molestia empezó por un golpe o una caída reciente?",
      optionLabels: ["Sí", "No"],
    },
    T2: {
      text: "¿Ves el hombro deformado o te resulta imposible mover el brazo?",
      optionLabels: ["Sí", "No"],
    },
    T3: {
      text: "¿Tras un esfuerzo o una caída perdiste de repente la fuerza para levantar el brazo?",
      optionLabels: ["Sí", "No"],
    },
    T4: {
      text: "¿Sientes hormigueo que baja del cuello hacia el brazo o la mano?",
      optionLabels: ["Sí", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Actividades básicas",
      examples: "vestirte, alcanzar tus bolsillos",
    },
    moderadas: {
      label: "Elevación media",
      examples: "asearte, vestirte por la cabeza",
    },
    demandantes: {
      label: "Elevación completa y carga",
      examples: "repisas altas, cargar, empujar",
    },
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
