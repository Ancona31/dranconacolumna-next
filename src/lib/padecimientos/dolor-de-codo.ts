import type { Padecimiento } from "./types";

export const dolorDeCodo: Padecimiento = {
  slug: "dolor-de-codo",
  nombre: "Dolor de codo",
  grupo: "ortopedia",
  metaTitle:
    "Dolor de codo: epicondilitis y bursitis | Dr. Angel Ancona · Mérida",
  metaDescription:
    "¿Dolor en el codo al agarrar, girar la muñeca o apoyarte? Conoce el codo de tenista, el codo de golfista y la bursitis del codo — síntomas y tratamiento. Evalúa tu codo gratis.",
  zonaChip: "Codo",
  definicion: [
    "El codo parece una articulación simple, pero es donde se anclan todos los tendones que mueven tu muñeca y tus dedos. Por eso duele: no por lo que haces con el codo, sino por lo que haces con la mano — agarrar, girar, teclear, cargar. Tres cuadros explican la mayoría de los dolores de codo, y ninguno necesita que hayas jugado tenis o golf.",
  ],
  patologias: [
    {
      nombre: 'Epicondilitis lateral — el "codo de tenista"',
      queEs:
        "Los tendones que extienden tu muñeca se anclan en el hueso de la parte de afuera del codo. El uso repetido los enferma justo en esa inserción.",
      comoSeSiente:
        "Dolor por fuera del codo al agarrar, dar la mano, abrir una puerta o levantar la taza. Se corre hacia el antebrazo y aumenta con el uso. Muchos lo notan primero como pérdida de fuerza: se te caen las cosas.",
      comoSeTrata:
        "Primero, cambiar el gesto que lo provoca y dejar reposar el tendón para bajar la inflamación. Pero el reposo no cura: para recuperar fuerza y función, el tendón necesita volver a cargar de forma progresiva y dosificada — ahí está la clave de la fisioterapia bien hecha, y la razón por la que 'descansé un mes y volvió' es la historia más repetida en consulta. Si el dolor no cede, una infiltración dirigida permite que la rehabilitación avance. En los pocos casos que no responden, la liberación quirúrgica del tendón enfermo es corta y de recuperación rápida.",
    },
    {
      nombre: 'Epicondilitis medial — el "codo de golfista"',
      queEs:
        "El mismo problema, del lado contrario: los tendones que flexionan tu muñeca y cierran tu puño se anclan por dentro del codo, y ahí se enferman.",
      comoSeSiente:
        "Dolor en la parte de adentro del codo al girar la muñeca, cerrar el puño con fuerza, usar un desarmador o cargar. Menos frecuente que la lateral, pero igual de terca cuando se trata mal.",
      comoSeTrata:
        "El mismo camino que la lateral — corregir el gesto, reposo inicial, y después carga progresiva para devolverle fuerza al tendón. Infiltración si no cede, y cirugía en los casos rebeldes. Lo que cambia es qué tendón trabajamos, y por eso importa que el diagnóstico distinga bien un lado del otro.",
    },
    {
      nombre: "Bursitis del olécranon",
      queEs:
        "En la punta del codo tienes una bolsa que amortigua el hueso contra la piel. Un golpe o el apoyo repetido la inflaman y se llena de líquido.",
      comoSeSiente:
        "Una bolita blanda e hinchada justo en la punta del codo, a veces del tamaño de un huevo. Puede no doler nada — muchos llegan solo porque les preocupa cómo se ve.",
      comoSeTrata:
        "De primera intención se aspira en consultorio para vaciarla, y se protege el codo del apoyo que la provocó. Eso resuelve la mayoría. Lo importante es descartar que esté infectada: piel roja, caliente y dolor intenso cambian por completo el tratamiento y se revisan el mismo día. En casos contados, cuando recidiva una y otra vez, se extirpa la bursa — un procedimiento sencillo y ambulatorio.",
    },
  ],
  sintomas: [
    "Dolor en la parte de afuera del codo al agarrar objetos, dar la mano o abrir una puerta",
    "Dolor en la parte de adentro del codo al girar la muñeca o cerrar el puño con fuerza",
    "Una bolita blanda e hinchada en la punta del codo, con o sin dolor",
    "Dolor que baja hacia el antebrazo y aumenta con el uso repetido",
    "Pérdida de fuerza para sostener: se te cae la taza, el martillo, la sartén",
  ],
  cuandoPreocuparse: {
    señales: [
      "Deformidad visible del codo o imposibilidad de doblarlo o estirarlo tras un golpe",
      "La bolita del codo con piel roja, caliente y dolor intenso",
      "Fiebre junto con dolor e hinchazón del codo",
    ],
  },
  tratamiento: [
    {
      titulo: "Tratamiento conservador",
      texto:
        "Identificar y modificar el gesto que lo provoca, reposo inicial para bajar la inflamación, y después fisioterapia con carga progresiva — que es lo que devuelve fuerza y función al tendón. Medicamento en las crisis. Es el tratamiento de primera línea en las epicondilitis, y bien llevado resuelve la mayoría.",
    },
    {
      titulo: "Infiltraciones y procedimientos en consultorio",
      texto:
        "Cuando el dolor no cede o la bursitis está muy inflamada: infiltración dirigida, o aspiración de la bursa en el caso del olécranon. Alivian y permiten que la rehabilitación avance.",
    },
    {
      titulo: "Cirugía",
      texto:
        "Reservada para los pocos casos que no responden tras un tratamiento completo: liberación del tendón enfermo en la epicondilitis, o extirpación de la bursa cuando se cronifica o se infecta. Son procedimientos cortos y de recuperación rápida.",
    },
  ],
  citaDoctor:
    "El codo es donde nacen todos los músculos que dan movimiento fino a tu mano y tu muñeca. Cuidarlo — y tratar a tiempo lo que lo enferma — es cuidar todo lo que tus manos hacen por ti.",
  comoLoTrato: [
    "Con el codo, mi exploración empieza por localizar el punto exacto: por fuera, por dentro o en la punta. Suena obvio, pero es la diferencia entre tres diagnósticos distintos — y es el error que más veo en codos mal tratados, donde se infiltra a ciegas sin saber qué tendón está enfermo.",
    "Después busco la causa real, que casi nunca está en el codo: un gesto repetido en tu trabajo, una herramienta mal empuñada, una técnica deportiva que sobrecarga. Si no cambiamos eso, cualquier tratamiento es temporal.",
  ],
  faq: [
    {
      pregunta: "¿Tengo que jugar tenis para tener codo de tenista?",
      respuesta:
        "Para nada — la mayoría de mis pacientes con epicondilitis nunca ha tocado una raqueta. La causa es el uso repetido de la mano: herramientas, teclado, cargar, cocinar, el celular. El nombre es histórico y confunde más de lo que ayuda.",
    },
    {
      pregunta: "¿La bolita del codo es peligrosa?",
      respuesta:
        "La bursitis del olécranon casi siempre es benigna: una bolsa que se inflama por apoyar el codo o por un golpe. Lo que sí hay que descartar es que esté infectada — si la piel está roja, caliente y duele mucho, eso se revisa el mismo día, porque una bursitis infectada necesita tratamiento específico.",
    },
    {
      pregunta: "¿Sirve la banda o codera que venden en la farmacia?",
      respuesta:
        "Puede ayudar a bajar el dolor mientras haces otras cosas bien, pero no cura nada por sí sola: no cambia el gesto que enfermó el tendón ni lo fortalece. Usarla como único tratamiento es la razón por la que tantas epicondilitis duran años.",
    },
  ],
  testZone: "codo",
  testCtaQuestion:
    "Averigua qué tan afectado está tu codo en menos de 3 minutos",
  testCtaLabel: "Evalúa tu codo gratis",
};
