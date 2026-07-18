import type { Padecimiento } from "../types";

export const elbowPain: Padecimiento = {
  slug: "elbow-pain",
  nombre: "Elbow pain",
  grupo: "ortopedia",
  metaTitle:
    "Elbow Pain: Tennis Elbow, Golfer's Elbow & Bursitis | Dr. Angel Ancona · Mérida",
  metaDescription:
    "Elbow pain when gripping, twisting your wrist or leaning on it? Learn about tennis elbow, golfer's elbow and olecranon bursitis — symptoms and treatment. Free elbow assessment.",
  zonaChip: "Elbow",
  definicion: [
    "The elbow looks like a simple joint, but it's where every tendon that moves your wrist and fingers anchors. That's why it hurts: not because of what you do with your elbow, but because of what you do with your hand — gripping, twisting, typing, lifting. Three conditions account for most elbow pain, and none of them requires you to have ever played tennis or golf.",
  ],
  patologias: [
    {
      nombre: 'Lateral epicondylitis — "tennis elbow"',
      queEs:
        "The tendons that extend your wrist anchor to the bone on the outside of your elbow. Repeated use damages them right at that insertion point.",
      comoSeSiente:
        "Pain on the outside of the elbow when gripping, shaking hands, opening a door or lifting a cup. It travels down the forearm and worsens with use. Many people notice it first as weakness: you drop things.",
      comoSeTrata:
        "First, change the movement causing it and rest the tendon to settle the inflammation. But rest doesn't cure it: to regain strength and function, the tendon needs to be loaded again, progressively and in controlled doses — that's the key to physical therapy done right, and the reason 'I rested for a month and it came back' is the most repeated story in my clinic. If pain doesn't settle, a targeted injection lets rehabilitation move forward. In the few cases that don't respond, surgical release of the damaged tendon is short and recovery is quick.",
    },
    {
      nombre: 'Medial epicondylitis — "golfer\'s elbow"',
      queEs:
        "The same problem on the opposite side: the tendons that flex your wrist and close your fist anchor to the inside of the elbow, and that's where they break down.",
      comoSeSiente:
        "Pain on the inside of the elbow when twisting your wrist, clenching your fist, using a screwdriver or carrying weight. Less common than the lateral one, but just as stubborn when treated poorly.",
      comoSeTrata:
        "The same path as the lateral one — correct the movement, initial rest, then progressive loading to rebuild the tendon's strength. Injection if it doesn't settle, and surgery in resistant cases. What changes is which tendon we work on, and that's why the diagnosis must tell one side from the other.",
    },
    {
      nombre: "Olecranon bursitis",
      queEs:
        "At the tip of your elbow there's a sac that cushions the bone against the skin. A knock or repeated leaning inflames it, and it fills with fluid.",
      comoSeSiente:
        "A soft, swollen lump right at the tip of the elbow, sometimes the size of an egg. It may not hurt at all — many people come in simply because of how it looks.",
      comoSeTrata:
        "First line is aspiration in the office to drain it, and protecting the elbow from whatever caused it. That resolves most cases. What matters is ruling out infection: red, hot skin and severe pain change the treatment completely and get checked the same day. In the few cases where it keeps coming back, the bursa is removed — a simple, outpatient procedure.",
    },
  ],
  sintomas: [
    "Pain on the outside of the elbow when gripping, shaking hands or opening a door",
    "Pain on the inside of the elbow when twisting your wrist or clenching your fist",
    "A soft, swollen lump at the tip of the elbow, with or without pain",
    "Pain that travels down the forearm and worsens with repeated use",
    "Loss of grip strength: you drop your cup, your tools, the pan",
  ],
  cuandoPreocuparse: {
    señales: [
      "Visible deformity of the elbow, or inability to bend or straighten it after an injury",
      "The lump at the elbow with red, hot skin and severe pain",
      "Fever along with elbow pain and swelling",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative treatment",
      texto:
        "Identifying and changing the movement that causes it, initial rest to settle the inflammation, then physical therapy with progressive loading — which is what restores the tendon's strength and function. Medication during flare-ups. This is first-line treatment for epicondylitis, and done properly it resolves most cases.",
    },
    {
      titulo: "Injections and in-office procedures",
      texto:
        "When pain doesn't settle or the bursa is severely inflamed: a targeted injection, or aspiration of the bursa in the case of the olecranon. They relieve the pain and allow rehabilitation to move forward.",
    },
    {
      titulo: "Surgery",
      texto:
        "Reserved for the few cases that don't respond after complete treatment: release of the diseased tendon in epicondylitis, or removal of the bursa when it becomes chronic or infected. These are short procedures with a quick recovery.",
    },
  ],
  citaDoctor:
    "The elbow is where all the muscles that give fine movement to your hand and wrist begin. Caring for it — and treating what harms it in time — means caring for everything your hands do for you.",
  comoLoTrato: [
    "With the elbow, my examination starts by pinpointing exactly where it hurts: outside, inside, or at the tip. It sounds obvious, but it's the difference between three distinct diagnoses — and it's the mistake I see most often in poorly treated elbows, where injections are given blindly without knowing which tendon is actually affected.",
    "Then I look for the real cause, which is almost never in the elbow itself: a repeated movement at work, a poorly gripped tool, a sports technique that overloads it. If we don't change that, any treatment is temporary.",
  ],
  faq: [
    {
      pregunta: "Do I have to play tennis to get tennis elbow?",
      respuesta:
        "Not at all — most of my patients with epicondylitis have never held a racket. The cause is repeated use of the hand: tools, keyboards, lifting, cooking, your phone. The name is historical and confuses more than it helps.",
    },
    {
      pregunta: "Is the lump on my elbow dangerous?",
      respuesta:
        "Olecranon bursitis is almost always benign: a sac that becomes inflamed from leaning on your elbow or from a knock. What does need ruling out is infection — if the skin is red, hot and very painful, that gets checked the same day, because an infected bursa needs specific treatment.",
    },
    {
      pregunta: "Do those elbow straps from the pharmacy work?",
      respuesta:
        "They can take the edge off while you do other things right, but they don't cure anything on their own: they don't change the movement that damaged the tendon, and they don't strengthen it. Using one as your only treatment is why so many cases of epicondylitis drag on for years.",
    },
  ],
  testZone: "codo",
  testCtaQuestion:
    "Find out how much your elbow is affected in under 3 minutes",
  testCtaLabel: "Free elbow assessment",
};
