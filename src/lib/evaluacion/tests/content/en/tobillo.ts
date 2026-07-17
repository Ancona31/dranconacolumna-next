import type { TestContent } from "../../types";

/** Encabezado agrupador de las 21 actividades. */
const HEADER = "Because of your ankle or foot, how much difficulty do you have…";

/** Labels de la escala oficial del FAAM (0-4), en el orden de los valores. */
const DIFFICULTY_LABELS = [
  "No difficulty",
  "Slight difficulty",
  "Moderate difficulty",
  "Extreme difficulty",
  "Unable to do",
];

export const tobilloContentEn: TestContent = {
  zoneLabel: "Ankle and foot",
  instrumentName: "FAAM-ADL",
  instrumentCitation:
    "FAAM (Foot and Ankle Ability Measure, Activities of Daily Living subscale; Martin et al., Foot Ankle Int 2005). Original English version; public-domain instrument.",
  questionNoun: { singular: "activity", plural: "activities" },

  flagLabels: {
    trauma: "The problem started after a twist or a blow",
    // Flag de precaución (CAUTION_FLAGS): se lista en "Marcaste:" del banner.
    "inflamacion-aguda": "Swelling with warmth or redness of the skin",
  },

  questions: {
    q1: {
      contextHeader: HEADER,
      text: "…standing",
      shortLabel: "Standing",
      mirrorPhrase: "standing takes its toll",
      optionLabels: DIFFICULTY_LABELS,
    },
    q2: {
      contextHeader: HEADER,
      text: "…walking on even ground",
      shortLabel: "Walking on even ground",
      mirrorPhrase: "walking on flat ground already makes itself felt",
      optionLabels: DIFFICULTY_LABELS,
    },
    q3: {
      contextHeader: HEADER,
      text: "…walking on even ground without shoes",
      shortLabel: "Walking barefoot",
      mirrorPhrase: "walking barefoot is uncomfortable",
      optionLabels: DIFFICULTY_LABELS,
    },
    q4: {
      contextHeader: HEADER,
      text: "…walking up hills",
      shortLabel: "Walking up hills",
      mirrorPhrase: "uphill stretches wear you out",
      optionLabels: DIFFICULTY_LABELS,
    },
    q5: {
      contextHeader: HEADER,
      text: "…walking down hills",
      shortLabel: "Walking down hills",
      mirrorPhrase: "downhill stretches punish your step",
      optionLabels: DIFFICULTY_LABELS,
    },
    q6: {
      contextHeader: HEADER,
      text: "…going up stairs",
      shortLabel: "Going up stairs",
      mirrorPhrase: "going up stairs takes effort",
      optionLabels: DIFFICULTY_LABELS,
    },
    q7: {
      contextHeader: HEADER,
      text: "…going down stairs",
      shortLabel: "Going down stairs",
      mirrorPhrase: "going down stairs has become delicate",
      optionLabels: DIFFICULTY_LABELS,
    },
    q8: {
      contextHeader: HEADER,
      text: "…walking on uneven ground",
      shortLabel: "Uneven ground",
      mirrorPhrase: "uneven ground has become uncomfortable territory",
      optionLabels: DIFFICULTY_LABELS,
    },
    q9: {
      contextHeader: HEADER,
      text: "…stepping up and down curbs",
      shortLabel: "Curbs",
      mirrorPhrase: "curbs demand extra care",
      optionLabels: DIFFICULTY_LABELS,
    },
    q10: {
      contextHeader: HEADER,
      text: "…squatting",
      shortLabel: "Squatting",
      mirrorPhrase: "squatting has become difficult",
      optionLabels: DIFFICULTY_LABELS,
    },
    q11: {
      contextHeader: HEADER,
      text: "…coming up on your toes",
      shortLabel: "Rising on your toes",
      mirrorPhrase: "rising on your toes takes effort",
      optionLabels: DIFFICULTY_LABELS,
    },
    q12: {
      contextHeader: HEADER,
      text: "…taking your first steps after getting up",
      shortLabel: "First steps",
      mirrorPhrase: "the first steps of the day hurt",
      optionLabels: DIFFICULTY_LABELS,
    },
    q13: {
      contextHeader: HEADER,
      text: "…walking 5 minutes or less",
      shortLabel: "Walking 5 min",
      mirrorPhrase: "even short walks make themselves felt",
      optionLabels: DIFFICULTY_LABELS,
    },
    q14: {
      contextHeader: HEADER,
      text: "…walking approximately 10 minutes",
      shortLabel: "Walking 10 min",
      mirrorPhrase: "a ten-minute walk is already a challenge",
      optionLabels: DIFFICULTY_LABELS,
    },
    q15: {
      contextHeader: HEADER,
      text: "…walking 15 minutes or more",
      shortLabel: "Walking 15+ min",
      mirrorPhrase: "longer walks are on hold",
      optionLabels: DIFFICULTY_LABELS,
    },
    q16: {
      contextHeader: HEADER,
      text: "…home responsibilities",
      shortLabel: "Housework",
      mirrorPhrase: "housework takes effort",
      optionLabels: DIFFICULTY_LABELS,
    },
    q17: {
      contextHeader: HEADER,
      text: "…activities of daily living",
      shortLabel: "Everyday activities",
      mirrorPhrase: "your everyday activities are affected",
      optionLabels: DIFFICULTY_LABELS,
    },
    q18: {
      contextHeader: HEADER,
      text: "…personal care",
      shortLabel: "Personal care",
      mirrorPhrase: "even your personal care gets complicated",
      optionLabels: DIFFICULTY_LABELS,
    },
    q19: {
      contextHeader: HEADER,
      text: "…light to moderate work (standing, walking)",
      shortLabel: "Light work",
      mirrorPhrase: "work on your feet or walking takes effort",
      optionLabels: DIFFICULTY_LABELS,
    },
    q20: {
      contextHeader: HEADER,
      text: "…heavy work (pushing, pulling, climbing, carrying)",
      shortLabel: "Heavy work",
      mirrorPhrase: "heavy work is out of reach",
      optionLabels: DIFFICULTY_LABELS,
    },
    q21: {
      contextHeader: HEADER,
      text: "…your recreational activities",
      shortLabel: "Recreation",
      mirrorPhrase: "your hobbies are on hold",
      optionLabels: DIFFICULTY_LABELS,
    },
  },

  triage: {
    T1: {
      text: "Did your problem start with a recent twist, blow, or fall?",
      optionLabels: ["Yes", "No"],
    },
    T2: {
      text: "Can you put weight on your foot and take at least four steps, even if it hurts?",
      optionLabels: ["Yes", "No"],
    },
    T3: {
      text: "Is the area very swollen, warm, or red?",
      optionLabels: ["Yes", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Basic activities",
      examples: "standing, walking, your personal care",
    },
    moderadas: {
      label: "Walking and daily life",
      examples: "stairs, curbs, walks, housework",
    },
    demandantes: {
      label: "Tough terrain and effort",
      examples: "hills, squatting, heavy work",
    },
  },

  reportTexts: {
    leve: [
      "Your ankle or foot is giving you a warning, but your walking is holding up overall. It's the best moment to identify the cause — your foot carries everything else, and problems caught early are corrected with simple measures.",
      "A consultation with a physical exam will tell you for certain what's causing it.",
    ],
    moderada: [
      "Your score shows that your ankle or foot is already limiting your walking and your activities in a significant way. This pattern shows up in sprain after-effects, tendinitis, and joint wear — telling them apart takes a physical exam and, sometimes, scans.",
      "Treating it early prevents compensations that end up hurting your knee, hip, or back. A consultation will give the problem a name — and give you a real plan.",
    ],
    severa: [
      "Your score reflects a significant limitation: every step is conditioned. A foot that can't bear weight properly compromises everything above it — a picture like this needs a diagnosis soon.",
      "The consultation includes an exam of weight-bearing, stability, and gait, and whatever scans your case needs.",
    ],
  },

  // F3 corrección (a): completa el "No aplica — …no por {naZoneFragment}" del
  // QuestionScreen.
  naZoneFragment: "my ankle or foot",
};
