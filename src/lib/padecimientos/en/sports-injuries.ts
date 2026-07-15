import type { Padecimiento } from "../types";

export const sportsInjuries: Padecimiento = {
  slug: "sports-injuries",
  nombre: "Sports injuries",
  grupo: "ortopedia",
  metaTitle:
    "Sports Injuries: Diagnosis & Return to Play | Dr. Angel Ancona · Mérida, Mexico",
  metaDescription:
    "From a soccer player's sprain to a runner's tendinitis: precise diagnosis, treatment, and a return-to-play plan without setbacks. Get a free injury assessment.",
  definicion: [
    "Sports test every structure: muscles that tear during a sprint, ligaments that give way on a bad landing, tendons that get inflamed from repeated load, bones that fatigue from accumulated miles. Every sport has its own list of injuries — and every injury has its own treatment and its own timeline.",
    "The difference between a well-managed and a poorly managed sports injury doesn't show up in the first week — it shows up when you get hurt again. Going back too soon, or going back without treating the root cause, is the recipe for the injury that keeps coming back. My approach is to put an exact name on the injury and a realistic date on the return.",
  ],
  sintomas: [
    "Sharp pain during exercise (the 'pull', the 'stab', the pop)",
    "Pain that comes with load and eases with rest (classic tendinitis)",
    "Swelling or bruising after the effort",
    "Loss of strength or range for your sport's movements",
    "A nagging ache you can 'push through' — but one that shows up earlier and earlier in every workout",
  ],
  cuandoPreocuparse: {
    señales: [
      "An audible pop followed by being unable to continue",
      "Can't put weight on it, or there's a visible deformity",
      "Sudden, major swelling within the first hour",
      "Bone pain at night that doesn't ease with rest",
    ],
  },
  tratamiento: [
    {
      titulo: "Acute phase: protect and evaluate",
      texto:
        "Ice, relative rest, and an early diagnosis. The old 'walk it off and push through' is the worst sports medicine there is: training on an injury nobody's diagnosed yet only makes it worse.",
    },
    {
      titulo: "Rehab with progressive loading",
      texto:
        "Prolonged total rest weakens you; progressive, guided loading heals you. Physical therapy with measurable goals: range, strength, control — and only then, your sport's movements.",
    },
    {
      titulo: "Surgery when the injury demands it",
      texto:
        "Complete ligament or tendon tears in active athletes, injuries that don't improve with treatment: repair — often done arthroscopically — followed by the same rehab path, now with the tissue repaired.",
    },
  ],
  citaDoctor:
    "You return when you meet the criteria, not when the calendar says so.",
  comoLoTrato: [
    "With an athlete I speak two languages: the clinical one and the one of your sport. I care about the exact diagnosis — which structure, what grade — and I care just as much about your calendar: what tournament is coming, what position you play, how many years you've been at this. The plan comes from putting both together.",
    "And I'm clear about the return: you return when you meet the criteria, not when the calendar says so. Strength comparable to the healthy side, pain-free movement, confidence back. Coming back a week late is frustrating; coming back two weeks early can cost you the season — or the joint itself.",
  ],
  faq: [
    {
      pregunta: "How long does a muscle tear take to heal?",
      respuesta:
        "It depends on the grade: mild ones, 2 to 3 weeks; moderate, 4 to 8; complete tears may need surgery and months. Grading it with an exam — and ultrasound when needed — turns 'how long will this take?' from a guess into a plan.",
    },
    {
      pregunta: "Can I train through pain?",
      respuesta:
        "It depends on which pain. Mild discomfort that doesn't change your technique and disappears once you warm up can be managed with load adjustments. Pain that makes you compensate, gets worse during the session, or shows up at one fixed spot on a bone — that's a red light: training on it makes the injury worse.",
    },
    {
      pregunta: "Does tendinitis go away with rest?",
      respuesta:
        "Rest calms the pain, but it doesn't heal the tendon — that's why 'I rested a month and it came back' is the classic story. Tendons heal with progressive, measured loading that forces them to reorganize and get stronger. Less endless resting, more smart rehab.",
    },
  ],
  testCtaQuestion:
    "Point to the injured area and see how much it's affecting you — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
