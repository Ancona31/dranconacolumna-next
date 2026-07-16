import type { ScaleAnchors } from "@/lib/evaluacion/types";

import type { QuestionContent, TestContent } from "../../types";

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
  text: string,
  shortLabel: string,
  anchors: ScaleAnchors,
  contextHeader?: string,
  mirrorPhrase?: string
): QuestionContent => ({
  contextHeader,
  text,
  shortLabel,
  anchors,
  mirrorPhrase,
});

export const munecaContentEs: TestContent = {
  zoneLabel: "Muñeca y mano",
  instrumentName: "PRWHE",
  instrumentCitation:
    "PRWHE (Patient-Rated Wrist/Hand Evaluation; MacDermid, 1998). Traducción orientativa; © J. MacDermid, de uso libre citando la fuente.",
  instructions:
    "Si alguna actividad no la realizas normalmente, estima la dificultad que tendrías al intentarla.",

  flagLabels: {
    trauma: "La molestia inició tras una caída o golpe",
    mediano: "Hormigueo nocturno en pulgar, índice y medio",
  },

  questions: {
    r1: scale("…en reposo", "Dolor en reposo", PAIN_ANCHORS, PAIN_HEADER),
    r2: scale(
      "…al hacer un movimiento repetido con la muñeca",
      "Dolor en movimiento repetido",
      PAIN_ANCHORS,
      PAIN_HEADER
    ),
    r3: scale(
      "…al levantar un objeto pesado",
      "Dolor al levantar peso",
      PAIN_ANCHORS,
      PAIN_HEADER,
      "levantar objetos pesados dispara el dolor"
    ),
    r4: scale(
      "…en su peor momento",
      "Dolor máximo",
      PAIN_ANCHORS,
      PAIN_HEADER
    ),
    r5: scale(
      "¿Con qué frecuencia tienes dolor?",
      "Frecuencia del dolor",
      FREQ_ANCHORS
    ),
    s1: scale(
      "Girar una perilla",
      "Girar una perilla",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "girar una perilla se volvió doloroso"
    ),
    s2: scale(
      "Cortar carne con un cuchillo",
      "Cortar con cuchillo",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "cortar tu comida cuesta trabajo"
    ),
    s3: scale(
      "Abrocharte los botones de la camisa",
      "Abotonar camisa",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "abotonarte la camisa se ha vuelto lento"
    ),
    s4: scale(
      "Usar esa mano para empujarte y levantarte de una silla",
      "Levantarte de la silla",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "apoyar la mano para levantarte duele"
    ),
    s5: scale(
      "Cargar un objeto de 4 a 5 kilos",
      "Cargar 4-5 kg",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "cargar peso con esa mano quedó en pausa"
    ),
    s6: scale(
      "Usar papel higiénico",
      "Usar papel higiénico",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "hasta el aseo personal se complica"
    ),
    u1: scale(
      "Tus actividades personales (vestirte, asearte)",
      "Actividades personales",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "tu arreglo personal se volvió más lento"
    ),
    u2: scale(
      "El trabajo del hogar (limpieza, mantenimiento)",
      "Trabajo del hogar",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "el trabajo del hogar te está costando"
    ),
    u3: scale(
      "Tu trabajo (empleo o labor habitual)",
      "Tu trabajo",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "tu trabajo diario se ve afectado"
    ),
    u4: scale(
      "Tus actividades recreativas",
      "Actividades recreativas",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "tus pasatiempos quedaron en pausa"
    ),
  },

  triage: {
    T1: {
      text: "¿Tu molestia empezó por una caída apoyando la mano o por un golpe?",
      optionLabels: ["Sí", "No"],
    },
    T2: {
      text: "¿Ves la muñeca deformada o tienes dolor intenso en un punto del hueso?",
      optionLabels: ["Sí", "No"],
    },
    T3: {
      text: "¿Tienes hormigueo en pulgar, índice y medio que te despierta por la noche?",
      optionLabels: ["Sí", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Actividades básicas",
      examples: "vestirte, tu aseo personal",
    },
    moderadas: {
      label: "Uso cotidiano de la mano",
      examples: "puertas, cocinar, el hogar",
    },
    demandantes: {
      label: "Fuerza y carga",
      examples: "apoyarte, cargar, tu trabajo",
    },
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
