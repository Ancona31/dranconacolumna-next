import type { TestContent } from "../../types";
import type { ScaleAnchors } from "../../../types";

const PAIN_ANCHORS: ScaleAnchors = {
  min: "No pain",
  max: "Worst pain imaginable",
};
const FUNC_ANCHORS: ScaleAnchors = {
  min: "No difficulty",
  max: "So difficult I need help",
};

const PAIN_HEADER =
  "During the past week, rate your shoulder pain from 0 to 10…";
const FUNC_HEADER = "…your difficulty performing each activity";

export const hombroContentEn: TestContent = {
  zoneLabel: "Shoulder",
  instrumentName: "SPADI",
  instrumentCitation:
    "SPADI (Shoulder Pain and Disability Index; Roach et al., 1991; numerical version Williams et al., 1995). Original English version; public-domain instrument.",
  instructions:
    "If you don't normally do an activity, estimate the difficulty you would have if you tried it.",

  flagLabels: {
    trauma: "The problem started after a blow or a fall",
    manguito: "Sudden loss of strength to raise your arm",
    "origen-cervical": "Tingling running from your neck down your arm",
  },

  questions: {
    d1: {
      contextHeader: PAIN_HEADER,
      text: "…at its worst",
      shortLabel: "Worst pain",
      anchors: PAIN_ANCHORS,
    },
    d2: {
      contextHeader: PAIN_HEADER,
      text: "…when lying on the affected side",
      shortLabel: "Lying on that side",
      anchors: PAIN_ANCHORS,
    },
    d3: {
      contextHeader: PAIN_HEADER,
      text: "…when reaching for something on a high shelf",
      shortLabel: "Reaching up high",
      anchors: PAIN_ANCHORS,
      mirrorPhrase: "reaching a high shelf sets off your pain",
    },
    d4: {
      contextHeader: PAIN_HEADER,
      text: "…when touching the back of your neck",
      shortLabel: "Hand to the back of the neck",
      anchors: PAIN_ANCHORS,
      mirrorPhrase: "reaching the back of your neck hurts",
    },
    d5: {
      contextHeader: PAIN_HEADER,
      text: "…when pushing with the affected arm",
      shortLabel: "Pushing",
      anchors: PAIN_ANCHORS,
      mirrorPhrase: "pushing with that arm takes its toll",
    },
    f1: {
      contextHeader: FUNC_HEADER,
      text: "Washing your hair",
      shortLabel: "Washing your hair",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "washing your hair has become a struggle",
    },
    f2: {
      contextHeader: FUNC_HEADER,
      text: "Washing your back",
      shortLabel: "Washing your back",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "washing your back takes real effort",
    },
    f3: {
      contextHeader: FUNC_HEADER,
      text: "Putting on a T-shirt or sweater over your head",
      shortLabel: "Shirt over the head",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "pulling a shirt over your head is getting complicated",
    },
    f4: {
      contextHeader: FUNC_HEADER,
      text: "Putting on a shirt that buttons down the front",
      shortLabel: "Buttoning a shirt",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "buttoning your shirt has become slow",
    },
    f5: {
      contextHeader: FUNC_HEADER,
      text: "Putting on your pants",
      shortLabel: "Putting on pants",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "pulling up your pants takes more than it used to",
    },
    f6: {
      contextHeader: FUNC_HEADER,
      text: "Placing an object on a high shelf",
      shortLabel: "Object on a high shelf",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "putting things up high is nearly out of reach",
    },
    f7: {
      contextHeader: FUNC_HEADER,
      text: "Carrying a heavy object of 10 pounds (4.5 kg)",
      shortLabel: "Carrying 10 lb",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "carrying weight with that arm has become a challenge",
    },
    f8: {
      contextHeader: FUNC_HEADER,
      text: "Removing something from your back pocket",
      shortLabel: "Back pocket",
      anchors: FUNC_ANCHORS,
      mirrorPhrase: "reaching your back pocket is getting complicated",
    },
  },

  triage: {
    T1: {
      text: "Did your problem start with a recent blow or fall?",
      optionLabels: ["Yes", "No"],
    },
    T2: {
      text: "Does your shoulder look deformed, or is it impossible to move your arm?",
      optionLabels: ["Yes", "No"],
    },
    T3: {
      text: "After a strain or a fall, did you suddenly lose the strength to raise your arm?",
      optionLabels: ["Yes", "No"],
    },
    T4: {
      text: "Do you feel tingling running from your neck down into your arm or hand?",
      optionLabels: ["Yes", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Basic activities",
      examples: "getting dressed, reaching your pockets",
    },
    moderadas: {
      label: "Mid-level reach",
      examples: "washing up, dressing over your head",
    },
    demandantes: {
      label: "Full reach and load",
      examples: "high shelves, carrying, pushing",
    },
  },

  reportTexts: {
    leve: [
      "Your shoulder is giving you a warning, but its overall function is holding up. It's the ideal moment to identify the cause — shoulder problems treated early usually resolve with simple treatments.",
      "A consultation with a physical exam will tell you for certain what's causing it.",
    ],
    moderada: [
      "Your score shows that your shoulder is already limiting your daily activities in a significant way. This pattern is common in rotator cuff injuries and shoulder inflammation — telling them apart takes a physical exam and, often, scans.",
      "Catching it early keeps the limitation from progressing. A consultation will give the problem a name — and give you a real plan.",
    ],
    severa: [
      "Your score reflects a significant limitation: your shoulder is conditioning everything from getting dressed to carrying. With this level of impact, putting off the diagnosis can cost you mobility that's hard to get back.",
      "The consultation includes specific shoulder tests and whatever scans your case needs.",
    ],
  },
};
