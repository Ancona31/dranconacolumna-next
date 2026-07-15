import type { Padecimiento } from "../types";

export const sciatica: Padecimiento = {
  slug: "sciatica",
  nombre: "Sciatica",
  grupo: "columna",
  metaTitle:
    "Sciatica: Why It Hurts & How It's Treated in Mérida, Mexico | Dr. Angel Ancona",
  metaDescription:
    "Pain running from your lower back down your leg: that's sciatica. Learn what causes it, the warning signs, and your treatment options — free assessment in minutes.",
  zonaChip: "Lower back",
  definicion: [
    "The sciatic nerve starts in your lower back and travels down the back of each leg. When something compresses or irritates it at its origin, the pain 'travels' down the nerve's path — that's sciatica.",
    "Here's the key: sciatica isn't a diagnosis, it's a symptom. There's always a cause behind it — a herniated disc, spinal stenosis, inflammation — and my job is to find it.",
  ],
  sintomas: [
    "Pain running from the buttock down the back or side of the leg",
    "It can reach below the knee, all the way to the foot",
    "Tingling, electric 'shocks,' or numbness along that same path",
    "Gets worse when sitting, coughing, or sneezing",
    "Almost always affects just one side",
  ],
  cuandoPreocuparse: {
    señales: [
      "Weakness in the leg or foot that keeps getting worse",
      "Numbness in the genital area, or new difficulty controlling your bladder or bowels",
      "Sciatic pain in both legs at once",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative (non-surgical) treatment",
      texto:
        "In most cases sciatica settles down within a few weeks with nerve pain medication, targeted physical therapy, and activity adjustments — and nothing more.",
    },
    {
      titulo: "Image-guided injections",
      texto:
        "When the pain won't let up or keeps you from your daily life, an image-guided injection can reduce the inflammation right where the nerve begins.",
    },
    {
      titulo: "Surgery",
      texto:
        "Reserved for significant nerve compression that doesn't respond, or weakness that keeps getting worse. The technique depends on the cause — and it can often be minimally invasive.",
    },
  ],
  citaDoctor:
    "With sciatica I don't chase the pain: I chase the cause. And once I find it, I give you the right plan — from conservative care to minimally invasive surgery when that's what your nerve needs.",
  comoLoTrato: [
    "With sciatica I don't chase the pain: I chase the cause. The physical exam tells me which nerve is affected and at what level; a scan — when your case calls for it — confirms the why.",
    "With the cause in hand, your plan is built around you: most of my sciatica patients never set foot in an operating room. And if yours is a case that does need it, I'll tell you honestly — with options.",
  ],
  faq: [
    {
      pregunta: "Does sciatica go away on its own?",
      respuesta:
        "Often, yes — most cases settle in 4 to 6 weeks with proper management. But 'toughing it out' without a diagnosis is risky: if there's weakness or the pain persists, the nerve may be suffering damage that's hard to reverse later.",
    },
    {
      pregunta: "Are spinal injections dangerous?",
      respuesta:
        "Image-guided injections are controlled, low-risk procedures. When they're the right call for your case, they relieve pain without surgery. The key is choosing them for the right reasons — and always using image guidance.",
    },
    {
      pregunta: "When does sciatica need surgery?",
      respuesta:
        "When there's progressive weakness, loss of bladder or bowel control, or disabling pain that hasn't responded to a full course of treatment. That's the minority of cases — but in those, timely surgery protects the nerve.",
    },
  ],
  testZone: "espalda-baja",
  testCtaQuestion:
    "See how much your back pain is affecting you — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
