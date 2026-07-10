import type { Padecimiento } from "./types";

export const desviacionDeColumna: Padecimiento = {
  slug: "desviacion-de-columna",
  nombre: "Desviación de la columna",
  grupo: "columna",
  metaTitle:
    "Escoliosis (desviación de columna): qué hacer | Dr. Angel Ancona · Mérida",
  metaDescription:
    "¿Hombros disparejos o una curva en la espalda? Conoce la escoliosis en adolescentes y adultos, cuándo vigilar y cuándo tratar. Evalúa tu caso gratis.",
  definicion: [
    "Vista de frente, la columna debe ser una línea recta. En la escoliosis dibuja una curva hacia un lado — a veces con rotación de las vértebras — y el cuerpo lo delata: un hombro más alto, la cadera dispareja, la ropa que cae chueca.",
    "Hay dos historias distintas con el mismo nombre: la escoliosis del adolescente, que aparece durante el crecimiento y casi nunca duele; y la del adulto, que viene del desgaste y sí suele doler. Se vigilan y se tratan diferente.",
  ],
  sintomas: [
    "Un hombro o una cadera más alta que la otra",
    "La ropa cae dispareja o un tirante se resbala siempre del mismo lado",
    "Una 'joroba' o prominencia al inclinarse hacia adelante",
    "En adultos: dolor de espalda que empeora con el día y al estar de pie",
    "Sensación de cansancio en la espalda tras poco tiempo",
  ],
  cuandoPreocuparse: {
    intro:
      "La mayoría de las escoliosis se vigilan con calma. Estas señales piden valoración pronta:",
    señales: [
      "Una curva que visiblemente avanza en pocos meses (sobre todo en adolescentes en crecimiento)",
      "Dolor intenso que despierta por la noche",
      "Debilidad, hormigueo en las piernas o cambios al caminar",
    ],
  },
  tratamiento: [
    {
      titulo: "Observación medida",
      texto:
        "En curvas leves, el tratamiento es medir bien y comparar en el tiempo: radiografías seriadas con la misma técnica. La mayoría de las curvas leves no progresan de forma importante.",
    },
    {
      titulo: "Fisioterapia específica y corsé",
      texto:
        "Ejercicio dirigido para fuerza, postura y función. En adolescentes en crecimiento con curvas moderadas, el corsé — bien indicado y bien usado — puede frenar la progresión mientras el esqueleto madura.",
    },
    {
      titulo: "Cirugía de corrección",
      texto:
        "Reservada para curvas grandes o que progresan pese a todo, o cuando comprometen la función. Corrige y fija la curva con instrumentación. Es cirugía mayor — y por eso la indicación debe ser impecable.",
    },
  ],
  comoLoTrato: [
    "Lo primero que hago con una escoliosis es ponerle números: cuántos grados mide la curva, cuánta rotación tiene y — en adolescentes — cuánto crecimiento le queda al esqueleto. Con esos tres datos la conversación deja de ser de miedos y pasa a ser de decisiones.",
    "En el adolescente, mi trabajo es proteger el crecimiento: vigilar de cerca y frenar a tiempo si la curva corre. En el adulto, mi objetivo es tu función y tu dolor — no perseguir la curva perfecta en la radiografía. Opero la minoría: los casos donde los números y los síntomas lo exigen.",
  ],
  faq: [
    {
      pregunta: "¿La escoliosis leve siempre empeora?",
      respuesta:
        "No. La mayoría de las curvas leves se mantienen estables toda la vida. Las que más riesgo tienen de avanzar son las de adolescentes que aún están creciendo — por eso ahí la vigilancia es más estrecha.",
    },
    {
      pregunta: "¿Los ejercicios enderezan la columna?",
      respuesta:
        "La fisioterapia específica mejora fuerza, postura, dolor y función — y eso vale muchísimo. Lo que no hace es 'enderezar' una curva estructural establecida. Desconfía de quien prometa quitarte grados con una tabla de ejercicios.",
    },
    {
      pregunta: "¿Mi hijo con escoliosis puede hacer deporte?",
      respuesta:
        "En la gran mayoría de los casos, sí — y conviene: el músculo es aliado. Las restricciones son la excepción y dependen del grado y del tratamiento. Esa respuesta se personaliza en consulta.",
    },
  ],
  testZone: "espalda-baja",
  testCtaQuestion:
    "Averigua qué tan afectada está tu espalda en menos de 3 minutos",
  testCtaLabel: "Evalúa tu espalda gratis",
};
