import type { Padecimiento } from "./types";

export const vertebraDesplazada: Padecimiento = {
  slug: "vertebra-desplazada",
  nombre: "Vértebra desplazada",
  grupo: "columna",
  metaTitle:
    "Vértebra desplazada (espondilolistesis) | Dr. Angel Ancona · Mérida",
  metaDescription:
    "Una vértebra que se desliza sobre otra puede causar dolor lumbar y de piernas. Conoce la espondilolistesis, sus grados y tratamientos. Evalúate gratis.",
  definicion: [
    "La espondilolistesis significa que una vértebra se deslizó hacia adelante sobre la que está debajo. Puede ocurrir por desgaste de las articulaciones (lo más común en adultos) o por un defecto en el hueso que viene de la juventud.",
    "Aquí va una buena noticia de entrada: muchas vértebras desplazadas no duelen y nunca darán problemas. Cuando duelen, el manejo correcto empieza por medir el deslizamiento — no por asustarse con la palabra.",
  ],
  sintomas: [
    "Dolor en la parte baja de la espalda que empeora de pie o caminando",
    "Alivio al sentarte o recostarte",
    "Rigidez y sensación de 'cansancio' lumbar",
    "Dolor que baja a las piernas si hay compresión de nervios",
    "En algunos casos, sensación de escalón en la espalda baja",
  ],
  cuandoPreocuparse: {
    señales: [
      "Debilidad en las piernas que va avanzando",
      "Adormecimiento en la zona genital o dificultad nueva para controlar esfínteres",
      "Dolor que progresa rápidamente en semanas",
    ],
  },
  tratamiento: [
    {
      titulo: "Tratamiento conservador",
      texto:
        "Fortalecer el 'corsé' natural de tu columna — abdomen y espalda — con fisioterapia dirigida, más medicamento en las crisis. Funciona en la gran mayoría de los casos estables.",
    },
    {
      titulo: "Vigilancia con imagen",
      texto:
        "En deslizamientos de bajo grado, medir y comparar en el tiempo es parte del tratamiento: la mayoría no avanza.",
    },
    {
      titulo: "Cirugía de fusión",
      texto:
        "Cuando hay inestabilidad demostrada, progresión o compresión de nervios que no responde. Fija el segmento que se desliza; según el caso, con instrumentación percutánea de mínima invasión.",
    },
  ],
  comoLoTrato: [
    "Lo primero es clasificar tu caso: cuánto se deslizó la vértebra (el grado), si se mueve con tus movimientos (la estabilidad) y si está comprimiendo nervios. Esas tres respuestas — que salen de la exploración y de radiografías dinámicas — definen todo lo demás.",
    "Mi criterio quirúrgico aquí es conservador: se opera la inestabilidad y la compresión, no la imagen ni el susto. La mayoría de mis pacientes con espondilolistesis se maneja sin cirugía, con seguimiento medido.",
  ],
  faq: [
    {
      pregunta: "¿Un quiropráctico puede 'acomodarme' la vértebra?",
      respuesta:
        "No: el deslizamiento es estructural y no se reduce con manipulación externa. En una columna inestable, las manipulaciones bruscas pueden incluso ser riesgosas. El manejo pasa por fortalecer, vigilar y — solo si toca — fijar.",
    },
    {
      pregunta: "¿Puedo hacer ejercicio con espondilolistesis?",
      respuesta:
        "En la mayoría de los casos no solo puedes: debes. El músculo es tu mejor estabilizador. Lo que cambia es el tipo de ejercicio — eso se diseña según tu grado y tu estabilidad.",
    },
    {
      pregunta: "¿Siempre termina en cirugía?",
      respuesta:
        "No. Los deslizamientos de bajo grado y estables — que son la mayoría — se manejan sin operar durante toda la vida. La cirugía es para los casos con inestabilidad o compresión progresiva.",
    },
  ],
  testZone: "espalda-baja",
  testCtaQuestion:
    "Averigua qué tan afectada está tu espalda en menos de 3 minutos",
  testCtaLabel: "Evalúa tu espalda gratis",
};
