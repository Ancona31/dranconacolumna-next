import type { Padecimiento } from "../types";

export const kneePain: Padecimiento = {
  slug: "knee-pain",
  nombre: "Knee pain",
  grupo: "ortopedia",
  metaTitle:
    "Knee Pain: Meniscus, Ligaments & Arthritis | Dr. Angel Ancona · Mérida, Mexico",
  metaDescription:
    "A knee that hurts on stairs, swells up, or locks? Learn the causes — meniscus tears, ligaments, arthritis — and get a free knee assessment in minutes.",
  zonaChip: "Knee",
  definicion: [
    "Your knee carries your weight with every step and multiplies it when you climb stairs, come back down, or squat. That's why knee problems fall into two different worlds: injuries — meniscus and ligament tears, usually from a twist or from sports — and cartilage wear, arthritis, which comes with age and mileage.",
    "Knowing which of those two worlds your knee is in changes the whole plan: a mechanical injury in a young knee isn't treated like wear and tear. And both have more options today than ever before a knee replacement is even on the table.",
  ],
  sintomas: [
    "Pain going up or down stairs, or when squatting",
    "Swelling after activity",
    "A feeling that it locks up or gives way (instability)",
    "Morning stiffness that eases once you get moving",
    "Painful clicking, or pain at one specific spot in the joint",
  ],
  cuandoPreocuparse: {
    señales: [
      "Not being able to put weight on your leg or straighten your knee",
      "Sudden, major swelling after a twist",
      "Fever with a hot, red knee",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative (non-surgical) treatment",
      texto:
        "Targeted strengthening (your quads are your knee's best shock absorber), weight control, medication during flare-ups, and adjusting your activity. It's the foundation for treating every knee problem — with or without surgery later.",
    },
    {
      titulo: "Injections and viscosupplementation (gel injections)",
      texto:
        "For arthritis and inflammation that won't calm down: from anti-inflammatory injections to hyaluronic acid that improves the joint's lubrication. They buy you time and keep you moving, with minimal downside.",
    },
    {
      titulo: "Arthroscopy or surgery",
      texto:
        "For mechanical injuries that call for it — a meniscus that locks the knee, torn ligaments in active patients — arthroscopy repairs or reconstructs them through small incisions. And when the joint is truly worn out, a knee replacement gives back the life that pain took away — but it's the last step, not the first.",
    },
  ],
  citaDoctor:
    "The knee forgives few shortcuts — and rewards strong muscle generously.",
  comoLoTrato: [
    "With your knee, my exam starts with the right question: is this mechanical, or is it wear? The meniscus and ligament tests, the pattern of your pain, and — when needed — a scan give the answer. It's the difference between repairing a part and caring for the whole joint.",
    "My philosophy with the knee is step by step: exhaust every conservative option before injecting, inject with good judgment before operating, and operate on what the evidence says benefits from surgery. The knee forgives few shortcuts — and rewards strong muscle generously.",
  ],
  faq: [
    {
      pregunta: "Can knee arthritis be cured?",
      respuesta:
        "Lost cartilage doesn't grow back — that's the honest answer. But 'no cure' doesn't mean 'no treatment': strong muscle, keeping your weight in check, well-chosen injections, and adjusting your activity can radically change your pain — and what you can do — for years. Arthritis is something you manage — and when you manage it well, life is good.",
    },
    {
      pregunta: "Does every meniscus tear need surgery?",
      respuesta:
        "No. Degenerative tears (from wear) usually do better with rehab than with arthroscopy — the evidence is clear there. Surgery is mostly for mechanical tears that lock the knee, or tears in young, active patients where repairing it preserves the meniscus.",
    },
    {
      pregunta: "When is it time for a knee replacement?",
      respuesta:
        "When the wear is advanced and the pain limits your daily life despite everything else. The X-ray alone doesn't make the call: I've seen 'terrible' knees on X-rays with happy owners — and the other way around. I offer a replacement when your life asks for it, not when the X-ray suggests it.",
    },
  ],
  testZone: "rodilla",
  testCtaQuestion:
    "See how much your knee pain is affecting you — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
