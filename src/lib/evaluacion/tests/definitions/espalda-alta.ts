import type { TestStructure } from "../types";

// Las cinco opciones del COMI reparten la escala 0-10 en pasos de 2.5.
const OPTIONS_0_10 = [0, 2.5, 5, 7.5, 10];

export const espaldaAltaStructure: TestStructure = {
  id: "espalda-alta-comi",
  zoneId: "espalda-alta",
  estimatedMinutes: 1,
  domainThresholds: [2.5, 5, 7.5],
  // Las dimensiones no se ordenan por exigencia: un dolor alto no implica
  // actividades ni bienestar afectados.
  applyGradient: false,

  triage: [
    {
      id: "T1",
      options: [
        { action: "flag:banda-dorsal" },
        { action: "goto:T2" },
      ],
    },
    {
      // El déficit de piernas se desdobla por velocidad de instauración: solo el
      // súbito va a urgencias; el gradual es valoración prioritaria (24-48 h).
      id: "T2",
      options: [
        { action: "goto:T2b" },
        { action: "goto:T3" },
      ],
    },
    {
      id: "T2b",
      options: [
        { action: "flag:urgente-neurologico-dorsal" },
        { action: "flag:deficit-dorsal" },
      ],
    },
    {
      id: "T3",
      options: [
        { action: "flag:trauma" },
        { action: "continue" },
      ],
    },
  ],

  questions: [
    { id: "i1", kind: "scale" },
    { id: "i2", kind: "scale" },
    { id: "i3", optionValues: OPTIONS_0_10 },
    { id: "i4", optionValues: OPTIONS_0_10 },
    { id: "i5", optionValues: OPTIONS_0_10 },
    { id: "i6", optionValues: OPTIONS_0_10 },
    { id: "i7", optionValues: OPTIONS_0_10 },
  ],

  domains: [
    {
      id: "dolor",
      itemIds: ["i1", "i2"],
      // Manda el peor de los dos sitios, no su promedio.
      aggregation: "max",
    },
    {
      id: "actividades",
      itemIds: ["i3", "i6", "i7"],
    },
    {
      id: "bienestar",
      itemIds: ["i4", "i5"],
    },
  ],

  // COMI: cinco dominios 0-10 con el mismo peso; dolor = peor sitio,
  // discapacidad = promedio. higher-is-worse (sin inversión).
  scoring: {
    kind: "comi",
    painItems: ["i1", "i2"],
    functionItem: "i3",
    wellbeingItem: "i4",
    qolItem: "i5",
    disabilityItems: ["i6", "i7"],
  },
};
