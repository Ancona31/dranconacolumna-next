import type { TestContent } from "../../types";

// Encabezado de contexto común a las 24 frases.
const CONTEXT = "Piensa en cómo te encuentras HOY. ¿Esta frase te describe?";

// Labels Sí/No en el MISMO orden que optionValues [1, 0].
const SI_NO_LABELS = ["Sí", "No"];

export const espaldaBajaContentEs: TestContent = {
  zoneLabel: "Espalda baja",
  instrumentName: "Cuestionario Roland-Morris (RMDQ)",
  instrumentCitation:
    "Cuestionario de Roland-Morris, versión española validada. © Fundación Kovacs (Kovacs FM, Llobera J, Gil del Real MT, Abraira V, Gestoso M, Fernández C. Validation of the Spanish version of the Roland Morris Questionnaire. Spine 2002;27:538-542). Aplicación orientativa. Adaptación léxica mínima para México.",
  questionNoun: { singular: "frase", plural: "frases" },

  flagLabels: {
    radicular: "El dolor se extiende por debajo de la rodilla",
    claudicacion: "El dolor al caminar te obliga a detenerte y cede al sentarte",
    trauma: "El dolor inició tras un golpe o caída",
  },

  questions: {
    q1: {
      contextHeader: CONTEXT,
      text: "Me quedo en casa la mayor parte del tiempo por mi dolor de espalda.",
      shortLabel: "Quedarse en casa",
      mirrorPhrase: "pasas más tiempo en casa del que quisieras",
      optionLabels: SI_NO_LABELS,
    },
    q2: {
      contextHeader: CONTEXT,
      text: "Cambio de postura con frecuencia para intentar aliviar la espalda.",
      shortLabel: "Cambiar de postura",
      mirrorPhrase: "buscas constantemente posturas que alivien",
      optionLabels: SI_NO_LABELS,
    },
    q3: {
      contextHeader: CONTEXT,
      text: "Debido a mi espalda, camino más lentamente de lo normal.",
      shortLabel: "Caminar más lento",
      mirrorPhrase: "desplazarte te toma más tiempo del habitual",
      optionLabels: SI_NO_LABELS,
    },
    q4: {
      contextHeader: CONTEXT,
      text: "Debido a mi espalda, no puedo hacer ninguno de los quehaceres que habitualmente hago en casa.",
      shortLabel: "Quehaceres de casa",
      mirrorPhrase: "las labores del hogar se han vuelto un reto",
      optionLabels: SI_NO_LABELS,
    },
    q5: {
      contextHeader: CONTEXT,
      text: "Por mi espalda, uso el pasamanos para subir escaleras.",
      shortLabel: "Usar el pasamanos",
      mirrorPhrase: "las escaleras ya piden apoyo extra",
      optionLabels: SI_NO_LABELS,
    },
    q6: {
      contextHeader: CONTEXT,
      text: "A causa de mi espalda, debo acostarme más a menudo para descansar.",
      shortLabel: "Acostarse a descansar",
      mirrorPhrase: "tu espalda te pide recostarte con frecuencia",
      optionLabels: SI_NO_LABELS,
    },
    q7: {
      contextHeader: CONTEXT,
      text: "Debido a mi espalda, necesito agarrarme a algo para levantarme de los sillones o sofás.",
      shortLabel: "Agarrarse para levantarse",
      mirrorPhrase: "incorporarte de un asiento requiere ayuda de tus brazos",
      optionLabels: SI_NO_LABELS,
    },
    q8: {
      contextHeader: CONTEXT,
      text: "Por culpa de mi espalda, pido a los demás que me hagan las cosas.",
      shortLabel: "Pedir ayuda a otros",
      mirrorPhrase: "dependes más de otras personas para tareas cotidianas",
      optionLabels: SI_NO_LABELS,
    },
    q9: {
      contextHeader: CONTEXT,
      text: "Me visto más lentamente de lo normal a causa de mi espalda.",
      shortLabel: "Vestirse más lento",
      mirrorPhrase: "vestirte se ha vuelto más lento de lo normal",
      optionLabels: SI_NO_LABELS,
    },
    q10: {
      contextHeader: CONTEXT,
      text: "A causa de mi espalda, sólo me quedo de pie durante cortos períodos de tiempo.",
      shortLabel: "Estar de pie poco",
      mirrorPhrase: "tolerar tiempo de pie se ha vuelto difícil",
      optionLabels: SI_NO_LABELS,
    },
    q11: {
      contextHeader: CONTEXT,
      text: "A causa de mi espalda, procuro evitar inclinarme o arrodillarme.",
      shortLabel: "Evitar inclinarse",
      mirrorPhrase: "agacharte o arrodillarte es algo que ya evitas",
      optionLabels: SI_NO_LABELS,
    },
    q12: {
      contextHeader: CONTEXT,
      text: "Me cuesta levantarme de una silla por culpa de mi espalda.",
      shortLabel: "Levantarse de la silla",
      mirrorPhrase: "levantarte de una silla cuesta más de lo que debería",
      optionLabels: SI_NO_LABELS,
    },
    q13: {
      contextHeader: CONTEXT,
      text: "Me duele la espalda casi siempre.",
      shortLabel: "Dolor casi siempre",
      mirrorPhrase: "el dolor te acompaña la mayor parte del día",
      optionLabels: SI_NO_LABELS,
    },
    q14: {
      contextHeader: CONTEXT,
      text: "Me cuesta darme la vuelta en la cama por culpa de mi espalda.",
      shortLabel: "Voltearse en la cama",
      mirrorPhrase: "moverte en la cama se ha vuelto complicado",
      optionLabels: SI_NO_LABELS,
    },
    q15: {
      contextHeader: CONTEXT,
      text: "Debido a mi dolor de espalda, no tengo mucho apetito.",
      shortLabel: "Poco apetito",
      mirrorPhrase: "el dolor está afectando hasta tu apetito",
      optionLabels: SI_NO_LABELS,
    },
    q16: {
      contextHeader: CONTEXT,
      text: "Me cuesta ponerme los calcetines - o medias - por mi dolor de espalda.",
      shortLabel: "Ponerse calcetines",
      mirrorPhrase: "vestirte de la cintura para abajo cuesta trabajo",
      optionLabels: SI_NO_LABELS,
    },
    q17: {
      contextHeader: CONTEXT,
      text: "Debido a mi dolor de espalda, tan solo ando distancias cortas.",
      shortLabel: "Andar distancias cortas",
      mirrorPhrase: "las caminatas largas quedaron fuera de tu alcance por ahora",
      optionLabels: SI_NO_LABELS,
    },
    q18: {
      contextHeader: CONTEXT,
      text: "Duermo peor debido a mi espalda.",
      shortLabel: "Dormir peor",
      mirrorPhrase: "tu descanso nocturno está pagando el precio",
      optionLabels: SI_NO_LABELS,
    },
    q19: {
      contextHeader: CONTEXT,
      text: "Por mi dolor de espalda, deben ayudarme a vestirme.",
      shortLabel: "Ayuda para vestirse",
      mirrorPhrase: "vestirte ya requiere ayuda de alguien más",
      optionLabels: SI_NO_LABELS,
    },
    q20: {
      contextHeader: CONTEXT,
      text: "Estoy casi todo el día sentado a causa de mi espalda.",
      shortLabel: "Sentado todo el día",
      mirrorPhrase: "pasas la mayor parte del día sentado",
      optionLabels: SI_NO_LABELS,
    },
    q21: {
      contextHeader: CONTEXT,
      text: "Evito hacer trabajos pesados en casa, por culpa de mi espalda.",
      shortLabel: "Evitar trabajos pesados",
      mirrorPhrase: "los esfuerzos pesados en casa quedaron en pausa",
      optionLabels: SI_NO_LABELS,
    },
    q22: {
      contextHeader: CONTEXT,
      text: "Por mi dolor de espalda, estoy más irritable y de peor humor de lo normal.",
      shortLabel: "Más irritable",
      mirrorPhrase: "el dolor está afectando tu estado de ánimo",
      optionLabels: SI_NO_LABELS,
    },
    q23: {
      contextHeader: CONTEXT,
      text: "A causa de mi espalda, subo las escaleras más lentamente de lo normal.",
      shortLabel: "Subir escaleras lento",
      mirrorPhrase: "subir escaleras te toma más tiempo",
      optionLabels: SI_NO_LABELS,
    },
    q24: {
      contextHeader: CONTEXT,
      text: "Me quedo casi constantemente en la cama por mi espalda.",
      shortLabel: "Casi siempre en cama",
      mirrorPhrase: "la cama se ha vuelto tu lugar principal",
      optionLabels: SI_NO_LABELS,
    },
  },

  triage: {
    T1: {
      text: "¿El dolor se extiende por la pierna, más abajo de la rodilla?",
      optionLabels: ["Sí", "No"],
    },
    T2: {
      text: "¿El dolor aparece al caminar, te obliga a detenerte y se alivia al sentarte?",
      optionLabels: ["Sí", "No"],
    },
    T3: {
      text: "¿Tienes alguno de estos: debilidad en pie o pierna que va avanzando, adormecimiento en la zona genital, o dificultad nueva para controlar la orina o el excremento?",
      optionLabels: ["Sí", "No"],
    },
    T4: {
      text: "¿Tu dolor empezó tras un golpe o caída fuerte reciente?",
      optionLabels: ["Sí", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Actividades básicas",
      examples: "vestirte, levantarte, moverte en casa",
    },
    moderadas: {
      label: "Actividad moderada",
      examples: "caminar, estar de pie, escaleras",
    },
    demandantes: {
      label: "Actividad demandante",
      examples: "cargar peso, agacharte, quehaceres pesados",
    },
  },

  reportTexts: {
    leve: [
      "Tu espalda te está limitando poco por ahora — y ese es exactamente el mejor momento para entender qué lo causa. La mayoría de los problemas lumbares detectados temprano se resuelven sin cirugía.",
      "Una valoración con exploración física te dará un diagnóstico claro.",
    ],
    moderada: [
      "Tu resultado indica que el dolor lumbar ya está interfiriendo con actividades básicas de tu día. Este patrón puede corresponder a varios orígenes — muscular, discal o articular — y distinguirlos requiere exploración física y, en algunos casos, estudios de imagen.",
      "Identificar la causa a tiempo evita que el problema se vuelva crónico. Una valoración te dará un diagnóstico con nombre y apellido, y un plan concreto.",
    ],
    severa: [
      "Tu puntaje refleja una limitación importante: tu espalda está condicionando gran parte de tu vida diaria. Un cuadro con este impacto necesita diagnóstico preciso pronto para no seguir perdiendo función.",
      "La valoración incluye exploración neurológica y de columna, y los estudios que tu caso requiera.",
    ],
  },
};
