import type { Padecimiento } from "../types";

export const lumbarSpinalStenosis: Padecimiento = {
  slug: "lumbar-spinal-stenosis",
  nombre: "Lumbar spinal stenosis",
  grupo: "columna",
  metaTitle:
    "Lumbar Spinal Stenosis: Leg Pain When Walking | Dr. Angel Ancona · Mérida, Mexico",
  metaDescription:
    "Does leg pain force you to stop when walking, then ease when you sit? It may be lumbar spinal stenosis. Learn about the condition and get a free assessment.",
  zonaChip: "Lower back",
  definicion: [
    "A tunnel runs down the inside of your spine, protecting the nerves on their way to your legs. Over the years, that tunnel can narrow — arthritis, worn discs, thickened ligaments — and the nerves get squeezed on their way through.",
    "Its signature is unmistakable: pain, heaviness, or cramping in your legs when you walk — forcing you to stop — that eases when you sit down or lean forward.",
  ],
  sintomas: [
    "Pain, heaviness, or cramping in the legs after walking a certain distance",
    "Relief when sitting or leaning forward (like leaning on a shopping cart)",
    "The distance you can walk before stopping keeps shrinking",
    "Tingling or numbness in the legs",
    "You may have little or no pain at rest",
  ],
  cuandoPreocuparse: {
    señales: [
      "Weakness in the legs that keeps getting worse",
      "Numbness in the genital area, or new difficulty controlling your bladder or bowels",
      "A rapid drop in how far you can walk",
    ],
  },
  tratamiento: [
    {
      titulo: "Conservative (non-surgical) treatment",
      texto:
        "Physical therapy focused on flexibility and strengthening, medication, and conditioning. In mild to moderate cases it can keep you walking well for years.",
    },
    {
      titulo: "Image-guided injections",
      texto:
        "Injections that reduce the inflammation around the squeezed nerves and extend your walking distance without surgery.",
    },
    {
      titulo: "Decompression surgery",
      texto:
        "When you can no longer walk far enough to live your life, surgery opens up space for the nerves. Depending on the case, it can be done with minimally invasive techniques while preserving your spine's stability.",
    },
  ],
  citaDoctor:
    "My goal with spinal stenosis is to give you back distance: your plans shouldn't have to shrink to fit your body.",
  comoLoTrato: [
    "The number that matters most to me is one you already know by heart: how many blocks — or minutes — you can walk before your legs force you to stop. That number — along with the exam and the MRI — defines how tight the squeeze on your nerves is and which treatment is right for you.",
    "My goal with spinal stenosis is to give you back distance: your plans shouldn't have to shrink to fit your body. Surgery is a tool for that, not an inevitable destination.",
  ],
  faq: [
    {
      pregunta: "Is it the same as a herniated disc?",
      respuesta:
        "No. A herniated disc is an event — a fragment pressing on a nerve — and usually hurts more when sitting. Stenosis is a slow process over years — a tunnel closing in — and it punishes you when you walk. Telling them apart matters because they're treated differently.",
    },
    {
      pregunta: "Does spinal stenosis always get worse?",
      respuesta:
        "It's a degenerative process, but how fast it progresses varies enormously. Many patients stay stable for years with conservative management. What matters is measuring it and keeping an eye on it — not guessing.",
    },
    {
      pregunta: "Is stenosis surgery a big operation?",
      respuesta:
        "It depends on how many levels are narrowed and whether there's instability. It ranges from a focused, minimally invasive decompression to surgery with instrumentation (screws and rods). Your MRI and your exam — not fear — define the real size of the operation.",
    },
  ],
  testZone: "espalda-baja",
  testCtaQuestion:
    "Find out how much this is limiting your walking — in under 3 minutes",
  testCtaLabel: "Start my free assessment",
};
