import type { Padecimiento } from "../types";

export const scoliosis: Padecimiento = {
  slug: "scoliosis",
  nombre: "Scoliosis",
  grupo: "columna",
  metaTitle:
    "Scoliosis (Curvature of the Spine): What to Do | Dr. Angel Ancona · Mérida, Mexico",
  metaDescription:
    "Uneven shoulders or a curve in your back? Learn about scoliosis in teens and adults, when to monitor and when to treat. Get a free assessment.",
  zonaChip: "Lower back",
  definicion: [
    "Seen from the front, your spine should be a straight line. In scoliosis it curves off to one side — sometimes with the vertebrae rotating as well — and the body gives it away: one shoulder sits higher, the hips look uneven, clothes hang crooked.",
    "There are two different stories under the same name: adolescent scoliosis, which shows up during the growing years and almost never hurts; and adult scoliosis, which comes from wear and tear and usually does. They're monitored and treated differently.",
  ],
  sintomas: [
    "One shoulder or hip higher than the other",
    "Clothes hang unevenly, or a strap always slips off the same shoulder",
    "A hump or bulge in your back when you bend forward",
    "In adults: back pain that builds as the day goes on, especially when standing",
    "Your back tires out quickly",
  ],
  cuandoPreocuparse: {
    intro:
      "Most scoliosis is simply monitored over time. These signs call for prompt evaluation:",
    señales: [
      "A curve that visibly worsens over just a few months (especially in growing teens)",
      "Severe pain that wakes you up at night",
      "Weakness, tingling in the legs, or changes in the way you walk",
    ],
  },
  tratamiento: [
    {
      titulo: "Monitoring with measurements",
      texto:
        "For mild curves, the treatment is measuring accurately and comparing over time: repeat X-rays, taken the same way every time. Most mild curves never get significantly worse.",
    },
    {
      titulo: "Targeted physical therapy and bracing",
      texto:
        "Focused exercise for strength, posture, and function. In growing teens with moderate curves, a brace — when it's the right call, and worn as prescribed — can slow the curve while the bones finish growing.",
    },
    {
      titulo: "Corrective surgery",
      texto:
        "Reserved for large curves, curves that keep worsening despite treatment, or curves that are getting in the way of your daily life. It corrects and secures the curve with instrumentation (screws and rods). It's major surgery — which is why the decision has to be airtight.",
    },
  ],
  citaDoctor:
    "With numbers in hand, scoliosis stops being about fear and starts being about decisions.",
  comoLoTrato: [
    "The first thing I do with scoliosis is put numbers on it: how many degrees the curve measures, how much rotation it has, and — in teens — how much growth the skeleton has left. With those three data points, the conversation stops being about fear and starts being about decisions.",
    "With a teenager, my job is to protect them while they grow: watch closely and step in early if the curve starts moving fast. If you're an adult, my focus is how well you function and how much it hurts — not chasing a perfect curve on an X-ray. I operate on the minority: the cases where the numbers and the symptoms demand it.",
  ],
  faq: [
    {
      pregunta: "Does mild scoliosis always get worse?",
      respuesta:
        "No. Most mild curves stay stable for life. The curves at highest risk are in teens who are still growing — which is why we keep a closer eye on them.",
    },
    {
      pregunta: "Can exercise straighten my spine?",
      respuesta:
        "Targeted physical therapy builds strength, improves posture, eases pain, and helps you function — and that's worth a lot. What it can't do is straighten an established structural curve. Be wary of anyone who promises to take degrees off your curve with an exercise routine.",
    },
    {
      pregunta: "Can my child with scoliosis play sports?",
      respuesta:
        "In the vast majority of cases, yes — and they should: muscle is their ally. Restrictions are the exception and depend on the size of the curve and the treatment. That's an answer I tailor to your child at the consultation.",
    },
  ],
  testZone: "espalda-baja",
  testCtaQuestion:
    "See how much your back is affecting your day-to-day — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
