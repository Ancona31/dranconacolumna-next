import type { TestDefinition, TestQuestion } from "@/lib/evaluacion/types";

// Opciones Sí/No de todos los ítems del RMDQ (1 = describe al paciente).
const SI_NO_OPTIONS = [
  { label: "Sí", value: 1 },
  { label: "No", value: 0 },
];

// Encabezado de contexto común a las 24 frases.
const CONTEXT = "Piensa en cómo te encuentras HOY. ¿Esta frase te describe?";

// Los 24 ítems, TEXTO LITERAL de la versión española validada
// (© Fundación Kovacs). shortLabel = versión breve de 3-5 palabras.
const ITEMS: { text: string; shortLabel: string }[] = [
  {
    text: "Me quedo en casa la mayor parte del tiempo por mi dolor de espalda.",
    shortLabel: "Quedarse en casa",
  },
  {
    text: "Cambio de postura con frecuencia para intentar aliviar la espalda.",
    shortLabel: "Cambiar de postura",
  },
  {
    text: "Debido a mi espalda, camino más lentamente de lo normal.",
    shortLabel: "Caminar más lento",
  },
  {
    // Adaptación léxica MX: 'faenas'→'quehaceres' (única modificación al texto validado)
    text: "Debido a mi espalda, no puedo hacer ninguno de los quehaceres que habitualmente hago en casa.",
    shortLabel: "Quehaceres de casa",
  },
  {
    text: "Por mi espalda, uso el pasamanos para subir escaleras.",
    shortLabel: "Usar el pasamanos",
  },
  {
    text: "A causa de mi espalda, debo acostarme más a menudo para descansar.",
    shortLabel: "Acostarse a descansar",
  },
  {
    text: "Debido a mi espalda, necesito agarrarme a algo para levantarme de los sillones o sofás.",
    shortLabel: "Agarrarse para levantarse",
  },
  {
    text: "Por culpa de mi espalda, pido a los demás que me hagan las cosas.",
    shortLabel: "Pedir ayuda a otros",
  },
  {
    text: "Me visto más lentamente de lo normal a causa de mi espalda.",
    shortLabel: "Vestirse más lento",
  },
  {
    text: "A causa de mi espalda, sólo me quedo de pie durante cortos períodos de tiempo.",
    shortLabel: "Estar de pie poco",
  },
  {
    text: "A causa de mi espalda, procuro evitar inclinarme o arrodillarme.",
    shortLabel: "Evitar inclinarse",
  },
  {
    text: "Me cuesta levantarme de una silla por culpa de mi espalda.",
    shortLabel: "Levantarse de la silla",
  },
  {
    text: "Me duele la espalda casi siempre.",
    shortLabel: "Dolor casi siempre",
  },
  {
    text: "Me cuesta darme la vuelta en la cama por culpa de mi espalda.",
    shortLabel: "Voltearse en la cama",
  },
  {
    text: "Debido a mi dolor de espalda, no tengo mucho apetito.",
    shortLabel: "Poco apetito",
  },
  {
    text: "Me cuesta ponerme los calcetines - o medias - por mi dolor de espalda.",
    shortLabel: "Ponerse calcetines",
  },
  {
    text: "Debido a mi dolor de espalda, tan solo ando distancias cortas.",
    shortLabel: "Andar distancias cortas",
  },
  {
    text: "Duermo peor debido a mi espalda.",
    shortLabel: "Dormir peor",
  },
  {
    text: "Por mi dolor de espalda, deben ayudarme a vestirme.",
    shortLabel: "Ayuda para vestirse",
  },
  {
    text: "Estoy casi todo el día sentado a causa de mi espalda.",
    shortLabel: "Sentado todo el día",
  },
  {
    text: "Evito hacer trabajos pesados en casa, por culpa de mi espalda.",
    shortLabel: "Evitar trabajos pesados",
  },
  {
    text: "Por mi dolor de espalda, estoy más irritable y de peor humor de lo normal.",
    shortLabel: "Más irritable",
  },
  {
    text: "A causa de mi espalda, subo las escaleras más lentamente de lo normal.",
    shortLabel: "Subir escaleras lento",
  },
  {
    text: "Me quedo casi constantemente en la cama por mi espalda.",
    shortLabel: "Casi siempre en cama",
  },
];

