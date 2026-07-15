import type { Padecimiento } from "../types";

export const spinalFractures: Padecimiento = {
  slug: "spinal-fractures",
  nombre: "Spinal fractures",
  grupo: "columna",
  metaTitle:
    "Spinal Fracture & Vertebral Compression Fracture | Dr. Angel Ancona · Mérida, Mexico",
  metaDescription:
    "Sudden back pain after a fall — or with no clear injury at all, when osteoporosis has weakened the bone. Learn about vertebral fractures and their treatment, from bracing to bone cement.",
  zonaChip: "Mid and lower back",
  definicion: [
    "A vertebra can break in two very different ways: from a strong impact — an accident, a fall from a height — or by compression in a bone weakened by osteoporosis, where it can take next to nothing: carrying a bag, a stumble, even a sneeze.",
    "Osteoporosis fractures are the spine's silent epidemic: many get mistaken for 'ordinary back pain' and are diagnosed late. Catching them early changes everything — including the option of minimally invasive treatments that can bring relief within hours to a few days.",
  ],
  sintomas: [
    "Sudden, intense back pain, with or without a clear injury",
    "Worse when standing or sitting, better when lying down",
    "Pain that wraps around your midsection like a belt",
    "Losing height, or growing more stooped over the years",
    "Pain that still won't let up weeks after a 'minor' fall",
  ],
  cuandoPreocuparse: {
    señales: [
      "Weakness, tingling, or clumsiness in the legs",
      "New difficulty controlling your bladder or bowels",
      "Pain after a serious accident or fall",
      "Fever along with the back pain",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative (non-surgical) treatment",
      texto:
        "Many compression fractures are stable and heal on their own in 6 to 12 weeks. The plan: good pain control, a brace when needed, and early, supervised movement — prolonged strict bed rest works against you, not for you.",
    },
    {
      titulo: "Kyphoplasty / vertebroplasty",
      texto:
        "When the pain won't let up or keeps you from your daily life, bone cement stabilizes the vertebra from the inside, through a tiny incision. Most patients feel relief within hours to a few days — and go home the same day.",
    },
    {
      titulo: "Surgery with instrumentation",
      texto:
        "For unstable fractures or fractures pressing on the nerves: we secure the segment with screws — depending on your case, placed through the skin with minimally invasive technique.",
    },
  ],
  citaDoctor:
    "Treating the fracture without treating the bone leaves the door open for the next one. Here we take care of both.",
  comoLoTrato: [
    "With a vertebral fracture I answer three questions: is it stable or unstable? Is it pressing on any nerves? And how recent is it? Those answers — from the exam and your scans — separate the person who only needs a brace and monitoring from the one who'll benefit from cement or screws.",
    "And there's a fourth question many people forget: why did this bone break? If the answer is osteoporosis, treating the fracture without treating the bone leaves the door open for the next one. I'll coordinate that part of your care, too.",
  ],
  faq: [
    {
      pregunta: "Will a spinal fracture put me in a wheelchair?",
      respuesta:
        "No. The vast majority of vertebral fractures — especially osteoporosis compression fractures — are stable and don't touch the spinal cord or nerves. With the right treatment, getting back to your normal life is the rule, not the exception.",
    },
    {
      pregunta: "What exactly is this 'bone cement'?",
      respuesta:
        "Kyphoplasty and vertebroplasty fill the fractured vertebra with medical-grade bone cement that stabilizes it from the inside. It's done through a tiny incision, is usually outpatient, and pain relief typically comes within hours to a few days. It's one of the most gratifying procedures in spine care.",
    },
    {
      pregunta: "How did I break a bone without a real injury?",
      respuesta:
        "Because the bone had been quietly weakening — that's osteoporosis. For many people, the fracture is its first visible sign. That's why, besides treating the vertebra, we need to measure and treat your bone health: it's the best way to prevent the next one.",
    },
  ],
  testZone: "espalda-alta",
  testCtaQuestion:
    "See how much your back pain is affecting you — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
