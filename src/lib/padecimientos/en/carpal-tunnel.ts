import type { Padecimiento } from "../types";

export const carpalTunnel: Padecimiento = {
  slug: "carpal-tunnel",
  nombre: "Carpal tunnel",
  grupo: "ortopedia",
  metaTitle:
    "Carpal Tunnel: Tingling & Numb Hands | Dr. Angel Ancona · Mérida, Mexico",
  metaDescription:
    "Do your hands go numb at night, or while holding your phone? It may be carpal tunnel. Learn the signs, the treatment options, and get a free hand assessment.",
  zonaChip: "Wrist and hand",
  definicion: [
    "A narrow tunnel runs along the palm side of your wrist, and running through it is the median nerve — the one that gives feeling to your thumb, index, and middle fingers. When the tunnel gets inflamed or narrows, the nerve gets pinched: that's carpal tunnel syndrome.",
    "The telltale sign is unmistakable: tingling and numbness in those fingers that wakes you up at night and makes you shake your hand to 'bring it back to life.' Caught early, it's one of the most rewarding problems to treat; ignored for years, it can leave permanent damage.",
  ],
  sintomas: [
    "Tingling or numbness in your thumb, index, and middle fingers",
    "It wakes you up at night and gets better when you shake your hand",
    "It shows up when you're holding your phone, the steering wheel, or a book",
    "Trouble with buttons or picking up small objects",
    "In advanced stages: loss of thumb strength and a flattening at the base of the thumb",
  ],
  cuandoPreocuparse: {
    señales: [
      "Constant numbness that no longer comes and goes",
      "Loss of strength in your thumb, or dropping things",
      "Visible thinning of the muscle at the base of your thumb",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative (non-surgical) treatment",
      texto:
        "A night splint that keeps your wrist from bending as you sleep, activity adjustments, and medication. In mild to moderate cases that started recently, it's often enough.",
    },
    {
      titulo: "Injection into the tunnel",
      texto:
        "A well-placed injection brings down the inflammation in the tunnel and takes pressure off the nerve. It relieves the pain — and it also tells us something: if you respond to it, that confirms the diagnosis.",
    },
    {
      titulo: "Surgical release",
      texto:
        "When symptoms persist or there are already signs of nerve damage: opening the roof of the tunnel to free the median nerve. It's a short, outpatient surgery with excellent results — the point is not to wait too long.",
    },
  ],
  citaDoctor:
    "A pinched nerve gives you warning signs for years before it's damaged. If your hands are waking you up at night, don't write it off as normal.",
  comoLoTrato: [
    "Carpal tunnel is diagnosed first with my hands and your story: your nighttime symptoms and a couple of provocation tests usually tell me almost everything. The nerve study — an EMG — is what I order to confirm it and to measure how much the median nerve is struggling: that number decides whether we go conservative or straight to a release.",
    "My central message with this condition is time: a pinched nerve gives you warning signs for years before it's damaged. Treated in time, recovery is the rule; once the muscle has wasted away, what's lost is hard to get back. If your hands are waking you up at night, don't write it off as normal.",
  ],
  faq: [
    {
      pregunta: "Is this from my computer or my phone?",
      respuesta:
        "Heavy hand use can trigger or worsen the symptoms, but carpal tunnel has more factors behind it: anatomy, conditions like diabetes or hypothyroidism, pregnancy, age. Blaming the keyboard alone means missing everything else — and never treating the real cause.",
    },
    {
      pregunta: "Is carpal tunnel surgery risky?",
      respuesta:
        "It's one of the most common and safest hand surgeries there is: outpatient, under local or regional anesthesia, done in minutes. Most people get their sleep back right away and full use of their hand back in weeks. The myth that 'the hand is never the same' comes from cases operated on too late — when the nerve was already damaged.",
    },
    {
      pregunta: "Can it come back after surgery?",
      respuesta:
        "True recurrence is uncommon. When symptoms 'come back,' the most common reason is that there was another problem all along — a nerve also pinched in the neck, or neuropathy from diabetes. That's why the complete diagnosis matters as much as the surgery.",
    },
  ],
  testZone: "muneca",
  testCtaQuestion:
    "See how much your hand is affecting you — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
