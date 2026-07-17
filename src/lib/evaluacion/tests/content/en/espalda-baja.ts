import type { TestContent } from "../../types";

// Encabezado de contexto común a las 24 frases.
const CONTEXT = "Think about how you are TODAY. Does this sentence describe you?";

// Labels Sí/No en el MISMO orden que optionValues [1, 0].
const YES_NO_LABELS = ["Yes", "No"];

export const espaldaBajaContentEn: TestContent = {
  zoneLabel: "Lower back",
  instrumentName: "Roland-Morris Disability Questionnaire (RMDQ)",
  instrumentCitation:
    "Roland-Morris Disability Questionnaire, original English version (Roland M, Morris R. A study of the natural history of back pain. Spine 1983;8:141-144). For informational purposes.",
  questionNoun: { singular: "sentence", plural: "sentences" },

  flagLabels: {
    radicular: "The pain extends below the knee",
    claudicacion: "Pain when walking forces you to stop, and eases when you sit",
    trauma: "The pain started after a blow or a fall",
  },

  questions: {
    q1: {
      contextHeader: CONTEXT,
      text: "I stay at home most of the time because of my back.",
      shortLabel: "Staying home",
      mirrorPhrase: "you spend more time at home than you'd like",
      optionLabels: YES_NO_LABELS,
    },
    q2: {
      contextHeader: CONTEXT,
      text: "I change position frequently to try and get my back comfortable.",
      shortLabel: "Changing position",
      mirrorPhrase: "you're constantly searching for positions that bring relief",
      optionLabels: YES_NO_LABELS,
    },
    q3: {
      contextHeader: CONTEXT,
      text: "I walk more slowly than usual because of my back.",
      shortLabel: "Walking more slowly",
      mirrorPhrase: "getting around takes you longer than usual",
      optionLabels: YES_NO_LABELS,
    },
    q4: {
      contextHeader: CONTEXT,
      text: "Because of my back, I am not doing any of the jobs that I usually do around the house.",
      shortLabel: "Jobs around the house",
      mirrorPhrase: "housework has become a challenge",
      optionLabels: YES_NO_LABELS,
    },
    q5: {
      contextHeader: CONTEXT,
      text: "Because of my back, I use a handrail to get upstairs.",
      shortLabel: "Using the handrail",
      mirrorPhrase: "stairs already call for extra support",
      optionLabels: YES_NO_LABELS,
    },
    q6: {
      contextHeader: CONTEXT,
      text: "Because of my back, I lie down to rest more often.",
      shortLabel: "Lying down to rest",
      mirrorPhrase: "your back keeps making you want to lie down",
      optionLabels: YES_NO_LABELS,
    },
    q7: {
      contextHeader: CONTEXT,
      text: "Because of my back, I have to hold on to something to get out of an easy chair.",
      shortLabel: "Holding on to get up",
      mirrorPhrase: "getting out of a chair takes help from your arms",
      optionLabels: YES_NO_LABELS,
    },
    q8: {
      contextHeader: CONTEXT,
      text: "Because of my back, I try to get other people to do things for me.",
      shortLabel: "Asking others for help",
      mirrorPhrase: "you depend more on other people for everyday tasks",
      optionLabels: YES_NO_LABELS,
    },
    q9: {
      contextHeader: CONTEXT,
      text: "I get dressed more slowly than usual because of my back.",
      shortLabel: "Dressing more slowly",
      mirrorPhrase: "getting dressed has become slower than normal",
      optionLabels: YES_NO_LABELS,
    },
    q10: {
      contextHeader: CONTEXT,
      text: "I only stand up for short periods of time because of my back.",
      shortLabel: "Standing briefly",
      mirrorPhrase: "standing for long has become hard to tolerate",
      optionLabels: YES_NO_LABELS,
    },
    q11: {
      contextHeader: CONTEXT,
      text: "Because of my back, I try not to bend or kneel down.",
      shortLabel: "Avoiding bending",
      mirrorPhrase: "bending down or kneeling is something you already avoid",
      optionLabels: YES_NO_LABELS,
    },
    q12: {
      contextHeader: CONTEXT,
      text: "I find it difficult to get out of a chair because of my back.",
      shortLabel: "Getting out of a chair",
      mirrorPhrase: "getting up from a chair takes more effort than it should",
      optionLabels: YES_NO_LABELS,
    },
    q13: {
      contextHeader: CONTEXT,
      text: "My back is painful almost all the time.",
      shortLabel: "Pain almost always",
      mirrorPhrase: "the pain stays with you most of the day",
      optionLabels: YES_NO_LABELS,
    },
    q14: {
      contextHeader: CONTEXT,
      text: "I find it difficult to turn over in bed because of my back.",
      shortLabel: "Turning over in bed",
      mirrorPhrase: "moving in bed has become complicated",
      optionLabels: YES_NO_LABELS,
    },
    q15: {
      contextHeader: CONTEXT,
      text: "My appetite is not very good because of my back pain.",
      shortLabel: "Poor appetite",
      mirrorPhrase: "the pain is even affecting your appetite",
      optionLabels: YES_NO_LABELS,
    },
    q16: {
      contextHeader: CONTEXT,
      text: "I have trouble putting on my socks (or stockings) because of the pain in my back.",
      shortLabel: "Putting on socks",
      mirrorPhrase: "dressing from the waist down takes real effort",
      optionLabels: YES_NO_LABELS,
    },
    q17: {
      contextHeader: CONTEXT,
      text: "I only walk short distances because of my back pain.",
      shortLabel: "Walking short distances",
      mirrorPhrase: "long walks are out of reach for now",
      optionLabels: YES_NO_LABELS,
    },
    q18: {
      contextHeader: CONTEXT,
      text: "I sleep less well because of my back.",
      shortLabel: "Sleeping less well",
      mirrorPhrase: "your sleep is paying the price",
      optionLabels: YES_NO_LABELS,
    },
    q19: {
      contextHeader: CONTEXT,
      text: "Because of my back pain, I get dressed with help from someone else.",
      shortLabel: "Help getting dressed",
      mirrorPhrase: "getting dressed already takes someone else's help",
      optionLabels: YES_NO_LABELS,
    },
    q20: {
      contextHeader: CONTEXT,
      text: "I sit down for most of the day because of my back.",
      shortLabel: "Sitting most of the day",
      mirrorPhrase: "you spend most of the day sitting",
      optionLabels: YES_NO_LABELS,
    },
    q21: {
      contextHeader: CONTEXT,
      text: "I avoid heavy jobs around the house because of my back.",
      shortLabel: "Avoiding heavy jobs",
      mirrorPhrase: "heavy efforts around the house are on hold",
      optionLabels: YES_NO_LABELS,
    },
    q22: {
      contextHeader: CONTEXT,
      text: "Because of my back, I am more irritable and bad tempered with people than usual.",
      shortLabel: "More irritable",
      mirrorPhrase: "the pain is affecting your mood",
      optionLabels: YES_NO_LABELS,
    },
    q23: {
      contextHeader: CONTEXT,
      text: "Because of my back, I go upstairs more slowly than usual.",
      shortLabel: "Slower on stairs",
      mirrorPhrase: "going up stairs takes you longer",
      optionLabels: YES_NO_LABELS,
    },
    q24: {
      contextHeader: CONTEXT,
      text: "I stay in bed most of the time because of my back.",
      shortLabel: "Staying in bed",
      mirrorPhrase: "you're spending most of your time in bed",
      optionLabels: YES_NO_LABELS,
    },
  },

  triage: {
    T1: {
      text: "Does the pain run down your leg, below the knee?",
      optionLabels: ["Yes", "No"],
    },
    T2: {
      text: "Does the pain come on when you walk, force you to stop, and ease when you sit down?",
      optionLabels: ["Yes", "No"],
    },
    T3: {
      text: "Do you have any of these: weakness in your foot or leg that keeps getting worse, numbness in the genital area, or new difficulty controlling your bladder or bowels?",
      optionLabels: ["Yes", "No"],
    },
    T4: {
      text: "Did your pain start after a recent hard blow or fall?",
      optionLabels: ["Yes", "No"],
    },
  },

  domains: {
    basicas: {
      label: "Basic activities",
      examples: "getting dressed, getting up, moving around the house",
    },
    moderadas: {
      label: "Moderate activity",
      examples: "walking, standing, stairs",
    },
    demandantes: {
      label: "Demanding activity",
      examples: "lifting, bending over, heavy housework",
    },
  },

  reportTexts: {
    leve: [
      "Your back is barely limiting you right now — and that's exactly the best moment to understand what's causing it. Most lower back problems caught early are resolved without surgery.",
      "A consultation with a physical exam will give you a clear diagnosis.",
    ],
    moderada: [
      "Your result shows that lower back pain is already interfering with basic activities of your day. This pattern can come from a few different places — muscle, disc, or joint — and telling them apart takes a physical exam and, in some cases, a scan.",
      "Finding the cause early keeps the problem from becoming chronic. A consultation will give the problem a name — and give you a real plan.",
    ],
    severa: [
      "Your score reflects a significant limitation: your back is running a large part of your daily life. An impact like this needs a precise diagnosis soon, so you don't keep losing function.",
      "The consultation includes a neurological and spine exam, and whatever scans your case needs.",
    ],
  },
};
