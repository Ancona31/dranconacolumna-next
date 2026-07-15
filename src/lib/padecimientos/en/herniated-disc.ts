import type { Padecimiento } from "../types";

export const herniatedDisc: Padecimiento = {
  slug: "herniated-disc",
  nombre: "Herniated disc",
  grupo: "columna",
  metaTitle:
    "Herniated Disc: Symptoms & Treatment in Mérida, Mexico | Dr. Angel Ancona",
  metaDescription:
    "Pain shooting down your leg? Learn the symptoms of a herniated disc, when to worry, and your treatment options — most cases don't need surgery. Free assessment.",
  zonaChip: "Lower back",
  definicion: [
    "Between each pair of vertebrae sits a disc that cushions your every move. When that disc wears down or slips out of place, it can press on a nerve — and that's what causes the pain.",
    "It's one of the most common causes of low back pain that radiates down the leg, and one of the most treatable: most herniated discs get better without surgery.",
  ],
  sintomas: [
    "Lower back pain that travels into your buttock or down your leg",
    "Tingling or numbness in the leg or foot",
    "Pain that gets worse when sitting, bending over, coughing, or sneezing",
    "Weakness when walking on your toes or heels",
    "Some relief when you change position or walk around",
  ],
  cuandoPreocuparse: {
    señales: [
      "Weakness in the leg or foot that keeps getting worse",
      "Numbness in the genital area, or new difficulty controlling your bladder or bowels",
      "Fever along with the back pain",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative (non-surgical) treatment",
      texto:
        "Medication, targeted physical therapy, and activity adjustments. Most herniated discs improve this way within 6 to 12 weeks — your body can even reabsorb part of the fragment over time.",
    },
    {
      titulo: "Image-guided injections",
      texto:
        "If the pain persists, we can calm the nerve directly with an image-guided injection, without surgery. It relieves the pain and buys time for your body to do its part.",
    },
    {
      titulo: "Minimally invasive surgery",
      texto:
        "Only when those steps haven't been enough or the nerve is at risk. Endoscopic microdiscectomy removes the fragment that's pressing on the nerve through an incision under one centimeter — less than half an inch.",
    },
  ],
  citaDoctor:
    "We exhaust every conservative option first, because many herniated discs get better that way. But when surgery is what your case needs, my fellowship training in minimally invasive surgery has you walking the same day — and back to your life in weeks, not months.",
  comoLoTrato: [
    "My first job is to confirm that your pain really comes from a herniated disc — not all pain that runs down the leg comes from one. We sort that out with a physical exam and, when your case calls for it, an MRI.",
    "If it is a herniated disc, we start with conservative treatment: in my practice, surgery is the exception. And when surgery is the right call, my fellowship training lets me offer minimally invasive techniques: incisions measured in millimeters, home the same day or within 24 hours in most cases, and back to your life in weeks, not months.",
  ],
  faq: [
    {
      pregunta: "Does every herniated disc need surgery?",
      respuesta:
        "No. About 8 in 10 get better without surgery, with a proper course of conservative treatment. Surgery is the exception — and when it's needed, it's far less invasive today than it used to be.",
    },
    {
      pregunta: "Can a massage or an adjustment pop my disc back in?",
      respuesta:
        "The displaced fragment can't be pushed back from the outside. Your body, though, can partially reabsorb it over time — that's why conservative treatment works for most people. Be wary of anyone who promises to 'pop it back in' in one session.",
    },
    {
      pregunta: "If I need surgery, how long is the recovery?",
      respuesta:
        "With the endoscopic technique, most of my patients walk the same day, go home within 24 hours, and return to light activity in 2 to 4 weeks. Everyone heals at their own pace — you'll get a clear plan and scheduled follow-ups.",
    },
  ],
  testZone: "espalda-baja",
  testCtaQuestion:
    "See how much your back pain is affecting you — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
