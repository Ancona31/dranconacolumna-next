import type { TestContent } from "../../types";

const PAIN_ANCHORS = { min: "Sin dolor", max: "El peor posible" };
const FREQ_ANCHORS = { min: "Nunca", max: "Siempre" };
const FUNC_ANCHORS = {
  min: "Sin dificultad",
  max: "Incapaz de hacerlo",
};

const PAIN_HEADER =
  "Durante la última semana, califica tu dolor de codo del 0 al 10…";
const FUNC_HEADER = "…tu dificultad para realizar cada actividad";

export const codoContentEs: TestContent = {
  zoneLabel: "Codo",
  instrumentName: "PREE",
  instrumentCitation:
    "PREE (Patient-Rated Elbow Evaluation; MacDermid, 2009). Traducción orientativa; © J. MacDermid, de uso libre citando la fuente.",
  instructions:
    "Si alguna actividad no la realizas normalmente, estima la dificultad que tendrías al intentarla.",

  flagLabels: {
    trauma: "La molestia inició tras un golpe o caída",
    cubital: "Hormigueo en meñique y anular",
  },

  questions: {
    p1: {
      contextHeader: PAIN_HEADER,
      text: "…en reposo",
      shortLabel: "Dolor en reposo",
      anchors: PAIN_ANCHORS,
    },
    p2: {
      contextHeader: PAIN_HEADER,
      text: "…al hacer una tarea con movimiento repetido del codo",
      shortLabel: "Dolor en movimiento repetido",
      anchors: PAIN_ANCHORS,
    },
    p3: {
      contextHeader: PAIN_HEADER,
      text: "…al levantar un objeto pesado",
      shortLabel: "Dolor al levantar peso",
      mirrorPhrase: "levantar objetos pesados dispara el dolor",
      anchors: PAIN_ANCHORS,
    },
    p4: {
      contextHeader: PAIN_HEADER,
      text: "…en su peor momento",
      shortLabel: "Dolor máximo",
      anchors: PAIN_ANCHORS,
    },
    p5: {
      text: "¿Con qué frecuencia tienes dolor?",
      shortLabel: "Frecuencia del dolor",
      anchors: FREQ_ANCHORS,
    },
    e1: {
      contextHeader: FUNC_HEADER,
      text: "Peinarte",
      shortLabel: "Peinarte",
      mirrorPhrase: "peinarte se volvió incómodo",
      anchors: FUNC_ANCHORS,
    },
    e2: {
      contextHeader: FUNC_HEADER,
      text: "Comer con tenedor o cuchara",
      shortLabel: "Usar cubiertos",
      mirrorPhrase: "usar cubiertos te cuesta",
      anchors: FUNC_ANCHORS,
    },
    e3: {
      contextHeader: FUNC_HEADER,
      text: "Jalar un objeto pesado",
      shortLabel: "Jalar objeto pesado",
      mirrorPhrase: "jalar objetos pesados quedó en pausa",
      anchors: FUNC_ANCHORS,
    },
    e4: {
      contextHeader: FUNC_HEADER,
      text: "Usar tu brazo para levantarte de una silla",
      shortLabel: "Levantarte de la silla",
      mirrorPhrase: "apoyar el brazo para levantarte cuesta",
      anchors: FUNC_ANCHORS,
    },
    e5: {
      contextHeader: FUNC_HEADER,
      text: "Cargar un objeto de 4 a 5 kilos con el brazo al costado",
      shortLabel: "Cargar 4-5 kg",
      mirrorPhrase: "cargar peso con ese brazo se volvió un reto",
      anchors: FUNC_ANCHORS,
    },
    e6: {
      contextHeader: FUNC_HEADER,
      text: "Lanzar un objeto pequeño, como una pelota",
      shortLabel: "Lanzar una pelota",
      mirrorPhrase: "lanzar hasta algo ligero resulta difícil",
      anchors: FUNC_ANCHORS,
    },
    e7: {
      contextHeader: FUNC_HEADER,
      text: "Usar el teléfono",
      shortLabel: "Usar el teléfono",
      mirrorPhrase: "sostener el teléfono incomoda",
      anchors: FUNC_ANCHORS,
    },
    e8: {
      contextHeader: FUNC_HEADER,
      text: "Abrocharte los botones de la camisa",
      shortLabel: "Abotonar camisa",
      mirrorPhrase: "abotonarte la camisa se ha vuelto lento",
      anchors: FUNC_ANCHORS,
    },
    e9: {
      contextHeader: FUNC_HEADER,
      text: "Lavarte la axila del lado contrario",
      shortLabel: "Lavarte la axila contraria",
      mirrorPhrase: "lavarte la axila contraria cuesta trabajo",
      anchors: FUNC_ANCHORS,
    },
    e10: {
      contextHeader: FUNC_HEADER,
      text: "Atarte las agujetas",
      shortLabel: "Atarte las agujetas",
      mirrorPhrase: "atarte las agujetas se complica",
      anchors: FUNC_ANCHORS,
    },
    e11: {
      contextHeader: FUNC_HEADER,
      text: "Girar una perilla y abrir una puerta",
      shortLabel: "Abrir una puerta",
      mirrorPhrase: "abrir una puerta girando la perilla duele",
      anchors: FUNC_ANCHORS,
    },
    u1: {
      contextHeader: FUNC_HEADER,
      text: "Tus actividades personales (vestirte, asearte)",
      shortLabel: "Actividades personales",
      mirrorPhrase: "tu arreglo personal se volvió más lento",
      anchors: FUNC_ANCHORS,
    },
    u2: {
      contextHeader: FUNC_HEADER,
      text: "El trabajo del hogar (limpieza, mantenimiento)",
      shortLabel: "Trabajo del hogar",
      mirrorPhrase: "el trabajo del hogar te está costando",
      anchors: FUNC_ANCHORS,
    },
    u3: {
      contextHeader: FUNC_HEADER,
      text: "Tu trabajo (empleo o labor habitual)",
      shortLabel: "Tu trabajo",
      mirrorPhrase: "tu trabajo diario se ve afectado",
      anchors: FUNC_ANCHORS,
    },
    u4: {
      contextHeader: FUNC_HEADER,
      text: "Tus actividades recreativas",
      shortLabel: "Actividades recreativas",
      mirrorPhrase: "tus pasatiempos quedaron en pausa",
      anchors: FUNC_ANCHORS,
    },
  },

  triage: {
    T1: {
      text: "¿Tu molestia empezó por un golpe o una caída reciente?",
      optionLabels: ["Sí", "No"],
    },
    T2: {
      text: "¿Ves el codo deformado o no puedes doblarlo ni estirarlo?",
      optionLabels: ["Sí", "No"],
    },
    T3: {
      text: "¿Sientes hormigueo en el dedo meñique y el anular?",
      optionLabels: ["Sí", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Actividades básicas",
      examples: "comer, vestirte, el teléfono",
    },
    moderadas: {
      label: "Uso cotidiano del brazo",
      examples: "asearte, puertas, el hogar",
    },
    demandantes: {
      label: "Fuerza y carga",
      examples: "jalar, cargar, lanzar, tu trabajo",
    },
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
