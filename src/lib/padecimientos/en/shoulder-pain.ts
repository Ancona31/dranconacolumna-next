import type { Padecimiento } from "../types";

export const shoulderPain: Padecimiento = {
  slug: "shoulder-pain",
  nombre: "Shoulder pain",
  grupo: "ortopedia",
  metaTitle: "Shoulder Pain & Rotator Cuff | Dr. Angel Ancona · Mérida, Mexico",
  metaDescription:
    "Pain when lifting your arm, or when sleeping on that side? Learn what causes shoulder pain — from the rotator cuff to frozen shoulder — and get a free assessment.",
  zonaChip: "Shoulder",
  definicion: [
    "Your shoulder is the most mobile joint in your body — and that freedom comes at a price: it depends on a group of tendons, the rotator cuff, that's at work in every move your arm makes and, over the years (or with overuse), gets inflamed, wears down, or tears.",
    "The good news: most shoulder pain gets better without surgery. The key is putting a name to the problem — tendinitis, a tear, frozen shoulder, arthritis — because each one is treated differently.",
  ],
  sintomas: [
    "Pain when lifting your arm or reaching behind you (fastening a bra, reaching into the back seat)",
    "Pain at night when you lie on that side",
    "Losing the strength to lift or carry things",
    "Stiffness that limits your movement more and more",
    "Clicking or a rubbing feeling when you move your arm",
  ],
  cuandoPreocuparse: {
    señales: [
      "Sudden loss of strength to lift your arm after a strain or a fall",
      "A visible deformity in your shoulder after an injury",
      "Fever with a hot, swollen shoulder",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative (non-surgical) treatment",
      texto:
        "Physical therapy targeting the rotator cuff and shoulder blade, medication during flare-ups, and adjusting your activities. It's the first-line treatment for the vast majority of shoulder problems — and done right, it takes care of most of them.",
    },
    {
      titulo: "Image-guided injections",
      texto:
        "When the inflammation won't calm down or the pain keeps waking you up at night, an injection at the exact spot brings the inflammation down and lets your rehab move forward.",
    },
    {
      titulo: "Arthroscopic surgery",
      texto:
        "For rotator cuff tears that call for it, instability, or cases that haven't improved with treatment: arthroscopic repair, through small incisions. The decision depends on the size of the tear, your age, and how much you ask of that shoulder.",
    },
  ],
  citaDoctor:
    "A torn tendon left waiting too long becomes hard to repair. My job is to tell you clearly which group you're in.",
  comoLoTrato: [
    "My shoulder exam is built to separate three things that get mixed up all the time: pain coming from the tendons, pain coming from the joint, and pain that's actually coming down from your neck. Specific rotator cuff tests tell me which tendon is in trouble and how badly — and an ultrasound or MRI confirms what my hands already found.",
    "Once I have the diagnosis, I'm direct: tendinitis and most partial tears respond to rehab; complete tears in active patients usually do better with timely repair — because a torn tendon left waiting too long retracts — pulls back from the bone — and becomes hard to repair. I'll tell you clearly which group you're in.",
  ],
  faq: [
    {
      pregunta: "How do I know if my rotator cuff is torn?",
      respuesta:
        "The most telling sign is loss of strength — not just pain. If you suddenly can't lift your arm or carry what you could before, the chances it's a tear go up. The physical exam picks it up reliably, and a scan confirms it.",
    },
    {
      pregunta: "Can a rotator cuff tear heal on its own?",
      respuesta:
        "A torn tendon doesn't reattach itself to the bone. But the pain can improve and other muscles can compensate — many partial tears, and some complete ones in people who ask less of their shoulder, are handled that way, without surgery. It's a case-by-case call: the size of the tear, your age, your pain, and what your life asks of that shoulder.",
    },
    {
      pregunta: "Are cortisone shots bad for my shoulder?",
      respuesta:
        "Used with good judgment — image-guided, at the right dose, and not one on top of another — they're a safe and valuable tool. The problem is using them forever as the whole treatment instead of doing the rehab. In my practice, an injection opens the door to physical therapy; it doesn't replace it.",
    },
  ],
  testZone: "hombro",
  testCtaQuestion:
    "See how much your shoulder pain is affecting you — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
