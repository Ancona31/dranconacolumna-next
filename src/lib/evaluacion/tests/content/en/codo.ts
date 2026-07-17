import type { TestContent } from "../../types";

const PAIN_ANCHORS = { min: "No pain", max: "Worst possible" };
const FREQ_ANCHORS = { min: "Never", max: "Always" };
const FUNC_ANCHORS = {
  min: "No difficulty",
  max: "Unable to do",
};

const PAIN_HEADER =
  "During the past week, rate your elbow pain from 0 to 10…";
const FUNC_HEADER = "…your difficulty performing each activity";

export const codoContentEn: TestContent = {
  zoneLabel: "Elbow",
  instrumentName: "PREE",
  instrumentCitation:
    "PREE (Patient-Rated Elbow Evaluation; MacDermid, 2009). Original English version; © J. MacDermid, free to use with citation.",
  instructions:
    "If you don't normally do an activity, estimate the difficulty you would have if you tried it.",

  flagLabels: {
    trauma: "The problem started after a blow or a fall",
    cubital: "Tingling in the pinky and ring fingers",
  },

  questions: {
    p1: {
      contextHeader: PAIN_HEADER,
      text: "…at rest",
      shortLabel: "Pain at rest",
      anchors: PAIN_ANCHORS,
    },
    p2: {
      contextHeader: PAIN_HEADER,
      text: "…when doing a task with repeated elbow movement",
      shortLabel: "Pain with repeated movement",
      anchors: PAIN_ANCHORS,
    },
    p3: {
      contextHeader: PAIN_HEADER,
      text: "…when lifting a heavy object",
      shortLabel: "Pain when lifting",
      mirrorPhrase: "lifting heavy objects sets off the pain",
      anchors: PAIN_ANCHORS,
    },
    p4: {
      contextHeader: PAIN_HEADER,
      text: "…at its worst",
      shortLabel: "Worst pain",
      anchors: PAIN_ANCHORS,
    },
    p5: {
      text: "How often do you have pain?",
      shortLabel: "Pain frequency",
      anchors: FREQ_ANCHORS,
    },
    e1: {
      contextHeader: FUNC_HEADER,
      text: "Comb your hair",
      shortLabel: "Combing your hair",
      mirrorPhrase: "combing your hair has become uncomfortable",
      anchors: FUNC_ANCHORS,
    },
    e2: {
      contextHeader: FUNC_HEADER,
      text: "Eat with a fork or spoon",
      shortLabel: "Using utensils",
      mirrorPhrase: "using utensils is a struggle",
      anchors: FUNC_ANCHORS,
    },
    e3: {
      contextHeader: FUNC_HEADER,
      text: "Pull a heavy object",
      shortLabel: "Pulling something heavy",
      mirrorPhrase: "pulling heavy objects is on hold",
      anchors: FUNC_ANCHORS,
    },
    e4: {
      contextHeader: FUNC_HEADER,
      text: "Use your arm to get up from a chair",
      shortLabel: "Getting up from a chair",
      mirrorPhrase: "pushing up with that arm takes effort",
      anchors: FUNC_ANCHORS,
    },
    e5: {
      contextHeader: FUNC_HEADER,
      text: "Carry a 10-pound (4.5 kg) object with your arm at your side",
      shortLabel: "Carrying 10 lb",
      mirrorPhrase: "carrying weight with that arm has become a challenge",
      anchors: FUNC_ANCHORS,
    },
    e6: {
      contextHeader: FUNC_HEADER,
      text: "Throw a small object, such as a ball",
      shortLabel: "Throwing a ball",
      mirrorPhrase: "even throwing something light is hard",
      anchors: FUNC_ANCHORS,
    },
    e7: {
      contextHeader: FUNC_HEADER,
      text: "Use the telephone",
      shortLabel: "Using the phone",
      mirrorPhrase: "holding the phone is uncomfortable",
      anchors: FUNC_ANCHORS,
    },
    e8: {
      contextHeader: FUNC_HEADER,
      text: "Do up the buttons on the front of your shirt",
      shortLabel: "Buttoning a shirt",
      mirrorPhrase: "buttoning your shirt has become slow",
      anchors: FUNC_ANCHORS,
    },
    e9: {
      contextHeader: FUNC_HEADER,
      text: "Wash your opposite armpit",
      shortLabel: "Washing the opposite armpit",
      mirrorPhrase: "washing your opposite armpit takes real effort",
      anchors: FUNC_ANCHORS,
    },
    e10: {
      contextHeader: FUNC_HEADER,
      text: "Tie your shoelaces",
      shortLabel: "Tying your shoelaces",
      mirrorPhrase: "tying your shoelaces is getting complicated",
      anchors: FUNC_ANCHORS,
    },
    e11: {
      contextHeader: FUNC_HEADER,
      text: "Turn a doorknob and open a door",
      shortLabel: "Opening a door",
      mirrorPhrase: "turning a doorknob to open a door hurts",
      anchors: FUNC_ANCHORS,
    },
    u1: {
      contextHeader: FUNC_HEADER,
      text: "Your personal activities (dressing, washing)",
      shortLabel: "Personal activities",
      mirrorPhrase: "your personal care has become slower",
      anchors: FUNC_ANCHORS,
    },
    u2: {
      contextHeader: FUNC_HEADER,
      text: "Household work (cleaning, maintenance)",
      shortLabel: "Household work",
      mirrorPhrase: "housework is taking a toll",
      anchors: FUNC_ANCHORS,
    },
    u3: {
      contextHeader: FUNC_HEADER,
      text: "Your work (job or usual daily work)",
      shortLabel: "Your work",
      mirrorPhrase: "your daily work is affected",
      anchors: FUNC_ANCHORS,
    },
    u4: {
      contextHeader: FUNC_HEADER,
      text: "Your recreational activities",
      shortLabel: "Recreation",
      mirrorPhrase: "your hobbies are on hold",
      anchors: FUNC_ANCHORS,
    },
  },

  triage: {
    T1: {
      text: "Did your problem start with a recent blow or fall?",
      optionLabels: ["Yes", "No"],
    },
    T2: {
      text: "Does your elbow look deformed, or are you unable to bend or straighten it?",
      optionLabels: ["Yes", "No"],
    },
    T3: {
      text: "Do you feel tingling in your pinky and ring fingers?",
      optionLabels: ["Yes", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Basic activities",
      examples: "eating, dressing, the phone",
    },
    moderadas: {
      label: "Everyday arm use",
      examples: "washing up, doors, housework",
    },
    demandantes: {
      label: "Strength and load",
      examples: "pulling, carrying, throwing, your work",
    },
  },

  reportTexts: {
    leve: [
      "Your elbow is giving you a warning, but its overall function is holding up. It's a good moment to identify the cause precisely — most elbow problems caught early respond to simple treatments.",
      "A consultation with a physical exam will tell you what's causing it.",
    ],
    moderada: [
      "Your score shows that your elbow is already interfering with your daily activities. This pattern shows up in tendinitis, overuse, and other elbow injuries — telling them apart takes a focused physical exam.",
      "Treating it early keeps it from becoming chronic. A consultation will give the problem a name — and give you a real plan.",
    ],
    severa: [
      "Your score reflects a significant limitation: your elbow is conditioning everything from eating to working. A picture with this impact needs a precise diagnosis soon.",
      "The consultation includes a complete elbow exam and whatever scans your case needs.",
    ],
  },
};
