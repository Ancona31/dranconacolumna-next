import type { Padecimiento } from "../types";

export const wristAndHandPain: Padecimiento = {
  slug: "wrist-and-hand-pain",
  nombre: "Wrist and hand pain",
  grupo: "ortopedia",
  metaTitle:
    "Wrist & Hand Pain: Carpal Tunnel, Trigger Finger, Ganglion Cyst | Dr. Angel Ancona · Mérida",
  metaDescription:
    "Night-time tingling, a finger that catches, or a lump on your wrist? Learn about the most common wrist and hand problems, and get a free assessment in minutes.",
  zonaChip: "Wrist and hand",
  definicion: [
    "Your hand is the most precise tool you have, and that's why any problem there shows up immediately: getting dressed, at work, holding your phone. Almost every wrist and hand consultation comes down to three conditions — and all three have something in common: they warn you long before they cause real damage.",
  ],
  patologias: [
    {
      nombre: "Carpal tunnel syndrome",
      queEs:
        "A narrow tunnel runs through the palm side of your wrist, and the median nerve travels through it — the nerve that gives feeling to your thumb, index and middle fingers. When that tunnel narrows, the nerve gets squeezed.",
      comoSeSiente:
        "Tingling and numbness in those three fingers that wakes you at night and makes you shake your hand to bring it back. It shows up when holding your phone, the steering wheel, a book. Over time: clumsiness with buttons and coins, and loss of thumb strength.",
      comoSeTrata:
        "A night splint and activity changes in recent cases. If it persists, an injection settles the tunnel and confirms the diagnosis along the way. Once the nerve shows damage on the electromyography, surgical release is what's indicated: a short, outpatient procedure, and one of the most rewarding there is.",
    },
    {
      nombre: "Trigger finger",
      queEs:
        "The tendon that bends your finger runs through a pulley, like a cable through its guide. When that tendon thickens, it no longer glides smoothly: it catches.",
      comoSeSiente:
        "The finger locks as you close it and snaps as you straighten it, sometimes with an audible click. It hurts at the base of the finger, especially in the mornings. In advanced cases the finger stays locked and you have to straighten it with your other hand.",
      comoSeTrata:
        "Physical therapy can be tried. If there's no improvement, surgical release is the best option: the pulley is opened, the tendon glides freely again, and the result is immediate. It's a quick, outpatient procedure.",
    },
    {
      nombre: "Ganglion cyst",
      queEs:
        "A sac of synovial fluid — the same lubricant your joints have inside — that leaks out and collects under the skin, almost always on the back of the wrist.",
      comoSeSiente:
        "A soft lump that changes size and sometimes disappears on its own. It's usually painless and doesn't affect how your hand works. When it grows, it can be uncomfortable when leaning on the wrist or get in the way of certain movements.",
      comoSeTrata:
        "If it isn't growing or bothering you, we watch it. When it starts to grow, the solution is surgical: it's removed in a simple, outpatient procedure, and you go home the same day. And no — it isn't cured by hitting it with a book, as the old myth goes.",
    },
  ],
  sintomas: [
    "Tingling or numbness in the thumb, index and middle fingers that wakes you at night",
    "A finger that catches as you close it and snaps as you straighten it, sometimes with a click",
    "A soft lump on the back or palm side of the wrist that changes size",
    "Pain at the base of the thumb or in the wrist when turning a knob, opening jars or lifting",
    "Clumsiness with buttons, coins or keys; you drop things",
  ],
  cuandoPreocuparse: {
    señales: [
      "Constant numbness that no longer comes and goes",
      "Loss of thumb strength or visible thinning of the muscle at its base",
      "A finger that has locked and you cannot straighten",
      "Cold, pale or bluish fingers",
      "Deformity of the wrist after a fall",
    ],
  },
  tratamiento: [
    {
      titulo: "Rehabilitation and conservative care",
      texto:
        "Splinting, targeted therapy and activity changes. It's the starting point for most hand problems, and done properly it resolves many of them.",
    },
    {
      titulo: "Injections",
      texto:
        "A well-placed injection settles carpal tunnel, and it informs too: if it responds, it confirms the diagnosis.",
    },
    {
      titulo: "Hand surgery",
      texto:
        "When the problem limits your life and rehabilitation hasn't worked. Releasing the tunnel, opening the pulley of a catching finger, removing a growing cyst. All three are short, outpatient procedures with quick recovery — and highly predictable results.",
    },
  ],
  citaDoctor:
    "The hand warns you long before it's damaged. We start with rehabilitation — and when that's no longer enough, hand surgery solves in one morning what you've been putting up with for years.",
  comoLoTrato: [
    "With the hand, the diagnosis is in the history and the examination: which fingers go numb, at what time of day, what movement triggers it, exactly where the lump sits. I rarely need more than that — and when I do, the electromyography tells me how much the nerve is suffering, which is the piece of information that decides the path.",
    "Hand problems respond well to rehabilitation, and that's where we start. But when they genuinely begin to limit you and no longer settle, surgery is the right decision, not a last resort. And with the hand that's good news: these are short, outpatient procedures with predictable results. You go home the same day.",
  ],
  faq: [
    {
      pregunta: "My hands go numb at night — is that normal?",
      respuesta:
        "No, and it's the clearest warning sign of carpal tunnel. The median nerve passes through a narrow tunnel in your wrist, and sleeping with the wrist bent compresses it. Waking up and having to shake your hand to 'bring it back to life' is the classic symptom. Normalizing it for years is what leads to the cases that arrive late.",
    },
    {
      pregunta: "I have a lump on my wrist — is it a tumor?",
      respuesta:
        "No. A ganglion cyst is a sac of synovial fluid — the same lubricant your joints have inside — that leaks out and collects. It's benign and generally doesn't affect how your hand works. The point is to watch it: if it starts to grow, the solution is surgical, with a simple, outpatient procedure that resolves it for good. And no, it isn't cured by hitting it with a book, as the myth goes.",
    },
    {
      pregunta: "Why does my finger catch?",
      respuesta:
        "It's trigger finger: the tendon that bends your finger thickens and no longer glides smoothly through its pulley, so it catches and snaps. It's more common in people with diabetes and in hands that work with force. Physical therapy can be tried, but if there's no improvement, surgical release is the best option: a quick, outpatient procedure that opens the pulley and restores normal movement.",
    },
  ],
  testZone: "muneca",
  testCtaQuestion: "Find out how much your hand is affected in under 3 minutes",
  testCtaLabel: "Free hand assessment",
};
