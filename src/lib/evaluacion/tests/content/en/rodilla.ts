import type { TestContent } from "../../types";

const PAIN_LABELS = ["None", "Mild", "Moderate", "Severe", "Extreme"];
const DIFFICULTY_LABELS = ["None", "Mild", "Moderate", "Severe", "Extreme"];

const PAIN_HEADER =
  "During the past week, how much knee pain have you had…";
const DIFFICULTY_HEADER =
  "During the past week, how much difficulty have you had…";

export const rodillaContentEn: TestContent = {
  zoneLabel: "Knee",
  instrumentName: "KOOS-JR",
  instrumentCitation:
    "KOOS-JR (Knee injury and Osteoarthritis Outcome Score, Joint Replacement; Lyman et al., Clin Orthop Relat Res 2016). Original English version; instrument © Hospital for Special Surgery, free to use.",

  flagLabels: {
    trauma: "The problem started after a blow or a twist",
    inestabilidad: "The knee locks up or gives way on its own",
  },

  questions: {
    q1: {
      contextHeader: "Think about your knee during the past week.",
      text: "How severe is your knee stiffness after first waking up in the morning?",
      shortLabel: "Morning stiffness",
      mirrorPhrase: "your knee wakes up stiff",
      optionLabels: DIFFICULTY_LABELS,
    },
    q2: {
      contextHeader: PAIN_HEADER,
      text: "…twisting or pivoting on your knee",
      shortLabel: "Pivoting on the knee",
      mirrorPhrase: "twisting on your knee sets off the pain",
      optionLabels: PAIN_LABELS,
    },
    q3: {
      contextHeader: PAIN_HEADER,
      text: "…straightening your knee fully",
      shortLabel: "Straightening the knee",
      mirrorPhrase: "straightening it fully brings discomfort",
      optionLabels: PAIN_LABELS,
    },
    q4: {
      contextHeader: PAIN_HEADER,
      text: "…going up or down stairs",
      shortLabel: "Stairs",
      mirrorPhrase: "stairs set off your pain",
      optionLabels: PAIN_LABELS,
    },
    q5: {
      contextHeader: PAIN_HEADER,
      text: "…standing upright",
      shortLabel: "Standing",
      mirrorPhrase: "standing takes its toll",
      optionLabels: PAIN_LABELS,
    },
    q6: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…rising from sitting",
      shortLabel: "Rising from a chair",
      mirrorPhrase: "getting up from a seat has become an effort",
      optionLabels: DIFFICULTY_LABELS,
    },
    q7: {
      contextHeader: DIFFICULTY_HEADER,
      text: "…bending to the floor or picking up an object",
      shortLabel: "Bending to the floor",
      mirrorPhrase: "bending to the floor takes real effort",
      optionLabels: DIFFICULTY_LABELS,
    },
  },

  triage: {
    T1: {
      text: "Did your problem start with a recent blow, twist, or accident?",
      optionLabels: ["Yes", "No"],
    },
    T2: {
      text: "Can you put weight on your leg and take a few steps, even if it hurts?",
      optionLabels: ["Yes", "No"],
    },
    T3: {
      text: "Does your knee suddenly lock up or give way on its own?",
      optionLabels: ["Yes", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Basic activities",
      examples: "getting up from a chair, morning stiffness",
    },
    moderadas: {
      label: "Moderate activity",
      examples: "stairs, standing, straightening your knee",
    },
    demandantes: {
      label: "Demanding activity",
      examples: "pivoting on your knee, bending to the floor",
    },
  },

  reportTexts: {
    leve: [
      "Your knee is giving you a warning, but the impact on your daily life is still low. Finding the origin now — cartilage, meniscus, or ligaments — opens up the simplest treatment options.",
      "A consultation with a physical exam will tell you for certain what's causing it.",
    ],
    moderada: [
      "Your score shows that your knee problem is already limiting your daily activities in a significant way. This pattern is common in joint wear and in meniscus or ligament injuries — but telling which one is your case takes a physical exam and, usually, scans.",
      "Catching it early widens your options. A consultation will give the problem a name — and give you a real plan.",
    ],
    severa: [
      "Your score shows a significant limitation: your knee is running a large part of your daily life. With this level of impact, putting off the diagnosis only narrows the options.",
      "The consultation includes a complete physical exam and whatever scans your case needs.",
    ],
  },
};
