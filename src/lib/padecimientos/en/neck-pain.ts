import type { Padecimiento } from "../types";

export const neckPain: Padecimiento = {
  slug: "neck-pain",
  nombre: "Neck pain",
  grupo: "columna",
  metaTitle: "Neck Pain: Causes & Treatment | Dr. Angel Ancona · Mérida, Mexico",
  metaDescription:
    "From a stiff neck caused by stress to pain running down your arm: learn what causes neck pain, when to worry, and how it's treated. Free neck assessment.",
  zonaChip: "Neck",
  definicion: [
    "Your neck is the most mobile part of your spine — and that's why it pays the highest price for long hours in the same position, stress, and wear. Most neck pain is muscular or joint-related and gets better with the right care.",
    "But your neck is also the highway for the nerves to your arms and for the spinal cord itself. When the pain runs down your arm, or your hands start failing you, your neck deserves more than a muscle rub: it deserves a diagnosis.",
  ],
  sintomas: [
    "Neck pain and stiffness, with trouble turning your head",
    "Pain that climbs up to the base of your skull or triggers headaches",
    "Pain that runs down into your shoulder, arm, or hand",
    "Tingling or numbness in your arm or fingers",
    "Clicking, or a grinding, gritty feeling when you move your neck",
  ],
  cuandoPreocuparse: {
    señales: [
      "New weakness in an arm or hand",
      "Clumsiness in your hands, or unsteadiness when you walk, that's getting worse quickly",
      "Fever along with a very stiff neck",
      "Pain after an accident or a hard hit",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative (non-surgical) treatment",
      texto:
        "The workhorse of neck pain care: medication during flare-ups, targeted physical therapy, posture habits, and managing stress and muscle tension. It takes care of the vast majority of cases.",
    },
    {
      titulo: "Image-guided injections",
      texto:
        "For joint pain, or pain running down your arm that won't let up: injections that reduce the inflammation at the exact source of the problem.",
    },
    {
      titulo: "Cervical spine surgery",
      texto:
        "Reserved for herniated discs in the neck that are seriously pressing on a nerve and haven't improved with treatment, or for pressure on the spinal cord itself. It's often done from the front of the neck, with small incisions and short hospital stays.",
    },
  ],
  citaDoctor:
    "Most neck pain gets better with the right diagnosis and a good plan. And for the cases that do need cervical spine surgery, I perform it with specialized techniques — keeping your nerves safe.",
  comoLoTrato: [
    "With your neck, my exam is built to answer one question: is the pain coming from muscle, from the joints, or from a pinched nerve? Those are three different problems with three different treatments — and mixing them up is the reason so much neck pain becomes chronic.",
    "Most of my neck pain patients never need surgery or an MRI: they need the right diagnosis and the right plan. And the few surgical cases — the ones with real compression — benefit enormously from being caught early, before the nerve or the spinal cord pays the price.",
  ],
  faq: [
    {
      pregunta: "Is it my pillow, or my phone?",
      respuesta:
        "Long hours in the same posture — head pushed forward at a screen, hours on your phone — do overload your neck, and they're part of the modern problem. But if the pain lasts for weeks or runs down your arm, changing your pillow isn't a diagnosis: we need to find out which structure is actually in trouble.",
    },
    {
      pregunta: "Is cracking my neck bad?",
      respuesta:
        "The occasional pop when you move your neck doesn't usually mean anything's damaged. Making a habit of forcefully cracking it yourself is another story: it gives momentary relief, doesn't fix the cause, and in a neck with an underlying problem it can be risky. Better to find out why you feel the need to crack it.",
    },
    {
      pregunta: "When does a herniated disc in the neck need surgery?",
      respuesta:
        "When it's pressing on a nerve and the pain or weakness hasn't improved with a full course of treatment, or when it's pressing on the spinal cord itself. Outside of those cases, most herniated discs in the neck are treated without surgery.",
    },
  ],
  testZone: "cuello",
  testCtaQuestion:
    "See how much your neck pain is affecting you — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
