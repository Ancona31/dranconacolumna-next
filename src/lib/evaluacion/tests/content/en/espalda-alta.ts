import type { TestContent } from "../../types";

const PAIN_ANCHORS = {
  min: "No pain",
  max: "Worst pain I can imagine",
};

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

export const espaldaAltaContentEn: TestContent = {
  zoneLabel: "Upper back",
  instrumentName: "COMI",
  instrumentCitation:
    "COMI (Core Outcome Measures Index; Deyo et al., 1998; Mannion et al., 2009) — instrument of the European spine registry Spine Tango, EUROSPINE. Original English version; free to use. Adapted for informational use in the thoracic (upper back) region.",
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
    "banda-dorsal": "The pain wraps around the chest like a band",
    // Flag de precaución (CAUTION_FLAGS): se lista en "Marcaste:" del banner.
    "deficit-dorsal": "Weakness or clumsiness in the legs that came on gradually",
    trauma: "The pain started after a blow or a fall",
  },

  questions: {
    i1: {
      text: "How severe was your upper back pain in the last week?",
      shortLabel: "Upper back pain",
      mirrorPhrase: "the upper back pain stays present",
      anchors: PAIN_ANCHORS,
    },
    i2: {
      text: "How severe was the pain wrapping around your chest or ribs in the last week?",
      shortLabel: "Band-like pain",
      mirrorPhrase: "the pain wraps around your chest or ribs",
      anchors: PAIN_ANCHORS,
    },
    i3: {
      text: "During the past week, how much did your upper back problem interfere with your normal work (including both work outside the home and housework)?",
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
      text: "During the past 4 weeks, how many days did you cut down on the things you usually do (work, housework, school) because of your upper back problem?",
      shortLabel: "Days with reduced activity",
      mirrorPhrase: "you've had to cut back days of your activities",
      optionLabels: DAYS_LABELS,
    },
    i7: {
      text: "During the past 4 weeks, how many days did your upper back problem keep you from going to work (including housework)?",
      shortLabel: "Workdays lost",
      mirrorPhrase: "the problem has cost you days of work",
      optionLabels: DAYS_LABELS,
    },
  },

  triage: {
    T1: {
      text: "Does the pain wrap around your chest or ribs like a band?",
      optionLabels: ["Yes", "No"],
    },
    T2: {
      text: "Have you noticed weakness or clumsiness in your legs?",
      optionLabels: ["Yes", "No"],
    },
    T2b: {
      text: "Did it come on suddenly (over hours or a few days)?",
      optionLabels: ["Yes", "No"],
    },
    T3: {
      text: "Did the pain start after a hard blow or fall?",
      optionLabels: ["Yes", "No"],
    },
  },

  domains: {
    dolor: {
      label: "Your pain",
      examples: "your upper back and what wraps around your chest",
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
      "Your upper back is giving you a warning, but the impact is still low. In this area it's worth understanding the cause early — it's an area where getting the right diagnosis really puts your mind at ease.",
      "A consultation with a physical exam will give you a clear diagnosis.",
    ],
    moderada: [
      "Your result shows that upper back pain is already weighing on your everyday life. The upper back is an area that deserves careful study: its pain can come from the muscles, the spine, or — sometimes — be referred from other organs, and telling those apart takes a focused exam.",
      "A consultation will give the problem a name — and give you a real plan.",
    ],
    severa: [
      "Your result reflects a significant impact in an area that shouldn't go undiagnosed: your upper back. With this level of impact, the priority is identifying the cause soon.",
      "The consultation includes a spine exam and a neurological exam of your legs, plus whatever scans your case needs — in this area they tend to tell us the most.",
    ],
  },
};
