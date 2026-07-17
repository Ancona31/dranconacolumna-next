/**
 * Copy transversal del motor en INGLÉS.
 *
 * Contrapartida EN de es.ts: cada campo es el literal inglés, no una traducción
 * en vivo. Las claves de nivel siguen siendo internas en español
 * (leve/moderada/severa); LEVEL_EN las mapea a su forma inglesa dentro de las
 * plantillas que las interpolan (whatsapp.*). Es capa de copy, no lógica.
 */

import type { NonUrgentLevel } from "../types";
import type { EngineCopy } from "./types";

const LEVEL_EN: Record<NonUrgentLevel, string> = {
  leve: "mild",
  moderada: "moderate",
  severa: "severe",
};

export const en: EngineCopy = {
  recommendationEyebrow: "RECOMMENDED CONSULTATION",

  recommendations: {
    leve: {
      window: "This week",
      context:
        "Your result shows no urgent findings. A medical consultation will give you a clear diagnosis and a plan.",
    },
    moderada: {
      window: "Within the next 3 days",
      context: "This level of limitation calls for a medical consultation.",
    },
    severa: {
      window: "Within the next 24 to 48 hours",
      context: "Your result calls for a prompt consultation.",
    },
    precaucion: {
      window: "Within the next 24 to 48 hours",
      context:
        "Beyond your limitation level, the findings you marked call for a prompt consultation.",
    },
    urgente: {
      window: "Today, at an emergency room",
      context: "You need an in-person evaluation.",
    },
  },

  nivelDefinitions: {
    leve: "A mild limitation means you can do most of your daily and work activities, though with occasional discomfort or discomfort at the end of the day.",
    moderada:
      "A moderate limitation can make your daily or work activities harder. Be careful if your job involves carrying heavy objects, or walking through hazardous, narrow, or uneven places.",
    severa:
      "A severe limitation can make basic day-to-day activities nearly impossible and can make physical work unsafe. Avoid major exertion, heavy loads, and risky surfaces until a doctor evaluates your case.",
  },

  funcStateLabels: {
    verde: "No significant difficulty",
    amarillo: "With mild difficulty",
    naranja: "With considerable difficulty",
    rojo: "Very limited today",
    na: "Doesn't apply in your case",
  },

  domainNaPhrase: "You indicated these activities are limited by another cause.",

  unscorableMessage:
    "We couldn't calculate your result: you marked every activity as not applicable.",

  funcAllGreenLine:
    "Your answers show no functional limitation. If the pain persists despite that, it deserves an explanation too.",

  defaultSemaphoreTitle: "Your capacity today, according to your answers",

  domainPhrases: {
    verde: {
      basicas:
        "The essentials of your day remain without significant difficulty. Protect that base: it's your starting point for recovery.",
      moderadas:
        "Your everyday mobility is holding up well. Keep taking care so it stays that way.",
      demandantes:
        "Bigger efforts aren't limiting you significantly yet. Even so, don't push it: listen to your body.",
    },
    amarillo: {
      basicas:
        "A limitation is starting to show in the most basic things{ej}. It's mild, but on this ground every early signal counts.",
      moderadas:
        "Your daily mobility is starting to feel it{ej}. It's an early signal worth not letting grow.",
      demandantes:
        "Bigger efforts are starting to take their toll{ej}. Ease up on this ground.",
    },
    naranja: {
      basicas:
        "The essentials of your day already demand a clear effort{ej}. This finding carries weight in your evaluation: don't write it off as normal.",
      moderadas:
        "Your everyday mobility is clearly compromised{ej}. Pace these activities.",
      demandantes:
        "Bigger efforts are already causing you outright difficulty{ej}. Cut them down to the essential.",
    },
    rojo: {
      basicas:
        "Your most basic activities are seriously affected{ej}. It's the most significant finding in your evaluation.",
      moderadas:
        "The impact reaches your daily mobility head-on{ej}. Limit it to what's strictly necessary.",
      demandantes:
        "Bigger efforts are out of reach for now{ej}. Avoid them entirely until you have a diagnosis.",
    },
  },

  elevatedPhrases: {
    amarillo:
      "Your lighter activities already show limitation — this ground deserves the same caution.",
    naranja:
      "Given the limitation your lighter activities show, this ground will demand even more from you: pace it.",
    rojo: "Given the limitation your lighter activities show, this is the ground with the highest risk of overexertion — avoid it until you have a diagnosis.",
  },

  exampleLead: " — for example, ",
  exampleJoin: " and ",

  redFlagLabels: {
    fiebre: "Fever along with the pain",
    "perdida-peso": "Unexplained weight loss",
    cancer: "A history of cancer",
    "dolor-nocturno":
      "The pain wakes me up at night and doesn't ease with rest",
  },
  redFlagNoneLabel: "None of the above",

  urgentFlagBanners: {
    "urgente-trauma": {
      title: "Your injury needs to be seen today",
      body: "You indicated that after a blow or fall you can't put weight on your foot. That needs an in-person check today — go to an emergency room. Take this report with you; it will help the doctor who sees you.",
    },
    "urgente-neurologico": {
      title: "Your answers include findings that need to be seen today",
      body: "You indicated progressive weakness, numbness in the genital area, or new difficulty controlling your bladder or bowels. Those findings require an in-person evaluation today — go to an emergency room. Take this report with you.",
    },
    "urgente-neurologico-dorsal": {
      title: "Your answers include findings that need to be seen today",
      body: "You indicated weakness or clumsiness in your legs that came on suddenly. That finding needs an in-person evaluation today — go to an emergency room. Take this report with you.",
    },
  },

  urgentTraumaBannerByZone: {
    hombro: {
      title: "Your injury needs to be seen today",
      body: "You indicated that after a blow or fall you have a deformity or can't move the affected arm or hand. That needs an in-person check today — go to an emergency room. Take this report with you; it will help the doctor who sees you.",
    },
    codo: {
      title: "Your injury needs to be seen today",
      body: "You indicated that after a blow or fall you have a deformity or can't move the affected arm or hand. That needs an in-person check today — go to an emergency room. Take this report with you; it will help the doctor who sees you.",
    },
    muneca: {
      title: "Your injury needs to be seen today",
      body: "You indicated that after a blow or fall you have a deformity or can't move the affected arm or hand. That needs an in-person check today — go to an emergency room. Take this report with you; it will help the doctor who sees you.",
    },
  },

  cautionBannerTitle: "Findings that deserve medical evaluation",
  cautionBannerBody: (marks) =>
    `You marked: ${marks}. On their own, these findings don't confirm any serious problem, but they do call for a doctor to evaluate them soon to rule out causes that need specific treatment.`,

  evaluationSignature: "This is the evaluation I perform at the consultation.",

  warningClosing:
    "If any of these signs appear, don't wait for your appointment: seek evaluation right away. Most important of all: don't ignore what your body is telling you.",

  evaluationPlans: {
    cuello: {
      base: [
        "I'll examine your neck's mobility and the movements that set off your pain",
        "I'll check the strength, reflexes, and sensation in your arms",
        "I'll decide whether your case needs scans, and which ones",
      ],
      byFlag: {
        "radicular-cervical":
          "I'll trace the exact origin of the pain running down your arm",
        mielopatia:
          "I'll examine in detail the function of your hands, your reflexes, and the way you walk — the findings you marked are important and deserve a careful neurological review.",
        trauma: "I'll rule out injuries from the accident you mentioned",
      },
    },
    "espalda-alta": {
      base: [
        "I'll examine your upper back and the postures or movements that set off the pain",
        "I'll check the strength and reflexes in your legs",
        "I'll consider scans — in this area they tend to be especially useful",
      ],
      byFlag: {
        "banda-dorsal":
          "I'll evaluate the path of the pain wrapping around toward your chest",
        "deficit-dorsal":
          "I'll thoroughly examine the strength and reflexes in your legs — that finding will guide your evaluation.",
        trauma: "I'll rule out a vertebral fracture from the blow you mentioned",
      },
    },
    "espalda-baja": {
      base: [
        "I'll check how your spine moves and which movements set off your pain",
        "I'll evaluate the strength in your legs and how your reflexes respond",
        "I'll decide whether your case needs scans, and which ones",
      ],
      byFlag: {
        radicular:
          "I'll trace the exact origin of the pain running down your leg",
        claudicacion:
          "I'll measure how far you can walk before the pain stops you — a key piece of information in your case",
      },
    },
    cadera: {
      base: [
        "I'll examine your hip's movements to pinpoint the origin of the pain",
        "I'll look at the way you walk",
        "I'll consider scans if your case requires them",
      ],
      byFlag: {
        trauma: "I'll rule out a bone injury from the blow you mentioned",
      },
    },
    rodilla: {
      base: [
        "I'll examine your knee with specific meniscus and ligament tests",
        "I'll check its stability and mobility",
        "I'll consider scans if they're needed",
      ],
      byFlag: {
        inestabilidad: "I'll look for the cause of the locking or giving way",
        trauma: "I'll rule out a bone injury from the blow you mentioned",
      },
    },
    hombro: {
      base: [
        "I'll examine your shoulder's movements with specific rotator cuff tests",
        "I'll check your strength for raising and rotating your arm",
        "I'll consider scans if your case requires them",
      ],
      byFlag: {
        manguito:
          "I'll pay special attention to the loss of strength you noticed after the strain",
        "origen-cervical":
          "I'll also check your neck: part of shoulder pain can start there",
        trauma: "I'll rule out a bone injury from the blow you mentioned",
      },
    },
    codo: {
      base: [
        "I'll examine your elbow's full mobility and the exact spots where it hurts",
        "I'll evaluate the strength in your arm and forearm",
        "I'll consider scans if they're needed",
      ],
      byFlag: {
        cubital: "I'll check the nerve causing the tingling in your fingers",
        trauma: "I'll rule out a bone injury from the blow you mentioned",
      },
    },
    muneca: {
      base: [
        "I'll examine your wrist and hand: mobility, grip strength, and pain points",
        "I'll check the function of your nerves and tendons",
        "I'll consider scans if they're needed",
      ],
      byFlag: {
        mediano: "I'll evaluate the nerve causing the nighttime tingling",
        trauma: "I'll rule out a fracture from the fall you mentioned",
      },
    },
    tobillo: {
      base: [
        "I'll examine your ankle and foot: mobility, pain points, and ligament stability",
        "I'll check your weight-bearing and the way you walk",
        "I'll consider scans if your case requires them",
      ],
      byFlag: {
        trauma:
          "I'll rule out a fracture or a ligament injury from the twist you mentioned",
        "inflamacion-aguda":
          "I'll investigate the cause of the swelling — there are several possibilities, and telling them apart completely changes the treatment",
      },
    },
  },

  warningSigns: {
    cuello: [
      "Clumsiness in your hands or unsteadiness that's getting worse quickly",
      "New weakness in an arm or hand",
      "Fever along with the neck pain",
    ],
    "espalda-alta": [
      "New weakness or clumsiness in your legs",
      "New difficulty controlling your bladder or bowels",
      "Fever along with the back pain",
    ],
    "espalda-baja": [
      "New or growing weakness in your foot or leg",
      "Numbness in the genital area, or new difficulty controlling your bladder or bowels",
      "Fever along with the back pain",
    ],
    cadera: [
      "Suddenly not being able to put weight on your leg",
      "A visible deformity or a shorter-looking leg after a blow",
      "Fever along with hip pain",
    ],
    rodilla: [
      "Not being able to put weight on the leg or straighten the knee",
      "Sudden, major swelling",
      "Fever with a hot, red knee",
    ],
    hombro: [
      "A visible deformity of the shoulder after a blow or fall",
      "Complete inability to move the arm",
      "Fever with a hot, swollen shoulder",
    ],
    codo: [
      "A visible deformity of the elbow",
      "Not being able to bend or straighten the elbow",
      "Fever with a hot, swollen elbow",
    ],
    muneca: [
      "A visible deformity after a fall",
      "Fingers that are cold, pale, or turning purple",
      "Fever with swelling of the wrist or hand",
    ],
    tobillo: [
      "A visible deformity after a twist or blow",
      "Toes that are cold, pale, or turning purple",
      "Fever with a hot, swollen ankle or foot",
    ],
  },

  partialAnswersNote: (answered, total) =>
    `Approximate result: calculated from ${answered} of ${total} activities (you marked the rest as not applicable).`,

  whatsapp: {
    ventanaCorta: {
      urgente: "today",
      precaucion: "within 24 to 48 hours",
      severa: "within 24 to 48 hours",
      moderada: "within the next 3 days",
      leve: "this week",
    },
    qrShort: (folio, score, level, ventana) =>
      `I'd like to schedule a consultation. ${folio}: ${score}/100, ${LEVEL_EN[level]}, consultation ${ventana}.`,
    qr: (zona, folio, score, level, ventana) =>
      `I'd like to schedule a consultation. ${zona} evaluation ${folio}: ${score}/100, ${LEVEL_EN[level]} limitation. Test recommendation: consultation ${ventana}.`,
    qrAlarmSuffix: " I marked warning signs.",
    fullUrgente: (zoneLabel, folio) =>
      `Hello Dr. Ancona, my ${zoneLabel} assessment detected warning signs (folio ${folio}). I'm going to the ER; I'm letting you know about my case.`,
    fullUnscorable: (zoneLabel, folio) =>
      `Hello Dr. Ancona, I answered the ${zoneLabel} assessment (folio ${folio}), but I marked every activity as not applicable and got no result. I'd like to schedule a consultation.`,
    fullBase: (zoneLabel, folio, level, score) =>
      `Hello Dr. Ancona, I completed the ${zoneLabel} assessment (folio ${folio}). Result: ${LEVEL_EN[level]} limitation, ${score}/100. I'd like to schedule a consultation.`,
    fullPrecaucionSuffix: " I marked warning signs in the questionnaire.",
  },
};
