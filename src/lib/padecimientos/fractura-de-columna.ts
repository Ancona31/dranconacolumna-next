import type { Padecimiento } from "./types";

export const fracturaDeColumna: Padecimiento = {
  slug: "fractura-de-columna",
  nombre: "Fracturas de columna",
  grupo: "columna",
  metaTitle:
    "Fractura de columna y aplastamiento vertebral | Dr. Angel Ancona · Mérida",
  metaDescription:
    "Dolor de espalda súbito tras una caída — o sin golpe aparente en huesos con osteoporosis. Conoce las fracturas vertebrales y su tratamiento, del corsé al cemento óseo.",
  zonaChip: "Columna dorsal y lumbar",
  definicion: [
    "Una vértebra puede fracturarse de dos maneras muy distintas: por un golpe fuerte — un accidente, una caída de altura — o por compresión en un hueso debilitado por osteoporosis, donde a veces basta un esfuerzo trivial: cargar una bolsa, un tropiezo, hasta un estornudo.",
    "Las fracturas por osteoporosis son la epidemia silenciosa de la columna: muchas se confunden con 'dolor de espalda normal' y se diagnostican tarde. Detectarlas a tiempo cambia todo — incluido el acceso a tratamientos de mínima invasión que pueden aliviar en horas o pocos días.",
  ],
  sintomas: [
    "Dolor de espalda súbito e intenso, con o sin golpe aparente",
    "Empeora de pie o sentado y se alivia acostado",
    "Dolor 'en cinturón' hacia los costados",
    "Pérdida de estatura o encorvamiento progresivo con los años",
    "Dolor que no cede tras semanas de una caída 'menor'",
  ],
  cuandoPreocuparse: {
    señales: [
      "Debilidad, hormigueo o torpeza en las piernas",
      "Dificultad nueva para controlar la orina o el excremento",
      "Dolor tras un accidente o caída importante",
      "Fiebre junto con el dolor de espalda",
    ],
  },
  tratamiento: [
    {
      titulo: "Tratamiento conservador",
      texto:
        "Muchas fracturas por compresión son estables y sanan solas en 6 a 12 semanas: analgesia efectiva, corsé según el caso y movilización temprana vigilada — el reposo absoluto prolongado es enemigo, no aliado.",
    },
    {
      titulo: "Cifoplastia / vertebroplastia",
      texto:
        "Cuando el dolor no cede o no te deja funcionar, el cemento óseo estabiliza la vértebra desde adentro, a través de una incisión mínima. El alivio del dolor suele sentirse en horas o pocos días, y la mayoría se va a casa el mismo día.",
    },
    {
      titulo: "Cirugía con instrumentación",
      texto:
        "Para fracturas inestables o con compromiso de los nervios: fijar el segmento con tornillos — según el caso, colocados por vía percutánea de mínima invasión.",
    },
  ],
  citaDoctor:
    "Tratar la fractura sin tratar el hueso es dejar la puerta abierta a la siguiente. Aquí atendemos las dos.",
  comoLoTrato: [
    "Ante una fractura vertebral respondo tres preguntas: ¿es estable o inestable?, ¿está comprimiendo nervios?, y ¿qué tan reciente es? Esas respuestas — de la exploración y la imagen — separan a quien solo necesita corsé y vigilancia de quien se beneficia del cemento o de una fijación.",
    "Y hay una cuarta pregunta que muchos olvidan: ¿por qué se fracturó este hueso? Si la respuesta es osteoporosis, tratar la fractura sin tratar el hueso es dejar la puerta abierta a la siguiente. Esa parte también la coordinamos.",
  ],
  faq: [
    {
      pregunta: "¿Una fractura de columna significa quedar en silla de ruedas?",
      respuesta:
        "No. La gran mayoría de las fracturas vertebrales — sobre todo las de compresión por osteoporosis — son estables y no tocan la médula ni los nervios. Con el manejo correcto, la recuperación funcional es la regla, no la excepción.",
    },
    {
      pregunta: "¿Qué es eso del 'cemento' en la columna?",
      respuesta:
        "La cifoplastia y la vertebroplastia rellenan la vértebra fracturada con un cemento médico que la estabiliza desde adentro. Se hace por una incisión mínima, suele ser ambulatoria, y el alivio del dolor típicamente llega en horas o pocos días. Es de los procedimientos más agradecidos de la columna.",
    },
    {
      pregunta: "¿Por qué me fracturé si no me pegué fuerte?",
      respuesta:
        "Porque el hueso ya venía debilitándose en silencio — eso es la osteoporosis. La fractura es su primera manifestación visible en mucha gente. Por eso, además de tratar la vértebra, hay que medir y tratar la calidad del hueso: es la mejor forma de evitar la segunda fractura.",
    },
  ],
  testZone: "espalda-alta",
  testCtaQuestion:
    "Averigua qué tan afectada está tu espalda en menos de 3 minutos",
  testCtaLabel: "Evalúa tu espalda gratis",
};
