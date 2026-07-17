import type { Padecimiento } from "./types";

export const herniaDeDisco: Padecimiento = {
  slug: "hernia-de-disco",
  nombre: "Hernia de disco",
  grupo: "columna",
  metaTitle:
    "Hernia de disco: síntomas y tratamiento en Mérida | Dr. Angel Ancona",
  metaDescription:
    "¿Dolor que baja por la pierna? Conoce los síntomas de la hernia de disco, cuándo preocuparse y sus tratamientos — la mayoría no requiere cirugía. Evalúate gratis.",
  zonaChip: "Zona lumbar",
  definicion: [
    "Entre cada vértebra hay un disco que amortigua tus movimientos. Cuando ese disco se desgasta o se desplaza de su lugar, puede presionar un nervio — y eso es lo que produce el dolor.",
    "Es una de las causas más frecuentes de dolor lumbar con dolor que baja a la pierna, y una de las más tratables: la mayoría de las hernias mejoran sin cirugía.",
  ],
  sintomas: [
    "Dolor en la parte baja de la espalda que baja hacia la nalga o la pierna",
    "Hormigueo o adormecimiento en la pierna o el pie",
    "Dolor que empeora al estar sentado, al agacharte, al toser o estornudar",
    "Debilidad para caminar de puntas o de talones",
    "Alivio parcial al cambiar de postura o caminar",
  ],
  cuandoPreocuparse: {
    señales: [
      "Debilidad en la pierna o el pie que va avanzando",
      "Adormecimiento en la zona genital o dificultad nueva para controlar la orina o el excremento",
      "Fiebre junto con el dolor de espalda",
    ],
  },
  tratamiento: [
    {
      titulo: "Tratamiento conservador",
      texto:
        "Medicamento, fisioterapia dirigida y ajustes de actividad. La mayoría de las hernias mejoran así en 6 a 12 semanas — el disco puede incluso reabsorber parte del fragmento con el tiempo.",
    },
    {
      titulo: "Bloqueos e infiltraciones",
      texto:
        "Si el dolor persiste, podemos calmar el nervio directamente con una infiltración guiada, sin operar. Alivia el dolor y da tiempo a que el cuerpo haga su parte.",
    },
    {
      titulo: "Cirugía de mínima invasión",
      texto:
        "Solo cuando lo anterior no fue suficiente o hay riesgo para el nervio. La microdiscectomía endoscópica retira el fragmento que comprime a través de una incisión menor a un centímetro.",
    },
  ],
  citaDoctor:
    "Primero agotamos lo conservador, porque muchas hernias mejoran así. Pero cuando la cirugía es lo que tu caso necesita, mi alta especialidad en mínima invasión te pone de pie el mismo día — y de vuelta a tu vida en semanas, no en meses.",
  comoLoTrato: [
    "Mi primera tarea es confirmar que tu dolor de verdad viene de una hernia — no todo dolor que baja a la pierna lo es. Eso se resuelve con exploración física y, cuando el caso lo amerita, una resonancia.",
    "Si es hernia, empezamos por lo conservador: en mi consulta, operar es la excepción. Y cuando la cirugía sí es lo indicado, mi alta especialidad me permite ofrecerte técnicas de mínima invasión: incisiones milimétricas, alta el mismo día o en 24 horas en la mayoría de los casos, y de regreso a tu vida en semanas, no meses.",
  ],
  faq: [
    {
      pregunta: "¿Toda hernia de disco se opera?",
      respuesta:
        "No. Alrededor de 8 de cada 10 mejoran sin cirugía, con tratamiento conservador bien llevado. Operar es la excepción — y cuando se necesita, hoy es mucho menos agresivo que antes.",
    },
    {
      pregunta: "¿La hernia se puede 'acomodar' con masajes o manipulación?",
      respuesta:
        "El fragmento desplazado no se 'acomoda' desde afuera. Lo que sí puede pasar es que el cuerpo lo reabsorba parcialmente con el tiempo — por eso el tratamiento conservador funciona en la mayoría. Desconfía de quien prometa 'acomodártela' en una sesión.",
    },
    {
      pregunta: "Si me operan, ¿cuánto tarda la recuperación?",
      respuesta:
        "Con técnica endoscópica, la mayoría de mis pacientes camina el mismo día, se va a casa en 24 horas y retoma actividades ligeras en 2 a 4 semanas. Cada caso tiene su ritmo — te entrego un plan claro y revisiones programadas.",
    },
  ],
  testZone: "espalda-baja",
  testCtaQuestion:
    "Averigua qué tan afectada está tu espalda en menos de 3 minutos",
  testCtaLabel: "Evalúa tu espalda gratis",
};