// Paráfrasis en lenguaje del paciente (espejo), 1 por ítem en orden 1-24.
// NUNCA el texto del reactivo.
const MIRRORS: string[] = [
  "pasas más tiempo en casa del que quisieras",
  "buscas constantemente posturas que alivien",
  "desplazarte te toma más tiempo del habitual",
  "las labores del hogar se han vuelto un reto",
  "las escaleras ya piden apoyo extra",
  "tu espalda te pide recostarte con frecuencia",
  "incorporarte de un asiento requiere ayuda de tus brazos",
  "dependes más de otras personas para tareas cotidianas",
  "vestirte se ha vuelto más lento de lo normal",
  "tolerar tiempo de pie se ha vuelto difícil",
  "agacharte o arrodillarte es algo que ya evitas",
  "levantarte de una silla cuesta más de lo que debería",
  "el dolor te acompaña la mayor parte del día",
  "moverte en la cama se ha vuelto complicado",
  "el dolor está afectando hasta tu apetito",
  "vestirte de la cintura para abajo cuesta trabajo",
  "las caminatas largas quedaron fuera de tu alcance por ahora",
  "tu descanso nocturno está pagando el precio",
  "vestirte ya requiere ayuda de alguien más",
  "pasas la mayor parte del día sentado",
  "los esfuerzos pesados en casa quedaron en pausa",
  "el dolor está afectando tu estado de ánimo",
  "subir escaleras te toma más tiempo",
  "la cama se ha vuelto tu lugar principal",
];

const questions: TestQuestion[] = ITEMS.map((item, i) => ({
  id: `q${i + 1}`,
  contextHeader: CONTEXT,
  text: item.text,
  shortLabel: item.shortLabel,
  mirrorPhrase: MIRRORS[i],
  options: SI_NO_OPTIONS,
}));

export const espaldaBajaTest: TestDefinition = {
  id: "espalda-baja-rmdq",
  zoneId: "espalda-baja",
  zoneLabel: "Espalda baja",
  instrumentName: "Cuestionario Roland-Morris (RMDQ)",
  instrumentCitation:
    "Cuestionario de Roland-Morris, versión española validada. © Fundación Kovacs (Kovacs FM, Llobera J, Gil del Real MT, Abraira V, Gestoso M, Fernández C. Validation of the Spanish version of the Roland Morris Questionnaire. Spine 2002;27:538-542). Aplicación orientativa. Adaptación léxica mínima para México.",
  estimatedMinutes: 2,
  resultDisplay: "checklist",
  questionNoun: { singular: "frase", plural: "frases" },

  flagLabels: {
    radicular: "El dolor se extiende por debajo de la rodilla",
    claudicacion: "El dolor al caminar te obliga a detenerte y cede al sentarte",
    trauma: "El dolor inició tras un golpe o caída",
  },

  // Ítems 1,6,8,13,15,18,20,22,24 solo puntúan el score global (no son de dominio).
  domains: [
    {
      id: "basicas",
      label: "Actividades básicas",
      examples: "vestirte, levantarte, moverte en casa",
      itemIds: ["q7", "q9", "q12", "q14", "q16", "q19"],
    },
    {
      id: "moderadas",
      label: "Actividad moderada",
      examples: "caminar, estar de pie, escaleras",
      itemIds: ["q2", "q3", "q5", "q10", "q17", "q23"],
    },
    {
      id: "demandantes",
      label: "Actividad demandante",
      examples: "cargar peso, agacharte, quehaceres pesados",
      itemIds: ["q4", "q11", "q21"],
    },
  ],

  triage: [
    {
      id: "T1",
      text: "¿El dolor se extiende por la pierna, más abajo de la rodilla?",
      options: [
        { label: "Sí", action: "flag-next:radicular" },
        { label: "No", action: "next" },
      ],
    },
    {
      id: "T2",
      text: "¿El dolor aparece al caminar, te obliga a detenerte y se alivia al sentarte?",
      options: [
        { label: "Sí", action: "flag-next:claudicacion" },
        { label: "No", action: "next" },
      ],
    },
    {
      id: "T3",
      text: "¿Tienes alguno de estos: debilidad en pie o pierna que va avanzando, adormecimiento en la zona genital, o dificultad nueva para controlar la orina o el excremento?",
      options: [
        // No interrumpe el test: se registra la urgencia y el test se completa.
        { label: "Sí", action: "flag-next:urgente-neurologico" },
        { label: "No", action: "next" },
      ],
    },
    {
      id: "T4",
      text: "¿Tu dolor empezó tras un golpe o caída fuerte reciente?",
      options: [
        { label: "Sí", action: "flag-next:trauma" },
        { label: "No", action: "next" },
      ],
    },
  ],

  questions,

  // RMDQ: raw = número de frases marcadas Sí (0-24), lineal.
  scoring: { kind: "linear", maxRaw: 24 },

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
