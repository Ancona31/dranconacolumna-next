import type { Padecimiento } from "./types";

export const ciatica: Padecimiento = {
  slug: "ciatica",
  nombre: "Ciática",
  grupo: "columna",
  metaTitle:
    "Ciática: por qué duele y cómo se trata en Mérida | Dr. Angel Ancona",
  metaDescription:
    "Dolor que corre de la espalda baja a la pierna: eso es la ciática. Conoce sus causas, señales de alarma y tratamientos. Evalúa tu caso gratis en minutos.",
  definicion: [
    "El nervio ciático nace en tu espalda baja y viaja por la parte de atrás de cada pierna. Cuando algo lo comprime o lo irrita en su origen, el dolor 'viaja' por su trayecto — eso es la ciática.",
    "Aquí lo importante: la ciática no es un diagnóstico, es un síntoma. Detrás siempre hay una causa — una hernia, un canal estrecho, una inflamación — y el trabajo médico es encontrarla.",
  ],
  sintomas: [
    "Dolor que corre de la nalga hacia la parte de atrás o el costado de la pierna",
    "Puede llegar por debajo de la rodilla, hasta el pie",
    "Hormigueo, 'toques' o adormecimiento en el trayecto",
    "Empeora al estar sentado, al toser o al estornudar",
    "Casi siempre afecta un solo lado",
  ],
  cuandoPreocuparse: {
    señales: [
      "Debilidad en la pierna o el pie que va avanzando",
      "Adormecimiento en la zona genital o dificultad nueva para controlar esfínteres",
      "Dolor ciático en ambas piernas a la vez",
    ],
  },
  tratamiento: [
    {
      titulo: "Tratamiento conservador",
      texto:
        "En la mayoría de los casos la ciática cede en semanas con medicamento para el nervio, fisioterapia dirigida y ajustes de actividad — sin necesidad de nada más.",
    },
    {
      titulo: "Bloqueos e infiltraciones",
      texto:
        "Cuando el dolor no cede o no te deja funcionar, una infiltración guiada puede desinflamar el nervio directamente en su origen.",
    },
    {
      titulo: "Cirugía",
      texto:
        "Reservada para cuando hay compresión importante del nervio que no responde, o debilidad que avanza. La técnica depende de la causa — y con frecuencia puede ser de mínima invasión.",
    },
  ],
  comoLoTrato: [
    "Con la ciática no persigo el dolor: persigo la causa. La exploración física me dice qué nervio está comprometido y a qué nivel; la imagen — cuando el caso la amerita — confirma el porqué.",
    "Con la causa en la mano, el plan es tuyo y a tu medida: la mayoría de mis pacientes con ciática nunca pisa un quirófano. Y si tu caso es de los que sí, te lo diré con honestidad y con opciones.",
  ],
  faq: [
    {
      pregunta: "¿La ciática se quita sola?",
      respuesta:
        "Muchas veces sí — la mayoría cede en 4 a 6 semanas con manejo adecuado. Pero 'aguantar' sin diagnóstico tiene riesgo: si hay debilidad o el dolor persiste, el nervio puede estar pagando un precio que después es difícil recuperar.",
    },
    {
      pregunta: "¿Las inyecciones en la espalda son peligrosas?",
      respuesta:
        "Los bloqueos guiados por imagen son procedimientos controlados y de baja invasión. Bien indicados, alivian el dolor sin cirugía. La clave está en la indicación correcta y la técnica guiada.",
    },
    {
      pregunta: "¿Cuándo la ciática es de operar?",
      respuesta:
        "Cuando hay debilidad progresiva, compromiso de esfínteres, o dolor incapacitante que no respondió al tratamiento completo. Son la minoría de los casos — pero en esos, operar a tiempo protege al nervio.",
    },
  ],
  testZone: "espalda-baja",
  testCtaLabel: "Evalúa tu espalda gratis",
};
