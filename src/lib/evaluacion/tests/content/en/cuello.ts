import type { TestContent } from "../../types";

const PAIN_ANCHORS = {
  min: "No pain",
  max: "Worst pain I can imagine",
};

// Labels de las cinco opciones del COMI, en el mismo orden que optionValues.
const INTERFERENCE_LABELS = [
  "Not at all",
  "A little bit",
  "Moderately",
  "Quite a bit",
  "Extremely",
];

const WELLBEING_LABELS = [
  "Very satisfied",
  "Somewhat satisfied",
  "Neither satisfied nor dissatisfied",
  "Somewhat dissatisfied",
  "Very dissatisfied",
];

const QOL_LABELS = ["Very good", "Good", "Moderate", "Bad", "Very bad"];

const DAYS_LABELS = [
  "None",
  "Between 1 and 7 days",
  "Between 8 and 14 days",
  "Between 15 and 21 days",
  "More than 21 days",
];

export const cuelloContentEn: TestContent = {
  zoneLabel: "Neck",
  instrumentName: "COMI-neck",
  instrumentCitation:
    "COMI (Core Outcome Measures Index; Deyo et al., 1998; Mannion et al., 2009) — instrument of the European spine registry Spine Tango, EUROSPINE. Original English version; free to use.",
  semaphoreTitle: "How it's affecting you, according to your answers",

  // Matriz propia: el semáforo describe DIMENSIONES (dolor, actividades,
  // bienestar), no niveles de exigencia física.
  domainPhrases: {
    verde: {
      dolor:
        "Your pain is staying at low levels. A good starting point for resolving the cause.",
      actividades:
        "Your problem is barely touching your activities. Protect that ground.",
      bienestar:
        "Your mood and your quality of life are holding up. That helps recovery enormously.",
    },
    amarillo: {
      dolor:
        "Your pain is mild in intensity{ej}. Addressing it now keeps it from escalating.",
      actividades:
        "Your activities are starting to feel it{ej}. It's an early signal.",
      bienestar: "Your well-being is starting to pay the price{ej}.",
    },
    naranja: {
      dolor:
        "Your pain reaches a considerable intensity{ej}. This isn't something to just live with: it deserves a diagnosis.",
      actividades:
        "Your problem is already clearly cutting into your activities{ej}.",
      bienestar:
        "The problem is already weighing on your mood and your quality of life{ej}.",
    },
    rojo: {
      dolor:
        "Your pain is at high levels{ej}. Nobody should have to function like this — it needs attention.",
      actividades:
        "Your problem is stealing whole days of life and work from you{ej}.",
      bienestar:
        "Living like this is wearing you down{ej}. Your well-being matters here too — and it's one of the big reasons to come in.",
    },
  },

  flagLabels: {
    "radicular-cervical": "The pain runs down into the arm",
    // Flag de precaución (CAUTION_FLAGS): se lista en "Marcaste:" del banner.
    mielopatia: "New clumsiness in the hands, or unsteadiness when walking",
    trauma: "The pain started after an accident or a blow",
  },

  questions: {
    i1: {
      text: "How severe was your neck pain in the last week?",
      shortLabel: "Neck pain",
      mirrorPhrase: "the neck pain stays present",
      anchors: PAIN_ANCHORS,
    },
    i2: {
      text: "How severe was your arm/shoulder pain in the last week?",
      shortLabel: "Pain toward the arm",
      mirrorPhrase: "the pain runs down into your arm",
      anchors: PAIN_ANCHORS,
    },
    i3: {
      text: "During the past week, how much did your neck problem interfere with your normal work (including both work outside the home and housework)?",
      shortLabel: "Daily interference",
      mirrorPhrase: "your everyday tasks are being interfered with",
      optionLabels: INTERFERENCE_LABELS,
    },
    i4: {
      text: "If you had to spend the rest of your life with the symptoms you have right now, how would you feel about it?",
      shortLabel: "Living with the symptoms",
      mirrorPhrase: "you can't accept staying like this",
      optionLabels: WELLBEING_LABELS,
    },
    i5: {
      text: "Please think about the last week. How would you rate your quality of life?",
      shortLabel: "Quality of life",
      mirrorPhrase: "you'd rate your quality of life lower than you'd like",
      optionLabels: QOL_LABELS,
    },
    i6: {
      text: "During the past 4 weeks, how many days did you cut down on the things you usually do (work, housework, school) because of your neck problem?",
      shortLabel: "Days with reduced activity",
      mirrorPhrase: "you've had to cut back days of your activities",
      optionLabels: DAYS_LABELS,
    },
    i7: {
      text: "During the past 4 weeks, how many days did your neck problem keep you from going to work (including housework)?",
      shortLabel: "Workdays lost",
      mirrorPhrase: "the problem has cost you days of work",
      optionLabels: DAYS_LABELS,
    },
  },

  triage: {
    T1: {
      text: "Does the pain run down into your arm or hand?",
      optionLabels: ["Yes", "No"],
    },
    T2: {
      text: "Have you noticed new clumsiness in your hands (dropping things, trouble with buttons) or unsteadiness when you walk?",
      optionLabels: ["Yes", "No"],
    },
    T3: {
      text: "Did the pain start after an accident or a blow (for example, a car crash)?",
      optionLabels: ["Yes", "No"],
    },
  },

  domains: {
    dolor: {
      label: "Your pain",
      examples: "your neck and what runs down your arm",
    },
    actividades: {
      label: "Your activities",
      examples: "work, home, days lost",
    },
    bienestar: {
      label: "Your well-being",
      examples: "mood and quality of life",
    },
  },

  reportTexts: {
    leve: [
      "Your neck is giving you a warning, but the overall impact is still low. It's the best moment to understand the cause — most neck problems caught early are resolved without surgery.",
      "A consultation with a physical exam will give you a clear diagnosis.",
    ],
    moderada: [
      "Your result shows that your neck problem is already weighing on your everyday life. This pattern can come from muscle, from the joints, or from a pinched nerve — telling them apart takes a focused physical exam and, in some cases, a scan.",
      "Finding the cause early keeps it from becoming chronic. A consultation will give the problem a name — and give you a real plan.",
    ],
    severa: [
      "Your result reflects a significant impact: your neck problem is running your pain, your activities, and your well-being. A picture like this needs a precise diagnosis soon.",
      "The consultation includes a neurological exam of your arms and neck, and whatever scans your case needs.",
    ],
  },
};
