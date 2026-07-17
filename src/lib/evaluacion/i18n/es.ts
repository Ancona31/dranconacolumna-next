/**
 * Copy transversal del motor en ESPAÑOL. Extracción byte-idéntica de engine.ts
 * (PASO 1 de F3.A). No reescribir: cada string debe quedar carácter por
 * carácter igual al original — el harness de regresión lo verifica.
 */

import type { EngineCopy } from "./types";

export const es: EngineCopy = {
  recommendationEyebrow: "VALORACIÓN RECOMENDADA",

  recommendations: {
    leve: {
      window: "Esta semana",
      context:
        "Tu resultado no muestra datos de urgencia. Una valoración médica te dará un diagnóstico claro y un plan.",
    },
    moderada: {
      window: "En los próximos 3 días",
      context: "Este nivel de limitación amerita valoración médica.",
    },
    severa: {
      window: "En las próximas 24 a 48 horas",
      context: "Tu resultado amerita valoración pronta.",
    },
    precaucion: {
      window: "En las próximas 24 a 48 horas",
      context:
        "Además de tu nivel de limitación, los datos que marcaste ameritan valoración pronta.",
    },
    urgente: {
      window: "Hoy mismo, en un servicio de urgencias",
      context: "Lo indicado es valoración presencial.",
    },
  },

  nivelDefinitions: {
    leve: "Una limitación leve significa que puedes realizar la mayoría de tus actividades diarias y laborales, aunque con molestias ocasionales o al final del día.",
    moderada:
      "Una limitación moderada puede dificultar tus actividades de la vida diaria o laborales. Ten precaución si tu trabajo incluye cargar objetos pesados, o caminar por lugares peligrosos, estrechos o con desniveles.",
    severa:
      "Una limitación severa puede imposibilitar casi por completo las actividades básicas del día a día y puede hacer inseguro el trabajo físico. Evita esfuerzos importantes, cargas pesadas y superficies de riesgo hasta que un médico valore tu caso.",
  },

  funcStateLabels: {
    verde: "Sin dificultad importante",
    amarillo: "Con dificultad leve",
    naranja: "Con dificultad considerable",
    rojo: "Muy limitada hoy",
    na: "No aplica en tu caso",
  },

  domainNaPhrase:
    "Indicaste que estas actividades están limitadas por otra causa.",

  unscorableMessage:
    "No pudimos calcular tu resultado: marcaste todas las actividades como no aplicables.",

  funcAllGreenLine:
    "Tus respuestas no muestran limitación funcional. Si el dolor persiste a pesar de eso, también merece explicación.",

  defaultSemaphoreTitle: "Tu capacidad hoy, según tus respuestas",

  domainPhrases: {
    verde: {
      basicas:
        "Lo esencial de tu día se mantiene sin dificultad importante. Cuida esa base: es tu punto de partida para recuperarte.",
      moderadas:
        "Tu movilidad cotidiana se conserva bien. Mantén la precaución para que siga así.",
      demandantes:
        "Los esfuerzos mayores todavía no te limitan de forma importante. Aun así, no te confíes: escucha a tu cuerpo.",
    },
    amarillo: {
      basicas:
        "Asoma una limitación en lo más elemental{ej}. Es leve, pero en este terreno cualquier señal temprana cuenta.",
      moderadas:
        "Tu movilidad diaria empieza a resentirse{ej}. Es una señal temprana que conviene no dejar crecer.",
      demandantes:
        "Los esfuerzos mayores empiezan a cobrarte factura{ej}. Modérate en este terreno.",
    },
    naranja: {
      basicas:
        "Lo esencial del día ya te exige un esfuerzo claro{ej}. Este dato pesa en tu evaluación: no lo normalices.",
      moderadas:
        "Tu movilidad cotidiana está claramente comprometida{ej}. Dosifica estas actividades.",
      demandantes:
        "Los esfuerzos mayores ya te generan dificultad franca{ej}. Redúcelos a lo indispensable.",
    },
    rojo: {
      basicas:
        "Las actividades más elementales están gravemente afectadas{ej}. Es el hallazgo de mayor peso en tu evaluación.",
      moderadas:
        "El impacto alcanza de lleno tu movilidad diaria{ej}. Limítala a lo estrictamente necesario.",
      demandantes:
        "Los esfuerzos mayores quedan fuera de tus posibilidades por ahora{ej}. Evítalos por completo hasta tener un diagnóstico.",
    },
  },

  elevatedPhrases: {
    amarillo:
      "Tus actividades más ligeras ya muestran limitación — este terreno merece la misma precaución.",
    naranja:
      "Por el nivel de limitación que muestran tus actividades más ligeras, este terreno te exigirá aún más: dosifícalo.",
    rojo: "Por el nivel de limitación que muestran tus actividades más ligeras, este es el terreno con mayor riesgo de sobreesfuerzo — evítalo hasta tener un diagnóstico.",
  },

  exampleLead: " — por ejemplo, ",
  exampleJoin: " y ",

  redFlagLabels: {
    fiebre: "Fiebre junto con el dolor",
    "perdida-peso": "Pérdida de peso sin explicación",
    cancer: "Antecedente de cáncer",
    "dolor-nocturno":
      "El dolor me despierta por la noche y no cede con el reposo",
  },
  redFlagNoneLabel: "Ninguna de las anteriores",

  urgentFlagBanners: {
    "urgente-trauma": {
      title: "Tu lesión necesita valoración hoy",
      body: "Indicaste que tras un golpe o caída no puedes apoyar el pie. Eso debe revisarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo; le servirá al médico que te atienda.",
    },
    "urgente-neurologico": {
      title: "Tus respuestas incluyen datos que deben valorarse hoy",
      body: "Indicaste debilidad que avanza, adormecimiento en la zona genital o dificultad nueva para controlar esfínteres. Esos datos requieren valoración presencial hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo.",
    },
    "urgente-neurologico-dorsal": {
      title: "Tus respuestas incluyen datos que deben valorarse hoy",
      body: "Indicaste debilidad o torpeza en las piernas de aparición súbita. Ese dato debe valorarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo.",
    },
  },

  urgentTraumaBannerByZone: {
    hombro: {
      title: "Tu lesión necesita valoración hoy",
      body: "Indicaste que tras un golpe o caída tienes deformidad o no puedes mover el brazo o la mano afectada. Eso debe revisarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo; le servirá al médico que te atienda.",
    },
    codo: {
      title: "Tu lesión necesita valoración hoy",
      body: "Indicaste que tras un golpe o caída tienes deformidad o no puedes mover el brazo o la mano afectada. Eso debe revisarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo; le servirá al médico que te atienda.",
    },
    muneca: {
      title: "Tu lesión necesita valoración hoy",
      body: "Indicaste que tras un golpe o caída tienes deformidad o no puedes mover el brazo o la mano afectada. Eso debe revisarse presencialmente hoy mismo — acude a un servicio de urgencias. Lleva este reporte contigo; le servirá al médico que te atienda.",
    },
  },

  cautionBannerTitle: "Datos que merecen valoración médica",
  cautionBannerBody: (marks) =>
    `Marcaste: ${marks}. Estos datos por sí solos no confirman ningún problema grave, pero sí ameritan que un médico los valore pronto para descartar causas que requieren tratamiento específico.`,

  evaluationSignature: "Esta es la valoración que realizo en consulta.",

  warningClosing:
    "Si aparece cualquiera de estas señales, no esperes tu cita: busca valoración de inmediato. Lo más importante: no ignores lo que tu cuerpo te está diciendo.",

  evaluationPlans: {
    cuello: {
      base: [
        "Exploraré la movilidad de tu cuello y los movimientos que despiertan tu dolor",
        "Revisaré la fuerza, los reflejos y la sensibilidad de tus brazos",
        "Valoraré estudios de imagen si tu caso los requiere",
      ],
      byFlag: {
        "radicular-cervical":
          "Buscaré el origen exacto del dolor que baja por tu brazo",
        mielopatia:
          "Exploraré con detalle la función de tus manos, tus reflejos y tu marcha — los datos que marcaste son importantes y merecen una revisión neurológica cuidadosa.",
        trauma: "Descartaré lesiones por el accidente que mencionaste",
      },
    },
    "espalda-alta": {
      base: [
        "Exploraré tu columna dorsal y las posturas o movimientos que despiertan el dolor",
        "Revisaré la fuerza y los reflejos de tus piernas",
        "Valoraré estudios de imagen — en esta zona suelen ser especialmente útiles",
      ],
      byFlag: {
        "banda-dorsal":
          "Evaluaré el trayecto del dolor que rodea hacia tu pecho",
        "deficit-dorsal":
          "Exploraré a fondo la fuerza y los reflejos de tus piernas — ese dato guiará tu valoración.",
        trauma:
          "Descartaré una fractura vertebral por el golpe que mencionaste",
      },
    },
    "espalda-baja": {
      base: [
        "Revisaré cómo se mueve tu columna y qué movimientos despiertan tu dolor",
        "Evaluaré la fuerza de tus piernas y cómo responden tus reflejos",
        "Valoraré si tu caso necesita estudios de imagen y cuáles",
      ],
      byFlag: {
        radicular: "Buscaré el origen exacto del dolor que baja por tu pierna",
        claudicacion:
          "Mediré cuánto puedes caminar antes de que el dolor te detenga — un dato clave en tu caso",
      },
    },
    cadera: {
      base: [
        "Exploraré los movimientos de tu cadera para localizar el origen del dolor",
        "Revisaré tu forma de caminar",
        "Valoraré estudios de imagen si tu caso los requiere",
      ],
      byFlag: {
        trauma:
          "Descartaré una lesión en el hueso por el golpe que mencionaste",
      },
    },
    rodilla: {
      base: [
        "Exploraré tu rodilla con maniobras específicas de meniscos y ligamentos",
        "Revisaré su estabilidad y su movilidad",
        "Valoraré estudios de imagen si se requieren",
      ],
      byFlag: {
        inestabilidad: "Buscaré la causa de que se trabe o se doble",
        trauma:
          "Descartaré una lesión en el hueso por el golpe que mencionaste",
      },
    },
    hombro: {
      base: [
        "Exploraré los movimientos de tu hombro con maniobras específicas del manguito rotador",
        "Revisaré tu fuerza para elevar y rotar el brazo",
        "Valoraré estudios de imagen si tu caso los requiere",
      ],
      byFlag: {
        manguito:
          "Pondré especial atención a la pérdida de fuerza que notaste tras el esfuerzo",
        "origen-cervical":
          "Revisaré también tu cuello: parte del dolor de hombro puede originarse ahí",
        trauma:
          "Descartaré una lesión en el hueso por el golpe que mencionaste",
      },
    },
    codo: {
      base: [
        "Exploraré la movilidad completa de tu codo y los puntos exactos donde duele",
        "Evaluaré la fuerza de tu brazo y antebrazo",
        "Valoraré estudios de imagen si se requieren",
      ],
      byFlag: {
        cubital: "Revisaré el nervio que causa el hormigueo en tus dedos",
        trauma:
          "Descartaré una lesión en el hueso por el golpe que mencionaste",
      },
    },
    muneca: {
      base: [
        "Exploraré tu muñeca y tu mano: movilidad, fuerza de puño y puntos de dolor",
        "Revisaré la función de tus nervios y tendones",
        "Valoraré estudios de imagen si se requieren",
      ],
      byFlag: {
        mediano: "Evaluaré el nervio que provoca el hormigueo nocturno",
        trauma: "Descartaré una fractura por la caída que mencionaste",
      },
    },
    tobillo: {
      base: [
        "Exploraré tu tobillo y tu pie: movilidad, puntos de dolor y estabilidad de los ligamentos",
        "Revisaré tu apoyo y tu forma de caminar",
        "Valoraré estudios de imagen si tu caso los requiere",
      ],
      byFlag: {
        trauma:
          "Descartaré una fractura o una lesión de ligamentos por la torcedura que mencionaste",
        "inflamacion-aguda":
          "Estudiaré la causa de la inflamación — hay varias posibles y distinguirlas cambia por completo el tratamiento",
      },
    },
  },

  warningSigns: {
    cuello: [
      "Torpeza en las manos o inestabilidad que empeora rápidamente",
      "Debilidad nueva en un brazo o una mano",
      "Fiebre junto con el dolor de cuello",
    ],
    "espalda-alta": [
      "Debilidad o torpeza nueva en las piernas",
      "Dificultad nueva para controlar la orina o el excremento",
      "Fiebre junto con el dolor de espalda",
    ],
    "espalda-baja": [
      "Debilidad nueva o creciente en el pie o la pierna",
      "Adormecimiento en la zona genital o dificultad nueva para controlar la orina o el excremento",
      "Fiebre junto con el dolor de espalda",
    ],
    cadera: [
      "Imposibilidad repentina de apoyar la pierna",
      "Deformidad visible o acortamiento de la pierna tras un golpe",
      "Fiebre junto con dolor de cadera",
    ],
    rodilla: [
      "Imposibilidad de apoyar o de estirar la rodilla",
      "Hinchazón súbita e importante",
      "Fiebre con la rodilla caliente y enrojecida",
    ],
    hombro: [
      "Deformidad visible del hombro tras un golpe o caída",
      "Incapacidad total para mover el brazo",
      "Fiebre con el hombro caliente e hinchado",
    ],
    codo: [
      "Deformidad visible del codo",
      "Imposibilidad de doblar o estirar el codo",
      "Fiebre con el codo caliente e hinchado",
    ],
    muneca: [
      "Deformidad visible tras una caída",
      "Dedos fríos, pálidos o amoratados",
      "Fiebre con hinchazón de la muñeca o la mano",
    ],
    tobillo: [
      "Deformidad visible tras una torcedura o golpe",
      "Dedos fríos, pálidos o amoratados",
      "Fiebre con el tobillo o el pie caliente e hinchado",
    ],
  },

  partialAnswersNote: (answered, total) =>
    `Resultado orientativo: calculado con ${answered} de ${total} actividades (el resto las marcaste como no aplicables).`,

  whatsapp: {
    ventanaCorta: {
      urgente: "hoy mismo",
      precaucion: "en 24 a 48 horas",
      severa: "en 24 a 48 horas",
      moderada: "en los proximos 3 dias",
      leve: "esta semana",
    },
    qrShort: (folio, score, level, ventana) =>
      `Quiero agendar una valoracion. ${folio}: ${score}/100, ${level}, valoracion ${ventana}.`,
    qr: (zona, folio, score, level, ventana) =>
      `Quiero agendar una valoracion. Evaluacion de ${zona} ${folio}: ${score}/100, limitacion ${level}. Recomendacion del test: valoracion ${ventana}.`,
    qrAlarmSuffix: " Marque datos de alarma.",
    fullUrgente: (zoneLabel, folio) =>
      `Hola Dr. Ancona, mi evaluación de ${zoneLabel} detectó datos de alarma (folio ${folio}). Acudiré a urgencias; le aviso de mi caso.`,
    fullUnscorable: (zoneLabel, folio) =>
      `Hola Dr. Ancona, respondí la evaluación de ${zoneLabel} (folio ${folio}), pero marqué todas las actividades como no aplicables y no obtuve resultado. Quiero agendar una valoración.`,
    fullBase: (zoneLabel, folio, level, score) =>
      `Hola Dr. Ancona, completé la evaluación de ${zoneLabel} (folio ${folio}). Resultado: limitación ${level}, ${score}/100. Quiero agendar una valoración.`,
    fullPrecaucionSuffix: " Marqué datos de alarma en el cuestionario.",
  },
};
