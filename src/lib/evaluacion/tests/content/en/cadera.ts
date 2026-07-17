import type { TestContent } from "../../types";

const PAIN_LABELS = ["None", "Mild", "Moderate", "Severe", "Extreme"];
const DIFFICULTY_LABELS = ["None", "Mild", "Moderate", "Severe", "Extreme"];

const PAIN_HEADER =
  "During the past week, how much hip pain have you experienced…";
const DIFFICULTY_HEADER =
  "During the past week, how much difficulty have you had…";

export const caderaContentEn: TestContent = {
  zoneLabel: "Hip",
  instrumentName: "HOOS-JR",
  instrumentCitation:
    "HOOS-JR (Hip Disability and Osteoarthritis Outcome Score, Joint Replacement; Lyman et al., Clin Orthop Relat Res 2016). Original English version; instrument © Hospital for Special Surgery, free to use.",

  flagLabels: {
    trauma: "The problem started after a blow or a fall",
  },

  questions: {
    q1: {
      contextHeader: PAIN_HEADER,
      text: "…going up or down stairs",
      shortLabel: "Pain on stairs",
      mirrorPhrase: "stairs set off your pain",
      optionLabels: PAIN_LABELS,
    },
    q2: {
      contextHeader: PAIN_HEADER,
      text: "…walking on an uneven surface",
      shortLabel: "Pain on uneven ground",
      mirrorPhrase: "uneven ground has become uncomfortable territory",
      optionLabels: PAIN_LABELS,
    },
    q3: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…rising from sitting",
      shortLabel: "Rising from a chair",
      mirrorPhrase: "getting up from a seat has become an effort",
      optionLabels: DIFFICULTY_LABELS,
    },
    q4: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…bending to the floor or picking up an object",
      shortLabel: "Bending to the floor",
      mirrorPhrase: "bending down for something on the floor takes real effort",
      optionLabels: DIFFICULTY_LABELS,
    },
    q5: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…lying in bed (turning over, or keeping your hip in position)",
      shortLabel: "Lying in bed",
      mirrorPhrase: "even resting in bed is affected",
      optionLabels: DIFFICULTY_LABELS,
    },
    q6: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…sitting",
      shortLabel: "Sitting",
      mirrorPhrase: "sitting for long stretches bothers you",
      optionLabels: DIFFICULTY_LABELS,
    },
  },

  triage: {
    T1: {
      text: "Did your problem start with a recent blow, fall, or accident?",
      optionLabels: ["Yes", "No"],
    },
    T2: {
      text: "Can you put weight on your foot and walk, even if it hurts?",
      optionLabels: ["Yes", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Basic activities",
      examples: "getting up from a chair, sitting or lying down",
    },
    moderadas: {
      label: "Moderate activity",
      examples: "going up and down stairs",
    },
    demandantes: {
      label: "Demanding activity",
      examples: "walking on uneven ground, bending to the floor",
    },
  },

  reportTexts: {
    leve: [
      "Your hip is giving you a warning, but the impact on your daily life is still low. It's the best moment to act: hip problems caught early have more options — and simpler ones.",
      "A consultation with a physical exam will tell you for certain what's causing it.",
    ],
    moderada: [
      "Your score shows that your hip problem is already limiting your daily activities in a significant way. This pattern is common in joint wear and in some hip injuries — but telling which one is your case takes a physical exam and, usually, scans.",
      "The good news: catching it early widens your options. A consultation will give the problem a name — and give you a real plan.",
    ],
    severa: [
      "Your score shows a significant limitation: your hip is running a large part of your daily life. A problem with this level of impact needs a precise diagnosis soon — every week without one is a week of narrowing options.",
      "The consultation includes a physical exam and whatever scans your case needs.",
    ],
  },
};
