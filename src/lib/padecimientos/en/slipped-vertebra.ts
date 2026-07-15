import type { Padecimiento } from "../types";

export const slippedVertebra: Padecimiento = {
  slug: "slipped-vertebra",
  nombre: "Slipped vertebra",
  grupo: "columna",
  metaTitle:
    "Slipped Vertebra (Spondylolisthesis) | Dr. Angel Ancona · Mérida, Mexico",
  metaDescription:
    "A vertebra slipping forward over the one below it can cause low back and leg pain. Learn about spondylolisthesis, its grades, and treatments. Free assessment.",
  zonaChip: "Lower back",
  definicion: [
    "Spondylolisthesis means one vertebra has slipped forward over the one below it. It can happen from wear and tear in the joints (most common in adults) or from a bone defect that dates back to adolescence.",
    "Here's some good news up front: many slipped vertebrae never hurt and never cause any problems. When they do hurt, proper treatment starts with measuring the slip — not with panicking over the name.",
  ],
  sintomas: [
    "Lower back pain that gets worse when standing or walking",
    "Relief when sitting or lying down",
    "Stiffness and a worn-out feeling in your lower back",
    "Pain running down your legs if a nerve is being pinched",
    "In some cases, a small 'step' you can feel in your lower back",
  ],
  cuandoPreocuparse: {
    señales: [
      "Weakness in the legs that keeps getting worse",
      "Numbness in the genital area, or new difficulty controlling your bladder or bowels",
      "Pain that gets worse quickly over a matter of weeks",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative (non-surgical) treatment",
      texto:
        "Strengthening your spine's natural 'corset' (your core and back muscles) with targeted physical therapy, plus medication during flare-ups. It works in the vast majority of stable cases.",
    },
    {
      titulo: "Monitoring with imaging",
      texto:
        "In low-grade slips, measuring and comparing over time is part of the treatment: most don't progress.",
    },
    {
      titulo: "Fusion surgery",
      texto:
        "When there's proven instability, progression, or nerve compression that doesn't respond. It secures the slipping segment in place — depending on your case, with minimally invasive percutaneous instrumentation.",
    },
  ],
  citaDoctor:
    "I operate on what truly warrants it: instability and compression — not a scan or a scare. That standard is what protects you — and when surgery is necessary, I do it with minimally invasive instrumentation.",
  comoLoTrato: [
    "The first step is classifying your case: how far the vertebra has slipped (the grade), whether it moves when you move (stability), and whether it's pinching any nerves. Those three answers — which come from the exam and from X-rays taken while you bend — define everything else.",
    "My bar for surgery here is high: I operate on instability and compression — not on a scan or a scare. Most of my spondylolisthesis patients are treated without surgery, with follow-ups that measure the slip over time.",
  ],
  faq: [
    {
      pregunta: "Can a chiropractor 'put my vertebra back in place'?",
      respuesta:
        "No — the slip is structural and can't be pushed back into place from the outside. In an unstable spine, forceful manipulation can even be risky. Treatment means strengthening, monitoring, and — only if truly needed — fusion surgery.",
    },
    {
      pregunta: "Can I exercise with spondylolisthesis?",
      respuesta:
        "In most cases, not only can you — you should. Muscle is your best stabilizer. What changes is the type of exercise — we design it around your grade and your stability.",
    },
    {
      pregunta: "Does it always end in surgery?",
      respuesta:
        "No. Low-grade, stable slips — and that's most of them — can be managed without surgery for life. Surgery is for cases with instability or progressive compression.",
    },
  ],
  testZone: "espalda-baja",
  testCtaQuestion:
    "See how much your back pain is affecting you — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
