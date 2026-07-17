import type { ScaleAnchors } from "@/lib/evaluacion/types";

import type { QuestionContent, TestContent } from "../../types";

const PAIN_ANCHORS: ScaleAnchors = { min: "No pain", max: "Worst possible" };
const FREQ_ANCHORS: ScaleAnchors = { min: "Never", max: "Always" };
const FUNC_ANCHORS: ScaleAnchors = {
  min: "No difficulty",
  max: "Unable to do",
};

const PAIN_HEADER =
  "During the past week, rate your wrist or hand pain from 0 to 10…";
const FUNC_HEADER =
  "…your difficulty performing each activity with the affected hand";

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

export const munecaContentEn: TestContent = {
  zoneLabel: "Wrist and hand",
  instrumentName: "PRWHE",
  instrumentCitation:
    "PRWHE (Patient-Rated Wrist/Hand Evaluation; MacDermid, 1998). Original English version; © J. MacDermid, free to use with citation.",
  instructions:
    "If you don't normally do an activity, estimate the difficulty you would have if you tried it.",

  flagLabels: {
    trauma: "The problem started after a fall or a blow",
    mediano: "Nighttime tingling in the thumb, index, and middle fingers",
  },

  questions: {
    r1: scale("…at rest", "Pain at rest", PAIN_ANCHORS, PAIN_HEADER),
    r2: scale(
      "…when doing a repeated wrist movement",
      "Pain with repeated movement",
      PAIN_ANCHORS,
      PAIN_HEADER
    ),
    r3: scale(
      "…when lifting a heavy object",
      "Pain when lifting",
      PAIN_ANCHORS,
      PAIN_HEADER,
      "lifting heavy objects sets off the pain"
    ),
    r4: scale(
      "…at its worst",
      "Worst pain",
      PAIN_ANCHORS,
      PAIN_HEADER
    ),
    r5: scale(
      "How often do you have pain?",
      "Pain frequency",
      FREQ_ANCHORS
    ),
    s1: scale(
      "Turn a doorknob",
      "Turning a doorknob",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "turning a doorknob has become painful"
    ),
    s2: scale(
      "Cut meat with a knife",
      "Cutting with a knife",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "cutting your food takes effort"
    ),
    s3: scale(
      "Fasten the buttons on your shirt",
      "Buttoning a shirt",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "buttoning your shirt has become slow"
    ),
    s4: scale(
      "Use that hand to push up from a chair",
      "Pushing up from a chair",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "pushing up with that hand hurts"
    ),
    s5: scale(
      "Carry a 10-pound (4.5 kg) object",
      "Carrying 10 lb",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "carrying weight with that hand is on hold"
    ),
    s6: scale(
      "Use toilet paper",
      "Using toilet paper",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "even personal hygiene gets complicated"
    ),
    u1: scale(
      "Your personal activities (dressing, washing)",
      "Personal activities",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "your personal care has become slower"
    ),
    u2: scale(
      "Household work (cleaning, maintenance)",
      "Household work",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "housework is taking a toll"
    ),
    u3: scale(
      "Your work (job or usual daily work)",
      "Your work",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "your daily work is affected"
    ),
    u4: scale(
      "Your recreational activities",
      "Recreation",
      FUNC_ANCHORS,
      FUNC_HEADER,
      "your hobbies are on hold"
    ),
  },

  triage: {
    T1: {
      text: "Did your problem start with a fall onto your hand or a blow?",
      optionLabels: ["Yes", "No"],
    },
    T2: {
      text: "Does your wrist look deformed, or do you have intense pain at one spot on the bone?",
      optionLabels: ["Yes", "No"],
    },
    T3: {
      text: "Do you have tingling in your thumb, index, and middle fingers that wakes you up at night?",
      optionLabels: ["Yes", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Basic activities",
      examples: "dressing, your personal care",
    },
    moderadas: {
      label: "Everyday hand use",
      examples: "doors, cooking, housework",
    },
    demandantes: {
      label: "Strength and load",
      examples: "pushing up, carrying, your work",
    },
  },

  reportTexts: {
    leve: [
      "Your wrist is giving you a warning, but your hand's function is holding up. It's the best moment to identify the cause — the hand rewards early diagnoses.",
      "A consultation with a physical exam will tell you for certain what's causing it.",
    ],
    moderada: [
      "Your score shows that your wrist or hand is already limiting your daily activities. This pattern shows up in tendinitis, nerve compression, and injury after-effects — telling them apart takes a focused exam.",
      "Treating it early protects your hand's function. A consultation will give the problem a name — and give you a real plan.",
    ],
    severa: [
      "Your score reflects a significant limitation: your hand is conditioning essential activities. The hand doesn't forgive delays — a picture like this needs a diagnosis soon.",
      "The consultation includes an exam of mobility, strength, and nerves, and whatever scans your case needs.",
    ],
  },
};
