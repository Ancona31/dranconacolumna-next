import type { Padecimiento } from "./types";

export const dolorDeHombro: Padecimiento = {
  slug: "dolor-de-hombro",
  nombre: "Dolor de hombro",
  grupo: "ortopedia",
  metaTitle: "Dolor de hombro y manguito rotador | Dr. Angel Ancona · Mérida",
  metaDescription:
    "¿Dolor al levantar el brazo o al dormir de ese lado? Conoce las causas del dolor de hombro — del manguito rotador al hombro congelado — y evalúa tu caso gratis.",
  zonaChip: "Hombro",
  definicion: [
    "El hombro es la articulación más móvil de tu cuerpo — y esa libertad tiene precio: depende de un grupo de tendones, el manguito rotador, que trabaja en cada movimiento del brazo y con los años (o los esfuerzos) se inflama, se desgasta o se rompe.",
    "La buena noticia: la mayoría de los dolores de hombro se resuelven sin cirugía. La clave está en ponerle nombre al problema — tendinitis, ruptura, hombro congelado, desgaste — porque cada uno se trata distinto.",
  ],
  sintomas: [
    "Dolor al levantar el brazo o al llevarlo atrás (abrocharte, alcanzar el asiento trasero)",
    "Dolor nocturno al dormir sobre ese lado",
    "Pérdida de fuerza para cargar o sostener",
    "Rigidez que limita cada vez más el movimiento",
    "Chasquidos o sensación de roce al mover el brazo",
  ],
  cuandoPreocuparse: {
    señales: [
      "Pérdida súbita de fuerza para levantar el brazo tras un esfuerzo o caída",
      "Deformidad visible del hombro tras un golpe",
      "Fiebre con el hombro caliente e hinchado",
    ],
  },
  tratamiento: [
    {
      titulo: "Tratamiento conservador",
      texto:
        "Fisioterapia dirigida al manguito y la escápula, medicamento en las crisis y ajuste de actividades. Es el tratamiento de primera línea en la gran mayoría de los problemas de hombro — y bien hecho, resuelve la mayoría.",
    },
    {
      titulo: "Infiltraciones guiadas",
      texto:
        "Cuando la inflamación no cede o el dolor nocturno no te deja, una infiltración en el punto exacto baja la inflamación y permite que la rehabilitación avance.",
    },
    {
      titulo: "Cirugía artroscópica",
      texto:
        "Para rupturas del manguito que lo ameritan, inestabilidad o casos que no respondieron: reparación por artroscopia, con incisiones pequeñas. La decisión depende del tamaño de la ruptura, tu edad y tu demanda física.",
    },
  ],
  citaDoctor:
    "Un tendón roto que espera demasiado se vuelve difícil de reparar. Mi trabajo es decirte con claridad en qué grupo estás.",
  comoLoTrato: [
    "Mi exploración del hombro busca separar tres cosas que se confunden todo el tiempo: el dolor que viene de los tendones, el que viene de la articulación y el que en realidad baja desde el cuello. Las maniobras específicas del manguito me dicen cuál tendón sufre y cuánto — y el ultrasonido o la resonancia confirman lo que la mano ya encontró.",
    "Con el diagnóstico puesto, soy directo: las tendinitis y la mayoría de las rupturas parciales se rehabilitan; las rupturas completas en pacientes activos suelen beneficiarse de reparar a tiempo — porque un tendón roto que espera demasiado se retrae y se vuelve difícil de reparar. Te diré con claridad en qué grupo estás.",
  ],
  faq: [
    {
      pregunta: "¿Cómo sé si mi manguito rotador está roto?",
      respuesta:
        "El dato que más orienta es la pérdida de fuerza — no solo el dolor. Si de repente no puedes levantar el brazo o sostener peso que antes sí, la sospecha sube. La exploración física lo detecta con buena precisión y la imagen lo confirma.",
    },
    {
      pregunta: "¿Una ruptura del manguito sana sola?",
      respuesta:
        "El tendón roto no vuelve a pegarse solo al hueso. Lo que sí puede pasar es que el dolor mejore y otros músculos compensen — muchas rupturas parciales y algunas completas en personas de baja demanda se manejan así, sin operar. La decisión es individual: tamaño, edad, dolor y lo que tu vida le exige a ese hombro.",
    },
    {
      pregunta: "¿La infiltración de cortisona daña el hombro?",
      respuesta:
        "Usada con criterio — guiada, en la dosis correcta y sin abusar de repeticiones — es una herramienta segura y valiosa. El problema es usarla como único tratamiento eterno en lugar de rehabilitar. En mi consulta la infiltración abre la puerta a la fisioterapia, no la sustituye.",
    },
  ],
  testZone: "hombro",
  testCtaQuestion:
    "Averigua qué tan afectado está tu hombro en menos de 3 minutos",
  testCtaLabel: "Evalúa tu hombro gratis",
};
