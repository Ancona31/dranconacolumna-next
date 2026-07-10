import type { Padecimiento } from "./types";

export const lesionesDeportivas: Padecimiento = {
  slug: "lesiones-deportivas",
  nombre: "Lesiones deportivas",
  grupo: "ortopedia",
  metaTitle:
    "Lesiones deportivas: diagnóstico y regreso al deporte | Dr. Angel Ancona · Mérida",
  metaDescription:
    "Del esguince del futbolista a la tendinitis del corredor: diagnóstico preciso, tratamiento y un plan de regreso al deporte sin recaídas. Evalúa tu lesión gratis.",
  definicion: [
    "El deporte pone a prueba cada estructura: músculos que se desgarran en el sprint, ligamentos que ceden en el mal apoyo, tendones que se inflaman por la carga repetida, huesos que se fatigan por kilómetros acumulados. Cada deporte tiene su catálogo — y cada lesión, su tratamiento y sus tiempos.",
    "La diferencia entre una lesión deportiva bien y mal manejada no se ve en la primera semana: se ve en la recaída. Volver antes de tiempo, o volver sin rehabilitar la causa, es la receta de la lesión que se repite. Mi enfoque es ponerle nombre exacto a la lesión y fecha realista al regreso.",
  ],
  sintomas: [
    "Dolor agudo durante el ejercicio (el 'jalón', el 'piquete', el chasquido)",
    "Dolor que aparece con la carga y cede con el reposo (típico de tendinitis)",
    "Hinchazón o moretón tras el esfuerzo",
    "Pérdida de fuerza o de rango para el gesto deportivo",
    "Molestia que 'se aguanta' pero cada vez llega más temprano en el entrenamiento",
  ],
  cuandoPreocuparse: {
    señales: [
      "Chasquido audible seguido de incapacidad para continuar",
      "Imposibilidad de apoyar o deformidad visible",
      "Hinchazón súbita e importante en la primera hora",
      "Dolor nocturno en el hueso que no cede con reposo",
    ],
  },
  tratamiento: [
    {
      titulo: "Fase aguda: proteger y evaluar",
      texto:
        "Frío, descarga relativa y diagnóstico temprano. El viejo 'échale ganas y sigue' es la peor medicina deportiva: entrenar sobre una lesión sin nombre la agranda.",
    },
    {
      titulo: "Rehabilitación con carga progresiva",
      texto:
        "El reposo absoluto prolongado atrofia; la carga progresiva y guiada cura. Fisioterapia con objetivos medibles: rango, fuerza, control — y recién entonces, el gesto deportivo.",
    },
    {
      titulo: "Cirugía cuando la lesión lo exige",
      texto:
        "Rupturas completas de ligamentos o tendones en deportistas activos, lesiones que no responden: reparación — con frecuencia artroscópica — seguida del mismo camino de rehabilitación, ahora con el tejido reparado.",
    },
  ],
  comoLoTrato: [
    "Con el deportista hablo dos idiomas: el clínico y el de tu deporte. Me importa el diagnóstico exacto — qué estructura, qué grado — y me importa igual tu calendario: qué torneo viene, qué posición juegas, cuántos años llevas en esto. El plan sale de cruzar ambos.",
    "Y soy claro con el regreso: se vuelve por criterios, no por calendario. Fuerza comparable al lado sano, gesto sin dolor, confianza recuperada. Regresar una semana tarde es frustrante; regresar dos semanas temprano puede costarte la temporada — o la articulación.",
  ],
  faq: [
    {
      pregunta: "¿Cuánto tarda en quitarse un desgarre muscular?",
      respuesta:
        "Depende del grado: los leves, 2 a 3 semanas; los moderados, 4 a 8; las rupturas completas pueden requerir cirugía y meses. Ponerle grado con exploración (y ultrasonido cuando hace falta) es lo que convierte el '¿cuánto tarda?' de adivinanza en plan.",
    },
    {
      pregunta: "¿Puedo entrenar con dolor?",
      respuesta:
        "Depende de qué dolor. La molestia leve que no altera tu técnica y desaparece al calentar puede manejarse con ajustes de carga. El dolor que te hace compensar, que empeora durante la sesión o que aparece en un punto óseo fijo — ese es semáforo rojo: entrenar sobre él es agrandar la lesión.",
    },
    {
      pregunta: "¿La tendinitis se quita con reposo?",
      respuesta:
        "El reposo calma el dolor, pero no cura el tendón — por eso 'descansé un mes y volvió' es la historia clásica. Los tendones sanan con carga progresiva y dosificada, que los obliga a reorganizarse y fortalecerse. Menos reposo eterno, más rehabilitación inteligente.",
    },
  ],
  testCtaQuestion:
    "Señala la zona lesionada y averigua qué tan afectada está en menos de 3 minutos",
  testCtaLabel: "Evalúa tu lesión gratis",
};
